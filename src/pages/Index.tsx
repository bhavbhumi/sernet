import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustSection } from '@/components/home/TrustSection';
import { StatsSection } from '@/components/home/StatsSection';
import { EcosystemSection } from '@/components/home/EcosystemSection';
import { PricingSection } from '@/components/home/PricingSection';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { OpenAccountSection } from '@/components/home/OpenAccountSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <TrustSection />
      <EcosystemSection />
      <PricingSection />
      <TestimonialSection />
      <OpenAccountSection />
    </Layout>
  );
};

export default Index;
