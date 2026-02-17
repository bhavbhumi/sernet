import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleCallContent from '@/components/contact/ScheduleCallContent';
import AskUsContent from '@/components/contact/AskUsContent';
import VisitUsContent from '@/components/contact/VisitUsContent';

const contactTabs = ['Schedule a Call', 'Ask Us', 'Visit Us'] as const;
type ContactTab = (typeof contactTabs)[number];

const tabContent: Record<ContactTab, React.ReactNode> = {
  'Schedule a Call': <ScheduleCallContent />,
  'Ask Us': <AskUsContent />,
  'Visit Us': <VisitUsContent />,
};

const Contact = () => {
  const [activeTab, setActiveTab] = useState<ContactTab>('Schedule a Call');

  return (
    <Layout>
      <PageHero
        title="Get in touch"
        highlight="with us"
        description="Schedule a call, send us a message, or visit one of our offices — we're here to help."
        breadcrumbLabel="Contact"
      />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {contactTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
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
