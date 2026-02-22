import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Handshake, Building2, Briefcase, Globe, Crown, Building } from 'lucide-react';
import clientRetail from '@/assets/client-retail.png';
import clientHnw from '@/assets/client-hnw.png';
import clientNri from '@/assets/client-nri.png';
import clientInstitutions from '@/assets/client-institutions.png';

const clientTypes = [
  {
    title: 'Retail Individuals',
    desc: 'Salaried, professionals & business owners',
    detail: 'Personalised investment plans, SIPs, insurance & trading solutions designed for everyday investors building long-term wealth.',
    image: clientRetail,
    icon: Briefcase,
  },
  {
    title: 'HNW Individuals',
    desc: 'CXOs, entrepreneurs & ultra-HNW families',
    detail: 'Bespoke portfolio management, tax-efficient strategies & exclusive access to alternative investments for high-net-worth clients.',
    image: clientHnw,
    icon: Crown,
  },
  {
    title: 'NRI & Foreign Nationals',
    desc: 'Indians abroad & foreign investors',
    detail: 'Seamless cross-border investments, NRI-specific mutual funds, repatriation support & FEMA-compliant financial planning.',
    image: clientNri,
    icon: Globe,
  },
  {
    title: 'Non-Individuals',
    desc: 'Family offices, MSMEs & startups',
    detail: 'Treasury management, corporate fixed deposits, employee benefit schemes & structured products for institutional needs.',
    image: clientInstitutions,
    icon: Building,
  },
];

const sideCards = [
  {
    title: 'Partners',
    subtitle: 'Professionals who grow with us',
    stat: '500+',
    statLabel: 'Empanelled nationwide',
    icon: Handshake,
    tab: 'partners',
    points: ['CAs, CSs & Fiduciaries', 'Freelancers & Finfluencers', 'Cross-industry professionals'],
    gradient: 'from-primary/5 to-primary/10',
  },
  {
    title: 'Principals',
    subtitle: 'Institutions who back our promise',
    stat: '50+',
    statLabel: 'Regulated associations',
    icon: Building2,
    tab: 'principals',
    points: ['Fund Houses & Insurers', 'Stock Exchanges & Depositories', 'Bond & Bullion Issuers'],
    gradient: 'from-accent/5 to-accent/10',
  },
];

export const NetworkSection = () => {
  const [activeClient, setActiveClient] = useState(0);

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="heading-lg text-foreground mb-3">
            Whom we serve
          </h2>
          <p className="text-body max-w-2xl mx-auto text-muted-foreground">
            Built on 35+ years of trust across 54 cities and 18 countries — a growing ecosystem of clients, partners, and principals.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Clients — spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground">Clients</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[46px]">
              10,000+ active clients across segments
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {clientTypes.map((client, i) => {
                const Icon = client.icon;
                const isActive = activeClient === i;
                return (
                  <motion.div
                    key={client.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group relative rounded-lg border border-border/60 bg-background overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveClient(i)}
                    onMouseLeave={() => setActiveClient(0)}
                  >
                    {/* Illustration */}
                    <div className="relative aspect-square bg-muted/30 overflow-hidden">
                      <img
                        src={client.image}
                        alt={client.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Icon badge */}
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-md bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                    {/* Label */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground leading-tight">{client.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{client.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Active client detail */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeClient}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-muted-foreground mt-4 leading-relaxed min-h-[2.5rem]"
              >
                {clientTypes[activeClient].detail}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Partners & Principals — stacked in 1 column */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {sideCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                  className={`flex-1 rounded-xl border border-border bg-gradient-to-br ${card.gradient} p-5 group hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                        <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">{card.stat}</span>
                      <p className="text-[10px] text-muted-foreground leading-tight">{card.statLabel}</p>
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {card.points.map((point, pi) => (
                      <li key={pi} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/network?tab=${card.tab}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Learn more
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/network"
            className="inline-flex items-center gap-2 link-primary font-medium group/link"
          >
            Explore Our Network
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
