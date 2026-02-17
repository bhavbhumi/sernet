import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import featuredImg from '@/assets/recognition-featured.png';
import thumbImg from '@/assets/recognition-thumb.webp';

type RecognitionItem = {
  title: string;
  month: string;
  event: string;
  from: string;
  year: number;
  featured?: boolean;
  category?: string;
  subCategory?: string;
};

const recognitions: RecognitionItem[] = [
  { title: "Best Investment Advisory Firm", month: "November 2024", event: "Financial Excellence Awards", from: "India Finance Forum", year: 2024, featured: true, category: "Investment", subCategory: "Mutual Fund" },
  { title: "Most Trusted Financial Partner", month: "August 2023", event: "National Finance Summit", from: "India Finance Forum", year: 2023, category: "Trading", subCategory: "Equity" },
  { title: "Excellence in Customer Service", month: "March 2023", event: "BFSI Excellence Awards", from: "BFSI Awards Committee", year: 2023, featured: true, category: "Insurance", subCategory: "Life Insurance" },
  { title: "Best Wealth Management Services", month: "December 2022", event: "ET Financial Services Awards", from: "Economic Times", year: 2022, category: "Investment", subCategory: "Company FD" },
  { title: "Innovation in Financial Technology", month: "June 2022", event: "FinTech India Awards", from: "NASSCOM", year: 2022, featured: true, category: "Trading", subCategory: "Derivatives" },
  { title: "Top Emerging Financial Services Brand", month: "January 2022", event: "Brand Excellence Awards", from: "Business World", year: 2022, category: "Insurance", subCategory: "Health Insurance" },
];

const years = [...new Set(recognitions.map((r) => r.year))].sort((a, b) => b - a);
const categories = ['All', 'Trading', 'Investment', 'Insurance'] as const;

// 3 Featured items for carousel
const featuredItems = recognitions.filter(r => r.featured).slice(0, 3);

export const RecognitionContent = () => {
  const [activeYear, setActiveYear] = useState(years[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const scrollYears = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      yearScrollRef.current.scrollBy({ left: direction === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  };

  // Auto-cycle featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredRecognitions = useMemo(() => {
    return recognitions.filter((item) => {
      const yearMatch = item.year === activeYear;
      const catMatch = activeCategory === 'All' || item.category === activeCategory;
      return yearMatch && catMatch;
    });
  }, [activeYear, activeCategory]);

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">

        {/* Section 1: Title + Featured Recognition Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight mb-4">
              Recognition & <span className="text-primary font-normal">Awards</span>
            </h2>
            <p className="text-body leading-relaxed">
              Recognition could be in Trading, Investment, Insurance category and Mutual Fund, Life or Health Insurance, Company FD etc sub category — honouring our commitment to excellence across every service vertical.
            </p>
          </motion.div>

          {/* Right: Featured Recognition Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="w-full p-6 rounded-xl border border-border bg-card"
                >
                  <img src={featuredImg} alt={featuredItems[featuredIndex].title} className="w-full h-48 rounded-lg object-cover mb-4" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.6875rem] font-medium">Featured</span>
                    <span>{featuredItems[featuredIndex].month}</span>
                    <span>—</span>
                    <span>{featuredItems[featuredIndex].event}</span>
                  </div>
                  <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground leading-snug">{featuredItems[featuredIndex].title}</h3>
                  <p className="text-[0.875rem] text-muted-foreground mt-1">From <span className="font-medium text-foreground">{featuredItems[featuredIndex].from}</span></p>
                </motion.div>
              </AnimatePresence>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredItems.map((_, i) => (
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
          <div ref={yearScrollRef} data-year-scroll-recog className="flex gap-0 overflow-x-auto scroll-smooth flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
            <style>{`[data-year-scroll-recog]::-webkit-scrollbar { display: none; }`}</style>
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

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recognition List */}
        <AnimatePresence mode="wait">
          <motion.div key={`${activeYear}-${activeCategory}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="divide-y divide-border">
              {filteredRecognitions.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-[1rem]">No recognitions for this year.</p>
              ) : (
                filteredRecognitions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className="flex items-center gap-4 py-5 group hover:bg-muted/30 -mx-4 px-4 rounded transition-colors"
                  >
                    <img src={thumbImg} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0 border border-border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground mb-1">
                        <span>{item.month}</span><span>—</span><span>{item.event}</span>
                        {item.category && <span className="px-2 py-0.5 rounded-full bg-muted text-[0.75rem]">{item.category}</span>}
                      </div>
                      <h3 className="text-[1.1875rem] md:text-[1.25rem] font-normal text-foreground leading-snug">{item.title}</h3>
                      <p className="text-[0.875rem] text-muted-foreground mt-0.5">From <span className="font-medium text-foreground">{item.from}</span></p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
