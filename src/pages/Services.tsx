import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { Briefcase } from 'lucide-react';
import { RelatedServices } from '@/components/shared/RelatedServices';
import { motion, AnimatePresence } from 'framer-motion';
import { TradingServiceContent } from '@/components/services/TradingServiceContent';
import { InvestmentServiceContent } from '@/components/services/InvestmentServiceContent';
import { InsuranceServiceContent } from '@/components/services/InsuranceServiceContent';
import { EducationServiceContent } from '@/components/services/EducationServiceContent';
import { EstatePlanningServiceContent } from '@/components/services/EstatePlanningServiceContent';
import { CreditCounsellingServiceContent } from '@/components/services/CreditCounsellingServiceContent';

const servicesTabs = ['Trading', 'Investment', 'Insurance', 'Estate Planning', 'Credit Counselling'] as const;
type ServicesTab = (typeof servicesTabs)[number];

const tabI18nKeys: Record<ServicesTab, string> = {
  Trading: 'services.tabs.trading',
  Investment: 'services.tabs.investment',
  Insurance: 'services.tabs.insurance',
  
  'Estate Planning': 'services.tabs.estatePlanning',
  'Credit Counselling': 'services.tabs.creditCounselling',
};

const tabContent: Record<ServicesTab, React.ReactNode> = {
  Trading: <TradingServiceContent />,
  Investment: <InvestmentServiceContent />,
  Insurance: <InsuranceServiceContent />,
  
  'Estate Planning': <EstatePlanningServiceContent />,
  'Credit Counselling': <CreditCounsellingServiceContent />,
};

const Services = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ServicesTab | null;
  const [activeTab, setActiveTab] = useState<ServicesTab>(
    tabParam && servicesTabs.includes(tabParam) ? tabParam : 'Trading'
  );

  useEffect(() => {
    if (tabParam && servicesTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: ServicesTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <Layout>
      <SEOHead
        title="Financial Advisory Services – Trading & Investment"
        description="SERNET financial advisory services: online trading platforms, mutual fund investment strategies, insurance solutions for families, estate planning & more."
        path="/services"
      />
      <PageHero
        title={t('services.title')}
        highlight={t('services.highlight')}
        description={t('services.description')}
        breadcrumbLabel={t('nav.services')}
      />

      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {servicesTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(tabI18nKeys[tab])}
                {activeTab === tab && (
                  <motion.div layoutId="services-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tabContent[activeTab]}
          <RelatedServices currentService={activeTab} />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Services;