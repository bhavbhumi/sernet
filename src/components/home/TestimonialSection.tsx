import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Play, MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Source icons as simple SVG components
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
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5"/>
        <stop offset="50%" stopColor="#FF543E"/>
        <stop offset="100%" stopColor="#C837AB"/>
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const MouthshutIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const sourceIcons: Record<string, React.ReactNode> = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  mouthshut: <MouthshutIcon />,
};

// Country flags as emoji
const countryFlags: Record<string, string> = {
  IN: "🇮🇳",
  US: "🇺🇸",
  UK: "🇬🇧",
  AE: "🇦🇪",
};

// Fallback static testimonials in case DB is empty
const fallbackTestimonials: Testimonial[] = [
  { name: "Rajesh Kumar", occupation: "Business Owner", city: "Mumbai", country: "IN", rating: 4.8, source: "google", hasVideo: true, text: "SERNET has been instrumental in growing my portfolio. Their personalized approach and deep market knowledge have helped me achieve my financial goals." },
  { name: "Priya Sharma", occupation: "IT Professional", city: "Delhi", country: "IN", rating: 5.0, source: "facebook", hasVideo: false, text: "The team at SERNET is incredibly professional. They've been managing my family's investments for over 10 years with excellent returns." },
  { name: "Anand Mehta", occupation: "Chartered Accountant", city: "Bangalore", country: "IN", rating: 4.9, source: "google", hasVideo: true, text: "Exceptional service and transparent communication. I highly recommend SERNET for anyone looking for reliable investment advisory." },
  { name: "Sunita Patel", occupation: "Homemaker & Investor", city: "Ahmedabad", country: "IN", rating: 5.0, source: "instagram", hasVideo: false, text: "From insurance planning to equity investments, SERNET has provided comprehensive solutions for all my financial needs." },
  { name: "Vikram Singh", occupation: "Retired Army Officer", city: "Jaipur", country: "IN", rating: 4.7, source: "mouthshut", hasVideo: false, text: "Switched from a big-name broker and couldn't be happier. Personal attention and zero hidden charges make SERNET stand out." },
  { name: "Meera Nair", occupation: "Doctor", city: "Kochi", country: "IN", rating: 4.9, source: "google", hasVideo: true, text: "Their research reports are top-notch. I've made informed decisions that consistently outperform the market benchmarks." },
];

type Testimonial = {
  name: string;
  occupation: string;
  city: string;
  country: string;
  rating: number;
  source: string;
  hasVideo: boolean;
  text: string;
};

const TestimonialCard = ({ name, occupation, city, country, rating, source, hasVideo, text }: Testimonial) => (
  <div className="flex-shrink-0 w-[340px] md:w-[400px] p-6 rounded-xl border border-border bg-card relative group hover:border-primary/30 transition-colors duration-300">
    {/* Top row: rating number + stars left, source icon right */}
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
                  : i < rating
                  ? 'fill-[hsl(var(--sernet-yellow))]/50 text-[hsl(var(--sernet-yellow))]'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="w-6 h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity" title={`via ${source}`}>
        {sourceIcons[source]}
      </div>
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
      "{text}"
    </p>

    {/* Bottom: avatar, name, occupation, video | city + flag */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
          {name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{name}</p>
            {hasVideo && (
              <button className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200 group/play">
                <Play className="w-2.5 h-2.5 text-primary group-hover/play:text-primary-foreground fill-current" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{occupation}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{city}</span>
        <span className="text-sm leading-none">{countryFlags[country]}</span>
      </div>
    </div>
  </div>
);

const ReviewFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-medium">
          {t('testimonials.submitReview')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('testimonials.dialogTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="review-name">{t('testimonials.name')}</Label>
            <Input id="review-name" placeholder={t('testimonials.namePlaceholder')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-email">{t('testimonials.email')}</Label>
            <Input id="review-email" type="email" placeholder={t('testimonials.emailPlaceholder')} required />
          </div>
          <div className="space-y-2">
            <Label>{t('testimonials.rating')}</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className="text-muted-foreground hover:text-[hsl(var(--sernet-yellow))] transition-colors">
                  <Star className="w-6 h-6 hover:fill-[hsl(var(--sernet-yellow))]" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-text">{t('testimonials.yourReview')}</Label>
            <Textarea id="review-text" placeholder={t('testimonials.reviewPlaceholder')} rows={4} required />
          </div>
          <Button type="submit" className="w-full">{t('testimonials.submit')}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const TestimonialSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useTranslation();

  const { data: dbReviews } = useQuery({
    queryKey: ['homepage-reviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('name, occupation, city, country, rating, source, has_video, review, video_url')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(12);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const testimonials: Testimonial[] = (dbReviews && dbReviews.length > 0)
    ? dbReviews.map(r => ({
        name: r.name,
        occupation: r.occupation ?? '',
        city: r.city ?? '',
        country: r.country ?? 'IN',
        rating: r.rating,
        source: (r.source ?? 'google').toLowerCase(),
        hasVideo: r.has_video ?? false,
        text: r.review,
      }))
    : fallbackTestimonials;

  const doubledTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      if (!isPaused && el) {
        scrollPos += speed;
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="section-padding overflow-hidden bg-section-alt">
      <div className="container-sernet mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="heading-lg text-foreground mb-3">
            {t('testimonials.heading')}
          </h2>
          <p className="text-body max-w-xl mx-auto">
            {t('testimonials.subheading')}
          </p>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-5 overflow-hidden px-4 py-2"
      >
        {doubledTestimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>

      <div className="container-sernet mt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
            <span>Browse reviews from</span>
            <div className="flex items-center gap-2">
              {[
                { label: 'All', type: '' },
                { label: 'Clients', type: 'Client' },
                { label: 'Partners', type: 'Partner' },
                { label: 'Principals', type: 'Principal' },
              ].map(({ label, type }) => (
                <Link
                  key={label}
                  to={type ? `/reviews?type=${type}` : '/reviews'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ReviewFormDialog />
            <Link to="/reviews" className="link-primary font-medium inline-flex items-center gap-1 group">
              {t('testimonials.seeAllReviews')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};