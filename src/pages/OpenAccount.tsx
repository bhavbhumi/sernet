import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { SEOHead } from '@/components/shared/SEOHead';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { KYC_LINKS } from '@/lib/appLinks';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  onboardingTabs, tabLabels, tabContent, kycChecks, investorTypes, interestOptions,
  isOnboardingTab, type OnboardingTab, type OnboardingLink,
} from '@/content/onboarding';

const OutLink = ({ link }: { link: OnboardingLink }) => (
  <a
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    className={link.primary ? 'btn-primary inline-flex items-center gap-2' : 'btn-secondary inline-flex items-center gap-2'}
  >
    {link.label}
    <ExternalLink className="w-3.5 h-3.5" aria-label="opens in a new tab" />
  </a>
);

const InterestForm = ({ tab }: { tab: OnboardingTab }) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [investorType, setInvestorType] = useState<string>('Individual');
  const [interests, setInterests] = useState<string[]>([tab]);

  const toggle = (v: string) =>
    setInterests((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const city = String(fd.get('city') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    if (name.length < 2 || !/^[+\d\s-]{10,15}$/.test(phone)) {
      toast({ title: 'Please check your details', description: 'Enter your name and a valid mobile number.', variant: 'destructive' });
      return;
    }
    if (interests.length === 0) {
      toast({ title: 'Choose at least one interest', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('leads').insert({
      name,
      phone,
      email: email || null,
      source: 'open_account',
      lead_type: 'account_opening',
      context: {
        investor_type: investorType,
        interests,
        city: city || undefined,
        message: message || undefined,
        source_tab: tab,
      },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Submission failed', description: 'Please try again or call +91 92067 67670.', variant: 'destructive' });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="feature-card text-center py-10">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="heading-md text-foreground mb-2">Interest expressed successfully</h3>
        <p className="text-body text-muted-foreground">Thank you! Your interest has been recorded. Our team will call you back shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="feature-card space-y-4">
      <div>
        <h3 className="heading-md text-foreground">Express your interest</h3>
        <p className="text-small text-muted-foreground mt-1">Share your details and our team will call you back.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="oa-name">Name</Label>
          <Input id="oa-name" name="name" required maxLength={100} placeholder="Your full name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oa-phone">Mobile</Label>
          <Input id="oa-phone" name="phone" type="tel" required maxLength={15} placeholder="+91 XXXXX XXXXX" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oa-email">Email (optional)</Label>
          <Input id="oa-email" name="email" type="email" maxLength={255} placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oa-city">City</Label>
          <Input id="oa-city" name="city" maxLength={80} placeholder="Your city" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Investor type</Label>
        <div className="flex flex-wrap gap-2">
          {investorTypes.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setInvestorType(t)}
              aria-pressed={investorType === t}
              className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                investorType === t ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {investorType !== 'Individual' && (
          <p className="text-xs text-muted-foreground">Our team will guide you with the documents needed for {investorType} accounts.</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Interested in</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {interestOptions.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <Checkbox checked={interests.includes(o.value)} onCheckedChange={() => toggle(o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="oa-msg">Message (optional)</Label>
        <Textarea id="oa-msg" name="message" rows={2} maxLength={500} placeholder="Anything we should know?" />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</> : 'Submit interest'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to be contacted by SERNET and accept our{' '}
        <Link to="/legal?tab=terms" className="text-primary hover:underline">Terms</Link> and{' '}
        <Link to="/legal?tab=privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
};

const OpenAccount = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('tab');
  const active: OnboardingTab = isOnboardingTab(param) ? param : 'invest';
  const content = tabContent[active];

  return (
    <Layout>
      <SEOHead
        title="Open an Account"
        description="Start investing with Tick Funds, get insured with Tushil, or trade with Choice FinX — with SERNET by your side."
        path="/open-account"
      />
      <PageHero
        title="Open an account with"
        highlight="SERNET"
        description="Invest, insure and trade through trusted partners, with SERNET by your side."
        breadcrumbLabel="Open Account"
      />

      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }} role="tablist">
            {onboardingTabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={active === tab}
                onClick={() => setSearchParams({ tab })}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  active === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tabLabels[tab]}
                {active === tab && (
                  <motion.div layoutId="open-account-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section-padding bg-background">
        <div className="container-sernet grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="heading-lg text-foreground mb-3">{content.heading}</h2>
              <p className="text-body text-muted-foreground">{content.intro}</p>
            </div>
            <ol className="space-y-5">
              {content.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center">{i + 1}</span>
                  <div className="space-y-2 pt-1">
                    <p className="font-medium text-foreground">{s.title}</p>
                    {s.text && (
                      <p className="text-small text-muted-foreground">
                        {s.text}
                      </p>
                    )}
                    {s.links && <div className="flex flex-wrap gap-3">{s.links.map((l) => <OutLink key={l.href} link={l} />)}</div>}
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-md border border-border bg-section-alt p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-foreground">Check before you start</h3>
              </div>
              <ul className="space-y-2">
                {kycChecks.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">
                      {c.label}<ExternalLink className="w-3 h-3" aria-label="opens in a new tab" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                KYC not done?{' '}
                <a href={KYC_LINKS.UTI_CKYC} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1.5">
                  Complete Digital CKYC<ExternalLink className="w-3 h-3" aria-label="opens in a new tab" />
                </a>
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{content.note}</p>
          </div>

          <div className="lg:sticky lg:top-36">
            <InterestForm key={active} tab={active} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OpenAccount;
