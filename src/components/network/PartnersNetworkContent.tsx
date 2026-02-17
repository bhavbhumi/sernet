import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Building, Landmark, ArrowRight, Handshake } from 'lucide-react';
import networkPartnersImg from '@/assets/network-partners.webp';

const partnerStats = [
  { value: '50+', label: 'Partner Institutions' },
  { value: '5000+', label: 'Products Distributed' },
  { value: '35+', label: 'Years of Partnerships' },
];

const partnerTypes = [
  {
    icon: TrendingUp,
    title: 'Stock Exchanges & Depositories',
    partners: ['NSE', 'BSE', 'MCX', 'NSDL', 'CDSL'],
    description: 'Registered with all major exchanges and depositories for seamless trade execution and settlement.',
    value: 'Direct market access, real-time settlement, and regulatory compliance.',
  },
  {
    icon: Building,
    title: 'Mutual Fund Houses',
    partners: ['HDFC MF', 'SBI MF', 'ICICI Prudential', 'Axis MF', 'Kotak MF', 'Nippon India'],
    description: 'Empanelled with leading AMCs to distribute direct and regular mutual fund schemes.',
    value: 'Access to 5000+ schemes, SIP facilities, and consolidated portfolio tracking.',
  },
  {
    icon: Shield,
    title: 'Insurance Companies',
    partners: ['LIC', 'HDFC Life', 'ICICI Prudential', 'Max Life', 'Bajaj Allianz'],
    description: 'Partnered with top insurers to offer life, health, and general insurance solutions.',
    value: 'Best-in-class products, claims support, and policy management.',
  },
  {
    icon: Landmark,
    title: 'Technology Partners',
    partners: ['Kite', 'Streak', 'Sensibull', 'Smallcase'],
    description: 'Integrated with best-in-class fintech platforms for superior trading and investment experiences.',
    value: 'Advanced analytics, algo trading, options strategies, and thematic investing.',
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

    {/* Section 2 — Partner Ecosystem */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Our partner ecosystem
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          We collaborate with leading financial institutions and technology providers to deliver comprehensive solutions.
        </motion.p>
        <div className="space-y-8">
          {partnerTypes.map((type, index) => (
            <motion.div key={type.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="feature-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-md text-foreground">{type.title}</h3>
                  <p className="text-small">{type.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {type.partners.map((partner) => (
                  <span key={partner} className="px-3 py-1 bg-muted/50 text-sm text-muted-foreground rounded-full">{partner}</span>
                ))}
              </div>
              <p className="text-small italic border-l-2 border-primary/30 pl-3">{type.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

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
