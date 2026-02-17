import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientsNetworkContent } from '@/components/network/ClientsNetworkContent';
import { PartnersNetworkContent } from '@/components/network/PartnersNetworkContent';
import { PrincipalsNetworkContent } from '@/components/network/PrincipalsNetworkContent';

const networkTabs = ['Clients', 'Partners', 'Principals'] as const;
type NetworkTab = (typeof networkTabs)[number];

const tabContent: Record<NetworkTab, React.ReactNode> = {
  Clients: <ClientsNetworkContent />,
  Partners: <PartnersNetworkContent />,
  Principals: <PrincipalsNetworkContent />,
};

const Network = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as NetworkTab | null;
  const [activeTab, setActiveTab] = useState<NetworkTab>(
    tabParam && networkTabs.includes(tabParam) ? tabParam : 'Clients'
  );

  useEffect(() => {
    if (tabParam && networkTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: NetworkTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <Layout>
      <SEOHead
        title="Our Network"
        description="SERNET's growing network of clients, partners, and principals across 54 cities and 18 countries — built over 35+ years of trust."
        path="/network"
      />
      <PageHero
        title="Our growing"
        highlight="network"
        description="Built over 35+ years of trust — connecting clients, partners, and principals across the financial services ecosystem."
        icon={Globe}
      />

      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container-zerodha">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {networkTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="network-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
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

export default Network;
