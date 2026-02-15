import { motion } from 'framer-motion';
import { Shield, Heart, Car, Plane } from 'lucide-react';

const insuranceProducts = [
  {
    icon: Shield,
    name: 'Term Life Insurance',
    tagline: 'Pure protection plans',
    description: 'Affordable term plans from top insurers. Secure your family\'s future with comprehensive life cover.',
  },
  {
    icon: Heart,
    name: 'Health Insurance',
    tagline: 'Individual & family floater',
    description: 'Comprehensive health coverage including cashless hospitalization, critical illness, and more.',
  },
  {
    icon: Car,
    name: 'Motor Insurance',
    tagline: 'Car & bike coverage',
    description: 'Comprehensive and third-party motor insurance with instant policy issuance and hassle-free claims.',
  },
  {
    icon: Plane,
    name: 'Travel Insurance',
    tagline: 'Domestic & international',
    description: 'Complete travel protection covering medical emergencies, trip cancellations, and baggage loss.',
  },
];

const insuranceCharges = [
  { category: 'Life Insurance', items: [{ name: 'Term life insurance', price: 'No commission', description: 'Pure term plans from top insurers' }, { name: 'ULIPs', price: 'No commission', description: 'Unit-linked insurance plans' }] },
  { category: 'Health Insurance', items: [{ name: 'Individual health', price: 'No commission', description: 'Comprehensive health coverage' }, { name: 'Family floater', price: 'No commission', description: 'Coverage for the entire family' }] },
  { category: 'General Insurance', items: [{ name: 'Motor insurance', price: 'No commission', description: 'Car and bike insurance' }, { name: 'Travel insurance', price: 'No commission', description: 'Domestic and international travel cover' }] },
];

export const InsuranceServiceContent = () => (
  <>
    {/* Products */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Insurance products we distribute
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Zero commission on all insurance products — what you pay goes entirely towards your cover.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insuranceProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="feature-card group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <product.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-md text-foreground">{product.name}</h3>
                  <p className="text-small">{product.tagline}</p>
                </div>
              </div>
              <p className="text-body text-sm">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Insurance — zero commission
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          We don't earn commissions from insurers. Our only goal is to help you get the right cover.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          {[
            { price: '₹0', title: 'No commission', desc: 'Zero commission on all insurance products.' },
            { price: '100%', title: 'Claim support', desc: 'Dedicated support throughout the claims process.' },
            { price: '10+', title: 'Insurers', desc: 'Choose from top insurance providers.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {insuranceCharges.map((tier, tierIndex) => (
            <motion.div key={tier.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: tierIndex * 0.1 }}>
              <h3 className="heading-md text-foreground mb-4">{tier.category}</h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {tier.items.map((item, itemIndex) => (
                  <div key={item.name} className={`flex items-center justify-between p-4 ${itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''}`}>
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-small">{item.description}</p>
                    </div>
                    <div className="text-lg font-bold text-success">{item.price}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);
