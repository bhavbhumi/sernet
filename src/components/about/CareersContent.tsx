import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Upload, Star, Users, Heart, Smile, Award, Target, Shield, Briefcase, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

// Section 1: Why Work With Us — values inspired by SERNET values grid
const workValues = [
  { icon: Heart, title: 'Great Culture', description: 'A collaborative, inclusive environment where every voice matters and ideas flourish.' },
  { icon: Target, title: 'Skill Focussed', description: 'Continuous learning programs and mentorship to sharpen your expertise every day.' },
  { icon: Smile, title: 'Stress-free Working Hours', description: 'Flexible schedules that respect your personal time and promote well-being.' },
  { icon: Award, title: 'Rewarding Career', description: 'Clear growth paths with recognition and advancement for your contributions.' },
  { icon: Shield, title: 'Employee Benefits', description: 'Comprehensive health coverage, stock options, and financial wellness support.' },
  { icon: Users, title: 'Client Centric Approach', description: 'Work on meaningful solutions that directly impact lives and create prosperity.' },
];

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  description: string | null;
  is_featured: boolean | null;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string | null;
  photo_url: string | null;
}

interface EmployeeReview {
  id: string;
  name: string;
  occupation: string | null;
  rating: number;
  review: string;
  city: string | null;
}

// Employee Review Card
const EmployeeReviewCard = ({ name, occupation, rating, review }: EmployeeReview) => (
  <div className="flex-shrink-0 w-[320px] md:w-[380px] p-6 rounded-xl border border-border bg-card relative group hover:border-primary/30 transition-colors duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Employee</span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">"{review}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        {occupation && <p className="text-xs text-muted-foreground">{occupation}</p>}
      </div>
    </div>
  </div>
);

// ── Resume Upload Dialog ─────────────────────────────────────────────────────
const ResumeUploadDialog = ({ jobId, jobTitle }: { jobId?: string; jobTitle?: string }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', preferred_role: jobTitle ?? '', cover_note: '' });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    let resume_url: string | null = null;

    // Upload resume if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cms-resumes')
        .upload(fileName, file);
      if (uploadError) {
        toast({ title: 'Resume upload failed', description: uploadError.message, variant: 'destructive' });
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('cms-resumes').getPublicUrl(uploadData.path);
      resume_url = urlData?.publicUrl ?? null;
    }

    const { error } = await db('job_applications').insert([{
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      preferred_role: form.preferred_role.trim() || null,
      cover_note: form.cover_note.trim() || null,
      resume_url,
      job_id: jobId ?? null,
      status: 'new',
    }]);

    if (error) {
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setSubmitted(false);
      setForm({ full_name: '', email: '', phone: '', preferred_role: jobTitle ?? '', cover_note: '' });
      setFile(null);
    }
    setOpen(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-8 py-3 text-base">
          <Upload className="w-4 h-4" />
          {jobTitle ? `Apply for this Role` : 'Send Your Resume'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jobTitle ? `Apply — ${jobTitle}` : 'Submit Your Resume'}</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <h3 className="text-lg font-semibold text-foreground">Application Received!</h3>
            <p className="text-sm text-muted-foreground">We'll review your application and get in touch soon.</p>
            <button onClick={() => handleClose(false)} className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="Your full name" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Preferred Role</Label>
              <Input placeholder="e.g. Relationship Manager" value={form.preferred_role} onChange={e => setForm(f => ({ ...f, preferred_role: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Resume (PDF / DOC)</Label>
              <Input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label>Cover Note (Optional)</Label>
              <Textarea placeholder="Tell us why you'd like to join SERNET..." rows={3} value={form.cover_note} onChange={e => setForm(f => ({ ...f, cover_note: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ── Employee Review Submit Dialog ────────────────────────────────────────────
const ReviewFormDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: '', occupation: '', city: '', rating: 0, review: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.review || form.rating === 0) {
      toast({ title: 'Please fill all required fields and select a rating', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await db('reviews').insert([{
      name: form.name.trim(),
      occupation: form.occupation.trim() || null,
      city: form.city.trim() || null,
      country: 'IN',
      rating: form.rating,
      review: form.review.trim(),
      review_type: 'Employee',
      source: 'website',
      status: 'pending',
    }]);
    if (error) {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setSubmitted(false);
      setForm({ name: '', occupation: '', city: '', rating: 0, review: '' });
      setHoverRating(0);
    }
    setOpen(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-medium">Submit Your Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Share Your Experience</DialogTitle></DialogHeader>
        {submitted ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your review will be published after admin approval.</p>
            <button onClick={() => handleClose(false)} className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input placeholder="Your name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Role / Occupation</Label>
                <Input placeholder="e.g. Relationship Manager" value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input placeholder="Mumbai" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Rating *</Label>
              <div className="flex gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map(r => (
                  <button type="button" key={r} onMouseEnter={() => setHoverRating(r)} onClick={() => setForm(f => ({ ...f, rating: r }))} className="transition-transform hover:scale-110">
                    <Star className={`w-7 h-7 transition-colors ${r <= (hoverRating || form.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Your Review *</Label>
              <Textarea placeholder="Tell us about your experience at SERNET..." rows={4} required value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const CareersContent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Fetch live data from DB
  const { data: jobOpenings = [] } = useQuery<JobOpening[]>({
    queryKey: ['job_openings_public'],
    queryFn: async () => {
      const { data } = await db('job_openings').select('*').eq('status', 'published').order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['team_members_public'],
    queryFn: async () => {
      const { data } = await db('team_members').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      return data ?? [];
    },
  });

  const { data: employeeReviews = [] } = useQuery<EmployeeReview[]>({
    queryKey: ['employee_reviews_public'],
    queryFn: async () => {
      const { data } = await db('reviews').select('id, name, occupation, rating, review, city').eq('status', 'approved').eq('review_type', 'Employee').order('published_at', { ascending: false }).limit(12);
      return data ?? [];
    },
  });

  const featuredPositions = jobOpenings.filter(j => j.is_featured).slice(0, 3);
  const displayPositions = featuredPositions.length > 0 ? featuredPositions : jobOpenings.slice(0, 3);
  const doubledReviews = employeeReviews.length > 0 ? [...employeeReviews, ...employeeReviews] : [];

  // Auto-scroll reviews carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || doubledReviews.length === 0) return;
    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;
    const step = () => {
      if (!isPaused && el) {
        scrollPos += speed;
        if (scrollPos >= el.scrollWidth / 2) scrollPos = 0;
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, doubledReviews.length]);

  // Auto-cycle featured positions
  useEffect(() => {
    if (displayPositions.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % displayPositions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayPositions.length]);

  return (
    <>
      {/* Section 1: Title + Featured Positions Carousel */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
                Careers at <span className="text-primary font-normal">SERNET</span>
              </h2>
              <p className="text-body leading-relaxed mb-6">
                At SERNET, we empower people to make informed financial decisions that transform lives. If you're driven by purpose and want to help families secure their dreams — this is where you belong.
              </p>
              <div>
                <ResumeUploadDialog />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center"
            >
              <div className="w-full relative">
                {displayPositions.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={featuredIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                        className="w-full p-6 rounded-xl border border-border bg-card"
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured Position</span>
                          <span>{displayPositions[featuredIndex]?.job_type}</span>
                        </div>
                        <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground leading-snug mb-2">
                          {displayPositions[featuredIndex]?.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{displayPositions[featuredIndex]?.department}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{displayPositions[featuredIndex]?.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{displayPositions[featuredIndex]?.job_type}</span>
                        </div>
                        <ResumeUploadDialog jobId={displayPositions[featuredIndex]?.id} jobTitle={displayPositions[featuredIndex]?.title} />
                      </motion.div>
                    </AnimatePresence>
                    {displayPositions.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {displayPositions.map((_, i) => (
                          <button key={i} onClick={() => setFeaturedIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === featuredIndex ? 'bg-primary' : 'bg-border'}`} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full p-6 rounded-xl border border-border bg-card text-center text-muted-foreground">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No featured positions currently open.</p>
                    <p className="text-xs mt-1">Send us your resume — we'll reach out when the right opportunity arises.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Work With Us — Values Grid */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="heading-lg text-foreground mb-12 text-center">
            Work With Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workValues.map((v, index) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="feature-card flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="heading-md text-foreground mb-1">{v.title}</h3>
                  <p className="text-small">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Team */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="heading-lg text-foreground mb-12 text-center">
            The People with SERNET
          </motion.h2>
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 border-2 border-transparent group-hover:border-primary/30 transition-colors overflow-hidden">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold text-primary">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.position}</p>
                  {member.department && <p className="text-xs text-muted-foreground/60">{member.department}</p>}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Team profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Employee Reviews — auto-scrolling carousel */}
      <section className="section-padding overflow-hidden bg-section-alt">
        <div className="container-zerodha mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
            <h2 className="heading-lg text-foreground mb-3">Team's Experience</h2>
            <p className="text-body max-w-xl mx-auto">Hear from the people who make SERNET what it is every day</p>
          </motion.div>
        </div>
        {doubledReviews.length > 0 ? (
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 overflow-hidden px-4 py-2"
          >
            {doubledReviews.map((review, i) => (
              <EmployeeReviewCard key={`${review.id}-${i}`} {...review} />
            ))}
          </div>
        ) : (
          <div className="container-zerodha text-center text-muted-foreground py-8">
            <p className="text-sm">Employee reviews coming soon. Be the first to share your experience!</p>
          </div>
        )}

        {/* Social sharing + CTAs */}
        <div className="container-zerodha mt-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col items-center gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
              <span>Share your experience on</span>
              <div className="flex items-center gap-2">
                <a href="https://g.page/r/sernet/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">Google</a>
                <a href="https://www.linkedin.com/company/sernetfspl/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">LinkedIn</a>
                <a href="https://www.facebook.com/sernetfspl/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">Facebook</a>
                <a href="https://www.instagram.com/sernetfspl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">Instagram</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ReviewFormDialog />
              <Link to="/reviews" className="link-primary font-medium inline-flex items-center gap-1 group">
                See all reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Open Positions */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="heading-lg text-foreground mb-8">
            Open Positions
          </motion.h2>
          {jobOpenings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-xl">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No open positions at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      {job.is_featured && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type}</span>
                    </div>
                    {job.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{job.description}</p>}
                  </div>
                  <ResumeUploadDialog jobId={job.id} jobTitle={job.title} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Upload Resume CTA */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="heading-lg text-foreground mb-3">Don't see a position here?</h2>
            <p className="text-body max-w-lg mx-auto mb-8">
              We're always looking for talented people who share our passion for creating prosperity. Send us your resume and we'll reach out when the right opportunity opens up.
            </p>
            <ResumeUploadDialog />
          </motion.div>
        </div>
      </section>
    </>
  );
};
