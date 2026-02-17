import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Building2, Globe, ArrowRight, Gift, UserCheck, Check } from 'lucide-react';
import networkClientsImg from '@/assets/network-clients.webp';
import { AutoScrollShowcase, type ShowcaseItem } from './AutoScrollShowcase';
import { ReferralFormDialog } from '@/components/shared/ReferralFormDialog';

const clientStats = [
  { icon: Users, value: '1500+', label: 'Families Served' },
  { icon: Building2, value: '200+', label: 'Corporate Clients' },
  { icon: Globe, value: '18', label: 'Countries Served' },
];

const clientShowcaseItems: ShowcaseItem[] = [
  {
    icon: Users,
    title: 'Retail Individuals',
    subtitle: 'Salaried · Professional · Business',
    detail: {
      heading: 'Retail Investors',
      description: 'Personalised investment strategies for salaried professionals, self-employed individuals, and business owners at every stage of their financial journey.',
      points: [
        'Goal-based portfolio planning aligned with income cycles',
        'Tax-saving investments through ELSS, NPS, and insurance',
        'SIP-based wealth creation for long-term compounding',
        'Dedicated relationship manager for periodic reviews',
      ],
    },
  },
  {
    icon: UserCheck,
    title: 'HNW Individuals',
    subtitle: 'CXOs · Entrepreneurs',
    detail: {
      heading: 'High Net-Worth Investors',
      description: 'Sophisticated wealth management solutions for CXOs, senior executives, and entrepreneurs with complex financial needs.',
      points: [
        'PMS and AIF access for alpha generation',
        'Estate and succession planning advisory',
        'Concentrated stock risk management',
        'Private market and pre-IPO opportunities',
      ],
    },
  },
  {
    icon: Globe,
    title: 'NRI & Foreign Individuals',
    subtitle: 'Travelling · Working · Migrants',
    detail: {
      heading: 'NRI & Global Investors',
      description: 'Seamless cross-border investment facilitation for NRIs and foreign nationals looking to invest in Indian markets.',
      points: [
        'NRE/NRO account-based investment setup',
        'FEMA-compliant portfolio structuring',
        'Repatriation-friendly mutual fund schemes',
        'Remote KYC and digital onboarding',
      ],
    },
  },
  {
    icon: Building2,
    title: 'Non-Individuals',
    subtitle: 'Family Offices · MSMEs · Startups',
    detail: {
      heading: 'Institutional & Corporate Investors',
      description: 'Treasury management, corporate investment solutions, and structured products for family offices, MSMEs, and startups.',
      points: [
        'Corporate FD and debt instrument placement',
        'Treasury surplus deployment strategies',
        'Employee stock option (ESOP) advisory',
        'Customised reporting and compliance support',
      ],
    },
  },
];

export const ClientsNetworkContent = () => (
  <>
    {/* Section 1 — Hero Split */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="heading-lg text-foreground mb-3">
              Empowering <span className="text-primary">every investor</span>
            </h2>
            <p className="text-body max-w-lg mb-6">
              From first-time investors to seasoned HNIs — personalised strategies for wealth creation, preservation, and growth across every life stage.
            </p>
            <ul className="space-y-2 mb-8">
              {['Personalised Wealth Strategies', 'Multi-Asset Portfolio Access', 'Dedicated Relationship Manager'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/open-account" className="btn-primary inline-flex items-center">
                Open an Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <ReferralFormDialog
                type="client"
                trigger={
                  <button className="btn-secondary inline-flex items-center">
                    Refer a Friend
                  </button>
                }
              />
            </div>
            {/* 3 Stats */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {clientStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <img
              src={networkClientsImg}
              alt="SERNET client network"
              className="w-full max-w-[480px] max-h-[400px] h-auto object-contain dark:bg-white dark:rounded-xl dark:p-3"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 — Auto-Scroll Showcase */}
    <AutoScrollShowcase
      sectionTitle="Who we serve"
      sectionSubtitle="Tailored financial solutions for every type of investor across segments."
      items={clientShowcaseItems}
    />

    {/* Referral CTA */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto p-8 rounded-lg border border-primary/20 bg-primary/5 text-center">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="heading-md text-foreground mb-3">Know someone who should invest?</h3>
          <p className="text-body text-sm mb-6 max-w-xl mx-auto">
            Refer your friends and family to SERNET. Share their details and our team will reach out to them.
          </p>
          <ReferralFormDialog
            type="client"
            trigger={
              <button className="btn-primary inline-flex items-center">
                Refer a Friend <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            }
          />
        </motion.div>
      </div>
    </section>
  </>
);
