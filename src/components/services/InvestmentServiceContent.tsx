import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart, Wallet, Landmark, Briefcase } from 'lucide-react';

const investmentProducts = [
  {
    icon: PieChart,
    name: 'Coin',
    tagline: 'Direct mutual funds online',
    description: 'Buy direct mutual funds commission-free, delivered directly to your Demat account.',
    link: '/products/coin',
  },
  {
    icon: Briefcase,
    name: 'Smallcase',
    tagline: 'Thematic stock portfolios',
    description: 'Invest in curated portfolios of stocks and ETFs built around market themes and strategies.',
    link: '/products/smallcase',
  },
  {
    icon: Landmark,
    name: 'GoldenPi',
    tagline: 'Bonds and fixed income',
    description: 'Government securities, corporate bonds, and more with transparent pricing.',
    link: '/products/goldenpi',
  },
  {
    icon: Wallet,
    name: 'Kite Connect',
    tagline: 'Build your own investing app',
    description: 'Powerful APIs for businesses to build custom trading and investment platforms.',
    link: '/products/kite-connect',
  },
];

const investmentCharges = [
  { category: 'Mutual Funds', items: [{ name: 'Direct mutual funds', price: 'FREE', description: 'Zero commission, invest in 5000+ funds' }, { name: 'SIP investments', price: 'FREE', description: 'Systematic investment plans at no cost' }] },
  { category: 'Bonds & FDs', items: [{ name: 'Government bonds', price: 'FREE', description: 'Invest in sovereign bonds at no charge' }, { name: 'Corporate bonds', price: 'FREE', description: 'Access corporate bonds marketplace' }] },
  { category: 'Others', items: [{ name: 'IPO applications', price: 'FREE', description: 'Apply for IPOs using UPI' }, { name: 'Digital gold', price: 'FREE', description: 'Buy and sell 24K digital gold' }] },
];

export const InvestmentServiceContent = () => (
  <>
    {/* Products */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Investment products we distribute
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Zero-commission investments across mutual funds, bonds, gold, and more.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {investmentProducts.map((product, index) => (
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
              <p className="text-body text-sm mb-4">{product.description}</p>
              <Link to={product.link} className="link-primary text-sm font-medium">Learn more →</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Investment charges
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Completely free — no commissions, no hidden fees.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          {[
            { price: '₹0', title: 'Direct mutual funds', desc: 'Invest in direct mutual funds, completely free.' },
            { price: '₹0', title: 'Stocks (delivery)', desc: 'Buy and hold stocks with zero brokerage.' },
            { price: '₹0', title: 'Digital gold', desc: 'Invest in 24K digital gold with no extra charges.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {investmentCharges.map((tier, tierIndex) => (
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
