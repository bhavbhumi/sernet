import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import {
  downloadsTabs, downloadsTabLabels, downloadsContent, resolveDownloadsTab,
} from '@/content/downloads';

const DownloadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = resolveDownloadsTab(searchParams.get('tab'));
  const content = downloadsContent[activeTab];
  const visibleSections = content.sections.filter((section) => section.docs.length > 0);

  return (
    <Layout>
      <SEOHead
        title="Downloads"
        description="Download account opening forms, product documents and apps for Tick Funds, Tushil and Choice FinX."
        path="/downloads"
      />
      <PageHero
        title="Forms, documents and"
        highlight="Apps"
        description="Account opening forms, product information and apps — everything you need in one place."
        breadcrumbLabel="Downloads"
      />

      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }} role="tablist">
            {downloadsTabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setSearchParams({ tab })}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {downloadsTabLabels[tab]}
                {activeTab === tab && (
                  <motion.div layoutId="downloads-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-sernet space-y-12">
          <p className="text-body text-muted-foreground">{content.intro}</p>
          {visibleSections.map((section, index) => (
            <motion.section
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h2 className="heading-lg mb-6">{section.heading}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.docs.map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/50 rounded-lg p-4 flex items-center justify-between gap-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.note}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="opens in a new tab" />
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
          {visibleSections.length === 0 && (
            <p className="text-small text-muted-foreground">Forms and documents for this service will be added here shortly.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DownloadsPage;
