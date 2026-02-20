import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import MarketHolidaysContent from '@/components/calendars/MarketHolidaysContent';
import EconomicCalendarContent from '@/components/calendars/EconomicCalendarContent';
import CorporateEventsContent from '@/components/calendars/CorporateEventsContent';

const calendarTabs = ['Holiday Events', 'Economic Events', 'Corporate Events'] as const;
type CalendarTab = (typeof calendarTabs)[number];

const tabContent: Record<CalendarTab, React.ReactNode> = {
  'Holiday Events': <MarketHolidaysContent />,
  'Economic Events': <EconomicCalendarContent />,
  'Corporate Events': <CorporateEventsContent />,
};

const Calendars = () => {
  const [activeTab, setActiveTab] = useState<CalendarTab>('Holiday Events');

  return (
    <Layout>
      <PageHero
        title="Important dates and"
        highlight="Events"
        description="Market holidays, economic events, and data releases — stay ahead of what moves the markets."
        breadcrumbLabel="Calendars"
      />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {calendarTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="calendar-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
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

export default Calendars;
