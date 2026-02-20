import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import BrokerageCalcContent from '@/components/calculators/BrokerageCalcContent';
import MarginCalcContent from '@/components/calculators/MarginCalcContent';
import SIPCalcContent from '@/components/calculators/SIPCalcContent';
import LumpsumCalcContent from '@/components/calculators/LumpsumCalcContent';
import { AICalculatorBar } from '@/components/calculators/AICalculatorBar';

const calcTabs = ['Brokerage', 'Margin', 'SIP', 'Lumpsum'] as const;
type CalcTab = (typeof calcTabs)[number];

type ProductType = 'sip' | 'lumpsum' | 'brokerage' | 'margin' | 'insurance';

interface AIParams {
  monthlyInvestment?: number;
  lumpsum?: number;
  targetAmount?: number;
  expectedReturn?: number;
  timePeriod?: number;
  coverAmount?: number;
}

const productToTab: Record<ProductType, CalcTab> = {
  sip: 'SIP',
  lumpsum: 'Lumpsum',
  brokerage: 'Brokerage',
  margin: 'Margin',
  insurance: 'SIP', // fallback — no insurance tab yet
};

const Calculators = () => {
  const [activeTab, setActiveTab] = useState<CalcTab>('Brokerage');
  const [aiPreFill, setAiPreFill] = useState<AIParams | null>(null);

  const handleAIResult = (product: ProductType, params: AIParams) => {
    const tab = productToTab[product];
    setActiveTab(tab);
    setAiPreFill(params);
    // Clear prefill after 100ms so calculator picks it up on remount
    setTimeout(() => setAiPreFill(null), 100);
  };

  const tabContent: Record<CalcTab, React.ReactNode> = {
    Brokerage: <BrokerageCalcContent />,
    Margin: <MarginCalcContent />,
    SIP: (
      <SIPCalcContent
        prefillMonthly={aiPreFill?.monthlyInvestment}
        prefillReturn={aiPreFill?.expectedReturn}
        prefillYears={aiPreFill?.timePeriod}
      />
    ),
    Lumpsum: (
      <LumpsumCalcContent
        prefillAmount={aiPreFill?.lumpsum}
        prefillReturn={aiPreFill?.expectedReturn}
        prefillYears={aiPreFill?.timePeriod}
      />
    ),
  };

  return (
    <Layout>
      <PageHero
        title="Financial planning made"
        highlight="Simple"
        description="Brokerage charges, margin requirements, SIP returns, and lumpsum growth — calculate it all in one place."
        breadcrumbLabel="Calculators"
      />

      {/* AI Goal Planner bar */}
      <AICalculatorBar onResult={handleAIResult} />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {calcTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="calc-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
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

export default Calculators;
