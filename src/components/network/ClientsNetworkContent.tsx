import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Building2, Globe, ArrowRight, Gift, UserCheck, Briefcase, ChevronRight } from 'lucide-react';
import networkClientsImg from '@/assets/network-clients.webp';

const clientStats = [
  { value: '1500+', label: 'Families Served' },
  { value: '200+', label: 'Corporate Clients' },
  { value: '18', label: 'Countries Served' },
];

const clientCategories = [
  {
    icon: Users,
    title: 'Retail Individuals',
    items: ['Salaried Professionals', 'Self-Employed Professionals', 'Business Owners'],
  },
  {
    icon: UserCheck,
    title: 'HNW Individuals',
    items: ['CXOs & Senior Executives', 'Entrepreneurs & Promoters'],
  },
  {
    icon: Globe,
    title: 'NRI & Foreign Individuals',
    items: ['Travelling NRIs', 'Working NRIs', 'Migrants & Foreign Nationals'],
  },
  {
    icon: Building2,
    title: 'Non-Individuals',
    items: ['Family Offices', 'MSMEs', 'Startups & Corporates'],
  },
];

const investorProfile = [
  { label: 'Risk Assessment', desc: 'Comprehensive risk profiling to match investments with your comfort level.' },
  { label: 'Goal Mapping', desc: 'Align financial products with short, medium, and long-term goals.' },
  { label: 'Portfolio Construction', desc: 'Diversified portfolio built around your unique investor profile.' },
  { label: 'Periodic Reviews', desc: 'Quarterly reviews and rebalancing to keep your portfolio on track.' },
  { label: 'Tax Optimization', desc: 'Strategies to minimize tax burden and maximize post-tax returns.' },
];

export const ClientsNetworkContent = () => (
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
              Empowering <span className="text-primary">every investor</span>
            </h2>
            <p className="text-body max-w-lg mb-8">
              From first-time investors to seasoned HNIs — personalised strategies for wealth creation, preservation, and growth across every life stage.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/open-account" className="btn-primary inline-flex items-center">
                Open an Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/referral/client" className="btn-secondary inline-flex items-center">
                Refer a Friend
              </Link>
            </div>
            {/* 3 Stats */}
            <div className="flex flex-wrap gap-6 lg:gap-10">
              {clientStats.map((stat, i) => (
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
              src={networkClientsImg}
              alt="SERNET client network"
              className="w-full max-w-[480px] h-auto mix-blend-multiply"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 — Client Categories & Investor Profiling */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Who we serve
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Tailored financial solutions for every type of investor across segments.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Categories List (stacked cards) */}
          <div className="space-y-4">
            {clientCategories.map((cat, index) => {
              const bgColors = [
                'bg-primary/8 border-primary/15',
                'bg-accent/60 border-accent/30',
                'bg-secondary/50 border-secondary/30',
                'bg-muted/60 border-muted-foreground/10',
              ];
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`rounded-xl p-5 border ${bgColors[index % bgColors.length]} transition-shadow hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <cat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cat.items.join(' · ')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right — Investor Profiling (stacked cards) */}
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="heading-md text-foreground mb-1">Investor Profiling</h3>
              <p className="text-small">How we personalise your investment journey</p>
            </div>
            {investorProfile.map((point, i) => {
              const bgColors = [
                'bg-primary/8 border-primary/15',
                'bg-accent/60 border-accent/30',
                'bg-secondary/50 border-secondary/30',
                'bg-muted/60 border-muted-foreground/10',
                'bg-primary/5 border-primary/10',
              ];
              return (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`rounded-xl p-5 border ${bgColors[i % bgColors.length]} transition-shadow hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-0.5">{point.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    {/* Referral CTA */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto p-8 rounded-lg border border-primary/20 bg-primary/5 text-center">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="heading-md text-foreground mb-3">Client Referral Programme</h3>
          <p className="text-body text-sm mb-6 max-w-xl mx-auto">
            Love our services? Refer your friends and family and earn rewards. Earn 10% of brokerage generated by your referrals for the first year.
          </p>
          <Link to="/referral/client" className="btn-primary inline-flex items-center">
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);
