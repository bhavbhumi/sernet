import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurveysContent } from '@/components/opinions/SurveysContent';
import { PollsContent } from '@/components/opinions/PollsContent';

const opinionsTabs = ['Surveys', 'Polls'] as const;
type OpinionsTab = (typeof opinionsTabs)[number];

const tabContent: Record<OpinionsTab, React.ReactNode> = {
  Surveys: <SurveysContent />,
  Polls: <PollsContent />,
};

const Opinions = () => {
  const [activeTab, setActiveTab] = useState<OpinionsTab>('Surveys');

  return (
    <Layout>
      <PageHero
        title="Your voice shapes our"
        highlight="future"
        description="Share your feedback through surveys and polls — help us improve products, services, and your overall experience."
        breadcrumbLabel="Opinions"
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {opinionsTabs.map((tab) => (
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
                    layoutId="opinions-tab-underline"
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

export default Opinions;
