import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsContent } from '@/components/updates/NewsContent';
import { CircularsContent } from '@/components/updates/CircularsContent';

const updatesTabs = ['News', 'Circulars'] as const;
type UpdatesTab = (typeof updatesTabs)[number];

const tabContent: Record<UpdatesTab, React.ReactNode> = {
  News: <NewsContent />,
  Circulars: <CircularsContent />,
};

const UpdatesPage = () => {
  const [activeTab, setActiveTab] = useState<UpdatesTab>('News');

  return (
    <Layout>
      <SEOHead
        title="Updates"
        description="Latest market news, regulatory circulars and exchange notices curated by SERNET Financial Services."
        path="/updates"
      />
      <PageHero
        title="Stay informed with latest"
        highlight="Updates"
        description="Market news, regulatory circulars, exchange notices, and policy changes — all in one place."
        breadcrumbLabel="Updates"
      />

      {/* Tab Navigation */}
      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {updatesTabs.map((tab) => (
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
                    layoutId="updates-tab-underline"
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

export default UpdatesPage;
