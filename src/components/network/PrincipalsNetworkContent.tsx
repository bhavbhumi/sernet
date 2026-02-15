import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Landmark, Award } from 'lucide-react';

const principalTypes = [
  {
    icon: TrendingUp,
    title: 'Stock Broking Principals',
    entities: ['National Stock Exchange (NSE)', 'Bombay Stock Exchange (BSE)', 'Multi Commodity Exchange (MCX)'],
    description: 'Registered as a trading and clearing member with India\'s premier exchanges.',
    role: 'Enable us to execute trades across equity, derivatives, currency, and commodity segments.',
  },
  {
    icon: Shield,
    title: 'Depository Participants',
    entities: ['National Securities Depository (NSDL)', 'Central Depository Services (CDSL)'],
    description: 'Authorised depository participant for secure custody and transfer of securities.',
    role: 'Facilitate dematerialization, rematerialization, and seamless settlement of trades.',
  },
  {
    icon: Building2,
    title: 'Regulatory Bodies',
    entities: ['Securities and Exchange Board of India (SEBI)', 'Association of Mutual Funds in India (AMFI)', 'Insurance Regulatory and Development Authority (IRDAI)'],
    description: 'Licensed and regulated by India\'s financial regulators ensuring compliance and investor protection.',
    role: 'Govern our operations, protect investor interests, and ensure market integrity.',
  },
  {
    icon: Landmark,
    title: 'Mutual Fund Registrars',
    entities: ['CAMS', 'KFintech (formerly Karvy)'],
    description: 'Integrated with registrar and transfer agents for direct mutual fund transactions.',
    role: 'Process subscriptions, redemptions, and SIP transactions with zero commission.',
  },
];

export const PrincipalsNetworkContent = () => (
  <>
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Our principals & regulators
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          We operate under the authority and regulation of India's leading financial institutions and regulatory bodies.
        </motion.p>
        <div className="space-y-8">
          {principalTypes.map((type, index) => (
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
              <div className="mb-3">
                {type.entities.map((entity) => (
                  <div key={entity} className="flex items-center gap-2 py-1.5">
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{entity}</span>
                  </div>
                ))}
              </div>
              <p className="text-small italic border-l-2 border-primary/30 pl-3">{type.role}</p>
            </motion.div>
          ))}
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
