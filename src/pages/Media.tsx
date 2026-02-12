import { useState, useMemo, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { ExternalLink, Search, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import sernetLogo from '@/assets/sernet-logo.png';

type PressItem = {
  title: string;
  source: string;
  date: string;
  year: number;
  link: string;
  featured?: boolean;
};

const pressReleases: PressItem[] = [
  {
    title: "Sernet India expands wealth management services across Tier-2 cities",
    source: "Economic Times",
    date: "15 Jan 2025",
    year: 2025,
    link: "#",
    featured: true,
  },
  {
    title: "How Sernet India is redefining trust in financial advisory",
    source: "Mint",
    date: "02 Jan 2025",
    year: 2025,
    link: "#",
    featured: true,
  },
  {
    title: "Sernet India launches AI-powered portfolio insights for retail investors",
    source: "CNBC TV18",
    date: "18 Dec 2024",
    year: 2024,
    link: "#",
    featured: true,
  },
  {
    title: "Sernet India's client-first approach wins industry recognition",
    source: "Business Standard",
    date: "05 Dec 2024",
    year: 2024,
    link: "#",
  },
  {
    title: "Sernet India partners with leading insurers to offer holistic financial planning",
    source: "Money Control",
    date: "20 Nov 2024",
    year: 2024,
    link: "#",
    featured: true,
  },
  {
    title: "Why Sernet India believes financial literacy is the key to India's growth",
    source: "Forbes India",
    date: "10 Nov 2024",
    year: 2024,
    link: "#",
  },
  {
    title: "Sernet India crosses 50,000 active clients milestone",
    source: "The Times of India",
    date: "28 Oct 2024",
    year: 2024,
    link: "#",
  },
  {
    title: "Sernet India's zero-hidden-charges model disrupts traditional broking",
    source: "NDTV Profit",
    date: "15 Oct 2024",
    year: 2024,
    link: "#",
  },
  {
    title: "Inside Sernet India's mission to democratise investing",
    source: "Economic Times",
    date: "01 Sep 2024",
    year: 2024,
    link: "#",
  },
  {
    title: "Sernet India recognised among top emerging financial services firms",
    source: "Mint",
    date: "20 Aug 2024",
    year: 2024,
    link: "#",
    featured: true,
  },
  {
    title: "Sernet India launches comprehensive trading platform for equities and derivatives",
    source: "Business Standard",
    date: "10 Jun 2023",
    year: 2023,
    link: "#",
  },
  {
    title: "How Sernet India is building a tech-first broking experience",
    source: "Money Control",
    date: "15 Apr 2023",
    year: 2023,
    link: "#",
  },
  {
    title: "Sernet India's founders on the vision behind the company",
    source: "Forbes India",
    date: "20 Feb 2023",
    year: 2023,
    link: "#",
    featured: true,
  },
  {
    title: "Sernet India secures funding to accelerate digital broking expansion",
    source: "Economic Times",
    date: "12 Nov 2022",
    year: 2022,
    link: "#",
  },
  {
    title: "Sernet India opens new regional offices in South India",
    source: "Mint",
    date: "05 Jul 2022",
    year: 2022,
    link: "#",
  },
  {
    title: "Sernet India partners with fintech startups for seamless onboarding",
    source: "CNBC TV18",
    date: "18 Mar 2021",
    year: 2021,
    link: "#",
  },
  {
    title: "Sernet India's trading volumes surge during market rally",
    source: "Money Control",
    date: "02 Dec 2020",
    year: 2020,
    link: "#",
  },
  {
    title: "Sernet India introduces zero-brokerage plans for new investors",
    source: "Business Standard",
    date: "15 Aug 2019",
    year: 2019,
    link: "#",
  },
  {
    title: "Sernet India wins 'Best Emerging Broker' award at industry summit",
    source: "Forbes India",
    date: "20 Jun 2018",
    year: 2018,
    link: "#",
  },
  {
    title: "Sernet India launches mobile-first trading app",
    source: "The Times of India",
    date: "10 Oct 2017",
    year: 2017,
    link: "#",
  },
  {
    title: "Sernet India registered with SEBI as a stockbroker",
    source: "Economic Times",
    date: "05 Mar 2016",
    year: 2016,
    link: "#",
  },
];

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
const tabs = ['Featured', 'Timeline'] as const;

const Media = () => {
  const [activeTab, setActiveTab] = useState<'Featured' | 'Timeline'>('Featured');
  const [activeYear, setActiveYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      const scrollAmount = 120;
      yearScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filteredReleases = useMemo(() => {
    let items = pressReleases;

    if (activeTab === 'Featured') {
      items = items.filter((item) => item.featured);
    }

    if (activeTab === 'Timeline') {
      items = items.filter((item) => item.year === activeYear);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeTab, activeYear, searchQuery]);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-[2rem] md:text-[2.5rem] font-light leading-tight tracking-tight mb-6">
              Press & media
            </h1>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or publisher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Tabs: Featured / Timeline */}
          <div className="flex justify-center gap-8 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[1rem] transition-colors relative ${
                  activeTab === tab
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Year timeline (only for Timeline tab) */}
          {activeTab === 'Timeline' && (
            <div className="flex items-center gap-1 mb-10 border-b border-border">
              <button
                onClick={() => scrollYears('left')}
                className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Scroll years left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div
                ref={yearScrollRef}
                data-year-scroll
                className="flex gap-0 overflow-x-auto scroll-smooth flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
              >
                <style>{`[data-year-scroll]::-webkit-scrollbar { display: none; }`}</style>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`text-[0.875rem] px-4 py-2 transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${
                      activeYear === year
                        ? 'text-foreground font-medium border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              <button
                onClick={() => scrollYears('right')}
                className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Scroll years right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Press items */}
          <div className="divide-y divide-border">
            {filteredReleases.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-[0.9375rem]">
                No results found.
              </p>
            ) : (
              filteredReleases.map((item, index) => (
                <motion.a
                  key={`${item.year}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="block py-5 group hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground mb-1">
                    <span>{item.date}</span>
                    <span>—</span>
                    <span>{item.source}</span>
                  </div>
                  <h3 className="text-[1.0625rem] font-normal text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                </motion.a>
              ))
            )}
          </div>

          {/* Media Kit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-12 border-t border-border"
          >
            <h2 className="heading-lg mb-3">Media kit</h2>
            <p className="text-body mb-8 max-w-xl">
              Download our brand assets and guidelines for use in press coverage, partnerships, and media publications.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Logo Assets */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-24 mb-5 bg-secondary/50 rounded-md">
                  <img
                    src={sernetLogo}
                    alt="Sernet India Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <h3 className="heading-md text-[1.0625rem] mb-1">Logo assets</h3>
                <p className="text-small mb-4">
                  Official Sernet India logos in PNG, SVG, and vector formats for light and dark backgrounds.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download logo pack
                </a>
              </div>

              {/* Brand Guidelines */}
              <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-24 mb-5 bg-secondary/50 rounded-md">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary" />
                    <div className="w-8 h-8 rounded-md bg-foreground" />
                    <div className="w-8 h-8 rounded-md bg-muted-foreground" />
                    <div className="w-8 h-8 rounded-md bg-secondary" />
                  </div>
                </div>
                <h3 className="heading-md text-[1.0625rem] mb-1">Brand guidelines</h3>
                <p className="text-small mb-4">
                  Colour palette, typography, spacing rules, and usage guidelines to maintain brand consistency.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download brand guide
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
