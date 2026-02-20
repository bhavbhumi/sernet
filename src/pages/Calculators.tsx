import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import BrokerageCalcContent from '@/components/calculators/BrokerageCalcContent';
import MarginCalcContent from '@/components/calculators/MarginCalcContent';
import SIPCalcContent from '@/components/calculators/SIPCalcContent';
import LumpsumCalcContent from '@/components/calculators/LumpsumCalcContent';
import GoalCalcContent from '@/components/calculators/GoalCalcContent';
import InsuranceNeedCalcContent from '@/components/calculators/InsuranceNeedCalcContent';

type ServiceTab = 'Trading' | 'Investment' | 'Insurance';
const serviceTabs: ServiceTab[] = ['Trading', 'Investment', 'Insurance'];

const subTabs: Record<ServiceTab, string[]> = {
  Trading: ['Brokerage', 'Margin'],
  Investment: ['SIP', 'Lumpsum', 'Goal Planner'],
  Insurance: ['Need Estimator'],
};

const serviceDescriptions: Record<ServiceTab, string> = {
  Trading: 'Estimate brokerage costs, margins & leverage for your trades',
  Investment: 'Plan SIPs, lumpsum investments, and goal-based wealth creation',
  Insurance: 'Find out how much life cover your family truly needs',
};

const Calculators = () => {
  const [activeService, setActiveService] = useState<ServiceTab>('Investment');
  const [activeSubTab, setActiveSubTab] = useState<string>('SIP');

  const handleServiceChange = (service: ServiceTab) => {
    setActiveService(service);
    setActiveSubTab(subTabs[service][0]);
  };

  const renderContent = () => {
    if (activeService === 'Trading') {
      if (activeSubTab === 'Brokerage') return <BrokerageCalcContent />;
      if (activeSubTab === 'Margin') return <MarginCalcContent />;
    }
    if (activeService === 'Investment') {
      if (activeSubTab === 'SIP') return <SIPCalcContent />;
      if (activeSubTab === 'Lumpsum') return <LumpsumCalcContent />;
      if (activeSubTab === 'Goal Planner') return <GoalCalcContent />;
    }
    if (activeService === 'Insurance') {
      return <InsuranceNeedCalcContent />;
    }
    return null;
  };

  return (
    <Layout>
      <PageHero
        title="Financial planning made"
        highlight="Simple"
        description="Trading costs, margins, SIP returns, goal planning, and insurance needs — calculate it all in one place."
        breadcrumbLabel="Calculators"
      />

      {/* ── Service tabs (primary) ── */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {serviceTabs.map((service) => (
              <button
                key={service}
                onClick={() => handleServiceChange(service)}
                className={`pb-3.5 pt-4 px-5 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeService === service
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {service}
                {activeService === service && (
                  <motion.div
                    layoutId="service-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sub-tabs + description ── */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="container-zerodha py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {subTabs[activeService].map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubTab(sub)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeSubTab === sub
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground sm:ml-auto hidden sm:block">
            {serviceDescriptions[activeService]}
          </p>
        </div>
      </div>

      {/* ── Calculator content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeService}-${activeSubTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Calculators;
