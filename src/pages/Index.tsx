import { homeJsonLd } from '@/lib/homeJsonLd';
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
        title="SERNET | Mutual Funds, Insurance & Trading Since 1986"
        exactTitle
        description="AMFI-registered mutual fund and APMI PMS distributor (ARN-35275). Invest via Tick Funds, insure via Tushil, trade via Choice FinX. A family practice since 1986."
        path="/"
        jsonLd={homeJsonLd}
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
