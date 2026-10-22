import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, UserCheck } from 'lucide-react';
import { kycChecks } from '@/content/onboarding';
import { KYC_LINKS } from '@/lib/appLinks';

interface Props {
  tab: 'invest' | 'insure' | 'trade';
  /** Online opening is only for adult Resident Indian individuals (invest/trade). */
  restrictOnline?: boolean;
  showKyc?: boolean;
}

/** "Who it's for" + "Before you start" block shared by the product pages. */
export const ProductOnboardingBlock = ({ tab, restrictOnline = true, showKyc = true }: Props) => (
  <section className="section-padding">
    <div className="container-sernet grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="feature-card">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><UserCheck className="w-5 h-5 text-primary" /></div>
        <h2 className="heading-md text-foreground mb-2">Who can open online</h2>
        {restrictOnline ? (
          <p className="text-small leading-relaxed mb-4">
            Online account opening is for adult Resident Indian individuals. Minors, HUFs, NRIs and non-individuals can use the{' '}
            <Link to={`/downloads?tab=${tab === 'trade' ? 'trade' : 'invest'}`} className="text-primary hover:underline">forms on Downloads</Link>{' '}
            or ask us to call back.
          </p>
        ) : (
          <p className="text-small leading-relaxed mb-4">Individuals, families and businesses can express interest; our team will call back and coordinate with the broker partner.</p>
        )}
        <Link to={`/open-account?tab=${tab}`} className="btn-primary">Open Account <ArrowRight className="w-4 h-4 ml-2" /></Link>
      </div>
      {showKyc && (
        <div className="feature-card">
          <h2 className="heading-md text-foreground mb-3">Before you start</h2>
          <ul className="space-y-2">
            {[{ label: 'Complete Digital CKYC (UTI MF)', href: KYC_LINKS.UTI_CKYC }, ...kycChecks].map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  {l.label} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </section>
);
