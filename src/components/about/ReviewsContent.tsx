import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, ArrowRight, Play, MapPin, ChevronLeft, ChevronRight, Heart, Share2, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <defs>
      <linearGradient id="ig-grad-reviews" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5"/>
        <stop offset="50%" stopColor="#FF543E"/>
        <stop offset="100%" stopColor="#C837AB"/>
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad-reviews)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const sourceIcons: Record<string, React.ReactNode> = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  website: <span className="text-xs font-bold text-primary">W</span>,
};

const countryFlags: Record<string, string> = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", AE: "🇦🇪" };

interface DbReview {
  id: string;
  name: string;
  occupation: string | null;
  city: string | null;
  country: string | null;
  rating: number;
  source: string | null;
  has_video: boolean | null;
  review: string;
  published_at: string | null;
  review_type: string | null;
  is_featured: boolean | null;
  video_url: string | null;
}

const reviewTypes = ['All', 'Client', 'Partner', 'Employee', 'Principal'] as const;

// ── Submit Review Dialog ─────────────────────────────────────────────────────
function SubmitReviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', occupation: '', city: '', country: 'IN',
    rating: 0, review: '', review_type: 'Client', source: 'website',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.review.trim() || form.rating === 0) {
      toast({ title: 'Please fill in all required fields and select a rating.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await db('reviews').insert([{
      name: form.name.trim(),
      occupation: form.occupation.trim() || null,
      city: form.city.trim() || null,
      country: form.country || 'IN',
      rating: form.rating,
      review: form.review.trim(),
      review_type: form.review_type,
      source: form.source,
      status: 'pending',
    }]);
    if (error) {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', occupation: '', city: '', country: 'IN', rating: 0, review: '', review_type: 'Client', source: 'website' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>Your review will be reviewed by our team before publishing.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your review has been submitted and will appear after approval.</p>
            <button onClick={handleClose} className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rating <span className="text-destructive">*</span></label>
              <div className="flex gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onMouseEnter={() => setHoverRating(r)}
                    onClick={() => setForm(f => ({ ...f, rating: r }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-7 h-7 transition-colors ${r <= (hoverRating || form.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
                {form.rating > 0 && <span className="ml-2 text-sm text-muted-foreground self-center">{form.rating}.0</span>}
              </div>
            </div>

            {/* Type & Source */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">I am a <span className="text-destructive">*</span></label>
                <select
                  value={form.review_type}
                  onChange={e => setForm(f => ({ ...f, review_type: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Client">Client</option>
                  <option value="Partner">Partner</option>
                  <option value="Employee">Employee</option>
                  <option value="Principal">Principal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Source</label>
                <select
                  value={form.source}
                  onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="website">Website</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
            </div>

            {/* Name & Occupation */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name <span className="text-destructive">*</span></label>
                <input
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Occupation</label>
                <input
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Business Owner"
                  value={form.occupation}
                  onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                />
              </div>
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">City</label>
                <input
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Country</label>
                <select
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 UK</option>
                  <option value="AE">🇦🇪 UAE</option>
                </select>
              </div>
            </div>

            {/* Review text */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Your Review <span className="text-destructive">*</span></label>
              <textarea
                rows={4}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Share your experience with SERNET..."
                value={form.review}
                onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground text-right">{form.review.length}/1000</p>
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-border">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const ReviewsContent = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<string>(
    typeFromUrl && ['Client', 'Partner', 'Employee', 'Principal'].includes(typeFromUrl) ? typeFromUrl : 'All'
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  // Fetch approved reviews from DB
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews_public'],
    queryFn: async () => {
      const { data } = await db('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('published_at', { ascending: false });
      return (data ?? []) as DbReview[];
    },
  });

  const years = useMemo(() => {
    const yrs = [...new Set(reviews.map(r => new Date(r.published_at ?? r.id).getFullYear()))].sort((a, b) => b - a);
    return yrs;
  }, [reviews]);

  useEffect(() => {
    if (years.length > 0 && activeYear === null) {
      setActiveYear(years[0]);
    }
  }, [years, activeYear]);

  const featuredReviews = useMemo(() => reviews.filter(r => r.is_featured).slice(0, 3), [reviews]);

  // Auto-cycle featured reviews
  useEffect(() => {
    if (featuredReviews.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredReviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredReviews.length]);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const reviewYear = new Date(r.published_at ?? '').getFullYear();
      const yearMatch = activeYear === null || reviewYear === activeYear;
      const typeMatch = activeType === 'All' || r.review_type === activeType;
      return yearMatch && typeMatch;
    });
  }, [reviews, activeYear, activeType]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const currentFeatured = featuredReviews[featuredIndex];

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied!', description: 'Page link copied to clipboard.' });
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Title + Featured Review Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
              <span className="text-primary font-normal">Reviews</span>
            </h2>
            <p className="text-body leading-relaxed mb-2">
              Real voices from Clients, Partners, Employees, and Principals — sharing their experience with SERNET across every relationship.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[2.5rem] font-light text-foreground leading-none">{avgRating}</div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Based on {reviews.length}+ reviews</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button className="gap-2 px-8 py-3 text-base" onClick={() => setReviewDialogOpen(true)}>
                <Star className="w-4 h-4" />
                Submit your Review
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </motion.div>

          {/* Right: Featured Review Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="w-full relative">
              {isLoading ? (
                <div className="h-48 bg-muted animate-pulse rounded-xl" />
              ) : currentFeatured ? (
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
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured Review</span>
                        {currentFeatured.review_type && <span className="px-2 py-0.5 rounded-full bg-muted text-[0.6875rem]">{currentFeatured.review_type}</span>}
                      </div>
                      <p className="text-[1.125rem] font-light text-foreground leading-relaxed italic mb-5">
                        "{currentFeatured.review}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {currentFeatured.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{currentFeatured.name}</p>
                            <p className="text-xs text-muted-foreground">{currentFeatured.occupation} · {currentFeatured.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(currentFeatured.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex justify-center gap-2 mt-4">
                    {featuredReviews.map((_, i) => (
                      <button key={i} onClick={() => setFeaturedIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === featuredIndex ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full p-8 rounded-xl border border-border bg-muted/30 text-center text-muted-foreground text-sm">
                  No featured reviews yet. Be the first to submit!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Year Timeline */}
        {years.length > 0 && (
          <div className="flex items-center gap-1 border-b border-border">
            <button onClick={() => scrollYears('left')} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div ref={yearScrollRef} className="flex gap-0 overflow-x-auto scroll-smooth flex-1" style={{ scrollbarWidth: 'none' }}>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`text-[1rem] px-5 py-3 transition-colors border-b-[2.5px] whitespace-nowrap flex-shrink-0 ${activeYear === year ? 'text-foreground font-medium border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                >
                  {year}
                </button>
              ))}
            </div>
            <button onClick={() => scrollYears('right')} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 pt-4 pb-2">
          {reviewTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={`${activeYear}-${activeType}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)
              ) : filteredReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-[1rem] col-span-full">
                  {reviews.length === 0 ? 'No approved reviews yet. Be the first to share your experience!' : 'No reviews for this filter.'}
                </p>
              ) : (
                filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="p-6 border border-border rounded-xl relative group hover:border-primary/30 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{Number(review.rating).toFixed(1)}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.review_type && <span className="px-2 py-0.5 rounded-full bg-muted text-[0.75rem] text-muted-foreground">{review.review_type}</span>}
                        <div className="w-6 h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity" title={`via ${review.source}`}>
                          {sourceIcons[review.source ?? 'website'] ?? sourceIcons.website}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{review.review}"</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{review.name.charAt(0)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{review.name}</p>
                            {review.has_video && review.video_url && (
                              <a href={review.video_url} target="_blank" rel="noopener noreferrer" className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                                <Play className="w-2.5 h-2.5 text-primary fill-current" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{review.occupation}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        {(review.city || review.country) && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{review.city}</span>
                            {review.country && <span className="text-sm leading-none">{countryFlags[review.country]}</span>}
                          </div>
                        )}
                        {review.published_at && (
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(review.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Share Your Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 px-6 rounded-xl border border-border bg-section-alt"
        >
          <h2 className="heading-md text-foreground mb-2">Share Your Experience</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Had a great experience with SERNET? We'd love to hear from you. Submit directly or leave us a review on your favourite platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => setReviewDialogOpen(true)} className="gap-2">
              <Star className="w-4 h-4" /> Submit Review
            </Button>
            <a href="https://g.page/r/sernet/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
              Review on Google <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.facebook.com/sernetfspl/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
              Review on Facebook <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>

      <SubmitReviewDialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} />
    </section>
  );
};
