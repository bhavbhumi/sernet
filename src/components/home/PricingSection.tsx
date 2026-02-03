import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const pricingItems = [
  {
    title: 'Free equity delivery',
    description: 'All equity delivery investments (NSE, BSE), are absolutely free — ₹0 brokerage.',
    icon: '₹0',
  },
  {
    title: 'Intraday and F&O trades',
    description: 'Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades.',
    icon: '₹20',
  },
  {
    title: 'Free direct MF',
    description: 'All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.',
    icon: '₹0',
  },
];

export const PricingSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-foreground mb-4">Unbeatable pricing</h2>
          <p className="text-body max-w-2xl mx-auto">
            We pioneered the concept of discount broking and price transparency in India., and it doesn't cost you
            a thing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-5xl font-bold text-primary mb-4">{item.icon}</div>
              <h3 className="heading-md text-foreground mb-3">{item.title}</h3>
              <p className="text-body">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/pricing" className="link-primary font-medium">
            See pricing →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
