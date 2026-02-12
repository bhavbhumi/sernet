import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import pricingZero from '@/assets/pricing-zero.svg';

const pricingItems = [
  {
    highlight: '₹0',
    title: 'Trading',
    features: [
      'Account Opening Fee',
      'AMC for the 1st Year',
      'Auto Square Off Charges',
      'Call and Trade',
    ],
  },
  {
    highlight: '₹0',
    title: 'Investment',
    features: [
      'Multiple Profiles & Family Login',
      'Portfolio Health Checkup',
      'Premium Reports',
      'Assisted Execution',
    ],
  },
  {
    highlight: '₹0',
    title: 'Insurance',
    features: [
      'Family Login',
      'Policy Portfolio Review',
      'Premium Reports',
      'Assisted Execution',
    ],
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
          <h2 className="heading-lg text-foreground mb-4">Best Value Pricing</h2>
          <p className="text-body max-w-2xl mx-auto">
            We provide Full Service Broking*, Regular Distribution for Investment and Insurance Products. Honest upfront and transparent always.
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
              className="text-center p-8 rounded-lg border border-border"
            >
              <img src={pricingZero} alt="₹0" className="w-28 h-auto mx-auto mb-2" />
              <h3 className="heading-md text-foreground mb-6">{item.title}</h3>
              <ul className="space-y-3 text-left">
                {item.features.map((feature) => (
                  <li key={feature} className="text-body">
                    {feature}
                  </li>
                ))}
              </ul>
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
