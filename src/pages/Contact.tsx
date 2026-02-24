import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleCallContent from '@/components/contact/ScheduleCallContent';
import AskUsContent from '@/components/contact/AskUsContent';
import VisitUsContent from '@/components/contact/VisitUsContent';

const contactTabs = ['Schedule a Call', 'Ask Us', 'Visit Us'] as const;
type ContactTab = (typeof contactTabs)[number];

const tabI18nKeys: Record<ContactTab, string> = {
  'Schedule a Call': 'contact.tabs.scheduleCall',
  'Ask Us': 'contact.tabs.askUs',
  'Visit Us': 'contact.tabs.visitUs',
};

const tabContent: Record<ContactTab, React.ReactNode> = {
  'Schedule a Call': <ScheduleCallContent />,
  'Ask Us': <AskUsContent />,
  'Visit Us': <VisitUsContent />,
};

const Contact = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ContactTab | null;
  const [activeTab, setActiveTab] = useState<ContactTab>(
    tabParam && contactTabs.includes(tabParam) ? tabParam : 'Schedule a Call'
  );

  useEffect(() => {
    if (tabParam && contactTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: ContactTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Us"
        description="Get in touch with SERNET Financial Services. Schedule a call, send us a message, or visit our offices."
        path="/contact"
      />
      <PageHero
        title={t('contact.title')}
        highlight={t('contact.highlight')}
        description={t('contact.description')}
        breadcrumbLabel={t('nav.contact')}
      />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {contactTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(tabI18nKeys[tab])}
                {activeTab === tab && (
                  <motion.div layoutId="contact-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
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

export default Contact;