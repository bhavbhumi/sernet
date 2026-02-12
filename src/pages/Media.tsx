import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
];

const years = [2025, 2024, 2023];
const tabs = ['Recent', 'Featured'] as const;

const Media = () => {
  const [activeTab, setActiveTab] = useState<'Recent' | 'Featured'>('Recent');
  const [activeYear, setActiveYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = useMemo(() => {
    let items = pressReleases;

    if (activeTab === 'Featured') {
      items = items.filter((item) => item.featured);
    }

    if (activeTab === 'Recent') {
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
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-6">
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

          {/* Tabs: Recent / Featured */}
          <div className="flex justify-center gap-8 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-foreground'
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

          {/* Year pills (only for Recent tab) */}
          {activeTab === 'Recent' && (
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`text-sm font-medium pb-1 transition-colors border-b-2 ${
                    activeYear === year
                      ? 'text-foreground border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Press items */}
          <div className="divide-y divide-border">
            {filteredReleases.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No results found.
              </p>
            ) : (
              filteredReleases.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="block py-6 group hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date}</span>
                    <span>—</span>
                    <span className="font-medium">{item.source}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
