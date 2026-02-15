import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, LineChart, Target, MessageSquare } from 'lucide-react';

const tradingProducts = [
  {
    icon: TrendingUp,
    name: 'Kite',
    tagline: 'Ultra-fast flagship trading platform',
    description: 'Streaming market data, advanced charts, and an elegant UI across web, Android, and iOS.',
    link: '/products/kite',
  },
  {
    icon: BarChart3,
    name: 'Console',
    tagline: 'Central dashboard for your account',
    description: 'In-depth reports, visualisations, and insights into your trades and portfolio.',
    link: '/products/console',
  },
  {
    icon: LineChart,
    name: 'Streak',
    tagline: 'Algo trading & backtesting',
    description: 'Create and backtest strategies without coding. Validate your ideas before going live.',
    link: '/products/streak',
  },
  {
    icon: Target,
    name: 'Sensibull',
    tagline: 'Options trading made simple',
    description: 'India\'s most advanced options analytics platform. Build strategies and trade with confidence.',
    link: '/products/sensibull',
  },
  {
    icon: MessageSquare,
    name: 'Trading Q&A',
    tagline: 'Community knowledge base',
    description: 'India\'s most active trading community — ask questions, share knowledge, learn together.',
    link: '/tradingqna',
  },
];

const tradingCharges = [
  { category: 'Equity', items: [{ name: 'Equity delivery', price: 'FREE', description: 'All equity delivery investments (NSE, BSE)' }, { name: 'Equity intraday', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }] },
  { category: 'Derivatives', items: [{ name: 'F&O (Equity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }, { name: 'F&O (Currency)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }, { name: 'F&O (Commodity)', price: '₹20', description: '0.03% or ₹20/executed order whichever is lower' }] },
  { category: 'Account', items: [{ name: 'Account opening', price: 'FREE', description: 'Zero cost to open an account' }, { name: 'AMC', price: 'FREE', description: 'No annual maintenance charge' }] },
];

export const TradingServiceContent = () => (
  <>
    {/* Products We Distribute */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Trading platforms we offer
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Best-in-class tools for every kind of trader — from beginners to professionals.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tradingProducts.map((product, index) => (
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
          Trading charges
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Simple, transparent pricing — no hidden charges, ever.
        </motion.p>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          {[
            { price: '₹0', title: 'Free equity delivery', desc: 'All equity delivery investments are absolutely free.' },
            { price: '₹20', title: 'Intraday and F&O', desc: 'Flat ₹20 or 0.03% (whichever is lower) per executed order.' },
            { price: '₹0', title: 'Free account', desc: 'Zero cost to open. No annual maintenance charges.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-5xl font-bold text-primary mb-2">{item.price}</div>
              <h3 className="heading-md text-foreground mb-2">{item.title}</h3>
              <p className="text-small">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed table */}
        <div className="max-w-4xl mx-auto space-y-10">
          {tradingCharges.map((tier, tierIndex) => (
            <motion.div key={tier.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: tierIndex * 0.1 }}>
              <h3 className="heading-md text-foreground mb-4">{tier.category}</h3>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {tier.items.map((item, itemIndex) => (
                  <div key={item.name} className={`flex items-center justify-between p-4 ${itemIndex !== tier.items.length - 1 ? 'border-b border-border' : ''}`}>
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-small">{item.description}</p>
                    </div>
                    <div className={`text-lg font-bold ${item.price === 'FREE' ? 'text-success' : 'text-primary'}`}>{item.price}</div>
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
