import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { Handshake, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const benefits = [
  'Attractive revenue sharing on brokerage',
  'Dedicated partner relationship manager',
  'Co-branded marketing materials',
  'Real-time partner dashboard & analytics',
  'Priority client onboarding support',
  'Quarterly performance reviews & payouts',
];

const partnerTiers = [
  { tier: 'Associate', requirement: '10+ referrals/quarter', commission: '15% revenue share', perks: 'Marketing support, partner badge' },
  { tier: 'Premium', requirement: '50+ referrals/quarter', commission: '20% revenue share', perks: 'Dedicated RM, priority support, events' },
  { tier: 'Elite', requirement: '100+ referrals/quarter', commission: '25% revenue share', perks: 'All Premium perks + co-branding, advisory board' },
];

const PartnerReferral = () => (
  <Layout>
    <PageHero
      title="Partner Referral"
      highlight="Programme"
      description="Are you a financial advisor, CA, or business? Partner with SERNET and earn attractive commissions while your clients get access to premium financial services."
      icon={Handshake}
    />

    {/* Benefits */}
    <section className="section-padding bg-background">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-8 text-center">
          Why partner with SERNET?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div key={benefit} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-body text-sm">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tiers */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha max-w-4xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-8 text-center">
          Partner tiers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerTiers.map((tier, index) => (
            <motion.div key={tier.tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="feature-card text-center">
              <h3 className="heading-md text-foreground mb-1">{tier.tier}</h3>
              <p className="text-small mb-4">{tier.requirement}</p>
              <div className="text-2xl font-bold text-primary mb-4">{tier.commission}</div>
              <p className="text-small">{tier.perks}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
          <h2 className="heading-lg text-foreground mb-4">Ready to partner?</h2>
          <p className="text-body mb-8">Get in touch with our partnerships team and start earning today.</p>
          <Link to="/schedule-call" className="btn-primary inline-flex items-center">
            Schedule a call <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default PartnerReferral;
