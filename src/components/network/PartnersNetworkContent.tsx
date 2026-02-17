import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Check, User, Briefcase, Megaphone, ArrowRightLeft } from 'lucide-react';
import networkPartnersImg from '@/assets/network-partners.webp';
import { AutoScrollShowcase, type ShowcaseItem } from './AutoScrollShowcase';

const partnerStats = [
  { value: '50+', label: 'Partner Institutions' },
  { value: '5000+', label: 'Products Distributed' },
  { value: '35+', label: 'Years of Partnerships' },
];

const pointers = [
  'Competitive Revenue Sharing',
  'Succession Proof Income Source',
  'Periodical Cash Flow',
];

const partnerShowcaseItems: ShowcaseItem[] = [
  {
    icon: User,
    title: 'Freelancers',
    subtitle: 'Accountants · Tax Consultants · Bookkeepers',
    detail: {
      heading: 'Freelance Financial Professionals',
      description: 'Independent accountants and tax professionals who already advise clients on financial matters — extend your value by offering investment and trading solutions alongside your existing services.',
      points: [
        'Monetise your existing client relationships with zero capital investment',
        'Offer your clients a one-stop financial ecosystem beyond accounting',
        'Earn recurring revenue on every client who trades or invests',
        'Dedicated partner support and co-branded marketing collateral',
      ],
    },
  },
  {
    icon: Briefcase,
    title: 'Fiduciary Professionals',
    subtitle: 'CA · CS · CMA',
    detail: {
      heading: 'Chartered & Company Professionals',
      description: 'Chartered Accountants, Company Secretaries, and Cost & Management Accountants hold deep trust with their clients — partner with SERNET to convert that trust into a sustainable revenue stream.',
      points: [
        'Leverage your professional credibility to onboard high-value investors',
        'Access exclusive revenue-sharing models designed for licensed professionals',
        'Provide holistic financial advisory — compliance, tax, and investments under one roof',
        'Priority onboarding and dedicated relationship manager for your referred clients',
      ],
    },
  },
  {
    icon: Megaphone,
    title: 'Finfluencers',
    subtitle: 'Social Media Influencers · Content Creators',
    detail: {
      heading: 'Financial Content Creators',
      description: 'If you educate audiences about money, markets, or personal finance on social media — turn your influence into income by partnering with a trusted, SEBI-registered financial services firm.',
      points: [
        'Earn attractive commissions for every follower who opens an account',
        'Co-create branded educational content with our research team',
        'Access real-time market data and insights to power your content',
        'Transparent tracking dashboard to monitor referrals and earnings',
      ],
    },
  },
  {
    icon: ArrowRightLeft,
    title: 'Cross Professionals',
    subtitle: 'Insurance Agents · Small Financial Product Distributors',
    detail: {
      heading: 'Adjacent Financial Professionals',
      description: 'Insurance agents and small-scale distributors already operate within the financial ecosystem — expand your product suite and earn more from the same client base without additional licensing overhead.',
      points: [
        'Cross-sell equity, mutual funds, and bonds alongside your existing insurance book',
        'No conflict — complementary products that enhance your client\u2019s portfolio',
        'Seamless digital onboarding for your referred clients in under 10 minutes',
        'Succession-proof income that continues even if you step back from active selling',
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
            <p className="text-body max-w-lg mb-6">
              Join a partner ecosystem built on trust, transparency, and long-term wealth creation — designed for professionals who want to earn while they serve.
            </p>

            {/* Pointers */}
            <ul className="space-y-2 mb-8">
              {pointers.map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/referral/partner" className="btn-primary inline-flex items-center">
                Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/referral/partner" className="btn-secondary inline-flex items-center">
                Refer a Partner
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
                  <p className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight tracking-tight">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
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
      sectionTitle="Suitable Partner Ecosystem"
      sectionSubtitle="From independent professionals to digital creators — discover where you fit in our growing partner network and start earning today."
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