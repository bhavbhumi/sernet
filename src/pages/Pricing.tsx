import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    category: 'Equity',
    items: [
      { name: 'Equity delivery', price: 'FREE', description: 'All equity delivery investments (NSE, BSE)' },
      { name: 'Equity intraday', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' },
    ],
  },
  {
    category: 'Derivatives',
    items: [
      { name: 'F&O (Equity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' },
      { name: 'F&O (Currency)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' },
      { name: 'F&O (Commodity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' },
    ],
  },
  {
    category: 'Others',
    items: [
      { name: 'Direct mutual funds', price: 'FREE', description: 'All direct mutual fund investments' },
      { name: 'Account opening', price: 'FREE', description: 'Opening a Zerodha account' },
      { name: 'AMC', price: 'FREE', description: 'Annual maintenance charge' },
    ],
  },
];

const features = [
  'Free equity delivery trades',
  'Free direct mutual funds',
  'Free account opening',
  'No AMC for demat account',
  'Flat ₹20 for intraday & F&O',
  'Advanced trading platforms',
  'In-depth reports & analytics',
  'Dedicated support',
];

const Pricing = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-hero">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-xl text-foreground mb-6">
              Pricing
            </h1>
            <p className="text-body">
              Simple, transparent pricing. We pioneered the concept of discount broking and price transparency in India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Highlights */}
      <section className="py-12 bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">₹0</div>
              <h3 className="heading-md text-foreground mb-2">Free equity delivery</h3>
              <p className="text-small">All equity delivery investments are absolutely free — ₹0 brokerage.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">₹20</div>
              <h3 className="heading-md text-foreground mb-2">Intraday and F&O</h3>
              <p className="text-small">Flat ₹20 or 0.03% (whichever is lower) per executed order.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-primary mb-2">₹0</div>
              <h3 className="heading-md text-foreground mb-2">Free direct MF</h3>
              <p className="text-small">All direct mutual fund investments are absolutely free.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Pricing */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Detailed charges
          </motion.h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {pricingTiers.map((tier, tierIndex) => (
              <motion.div
                key={tier.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: tierIndex * 0.1 }}
              >
                <h3 className="heading-md text-foreground mb-6">{tier.category}</h3>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {tier.items.map((item, itemIndex) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-4 ${
                        itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <p className="text-small">{item.description}</p>
                      </div>
                      <div className={`text-lg font-bold ${item.price === 'FREE' ? 'text-success' : 'text-primary'}`}>
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="heading-lg text-foreground mb-8">What you get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-body">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="heading-lg text-foreground mb-4">
              Open a Zerodha account
            </h2>
            <p className="text-body mb-8">
              Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.
            </p>
            <Link to="/signup" className="btn-primary">
              Sign up for free
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
