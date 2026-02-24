import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { AwarenessContent } from '@/components/insights/AwarenessContent';

const Awareness = () => (
  <Layout>
    <SEOHead
      title="Awareness — Financial Literacy"
      description="Free financial awareness content — investor protection, scam alerts, market basics, and personal finance education by SERNET."
      path="/awareness"
    />
    <PageHero
      title="Financial"
      highlight="Awareness"
      description="Empowering you with knowledge — financial literacy, investor protection, scam alerts, and market basics for everyone."
    />
    <AwarenessContent />
  </Layout>
);

export default Awareness;
