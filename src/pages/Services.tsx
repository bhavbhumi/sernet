import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TradingServiceContent } from '@/components/services/TradingServiceContent';
import { InvestmentServiceContent } from '@/components/services/InvestmentServiceContent';
import { InsuranceServiceContent } from '@/components/services/InsuranceServiceContent';
import { EducationServiceContent } from '@/components/services/EducationServiceContent';
import { EstatePlanningServiceContent } from '@/components/services/EstatePlanningServiceContent';
import { CreditCounsellingServiceContent } from '@/components/services/CreditCounsellingServiceContent';

const servicesTabs = ['Trading', 'Investment', 'Insurance', 'Education', 'Estate Planning', 'Credit Counselling'] as const;
type ServicesTab = (typeof servicesTabs)[number];

const tabContent: Record<ServicesTab, React.ReactNode> = {
  Trading: <TradingServiceContent />,
  Investment: <InvestmentServiceContent />,
  Insurance: <InsuranceServiceContent />,
  Education: <EducationServiceContent />,
  'Estate Planning': <EstatePlanningServiceContent />,
  'Credit Counselling': <CreditCounsellingServiceContent />,
};

const Services = () => {
  const [activeTab, setActiveTab] = useState<ServicesTab>('Trading');

  return (
    <Layout>
      <PageHero
        title="Comprehensive financial"
        highlight="services"
        description="From trading and investments to insurance — we distribute the best financial products with transparent pricing and dedicated support."
        icon={Briefcase}
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {servicesTabs.map((tab) => (
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
                    layoutId="services-tab-underline"
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

export default Services;
