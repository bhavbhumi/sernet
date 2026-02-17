import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, FileText, Palette, Type, Image, Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import sernetLogo from '@/assets/sernet-logo.png';
import pressHeroImg from '@/assets/press-media-hero.webp';
import pressThumb from '@/assets/press-thumb.webp';

type PressItem = {
  title: string;
  source: string;
  date: string;
  year: number;
  link: string;
  featured?: boolean;
  medium?: string;
};

const pressReleases: PressItem[] = [
  { title: "Sernet India expands wealth management services across Tier-2 cities", source: "Economic Times", date: "15 Jan 2025", year: 2025, link: "#", featured: true, medium: "Web" },
  { title: "How Sernet India is redefining trust in financial advisory", source: "Mint", date: "02 Jan 2025", year: 2025, link: "#", featured: true, medium: "Print" },
  { title: "Sernet India launches AI-powered portfolio insights for retail investors", source: "CNBC TV18", date: "18 Dec 2024", year: 2024, link: "#", featured: true, medium: "TV" },
  { title: "Sernet India's client-first approach wins industry recognition", source: "Business Standard", date: "05 Dec 2024", year: 2024, link: "#", medium: "Web" },
  { title: "Sernet India partners with leading insurers to offer holistic financial planning", source: "Money Control", date: "20 Nov 2024", year: 2024, link: "#", featured: true, medium: "Web" },
  { title: "Why Sernet India believes financial literacy is the key to India's growth", source: "Forbes India", date: "10 Nov 2024", year: 2024, link: "#", medium: "Print" },
  { title: "Sernet India crosses 50,000 active clients milestone", source: "The Times of India", date: "28 Oct 2024", year: 2024, link: "#", medium: "Print" },
  { title: "Sernet India's zero-hidden-charges model disrupts traditional broking", source: "NDTV Profit", date: "15 Oct 2024", year: 2024, link: "#", medium: "TV" },
  { title: "Inside Sernet India's mission to democratise investing", source: "Economic Times", date: "01 Sep 2024", year: 2024, link: "#", medium: "Web" },
  { title: "Sernet India recognised among top emerging financial services firms", source: "Mint", date: "20 Aug 2024", year: 2024, link: "#", featured: true, medium: "Print" },
  { title: "Sernet India launches comprehensive trading platform for equities and derivatives", source: "Business Standard", date: "10 Jun 2023", year: 2023, link: "#", medium: "Web" },
  { title: "How Sernet India is building a tech-first broking experience", source: "Money Control", date: "15 Apr 2023", year: 2023, link: "#", medium: "Web" },
  { title: "Sernet India's founders on the vision behind the company", source: "Forbes India", date: "20 Feb 2023", year: 2023, link: "#", featured: true, medium: "Print" },
  { title: "Sernet India secures funding to accelerate digital broking expansion", source: "Economic Times", date: "12 Nov 2022", year: 2022, link: "#", medium: "Web" },
  { title: "Sernet India opens new regional offices in South India", source: "Mint", date: "05 Jul 2022", year: 2022, link: "#", medium: "Print" },
  { title: "Sernet India partners with fintech startups for seamless onboarding", source: "CNBC TV18", date: "18 Mar 2021", year: 2021, link: "#", medium: "TV" },
  { title: "Sernet India's trading volumes surge during market rally", source: "Money Control", date: "02 Dec 2020", year: 2020, link: "#", medium: "Web" },
  { title: "Sernet India introduces zero-brokerage plans for new investors", source: "Business Standard", date: "15 Aug 2019", year: 2019, link: "#", medium: "Web" },
  { title: "Sernet India wins 'Best Emerging Broker' award at industry summit", source: "Forbes India", date: "20 Jun 2018", year: 2018, link: "#", medium: "Radio" },
  { title: "Sernet India launches mobile-first trading app", source: "The Times of India", date: "10 Oct 2017", year: 2017, link: "#", medium: "Web" },
  { title: "Sernet India registered with SEBI as a stockbroker", source: "Economic Times", date: "05 Mar 2016", year: 2016, link: "#", medium: "Print" },
];

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
const mediums = ['All', 'Web', 'Print', 'Radio', 'TV'] as const;

// 3 Featured Posts for carousel
const featuredPosts = pressReleases.filter(p => p.featured).slice(0, 3);

export const PressContent = () => {
  const [activeYear, setActiveYear] = useState(2025);
  const [activeMedium, setActiveMedium] = useState<string>('All');
  const [showOpinionForm, setShowOpinionForm] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  // Auto-cycle featured posts
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredReleases = useMemo(() => {
    return pressReleases.filter((item) => {
      const yearMatch = item.year === activeYear;
      const mediumMatch = activeMedium === 'All' || item.medium === activeMedium;
      return yearMatch && mediumMatch;
    });
  }, [activeYear, activeMedium]);

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
              Coverage could be on Web, Print, Radio or TV — recognised by leading publications 
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
              <AnimatePresence mode="wait">
                <motion.a
                  key={featuredIndex}
                  href={featuredPosts[featuredIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="w-full p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group block"
                >
                  <img src={pressThumb} alt="" className="w-full h-48 rounded-lg object-cover mb-4 border border-border" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured</span>
                    <span>{featuredPosts[featuredIndex].date}</span>
                    <span>—</span>
                    <span>{featuredPosts[featuredIndex].source}</span>
                  </div>
                  <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground group-hover:text-primary transition-colors leading-snug">{featuredPosts[featuredIndex].title}</h3>
                </motion.a>
              </AnimatePresence>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredPosts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeaturedIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === featuredIndex ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Year Timeline */}
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
              {filteredReleases.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-[1rem]">No results found.</p>
              ) : (
                filteredReleases.map((item, index) => (
                  <motion.a key={`${item.year}-${index}`} href={item.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="flex items-center gap-4 py-5 group hover:bg-muted/30 -mx-4 px-4 rounded transition-colors">
                    <img src={pressThumb} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0 border border-border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground mb-1">
                        <span>{item.date}</span><span>—</span><span>{item.source}</span>
                        {item.medium && <span className="px-2 py-0.5 rounded-full bg-muted text-[0.75rem]">{item.medium}</span>}
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
