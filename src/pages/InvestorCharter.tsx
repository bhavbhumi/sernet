import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { PageHero } from '@/components/layout/PageHero';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RegistrationDetails } from '@/components/legal/RegistrationDetails';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { Button } from '@/components/ui/button';

const InvestorCharter = () => {
  const { data: body, isLoading, isError, refetch } = useQuery({
    queryKey: ['investor-charter-page'],
    queryFn: async () => {
      const { data, error } = await supabase.from('legal_pages').select('body').eq('slug', 'investor-charter').maybeSingle();
      if (error) throw error;
      return data?.body || '';
    },
  });
  return (
    <Layout>
      <SEOHead title="Investor Charter" description="Investor guidance for SERNET’s mutual fund and PMS distribution services, with product-provider responsibilities and complaint channels." path="/investor-charter" />
      <PageHero title="Investor" highlight="Charter" description="Investor rights, responsibilities and product-provider guidance." />
      <RegistrationDetails />
      <div className="container-sernet section-padding">
        {isLoading ? <div role="status" aria-label="Loading investor guidance" className="h-40 animate-pulse bg-muted rounded" /> : isError ? <div role="alert"><p className="mb-3 text-muted-foreground">This document could not be loaded.</p><Button variant="outline" onClick={() => void refetch()}>Try again</Button></div> : body ? <LegalDocument body={body} /> : <p className="text-muted-foreground">Please contact <a href="mailto:compliance@sernetindia.com" className="text-primary underline">compliance@sernetindia.com</a> for investor guidance.</p>}
      </div>
    </Layout>
  );
};

export default InvestorCharter;
