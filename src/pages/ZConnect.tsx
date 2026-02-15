import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisContent } from '@/components/insights/AnalysisContent';
import { ReportsContent } from '@/components/insights/ReportsContent';
import { BulletinContent } from '@/components/insights/BulletinContent';
import { UpdatesContent } from '@/components/insights/UpdatesContent';

const insightsTabs = ['Analysis', 'Reports', 'Bulletin', 'Updates'] as const;
type InsightsTab = (typeof insightsTabs)[number];

const tabContent: Record<InsightsTab, React.ReactNode> = {
  Analysis: <AnalysisContent />,
  Reports: <ReportsContent />,
  Bulletin: <BulletinContent />,
  Updates: <UpdatesContent />,
};

const ZConnect = () => {
  const [activeTab, setActiveTab] = useState<InsightsTab>('Analysis');

  return (
    <Layout>
      <PageHero
        title="Stay ahead with expert"
        highlight="Insights"
        description="Market analysis, research reports, important bulletins, and real-time updates — all in one place."
        icon={Lightbulb}
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {insightsTabs.map((tab) => (
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
                    layoutId="insights-tab-underline"
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

export default ZConnect;
