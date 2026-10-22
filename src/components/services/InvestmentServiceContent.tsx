import { Briefcase, Landmark, Building2, LineChart } from 'lucide-react';
import { ServiceOverview } from './ServiceOverview';

const rmProducts = [
  { icon: Briefcase, name: 'PMS', description: 'Portfolio Management Services from empanelled managers, for eligible investors. Arranged with your relationship manager.' },
  { icon: LineChart, name: 'AIF', description: 'Alternative Investment Funds from empanelled managers, for eligible investors. Arranged with your relationship manager.' },
  { icon: Landmark, name: 'Bonds on Altifi', description: 'Listed bonds through Altifi by Northern Arc Securities. Sign up online, complete KYC on Altifi and invest once your account is ready.' },
  { icon: Building2, name: 'Company FD', description: 'Corporate fixed deposits with a range of tenures. Check the issuer rating before investing.' },
];

const RmProducts = () => (
  <section className="section-padding bg-section-alt">
    <div className="container-sernet">
      <h2 className="heading-lg text-foreground mb-2 text-center">More ways to invest</h2>
      <p className="text-body text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Start online or through your relationship manager. See the Invest tab on Open Account for each partner's steps.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    primaryCta={{ label: 'Open Account', href: '/open-account?tab=invest' }}
    extra={<RmProducts />}
    eligibility={{ text: 'Online opening is for adult Resident Indian individuals. Minors, HUFs, NRIs and non-individuals can use the account opening forms.', href: '/downloads?tab=invest' }}
    disclaimer="Mutual fund investments are subject to market risks; read all scheme-related documents carefully. SERNET is an AMFI-registered Mutual Fund Distributor (ARN 35275, EUIN E025145) and an APMI-registered PMS distributor (APRN 10097), and earns commissions from product providers. SERNET is not a SEBI-registered Investment Adviser, Research Analyst or stock broker; the investment decision is yours."
  />
);
