import { Briefcase, Landmark, Building2 } from 'lucide-react';
import { ServiceOverview } from './ServiceOverview';
import { TICKFUNDS_LINKS } from '@/lib/appLinks';

const rmProducts = [
  { icon: Briefcase, name: 'PMS & AIF', description: 'Portfolio Management Services and Alternative Investment Funds from empanelled managers, for eligible investors.' },
  { icon: Landmark, name: 'Bonds', description: 'Government, corporate and tax-free bonds through our bond platform partner.' },
  { icon: Building2, name: 'Company FD', description: 'Corporate fixed deposits with a range of tenures. Check the issuer rating before investing.' },
];

const RmProducts = () => (
  <section className="section-padding bg-section-alt">
    <div className="container-sernet">
      <h2 className="heading-lg text-foreground mb-2 text-center">Available through your relationship manager</h2>
      <p className="text-body text-muted-foreground text-center mb-10 max-w-2xl mx-auto">In-app access is coming soon on Tick Funds.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rmProducts.map((p) => (
          <div key={p.name} className="feature-card">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <p.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="heading-md text-foreground mb-2">{p.name}</h3>
            <p className="text-small leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const InvestmentServiceContent = () => (
  <ServiceOverview
    partner="AMFI-registered distributor · ARN 35275"
    title="Investing with Tick Funds"
    intro="Invest in regular mutual funds and SIF on the Tick Funds web and mobile app, with support from a SERNET relationship manager."
    points={[
      'Regular mutual fund plans from 40+ AMCs',
      'SIP, lumpsum and goal-based investing',
      'Zero fees to you; we earn commissions from fund houses, disclosed under Disclosures',
      'PMS distribution as an APMI-registered distributor (APRN 10097)',
    ]}
    learnMore={{ label: 'Explore Tick Funds', to: '/tickfunds' }}
    primaryCta={{ label: 'Open Tick Funds', href: TICKFUNDS_LINKS.START_INVESTING, external: true }}
    extra={<RmProducts />}
    disclaimer="Mutual fund investments are subject to market risks; read all scheme-related documents carefully. SERNET is an AMFI-registered Mutual Fund Distributor (ARN 35275, EUIN E025145) and an APMI-registered PMS distributor (APRN 10097), and earns commissions from product providers. SERNET is not a SEBI-registered Investment Adviser, Research Analyst or stock broker; the investment decision is yours."
  />
);
