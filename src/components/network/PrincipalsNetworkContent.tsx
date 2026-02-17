import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Landmark, Award, ArrowRight, Banknote, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import networkPrincipalsImg from '@/assets/network-principals.webp';
import { AutoScrollShowcase, type ShowcaseItem } from './AutoScrollShowcase';

const principalStats = [
  { value: '10+', label: 'Principal Partners' },
  { value: '500+', label: 'Products Available' },
  { value: '₹500Cr+', label: 'Assets Managed' },
];

const principalShowcaseItems: ShowcaseItem[] = [
  {
    icon: TrendingUp,
    title: 'Broker',
    subtitle: 'Choice Equity Broking Pvt. Ltd.',
    detail: {
      heading: 'Stock Broking',
      description: 'Registered sub-broker under Choice Equity Broking for equities, derivatives, and commodity trading across NSE, BSE, and MCX.',
      points: [
        'Equity delivery, intraday, and F&O trading',
        'Commodity and currency derivative access',
        'Real-time market data and research reports',
        'Dedicated dealing desk for HNI clients',
      ],
    },
  },
  {
    icon: Landmark,
    title: 'Funds',
    subtitle: 'Mutual Funds · SIFs · PMS & AIFs',
    detail: {
      heading: 'Investment Funds',
      description: 'Empanelled with leading AMCs and fund managers for distributing mutual funds, specialized investment funds, and alternative investments.',
      points: [
        'Access to 5000+ mutual fund schemes (Direct & Regular)',
        'SIF allocations for sophisticated investors',
        'PMS and AIF curated selection for HNI/UHNI',
        'Consolidated portfolio tracking and reporting',
      ],
    },
  },
  {
    icon: Banknote,
    title: 'Company FD',
    subtitle: 'NBFC Companies',
    detail: {
      heading: 'Corporate Fixed Deposits',
      description: 'Distribute high-yield corporate FDs from trusted NBFCs for clients seeking stable, predictable returns.',
      points: [
        'Curated NBFC FDs with competitive interest rates',
        'Credit rating-based risk assessment',
        'Flexible tenure options from 1 to 5 years',
        'Auto-renewal and interest payout management',
      ],
    },
  },
  {
    icon: Award,
    title: 'Bonds',
    subtitle: 'Northern Arc Capital',
    detail: {
      heading: 'Bond Investments',
      description: 'Partnered with Northern Arc Capital to offer secured and unsecured bond opportunities across credit profiles.',
      points: [
        'Investment-grade and high-yield bond options',
        'Monthly and quarterly interest payout bonds',
        'Tax-efficient bond structuring',
        'Secondary market bond liquidity support',
      ],
    },
  },
  {
    icon: Heart,
    title: 'Insurance',
    subtitle: 'Srigoda Insurance',
    detail: {
      heading: 'Insurance Solutions',
      description: 'Comprehensive life, health, and general insurance distribution through our partnership with Srigoda Insurance.',
      points: [
        'Term life and whole life insurance plans',
        'Health and critical illness coverage',
        'Unit-linked insurance plans (ULIPs)',
        'Claims support and policy servicing',
      ],
    },
  },
];

export const PrincipalsNetworkContent = () => (
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
              Backed by <span className="text-primary">strong principals</span>
            </h2>
            <p className="text-body max-w-lg mb-8">
              We operate under the authority of India's leading financial institutions, exchanges, and regulatory bodies — ensuring trust, compliance, and investor protection.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/schedule-call" className="btn-primary inline-flex items-center">
                Schedule a Call <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-secondary inline-flex items-center">
                About SERNET
              </Link>
            </div>
            {/* 3 Stats */}
            <div className="flex flex-wrap gap-6 lg:gap-10">
              {principalStats.map((stat, i) => (
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
              src={networkPrincipalsImg}
              alt="SERNET principals and regulators"
              className="w-full max-w-[480px] h-auto mix-blend-multiply"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 — Auto-Scroll Showcase */}
    <AutoScrollShowcase
      sectionTitle="Our principals & products"
      sectionSubtitle="Licensed and empanelled with India's top financial product manufacturers."
      items={principalShowcaseItems}
    />

    {/* Compliance note */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="heading-md text-foreground mb-3">Fully Licensed & Compliant</h3>
          <p className="text-body text-sm max-w-xl mx-auto">
            SERNET operates with full regulatory compliance across all its business verticals — stock broking, mutual fund distribution, and insurance advisory. Your investments are always in safe hands.
          </p>
        </motion.div>
      </div>
    </section>
  </>
);
