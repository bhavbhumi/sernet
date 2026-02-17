import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustSection } from '@/components/home/TrustSection';
import { EcosystemSection } from '@/components/home/EcosystemSection';
import { PricingSection } from '@/components/home/PricingSection';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { OpenAccountSection } from '@/components/home/OpenAccountSection';
import { InsightsSection } from '@/components/home/InsightsSection';

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Home"
        description="SERNET Financial Services — 35+ years of trusted wealth management. Invest in Stocks, IPOs, Mutual Funds, Insurance, Digital Gold & more across 54 cities, 18 countries."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FinancialService',
          name: 'SERNET Financial Services',
          url: 'https://sernetindia.com',
          description: '35+ years of trusted wealth management across 54 cities and 18 countries.',
          foundingDate: '1989',
          areaServed: 'India',
          numberOfEmployees: { '@type': 'QuantitativeValue', value: '150+' },
        }}
      />
      <HeroSection />
      <EcosystemSection />
      <TrustSection />
      <TestimonialSection />
      <PricingSection />
      <OpenAccountSection />
      <InsightsSection />
    </Layout>
  );
};

export default Index;
