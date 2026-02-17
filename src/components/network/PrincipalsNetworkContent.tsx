import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Landmark, Award, ArrowRight, Banknote, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import networkPrincipalsImg from '@/assets/network-principals.webp';

const principalStats = [
  { value: '10+', label: 'Principal Partners' },
  { value: '500+', label: 'Products Available' },
  { value: '₹500Cr+', label: 'Assets Managed' },
];

const principalCategories = [
  {
    icon: TrendingUp,
    title: 'Broker',
    items: ['Choice Equity Broking Pvt. Ltd.'],
  },
  {
    icon: Landmark,
    title: 'Funds',
    items: ['Mutual Funds', 'SIFs (Specialized Investment Funds)', 'PMS & AIFs'],
  },
  {
    icon: Banknote,
    title: 'Company FD',
    items: ['NBFC Companies'],
  },
  {
    icon: Award,
    title: 'Bonds',
    items: ['Northern Arc Capital'],
  },
  {
    icon: Heart,
    title: 'Insurance',
    items: ['Srigoda Insurance'],
  },
];

const engagementScope = [
  { label: 'Product Distribution', desc: 'Distribute principal products across our client network with regulatory compliance.' },
  { label: 'Revenue Sharing', desc: 'Transparent commission and trail-based revenue models aligned with principal guidelines.' },
  { label: 'Client Servicing', desc: 'End-to-end client onboarding, KYC, and post-sale support on behalf of principals.' },
  { label: 'Market Intelligence', desc: 'Feedback loops and market insights shared with principals to improve product design.' },
  { label: 'Compliance & Reporting', desc: 'Periodic reporting, audit readiness, and regulatory adherence for all principal engagements.' },
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

    {/* Section 2 — Principal Categories & Engagement Scope */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Our principals & products
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Licensed and empanelled with India's top financial product manufacturers.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — Principal Categories */}
          <div className="space-y-6">
            {principalCategories.map((cat, index) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="feature-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="heading-md text-foreground">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-[52px]">
                  {cat.items.map((item) => (
                    <span key={item} className="px-3 py-1 bg-muted/50 text-sm text-muted-foreground rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — Engagement Scope */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="feature-card bg-muted/20 h-fit"
          >
            <h3 className="heading-md text-foreground mb-1">Scope of Engagement</h3>
            <p className="text-small mb-6">How we work with our principals</p>
            <div className="space-y-5">
              {engagementScope.map((point, i) => (
                <div key={point.label} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{point.label}</p>
                    <p className="text-small">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

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
