import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image, Palette, Type, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import pressThumb from '@/assets/press-thumb.webp';

type PressItem = {
  id: string;
  title: string;
  source: string;
  published_at: string | null;
  link: string | null;
  is_featured: boolean | null;
  medium: string;
  status: string;
};

function getFaviconUrl(link: string | null): string | null {
  if (!link) return null;
  try {
    const domain = new URL(link).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch { return null; }
}

const mediums = ['All', 'Web', 'Print', 'Radio', 'TV'] as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getYear(dateStr: string | null): number {
  if (!dateStr) return new Date().getFullYear();
  return new Date(dateStr).getFullYear();
}

export const PressContent = () => {
  const [activeMedium, setActiveMedium] = useState<string>('All');
  const [showOpinionForm, setShowOpinionForm] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const { data: pressItems = [], isLoading } = useQuery({
    queryKey: ['press_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('press_items')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as PressItem[];
    },
  });

  // Derive years dynamically from data
  const years = useMemo(() => {
    const ys = Array.from(new Set(pressItems.map(p => getYear(p.published_at)))).sort((a, b) => b - a);
    return ys.length > 0 ? ys : [new Date().getFullYear()];
  }, [pressItems]);

  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Set activeYear to latest year once data loads
  useEffect(() => {
    if (years.length > 0 && activeYear === null) {
      setActiveYear(years[0]);
    }
  }, [years]);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  const featuredPosts = useMemo(() => pressItems.filter(p => p.is_featured).slice(0, 3), [pressItems]);

  // Auto-cycle featured posts
  useEffect(() => {
    if (featuredPosts.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredPosts.length]);

  // Reset featured index if data changes
  useEffect(() => { setFeaturedIndex(0); }, [featuredPosts.length]);

  const filteredReleases = useMemo(() => {
    return pressItems.filter((item) => {
      const yearMatch = activeYear === null || getYear(item.published_at) === activeYear;
      const mediumMatch = activeMedium === 'All' || item.medium === activeMedium;
      return yearMatch && mediumMatch;
    });
  }, [pressItems, activeYear, activeMedium]);

  const currentFeatured = featuredPosts[featuredIndex];

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Title + Featured Post Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
              Press & <span className="text-primary font-normal">Media</span>
            </h2>
            <p className="text-body leading-relaxed mb-2">
              Coverage on Web, Print, Radio or TV — recognised by leading publications
              for our commitment to transparency, client empowerment, and innovation.
            </p>

            {/* Media Kit Downloads */}
            <div className="flex flex-wrap gap-3 mt-4 mb-6">
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
                <Image className="h-3.5 w-3.5" /> Logo Pack
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
                <Palette className="h-3.5 w-3.5" /> Brand Guide
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
                <Type className="h-3.5 w-3.5" /> Typography
              </a>
            </div>

            <div>
              <Button onClick={() => setShowOpinionForm(true)} className="gap-2 px-8 py-3 text-base">
                <Send className="w-4 h-4" />
                Ask your Query
              </Button>
            </div>
          </motion.div>

          {/* Right: Featured Post Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="w-full relative">
              {isLoading ? (
                <div className="w-full h-64 rounded-xl border border-border bg-muted animate-pulse" />
              ) : currentFeatured ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.a
                      key={featuredIndex}
                      href={currentFeatured.link ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="w-full p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group block"
                    >
                      <div className="w-full h-48 rounded-lg mb-4 border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img
                          src={getFaviconUrl(currentFeatured.link) ?? pressThumb}
                          alt={currentFeatured.source}
                          className="h-20 w-20 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = pressThumb; }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured</span>
                        <span>{formatDate(currentFeatured.published_at)}</span>
                        <span>—</span>
                        <span>{currentFeatured.source}</span>
                      </div>
                      <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground group-hover:text-primary transition-colors leading-snug">{currentFeatured.title}</h3>
                    </motion.a>
                  </AnimatePresence>
                  {/* Dots */}
                  {featuredPosts.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {featuredPosts.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setFeaturedIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === featuredIndex ? 'bg-primary' : 'bg-border'}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full p-6 rounded-xl border border-border bg-card text-center text-muted-foreground text-sm">
                  No featured press items yet. Mark items as featured in the admin panel.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Year Timeline */}
        {years.length > 0 && (
          <div className="flex items-center gap-1 border-b border-border">
            <button onClick={() => scrollYears('left')} className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden" aria-label="Scroll years left">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div ref={yearScrollRef} data-year-scroll className="flex gap-0 overflow-x-auto scroll-smooth flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
              <style>{`[data-year-scroll]::-webkit-scrollbar { display: none; }`}</style>
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
        )}

        {/* Medium Filters */}
        <div className="flex flex-wrap gap-2 pt-4 pb-2">
          {mediums.map((medium) => (
            <button
              key={medium}
              onClick={() => setActiveMedium(medium)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeMedium === medium ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {medium}
            </button>
          ))}
        </div>

        {/* Press List */}
        <AnimatePresence mode="wait">
          <motion.div key={`${activeYear}-${activeMedium}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="divide-y divide-border">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-5">
                    <div className="w-12 h-12 rounded-md bg-muted animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted animate-pulse rounded w-32" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </div>
                  </div>
                ))
              ) : filteredReleases.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-[1rem]">No results found.</p>
              ) : (
                filteredReleases.map((item, index) => (
                  <motion.a key={item.id} href={item.link ?? '#'} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="flex items-center gap-4 py-5 group hover:bg-muted/30 -mx-4 px-4 rounded transition-colors">
                    <div className="w-12 h-12 rounded-md flex-shrink-0 border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={getFaviconUrl(item.link) ?? pressThumb}
                        alt={item.source}
                        className="h-8 w-8 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = pressThumb; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground mb-1">
                        <span>{formatDate(item.published_at)}</span><span>—</span><span>{item.source}</span>
                        {item.medium && <span className="px-2 py-0.5 rounded-full bg-muted text-[0.75rem]">{item.medium}</span>}
                        {item.is_featured && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.75rem]">Featured</span>}
                      </div>
                      <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Opinion Form Dialog */}
        <Dialog open={showOpinionForm} onOpenChange={setShowOpinionForm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium">Send Your Opinion</DialogTitle>
              <DialogDescription>Share your perspective, media query, or story idea with us.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowOpinionForm(false);
              }}
              className="space-y-4 mt-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="opinion-name">Full Name</Label>
                  <Input id="opinion-name" placeholder="Your name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="opinion-org">Organisation</Label>
                  <Input id="opinion-org" placeholder="Publication / Outlet" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="opinion-email">Email</Label>
                <Input id="opinion-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="opinion-subject">Subject</Label>
                <Input id="opinion-subject" placeholder="What is this regarding?" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="opinion-message">Your Message</Label>
                <textarea
                  id="opinion-message"
                  rows={4}
                  placeholder="Share your opinion, query, or story idea..."
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowOpinionForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Query</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
