import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
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
      <PageHero
        title="NextGen Financial"
        highlight="Service Network"
        description="Always on the journey of engaging, enabling and empowering prosperity globally"
        breadcrumbLabel="About"
      />
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
