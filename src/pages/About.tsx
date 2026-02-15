import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { Building2 } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { CompanyContent } from '@/components/about/CompanyContent';
import { CareersContent } from '@/components/about/CareersContent';
import { PressContent } from '@/components/about/PressContent';
import { RecognitionContent } from '@/components/about/RecognitionContent';
import { ReviewsContent } from '@/components/about/ReviewsContent';

const aboutTabs = ['Company', 'Careers', 'Press', 'Recognition', 'Reviews'] as const;
type AboutTab = (typeof aboutTabs)[number];

const tabContent: Record<AboutTab, React.ReactNode> = {
  Company: <CompanyContent />,
  Careers: <CareersContent />,
  Press: <PressContent />,
  Recognition: <RecognitionContent />,
  Reviews: <ReviewsContent />,
};

const About = () => {
  const [activeTab, setActiveTab] = useState<AboutTab>('Company');

  return (
    <Layout>
      <section className="section-padding relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-10 right-[15%] w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'hsl(var(--primary) / 0.4)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 left-[10%] w-56 h-56 rounded-full opacity-15 blur-3xl"
          style={{ background: 'hsl(var(--sernet-yellow) / 0.5)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-[5%] w-3 h-3 rounded-full bg-primary/40"
          animate={{ y: [0, -40, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-primary/30"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[25%] w-2.5 h-2.5 rounded-full"
          style={{ background: 'hsl(var(--sernet-yellow) / 0.5)' }}
          animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
        />

        <div className="container-zerodha relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Logo with decorations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center lg:justify-end lg:order-2"
            >
              <img
                src={sernetLogo}
                alt="SERNET Logo"
                className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] h-auto drop-shadow-lg"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:order-1"
            >
              <h1 className="text-[2.25rem] md:text-[2.75rem] font-light text-foreground leading-[1.15] mb-4 tracking-tight">
                NextGen Financial{' '}
                <span className="text-primary font-normal">Service Network</span>
              </h1>
              <p className="text-body max-w-lg mb-8">Always on the journey of engaging, enabling and empowering prosperity globally</p>
              <a href="/schedule-call" className="btn-primary px-8 py-3.5 text-base inline-flex items-center">
                Schedule a Call
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {aboutTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="about-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default About;
