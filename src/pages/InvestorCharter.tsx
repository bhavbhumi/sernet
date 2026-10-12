import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { PageHero } from '@/components/layout/PageHero';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { Button } from '@/components/ui/button';
import { Navigate, useLocation } from 'react-router-dom';

const InvestorCharter = () => {
  const { hash } = useLocation();
  const { data: body, isLoading, isError, refetch } = useQuery({
    queryKey: ['investor-charter-page'],
    queryFn: async () => {
      const { data, error } = await supabase.from('legal_pages').select('body').eq('slug', 'investor-charter').maybeSingle();
      if (error) throw error;
      return data?.body || '';
    },
  });
  if (hash === '#legal-section-9') return <Navigate to="/legal?tab=disclosures#legal-section-1" replace />;
  if (hash === '#legal-section-10') return <Navigate to="/legal?tab=grievances" replace />;
  return (
    <Layout>
      <SEOHead title="Investor Charter" description="SERNET investor rights, responsibilities, onboarding, suitability, portfolio review and customer lifecycle guidance." path="/investor-charter" />
      <PageHero title="Investor" highlight="Charter" description="Investor rights, responsibilities, onboarding and portfolio servicing." />
      <div className="container-sernet section-padding">
        {isLoading ? <div role="status" aria-label="Loading investor guidance" className="h-40 animate-pulse bg-muted rounded" /> : isError ? <div role="alert"><p className="mb-3 text-muted-foreground">This document could not be loaded.</p><Button variant="outline" onClick={() => void refetch()}>Try again</Button></div> : body ? <LegalDocument body={body} /> : <p className="text-muted-foreground">Please contact <a href="mailto:support@sernetindia.com" className="text-primary underline">support@sernetindia.com</a> for investor guidance.</p>}
      </div>
    </Layout>
  );
};

export default InvestorCharter;
