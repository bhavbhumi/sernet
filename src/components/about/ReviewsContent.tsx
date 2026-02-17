import { useState, useMemo, useRef } from 'react';
import { Star, ArrowRight, Play, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const MouthshutIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const sourceIcons: Record<string, React.ReactNode> = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  mouthshut: <MouthshutIcon />,
};

const countryFlags: Record<string, string> = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", AE: "🇦🇪" };

const reviews = [
  { name: "Rajesh Kumar", occupation: "Business Owner", city: "Mumbai", country: "IN", rating: 4.8, source: "google", hasVideo: true, review: "SERNET has been instrumental in growing my portfolio. Their personalized approach and deep market knowledge have helped me achieve my financial goals.", date: "Jan 2025", year: 2025 },
  { name: "Priya Sharma", occupation: "IT Professional", city: "Delhi", country: "IN", rating: 5.0, source: "facebook", hasVideo: false, review: "The team at SERNET is incredibly professional and knowledgeable. They've been managing my family's investments for over 10 years with excellent returns.", date: "Dec 2024", year: 2024 },
  { name: "Anand Mehta", occupation: "Chartered Accountant", city: "Bangalore", country: "IN", rating: 4.9, source: "google", hasVideo: true, review: "Exceptional service and transparent communication. I highly recommend SERNET for anyone looking for reliable investment advisory services.", date: "Nov 2024", year: 2024 },
  { name: "Sunita Patel", occupation: "Homemaker & Investor", city: "Ahmedabad", country: "IN", rating: 5.0, source: "instagram", hasVideo: false, review: "From insurance planning to equity investments, SERNET has provided comprehensive solutions for all my financial needs. Truly a one-stop destination.", date: "Oct 2024", year: 2024 },
  { name: "Vikram Singh", occupation: "Retired Army Officer", city: "Jaipur", country: "IN", rating: 4.7, source: "mouthshut", hasVideo: false, review: "Switched from a big-name broker and couldn't be happier. Personal attention and zero hidden charges make SERNET stand out from the crowd.", date: "Sep 2024", year: 2024 },
  { name: "Meera Nair", occupation: "Doctor", city: "Kochi", country: "IN", rating: 4.9, source: "google", hasVideo: true, review: "Their research reports are top-notch. I've made informed decisions that consistently outperform the market benchmarks.", date: "Aug 2024", year: 2024 },
  { name: "Deepak Verma", occupation: "Software Engineer", city: "Lucknow", country: "IN", rating: 4.8, source: "google", hasVideo: false, review: "The onboarding process was seamless and the support team is always just a call away. Great experience overall with SERNET.", date: "Jul 2024", year: 2024 },
  { name: "Kavita Joshi", occupation: "School Principal", city: "Pune", country: "IN", rating: 5.0, source: "facebook", hasVideo: true, review: "I trust SERNET with my retirement planning. Their long-term vision and disciplined approach give me complete peace of mind.", date: "Jun 2024", year: 2024 },
];

const featuredReview = reviews[0];
const years = [...new Set(reviews.map((r) => r.year))].sort((a, b) => b - a);

export const ReviewsContent = () => {
  const [activeYear, setActiveYear] = useState(years[0]);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => r.year === activeYear);
  }, [activeYear]);

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Featured Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured Review</span>
              <span className="text-sm text-muted-foreground">{featuredReview.date}</span>
            </div>
            <p className="text-[1.375rem] md:text-[1.625rem] font-light text-foreground leading-relaxed italic mb-6">
              "{featuredReview.review}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary">
                {featuredReview.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-medium text-foreground">{featuredReview.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(featuredReview.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{featuredReview.occupation} · {featuredReview.city}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            {/* Aggregate Rating Card */}
            <div className="text-center p-10 rounded-2xl border border-border bg-section-alt">
              <div className="text-[4rem] font-light text-foreground leading-none mb-2">4.9</div>
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Based on {reviews.length}+ reviews</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-6 h-6 flex items-center justify-center opacity-60"><GoogleIcon /></div>
                <div className="w-6 h-6 flex items-center justify-center opacity-60"><FacebookIcon /></div>
                <div className="w-6 h-6 flex items-center justify-center opacity-60"><InstagramIcon /></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Year Timeline */}
        <div className="flex items-center gap-1 border-b border-border">
          <button onClick={() => scrollYears('left')} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden" aria-label="Scroll years left">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={yearScrollRef} data-year-scroll-reviews className="flex gap-0 overflow-x-auto scroll-smooth flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
            <style>{`[data-year-scroll-reviews]::-webkit-scrollbar { display: none; }`}</style>
            {years.map((year) => (
              <button key={year} onClick={() => setActiveYear(year)} className={`text-[1rem] px-5 py-3 transition-colors border-b-[2.5px] whitespace-nowrap flex-shrink-0 ${activeYear === year ? 'text-foreground font-medium border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}>
                {year}
              </button>
            ))}
          </div>
          <button onClick={() => scrollYears('right')} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden" aria-label="Scroll years right">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Reviews Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeYear} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
              {filteredReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-[1rem] col-span-full">No reviews for this year.</p>
              ) : (
                filteredReviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="p-6 border border-border rounded-xl relative group hover:border-primary/30 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{review.rating.toFixed(1)}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity" title={`via ${review.source}`}>
                        {sourceIcons[review.source]}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{review.review}"</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{review.name.charAt(0)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{review.name}</p>
                            {review.hasVideo && (
                              <button className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200 group/play">
                                <Play className="w-2.5 h-2.5 text-primary group-hover/play:text-primary-foreground fill-current" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{review.occupation}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{review.city}</span>
                          <span className="text-sm leading-none">{countryFlags[review.country]}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60">{review.date}</span>
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
            Had a great experience with SERNET? We'd love to hear from you. Leave us a review on your favourite platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://g.page/r/sernet/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
              Review on Google <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.facebook.com/sernetindia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
              Review on Facebook <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/sernetindia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
              Review on Instagram <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
