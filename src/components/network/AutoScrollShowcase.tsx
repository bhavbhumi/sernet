import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ShowcaseItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  detail: {
    heading: string;
    description: string;
    points?: string[];
    image?: string;
  };
}

interface AutoScrollShowcaseProps {
  sectionTitle: string;
  sectionSubtitle: string;
  items: ShowcaseItem[];
  interval?: number;
}

export const AutoScrollShowcase = ({
  sectionTitle,
  sectionSubtitle,
  items,
  interval = 4000,
}: AutoScrollShowcaseProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [isPaused, next, interval]);

  const active = items[activeIndex];

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-lg text-foreground mb-3 text-center"
        >
          {sectionTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-body text-center mb-12 max-w-2xl mx-auto"
        >
          {sectionSubtitle}
        </motion.p>

        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl border border-border overflow-hidden bg-card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left — Item List (horizontal scroll on mobile) */}
          <div className="lg:col-span-2 lg:border-r border-border flex lg:flex-col overflow-x-auto lg:overflow-x-visible" style={{ scrollbarWidth: 'none' }}>
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => setActiveIndex(index)}
                  className={`text-left px-5 py-4 flex items-center gap-4 transition-all duration-300 border-b lg:border-b border-r lg:border-r-0 border-border last:border-b-0 last:border-r-0 relative whitespace-nowrap lg:whitespace-normal min-w-[200px] lg:min-w-0 w-auto lg:w-full ${
                    isActive
                      ? 'bg-primary/8'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="showcase-active-bar"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                      isActive ? 'text-primary translate-x-0.5' : 'text-muted-foreground/50'
                    }`}
                  />

                  {/* Progress bar for active item */}
                  {isActive && !isPaused && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-primary/30"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: interval / 1000, ease: 'linear' }}
                      key={`progress-${activeIndex}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right — Detail Panel */}
          <div className="lg:col-span-3 p-6 md:p-8 lg:p-10 flex flex-col justify-center min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <active.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="heading-md text-foreground">{active.detail.heading}</h3>
                </div>

                <p className="text-body text-sm mb-6 leading-relaxed max-w-lg">
                  {active.detail.description}
                </p>

                {active.detail.points && active.detail.points.length > 0 && (
                  <ul className="space-y-2.5">
                    {active.detail.points.map((point, i) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                        </span>
                        <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {active.detail.image && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-border">
                    <img
                      src={active.detail.image}
                      alt={active.detail.heading}
                      className="w-full h-auto object-cover max-h-48"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
