import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { PageHero } from '@/components/layout/PageHero';
import { Shield, FileText, Users, Scale } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fallbackContent = `
<section class="bg-card border border-border rounded-lg p-8 mb-8">
  <h2 class="text-2xl font-bold text-foreground mb-6">Vision & Mission</h2>
  <p class="text-muted-foreground mb-2"><strong class="text-foreground">Vision:</strong> Invest with confidence.</p>
  <p class="text-muted-foreground"><strong class="text-foreground">Mission:</strong> Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy customer service.</p>
</section>

<section class="bg-card border border-border rounded-lg p-8 mb-8">
  <h2 class="text-2xl font-bold text-foreground mb-6">Rights of Investors</h2>
  <ol class="space-y-3 text-muted-foreground list-decimal pl-6">
    <li>Obtain and receive accurate information about products/services from the stock broker.</li>
    <li>Receive timely services without discrimination.</li>
    <li>Receive proper guidance and support in case of any query or complaint.</li>
    <li>Get fair and transparent treatment from the stock broker.</li>
    <li>Protection of your personal information and trading data.</li>
  </ol>
</section>

<section class="bg-card border border-border rounded-lg p-8 mb-8">
  <h2 class="text-2xl font-bold text-foreground mb-6">Responsibilities of Investors</h2>
  <ol class="space-y-3 text-muted-foreground list-decimal pl-6">
    <li>Read all the documents carefully before signing.</li>
    <li>Provide correct and complete information.</li>
    <li>Understand the risk factors associated with investments.</li>
    <li>Keep your account information and credentials secure.</li>
    <li>Report any unauthorized transactions immediately.</li>
  </ol>
</section>

<section class="bg-card border border-border rounded-lg p-8 mb-8">
  <h2 class="text-2xl font-bold text-foreground mb-6">Grievance Redressal Mechanism</h2>
  <div class="space-y-4">
    <div class="bg-muted/30 p-4 rounded-lg">
      <h3 class="font-semibold text-foreground mb-1">Level 1: Stock Broker</h3>
      <p class="text-muted-foreground text-sm">Write to complaint@sernetindia.com. We aim to resolve complaints within 30 days.</p>
    </div>
    <div class="bg-muted/30 p-4 rounded-lg">
      <h3 class="font-semibold text-foreground mb-1">Level 2: Stock Exchange</h3>
      <p class="text-muted-foreground text-sm">If not satisfied with our response, escalate to the stock exchange's investor grievance cell.</p>
    </div>
    <div class="bg-muted/30 p-4 rounded-lg">
      <h3 class="font-semibold text-foreground mb-1">Level 3: SEBI SCORES</h3>
      <p class="text-muted-foreground text-sm">Register a complaint on SEBI's SCORES portal at scores.gov.in</p>
    </div>
    <div class="bg-muted/30 p-4 rounded-lg">
      <h3 class="font-semibold text-foreground mb-1">Level 4: Arbitration</h3>
      <p class="text-muted-foreground text-sm">Apply for arbitration through the stock exchange as per SEBI regulations.</p>
    </div>
  </div>
</section>

<section class="bg-card border border-border rounded-lg p-8">
  <h2 class="text-2xl font-bold text-foreground mb-6">Service Standards</h2>
  <table class="w-full text-sm">
    <thead><tr class="border-b border-border"><th class="text-left py-3 px-4 font-semibold text-foreground">Activity</th><th class="text-left py-3 px-4 font-semibold text-foreground">Timeline</th></tr></thead>
    <tbody class="text-muted-foreground">
      <tr class="border-b border-border"><td class="py-3 px-4">Account opening</td><td class="py-3 px-4">24 hours (after document verification)</td></tr>
      <tr class="border-b border-border"><td class="py-3 px-4">KYC modification</td><td class="py-3 px-4">7 working days</td></tr>
      <tr class="border-b border-border"><td class="py-3 px-4">Complaint resolution</td><td class="py-3 px-4">30 days</td></tr>
      <tr class="border-b border-border"><td class="py-3 px-4">Fund payout</td><td class="py-3 px-4">24 hours</td></tr>
      <tr><td class="py-3 px-4">DP pledge creation</td><td class="py-3 px-4">Same day</td></tr>
    </tbody>
  </table>
</section>
`;

const InvestorCharter = () => {
  const { data: pageData } = useQuery({
    queryKey: ['investor-charter-page'],
    queryFn: async () => {
      const { data } = await supabase
        .from('legal_pages' as any)
        .select('body')
        .eq('slug', 'investor-charter')
        .single();
      return (data as any)?.body || '';
    },
  });

  const content = pageData || fallbackContent;

  return (
    <Layout>
      <SEOHead
        title="Investor Charter"
        description="Investor rights and responsibilities as prescribed by SEBI — SERNET Financial Services."
        path="/investor-charter"
      />
      <PageHero
        title="Investor Charter"
        description="Rights and responsibilities of investors as prescribed by SEBI"
      />

      {/* Quick Links */}
      <div className="container-zerodha py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Investor Rights</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Our Obligations</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Grievance Redressal</h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border text-center">
            <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm">Dispute Resolution</h3>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="max-w-4xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </Layout>
  );
};

export default InvestorCharter;
