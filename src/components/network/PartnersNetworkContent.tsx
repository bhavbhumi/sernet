import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Building, Landmark, ArrowRight, Handshake } from 'lucide-react';
import networkPartnersImg from '@/assets/network-partners.webp';
import { AutoScrollShowcase, type ShowcaseItem } from './AutoScrollShowcase';

const partnerStats = [
  { value: '50+', label: 'Partner Institutions' },
  { value: '5000+', label: 'Products Distributed' },
  { value: '35+', label: 'Years of Partnerships' },
];

const partnerShowcaseItems: ShowcaseItem[] = [
  {
    icon: TrendingUp,
    title: 'Stock Exchanges & Depositories',
    subtitle: 'NSE · BSE · MCX · NSDL · CDSL',
    detail: {
      heading: 'Exchange & Depository Partners',
      description: 'Registered with all major exchanges and depositories for seamless trade execution, settlement, and custody services.',
      points: [
        'Direct market access across equity, commodity, and currency segments',
        'Real-time settlement via NSDL and CDSL depository accounts',
        'Regulatory compliance and investor grievance redressal',
        'Multi-exchange order routing for best execution',
      ],
    },
  },
  {
    icon: Building,
    title: 'Mutual Fund Houses',
    subtitle: 'HDFC MF · SBI MF · ICICI Pru · Axis MF',
    detail: {
      heading: 'AMC Partnerships',
      description: 'Empanelled with leading Asset Management Companies to distribute direct and regular mutual fund schemes across categories.',
      points: [
        'Access to 5000+ schemes across equity, debt, and hybrid categories',
        'SIP, STP, and SWP facilitation with auto-debit setup',
        'Consolidated portfolio tracking and NAV-based reporting',
        'NFO participation and switch advisory',
      ],
    },
  },
  {
    icon: Shield,
    title: 'Insurance Companies',
    subtitle: 'LIC · HDFC Life · ICICI Pru · Max Life',
    detail: {
      heading: 'Insurance Partners',
      description: 'Partnered with top insurance providers to offer comprehensive life, health, and general insurance solutions.',
      points: [
        'Term life, whole life, and endowment plans',
        'Health and critical illness coverage with cashless networks',
        'Claims support and policy management services',
        'Group insurance solutions for corporate clients',
      ],
    },
  },
  {
    icon: Landmark,
    title: 'Technology Partners',
    subtitle: 'Kite · Streak · Sensibull · Smallcase',
    detail: {
      heading: 'Fintech Integrations',
      description: 'Integrated with best-in-class fintech platforms for superior trading, analytics, and thematic investment experiences.',
      points: [
        'Advanced charting and algorithmic trading via Streak',
        'Options strategy builder with Sensibull integration',
        'Thematic and model portfolio investing through Smallcase',
        'API-driven connectivity for custom trading solutions',
      ],
    },
  },
];

export const PartnersNetworkContent = () => (
  <>
    {/* Section 1 — Hero Split */}
    <section className="section-padding bg-background" style={{ background: 'var(--gradient-hero)' }}>
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
              Strength in <span className="text-primary">partnerships</span>
            </h2>
            <p className="text-body max-w-lg mb-8">
              We collaborate with leading financial institutions and technology providers to deliver comprehensive, best-in-class solutions to our clients.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/referral/partner" className="btn-primary inline-flex items-center">
                Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/schedule-call" className="btn-secondary inline-flex items-center">
                Schedule a Call
              </Link>
            </div>
            {/* 3 Stats */}
            <div className="flex flex-wrap gap-6 lg:gap-10">
              {partnerStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-[1.75rem] md:text-[2rem] font-light text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </motion.div>
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
              src={networkPartnersImg}
              alt="SERNET partner ecosystem"
              className="w-full max-w-[480px] h-auto mix-blend-multiply"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 — Auto-Scroll Showcase */}
    <AutoScrollShowcase
      sectionTitle="Our partner ecosystem"
      sectionSubtitle="We collaborate with leading financial institutions and technology providers to deliver comprehensive solutions."
      items={partnerShowcaseItems}
    />

    {/* Partner Referral CTA */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto p-8 rounded-lg border border-primary/20 bg-primary/5 text-center">
          <Handshake className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="heading-md text-foreground mb-3">Partner Referral Programme</h3>
          <p className="text-body text-sm mb-6 max-w-xl mx-auto">
            Are you a financial advisor, CA, or business? Partner with SERNET and earn attractive referral commissions while your clients get access to premium financial services.
          </p>
          <Link to="/referral/partner" className="btn-primary inline-flex items-center">
            Become a partner <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);
