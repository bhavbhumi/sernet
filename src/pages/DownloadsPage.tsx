import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import AppsContent from '@/components/downloads/AppsContent';
import DocumentsContent from '@/components/downloads/DocumentsContent';

const downloadsTabs = ['Apps', 'Documents'] as const;
type DownloadsTab = (typeof downloadsTabs)[number];

const tabContent: Record<DownloadsTab, React.ReactNode> = {
  Apps: <AppsContent />,
  Documents: <DocumentsContent />,
};

const DownloadsPage = () => {
  const [activeTab, setActiveTab] = useState<DownloadsTab>('Apps');

  return (
    <Layout>
      <PageHero
        title="Get our apps and"
        highlight="Resources"
        description="Download trading platforms, mobile apps, and important documents — everything you need in one place."
        breadcrumbLabel="Downloads"
      />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {downloadsTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="downloads-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default DownloadsPage;
