import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { legalTabs } from '@/lib/legalConfig';
import { RegistrationDetails } from '@/components/legal/RegistrationDetails';
import { LegalDocument } from '@/components/legal/LegalDocument';

interface LegalPage { slug: string; title: string; body: string; updated_at: string }

const Legal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = legalTabs.find(tab => tab.key === searchParams.get('tab'))?.key || 'terms';
  const activeConfig = legalTabs.find(tab => tab.key === activeTab);

  const handleTabChange = (key: string) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      next.set('tab', key);
      return next;
    });
  };

  const { data: pages, isLoading, isError, refetch } = useQuery({
    queryKey: ['legal-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_pages' as any)
        .select('slug, title, body, updated_at')
        .order('slug');
      if (error) throw error;
      return (data as unknown as LegalPage[]) || [];
    },
  });

  const activePage = pages?.find(p => p.slug === activeTab);

  return (
    <Layout>
      <SEOHead
        title={activeConfig?.label || 'Legal & Compliance'}
        description={`${activeConfig?.description} SERNET — AMFI mutual fund and APMI PMS distributor.`}
        path={`/legal?tab=${activeTab}`}
      />
      <PageHero
        title="Legal &"
        highlight="Compliance"
        description="Distribution registrations, investor disclosures, privacy and terms of service."
        breadcrumbLabel="Legal"
      />

      <RegistrationDetails />
      <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-sernet">
          <div className="overflow-x-auto">
          <TabsList aria-label="Legal and compliance sections" className="h-auto w-max justify-start gap-0 rounded-none bg-transparent p-0">
            {legalTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="gap-2 rounded-none border-b-2 border-transparent px-4 py-4 text-sm data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-sernet section-padding">
        <TabsContent value={activeTab} className="mt-0">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-5">
                <h2 className="heading-md text-foreground">{activeConfig?.label}</h2>
                {activePage?.updated_at && <p className="text-xs text-muted-foreground">Last updated: {new Date(activePage.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              </div>
              {isLoading ? (
                <div className="space-y-4" role="status" aria-label="Loading legal document">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 max-w-2xl bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : isError ? (
                <div role="alert" className="space-y-3"><p className="text-muted-foreground">This document could not be loaded.</p><Button variant="outline" onClick={() => void refetch()}>Try again</Button></div>
              ) : activePage?.body ? (
                <LegalDocument body={activePage.body} />
              ) : (
                <p className="text-muted-foreground">For this document, please <a className="text-primary underline" href="mailto:compliance@sernetindia.com">contact our compliance team</a>.</p>
              )}

        </TabsContent>
      </div>
      </Tabs>
    </Layout>
  );
};

export default Legal;
