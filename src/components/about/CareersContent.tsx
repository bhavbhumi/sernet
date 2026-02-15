import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Upload, Star, Play, Users, Heart, Smile, Award, Target, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Section 1: Why Work With Us — values inspired by SERNET values grid
const workValues = [
  { icon: Heart, title: 'Great Culture', description: 'A collaborative, inclusive environment where every voice matters and ideas flourish.' },
  { icon: Target, title: 'Skill Focussed', description: 'Continuous learning programs and mentorship to sharpen your expertise every day.' },
  { icon: Smile, title: 'Stress-free Working Hours', description: 'Flexible schedules that respect your personal time and promote well-being.' },
  { icon: Award, title: 'Rewarding Career', description: 'Clear growth paths with recognition and advancement for your contributions.' },
  { icon: Shield, title: 'Employee Benefits', description: 'Comprehensive health coverage, stock options, and financial wellness support.' },
  { icon: Users, title: 'Client Centric Approach', description: 'Work on meaningful solutions that directly impact lives and create prosperity.' },
];

// Section 2: Team
const teamMembers = [
  { name: 'Bhavesh Vora', position: 'Founder & Promoter', initials: 'BV' },
  { name: 'Bhumika Vora', position: 'Director - Operations', initials: 'BV' },
  { name: 'Akshat Vora', position: 'Strategy & Technology', initials: 'AV' },
  { name: 'Rajesh Mehta', position: 'Head - Advisory', initials: 'RM' },
  { name: 'Sneha Kapoor', position: 'Lead - Client Relations', initials: 'SK' },
  { name: 'Amit Desai', position: 'Head - Compliance', initials: 'AD' },
];

// Section 3: Employee Reviews
const employeeReviews = [
  { name: 'Pooja Sharma', role: 'Relationship Manager', years: '5 years', rating: 5.0, text: 'SERNET feels like family. The leadership genuinely cares about your growth, and the work-life balance here is unmatched in the finance industry.' },
  { name: 'Karan Patel', role: 'Research Analyst', years: '3 years', rating: 4.8, text: 'The learning culture here is incredible. I\'ve grown more in 3 years at SERNET than my entire previous career. The mentorship is truly world-class.' },
  { name: 'Nisha Iyer', role: 'Operations Executive', years: '7 years', rating: 4.9, text: 'What makes SERNET special is the trust they place in you. You\'re empowered to take decisions and the team always has your back.' },
  { name: 'Arjun Reddy', role: 'Technology Lead', years: '4 years', rating: 5.0, text: 'Cutting-edge technology with a human touch. SERNET invests in the latest tools and genuinely listens to the tech team\'s input.' },
  { name: 'Meera Joshi', role: 'Client Advisor', years: '6 years', rating: 4.9, text: 'The client-first philosophy isn\'t just talk here — it\'s lived every day. That purpose makes coming to work incredibly rewarding.' },
  { name: 'Vikash Kumar', role: 'Compliance Officer', years: '2 years', rating: 4.7, text: 'Transparent, ethical and forward-thinking. SERNET sets the standard for how financial services firms should operate.' },
];
const doubledReviews = [...employeeReviews, ...employeeReviews];

// Section 4: Open Positions
const openings = [
  { title: 'Senior Relationship Manager', department: 'Advisory', location: 'Mumbai', type: 'Full-time' },
  { title: 'Equity Research Analyst', department: 'Research', location: 'Mumbai', type: 'Full-time' },
  { title: 'Digital Marketing Specialist', department: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Operations Associate', department: 'Operations', location: 'Mumbai', type: 'Full-time' },
  { title: 'Full-Stack Developer', department: 'Technology', location: 'Remote', type: 'Full-time' },
];

// Resume Upload Dialog
const ResumeUploadDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-8 py-3 text-base">
          <Upload className="w-4 h-4" />
          Send Your Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Your Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="resume-name">Full Name</Label>
            <Input id="resume-name" placeholder="Your full name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-email">Email</Label>
            <Input id="resume-email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-phone">Phone</Label>
            <Input id="resume-phone" type="tel" placeholder="+91 98765 43210" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-position">Preferred Role</Label>
            <Input id="resume-position" placeholder="e.g. Relationship Manager" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-file">Upload Resume (PDF)</Label>
            <Input id="resume-file" type="file" accept=".pdf,.doc,.docx" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-message">Cover Note (Optional)</Label>
            <Textarea id="resume-message" placeholder="Tell us why you'd like to join SERNET..." rows={3} />
          </div>
          <Button type="submit" className="w-full">Submit Application</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Employee Review Card (inspired by TestimonialCard)
const EmployeeReviewCard = ({ name, role, years, rating, text }: typeof employeeReviews[0]) => (
  <div className="flex-shrink-0 w-[320px] md:w-[380px] p-6 rounded-xl border border-border bg-card relative group hover:border-primary/30 transition-colors duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(rating)
                  ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{years}</span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">"{text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

export const CareersContent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
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
  }, [isPaused]);

  return (
    <>
      {/* Appeal: Join Us */}
      <section className="section-padding" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container-zerodha text-center max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-6"
          >
            Join Us
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-body"
          >
            <p>
              At SERNET, we believe that true wealth is created when people are empowered to make informed financial decisions. 
              If you're driven by purpose and want to be part of a team that's transforming lives through financial literacy and holistic wealth solutions — this is where you belong.
            </p>
            <p>
              We're building a future where prosperity is accessible to everyone. 
              Join us in this mission to change lives, unlock potential, and help families secure their dreams — one financial decision at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Work With Us — Values Grid */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Work With Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workValues.map((v, index) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="feature-card flex items-start gap-4"
              >
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

      {/* Section 2: Team */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            The People with SERNET
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 border-2 border-transparent group-hover:border-primary/30 transition-colors">
                  <span className="text-lg font-semibold text-primary">{member.initials}</span>
                </div>
                <h3 className="text-sm font-medium text-foreground">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{member.position}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Employee Reviews — auto-scrolling carousel */}
      <section className="section-padding overflow-hidden" style={{ background: 'var(--gradient-testimonial)' }}>
        <div className="container-zerodha mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="heading-lg text-foreground mb-3">Team's Experience</h2>
            <p className="text-body max-w-xl mx-auto">Hear from the people who make SERNET what it is every day</p>
          </motion.div>
        </div>
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-5 overflow-hidden px-4 py-2"
        >
          {doubledReviews.map((review, i) => (
            <EmployeeReviewCard key={i} {...review} />
          ))}
        </div>
      </section>

      {/* Section 4: Open Positions */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-8"
          >
            Open Positions
          </motion.h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{job.department}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  Apply <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Upload Resume */}
      <section className="section-padding" style={{ background: 'var(--gradient-cta)' }}>
        <div className="container-zerodha text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
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
