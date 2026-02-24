import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticlesContent } from '@/components/insights/ArticlesContent';
import { AnalysisContent } from '@/components/insights/AnalysisContent';
import { ReportsContent } from '@/components/insights/ReportsContent';
import { BulletinContent } from '@/components/insights/BulletinContent';

const insightsTabs = ['Articles', 'Analysis', 'Reports', 'Bulletin'] as const;
type InsightsTab = (typeof insightsTabs)[number];

const tabContent: Record<InsightsTab, React.ReactNode> = {
  Articles: <ArticlesContent />,
  Analysis: <AnalysisContent />,
  Reports: <ReportsContent />,
  Bulletin: <BulletinContent />,
};

const Insights = () => {
  const [activeTab, setActiveTab] = useState<InsightsTab>('Articles');

  return (
    <Layout>
      <SEOHead
        title="Insights"
        description="Expert articles, market analysis, research reports and bulletins from SERNET Financial Services."
        path="/insights"
      />
      <PageHero
        title="Stay ahead with expert"
        highlight="Insights"
        description="Articles, market analysis, research reports, and important bulletins — all in one place."
        
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-sernet">
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

export default Insights;
