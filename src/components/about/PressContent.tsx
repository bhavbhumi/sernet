import { useState, useMemo, useRef } from 'react';
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
};

const pressReleases: PressItem[] = [
  { title: "Sernet India expands wealth management services across Tier-2 cities", source: "Economic Times", date: "15 Jan 2025", year: 2025, link: "#", featured: true },
  { title: "How Sernet India is redefining trust in financial advisory", source: "Mint", date: "02 Jan 2025", year: 2025, link: "#", featured: true },
  { title: "Sernet India launches AI-powered portfolio insights for retail investors", source: "CNBC TV18", date: "18 Dec 2024", year: 2024, link: "#", featured: true },
  { title: "Sernet India's client-first approach wins industry recognition", source: "Business Standard", date: "05 Dec 2024", year: 2024, link: "#" },
  { title: "Sernet India partners with leading insurers to offer holistic financial planning", source: "Money Control", date: "20 Nov 2024", year: 2024, link: "#", featured: true },
  { title: "Why Sernet India believes financial literacy is the key to India's growth", source: "Forbes India", date: "10 Nov 2024", year: 2024, link: "#" },
  { title: "Sernet India crosses 50,000 active clients milestone", source: "The Times of India", date: "28 Oct 2024", year: 2024, link: "#" },
  { title: "Sernet India's zero-hidden-charges model disrupts traditional broking", source: "NDTV Profit", date: "15 Oct 2024", year: 2024, link: "#" },
  { title: "Inside Sernet India's mission to democratise investing", source: "Economic Times", date: "01 Sep 2024", year: 2024, link: "#" },
  { title: "Sernet India recognised among top emerging financial services firms", source: "Mint", date: "20 Aug 2024", year: 2024, link: "#", featured: true },
  { title: "Sernet India launches comprehensive trading platform for equities and derivatives", source: "Business Standard", date: "10 Jun 2023", year: 2023, link: "#" },
  { title: "How Sernet India is building a tech-first broking experience", source: "Money Control", date: "15 Apr 2023", year: 2023, link: "#" },
  { title: "Sernet India's founders on the vision behind the company", source: "Forbes India", date: "20 Feb 2023", year: 2023, link: "#", featured: true },
  { title: "Sernet India secures funding to accelerate digital broking expansion", source: "Economic Times", date: "12 Nov 2022", year: 2022, link: "#" },
  { title: "Sernet India opens new regional offices in South India", source: "Mint", date: "05 Jul 2022", year: 2022, link: "#" },
  { title: "Sernet India partners with fintech startups for seamless onboarding", source: "CNBC TV18", date: "18 Mar 2021", year: 2021, link: "#" },
  { title: "Sernet India's trading volumes surge during market rally", source: "Money Control", date: "02 Dec 2020", year: 2020, link: "#" },
  { title: "Sernet India introduces zero-brokerage plans for new investors", source: "Business Standard", date: "15 Aug 2019", year: 2019, link: "#" },
  { title: "Sernet India wins 'Best Emerging Broker' award at industry summit", source: "Forbes India", date: "20 Jun 2018", year: 2018, link: "#" },
  { title: "Sernet India launches mobile-first trading app", source: "The Times of India", date: "10 Oct 2017", year: 2017, link: "#" },
  { title: "Sernet India registered with SEBI as a stockbroker", source: "Economic Times", date: "05 Mar 2016", year: 2016, link: "#" },
];

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
const tabs = ['Recent', 'Featured', 'Media Kit'] as const;
type TabType = (typeof tabs)[number];

export const PressContent = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Recent');
  const [activeYear, setActiveYear] = useState(2025);
  const [showOpinionForm, setShowOpinionForm] = useState(false);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  const filteredReleases = useMemo(() => {
    let items = [...pressReleases];
    if (activeTab === 'Featured') items = items.filter((item) => item.featured);
    if (activeTab === 'Recent') items = items.filter((item) => item.year === activeYear);
    return items;
  }, [activeTab, activeYear]);

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Our Opinion - Press & Media Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
              Press & <span className="text-primary font-normal">Media</span>
            </h2>
            <p className="text-body leading-relaxed">
              Sernet India's voice in the financial world — recognised by leading publications 
              for our commitment to transparency, client empowerment, and innovation that drives 
              India's next generation of investors forward.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-end"
          >
            <img src={pressHeroImg} alt="Press and Media" className="rounded-xl max-w-[320px] w-full shadow-md" />
          </motion.div>
        </div>

        {/* Section 2 & 3: Tabs + List (no search bar) */}
        <div className="flex justify-center gap-10 border-b border-border mb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3.5 text-[1.0625rem] transition-colors relative ${
                activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="press-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab !== 'Media Kit' && (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {activeTab === 'Recent' && (
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
                        </div>
                        <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                      </div>
                    </motion.a>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Media Kit' && (
            <motion.div key="media-kit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="pt-10">
              <div className="max-w-3xl mx-auto mb-10">
                <p className="text-[1rem] text-muted-foreground leading-relaxed">
                  Download our brand assets and guidelines for use in press coverage, partnerships, and media publications.
                  For media enquiries, contact us at <a href="mailto:media@sernetindia.com" className="text-primary hover:underline">media@sernetindia.com</a>.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-center h-28 mb-5 bg-secondary/50 rounded-md">
                    <img src={sernetLogo} alt="Sernet India Logo" className="h-12 w-auto object-contain" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4 text-primary" />
                    <h3 className="text-[1.0625rem] font-medium text-foreground">Logo assets</h3>
                  </div>
                  <p className="text-[0.875rem] text-muted-foreground mb-4 leading-relaxed">Official logos in PNG, SVG, and vector formats for light and dark backgrounds.</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary hover:text-primary/80 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download logo pack
                  </a>
                </div>

                <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-center h-28 mb-5 bg-secondary/50 rounded-md">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-md bg-primary" />
                      <div className="w-8 h-8 rounded-md bg-foreground" />
                      <div className="w-8 h-8 rounded-md bg-muted-foreground" />
                      <div className="w-8 h-8 rounded-md bg-secondary border border-border" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <h3 className="text-[1.0625rem] font-medium text-foreground">Brand guidelines</h3>
                  </div>
                  <p className="text-[0.875rem] text-muted-foreground mb-4 leading-relaxed">Colour palette, typography, spacing rules, and usage guidelines for brand consistency.</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary hover:text-primary/80 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download brand guide
                  </a>
                </div>

                <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-center h-28 mb-5 bg-secondary/50 rounded-md">
                    <span className="text-3xl font-light text-foreground tracking-tight">Aa</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4 text-primary" />
                    <h3 className="text-[1.0625rem] font-medium text-foreground">Typography</h3>
                  </div>
                  <p className="text-[0.875rem] text-muted-foreground mb-4 leading-relaxed">Font families, type scale, and typographic guidelines used across the Sernet brand.</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary hover:text-primary/80 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download type guide
                  </a>
                </div>
              </div>

              <div className="max-w-3xl mx-auto mt-14">
                <h2 className="text-[1.375rem] font-medium text-foreground mb-4">Usage guidelines</h2>
                <div className="divide-y divide-border">
                  {[
                    { icon: '✓', text: 'Use the official logo without any modifications to colour, proportion, or orientation.' },
                    { icon: '✓', text: 'Maintain the minimum clear space around the logo as specified in the brand guide.' },
                    { icon: '✓', text: 'Use the dark logo on light backgrounds and the light logo on dark backgrounds.' },
                    { icon: '✗', text: 'Do not stretch, rotate, add effects, or alter the logo in any way.' },
                    { icon: '✗', text: 'Do not use the Sernet name or logo to imply endorsement without written permission.' },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-start gap-3 py-3.5">
                      <span className={`text-[0.9375rem] font-medium mt-0.5 ${rule.icon === '✓' ? 'text-green-600' : 'text-destructive'}`}>{rule.icon}</span>
                      <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-w-3xl mx-auto mt-12 p-6 bg-secondary/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[1rem] font-medium text-foreground mb-1">Press enquiries</h3>
                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                      For interviews, press releases, or media partnerships, reach out to our communications team at{' '}
                      <a href="mailto:media@sernetindia.com" className="text-primary hover:underline">media@sernetindia.com</a>.
                      We typically respond within one business day.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 4: Send Your Opinion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-[2rem] md:text-[2.25rem] font-light text-foreground mb-3">
            Send Your <span className="text-primary font-normal">Opinion</span>
          </h2>
          <p className="text-body max-w-xl mx-auto mb-8">
            Are you from the press or media? We'd love to hear your perspective — share your thoughts, 
            queries, or story ideas with our communications team.
          </p>
          <Button
            onClick={() => setShowOpinionForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-[1rem] rounded-md"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Your Query
          </Button>
        </motion.div>

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
