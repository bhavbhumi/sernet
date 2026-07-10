import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustSection } from '@/components/home/TrustSection';
import { EcosystemSection } from '@/components/home/EcosystemSection';
import { NetworkSection } from '@/components/home/NetworkSection';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { OpenAccountSection } from '@/components/home/OpenAccountSection';
import { InsightsSection } from '@/components/home/InsightsSection';

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Wealth Management & Financial Services"
        description="SERNET — 35+ years of trusted wealth management. Online trading, mutual funds, insurance & retirement planning across 54 cities and 18 countries."
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SERNET Financial Services',
            url: 'https://sernetindia.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://sernetindia.com/?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FinancialService',
            name: 'SERNET Financial Services',
            url: 'https://sernetindia.com',
            description: '35+ years of trusted wealth management across 54 cities and 18 countries.',
            foundingDate: '1989',
            areaServed: 'India',
            numberOfEmployees: { '@type': 'QuantitativeValue', value: '150+' },
            telephone: '+91-22-4973-5000',
            email: 'contact@sernetindia.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'A-412, Kanakia Wall Street, Andheri-Kurla Road, Chakala',
              addressLocality: 'Mumbai',
              addressRegion: 'Maharashtra',
              postalCode: '400093',
              addressCountry: 'IN',
            },
            sameAs: [
              'https://www.instagram.com/sernetfspl',
              'https://www.youtube.com/@sernetfspl',
              'https://www.linkedin.com/company/sernetfspl/',
              'https://www.facebook.com/sernetfspl/',
            ],
          },
        ]}
      />
      <HeroSection />
      <EcosystemSection />
      <TrustSection />
      <TestimonialSection />
      <NetworkSection />
      <OpenAccountSection />
      <InsightsSection />
    </Layout>
  );
};

export default Index;
