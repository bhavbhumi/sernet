import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Shield, FileText, AlertTriangle } from 'lucide-react';

const tabs = [
  { key: 'terms', label: 'Terms', icon: Scale },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'policies', label: 'Policies', icon: FileText },
  { key: 'disclosures', label: 'Disclosures', icon: AlertTriangle },
];

const Legal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'terms';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some(t => t.key === tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  const { data: pages, isLoading } = useQuery({
    queryKey: ['legal-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_pages' as any)
        .select('slug, title, body, updated_at')
        .order('slug');
      if (error) throw error;
      return (data as any[]) || [];
    },
  });

  const activePage = pages?.find((p: any) => p.slug === activeTab);

  return (
    <Layout>
      <SEOHead
        title="Legal — SERNET"
        description="Terms, privacy policy, compliance policies and regulatory disclosures for SERNET Financial Services."
        path="/legal"
      />
      <PageHero
        title="Legal &"
        highlight="Compliance"
        description="Our terms, privacy practices, policies and regulatory disclosures — all in one place."
        breadcrumbLabel="Legal"
      />

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-sernet">
          <nav className="flex gap-0 overflow-x-auto" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-sernet section-padding">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${80 - i * 15}%` }} />
                  ))}
                </div>
              ) : activePage?.body ? (
                <div
                  className="prose prose-lg max-w-none text-muted-foreground
                    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-8
                    [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-3
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                    [&_a]:text-primary [&_a]:hover:underline
                    [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:p-3 [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_td]:p-3 [&_td]:border [&_td]:border-border"
                  dangerouslySetInnerHTML={{ __html: activePage.body }}
                />
              ) : (
                <FallbackContent slug={activeTab} />
              )}

              {activePage?.updated_at && (
                <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">
                  Last updated: {new Date(activePage.updated_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

/* Hardcoded fallback when CMS body is empty */
const FallbackContent = ({ slug }: { slug: string }) => {
  switch (slug) {
    case 'terms':
      return (
        <div className="space-y-8">
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2><p className="text-muted-foreground">By accessing and using SERNET's services, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">2. Account Registration</h2><p className="text-muted-foreground">To use our services, you must register for an account. You must be at least 18 years old, a resident of India with valid KYC documents, and responsible for maintaining the confidentiality of your account credentials.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">3. Trading and Investment</h2><p className="text-muted-foreground">Trading in securities market involves significant risk. Past performance is not indicative of future results.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">4. Fees and Charges</h2><p className="text-muted-foreground">You agree to pay all applicable fees and charges as listed on our pricing page. We reserve the right to modify our fee structure with prior notice.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">5. Governing Law</h2><p className="text-muted-foreground">These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.</p></section>
          <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">Contact: support@sernetindia.com | 080-47181888</p>
        </div>
      );
    case 'privacy':
      return (
        <div className="space-y-8">
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2><p className="text-muted-foreground">Personal identification (Name, PAN, Aadhaar), contact information, financial data, trading history, and device/usage information.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2><p className="text-muted-foreground">To provide services, process transactions, comply with regulations, detect fraud, and send technical notices.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Security</h2><p className="text-muted-foreground">We implement encryption, two-factor authentication, regular security audits, and employee training on data protection.</p></section>
          <section><h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Rights</h2><p className="text-muted-foreground">You have the right to access, correct, request deletion, and opt-out of marketing communications.</p></section>
          <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">Contact: privacy@sernetindia.com</p>
        </div>
      );
    case 'policies':
      return (
        <div className="space-y-6">
          {[
            { cat: 'Account & Trading', items: ['Account Opening Policy', 'Trading Policy', 'Margin Policy', 'Square Off Policy'] },
            { cat: 'Security & Privacy', items: ['Privacy Policy', 'Information Security Policy', 'Password Policy'] },
            { cat: 'Compliance', items: ['AML Policy', 'KYC Policy', 'PMLA Policy'] },
            { cat: 'Operations', items: ['Fund Withdrawal Policy', 'Depository Operations Policy', 'Corporate Actions Policy'] },
            { cat: 'Grievance & Support', items: ['Grievance Redressal Policy', 'Investor Grievance Policy', 'Escalation Matrix'] },
          ].map(group => (
            <div key={group.cat} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 border-b border-border"><h2 className="heading-md">{group.cat}</h2></div>
              <ul className="divide-y divide-border">{group.items.map(item => <li key={item} className="px-6 py-3 text-muted-foreground">{item}</li>)}</ul>
            </div>
          ))}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center"><p className="text-muted-foreground">For detailed policy documents, contact <a href="mailto:compliance@sernetindia.com" className="text-primary hover:underline">compliance@sernetindia.com</a></p></div>
        </div>
      );
    case 'disclosures':
      return (
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Registration Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Stock Broker SEBI Reg. No:</span><span className="block text-foreground font-medium">INZ000031633</span></div>
              <div><span className="text-muted-foreground">Depository Participant SEBI Reg. No:</span><span className="block text-foreground font-medium">IN-DP-431-2019</span></div>
              <div><span className="text-muted-foreground">Research Analyst SEBI Reg. No:</span><span className="block text-foreground font-medium">INH000000313</span></div>
              <div><span className="text-muted-foreground">Investment Adviser SEBI Reg. No:</span><span className="block text-foreground font-medium">INA100015082</span></div>
            </div>
          </section>
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Exchange Membership</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {['NSE', 'BSE', 'MCX'].map(ex => <div key={ex} className="text-center p-4 bg-muted/30 rounded-lg"><span className="block text-2xl font-bold text-primary">{ex}</span><span className="text-muted-foreground">Member</span></div>)}
            </div>
          </section>
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Important Notice</h2>
            <p className="text-sm text-muted-foreground">Investments in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.</p>
          </section>
        </div>
      );
    default:
      return <p className="text-muted-foreground">Content coming soon.</p>;
  }
};

export default Legal;
