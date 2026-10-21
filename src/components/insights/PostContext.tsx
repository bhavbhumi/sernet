import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { typeSlug } from '@/lib/insightsTaxonomy';

type P = { post_type?: string | null; category?: string | null; body?: string | null };

export function PostBreadcrumb({ post }: { post: P }) {
  const t = post.post_type;
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-8">
      <Link to="/" className="hover:text-foreground">Home</Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link to="/insights" className="hover:text-foreground">Insights</Link>
      {t && (<><ChevronRight className="h-3.5 w-3.5" /><Link to={`/insights?tab=${typeSlug(t)}`} className="hover:text-foreground">{t}</Link></>)}
      {t && post.category && (<><ChevronRight className="h-3.5 w-3.5" /><Link to={`/insights?tab=${typeSlug(t)}&category=${encodeURIComponent(post.category)}`} className="hover:text-foreground">{post.category}</Link></>)}
    </nav>
  );
}

const CTA: Record<string, { text: string; label: string; to: string }> = {
  Investment: { text: 'Want help choosing funds that suit your goals?', label: 'Start with Tick Funds', to: '/tickfunds' },
  Insurance: { text: 'Need to review your insurance cover?', label: 'Explore Tushil', to: '/tushil' },
  Trading: { text: 'Trade through Choice FinX, with SERNET as your partner.', label: 'About Choice FinX', to: '/choicefinx' },
  Credit: { text: 'Need liquidity without selling your investments?', label: 'Talk to us', to: '/contact' },
  'Personal Finance': { text: 'Plan your finances with a SERNET relationship manager.', label: 'Schedule a call', to: '/contact?tab=schedule' },
  'Macro & Markets': { text: 'Turn market insight into a plan for your money.', label: 'Talk to us', to: '/contact' },
};

const DISCLAIMER: Record<string, string> = {
  Investment: 'Mutual fund investments are subject to market risks; read all scheme-related documents carefully. SERNET is an AMFI-registered mutual fund distributor and receives commission from fund houses.',
  Insurance: 'Insurance is the subject matter of solicitation. SERNET refers enquiries to its IRDAI-registered broker partner and is not an insurer or insurance broker.',
  Trading: 'Investments in securities markets are subject to market risks. Broking services are provided by Choice Equity Broking Pvt. Ltd.; SERNET is not a stock broker.',
  Credit: 'Loans are subject to the lender’s terms and approval. SERNET does not lend.',
  'Personal Finance': 'This content is for general education and is not personalised advice.',
  'Macro & Markets': 'This content is for general information and education only and is not a recommendation to buy or sell any security.',
};

export function PostFooter({ post }: { post: P }) {
  const t = post.post_type ?? '';
  const cta = CTA[t];
  const hasIpoCta = /Log in to Choice FinX/i.test(post.body ?? '');
  return (
    <>
      {cta && !hasIpoCta && (
        <div className="mt-10 p-5 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-foreground font-medium">{cta.text}</p>
          <Link to={cta.to} className="inline-flex items-center gap-1 text-primary font-medium hover:underline shrink-0">{cta.label} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      )}
      {DISCLAIMER[t] && <p className="mt-6 text-xs text-muted-foreground leading-relaxed"><strong>Disclaimer:</strong> {DISCLAIMER[t]}</p>}
    </>
  );
}
