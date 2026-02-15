import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Apple, Smartphone, ArrowRight, TrendingUp, BarChart3, Layers, Globe, DollarSign, Rocket, RefreshCw, Landmark } from 'lucide-react';
import tradingShowcase from '@/assets/trading-app-showcase.png';

const stats = [
  { value: '2.5M+', label: 'Downloads' },
  { value: '13L+', label: 'Active Clients' },
  { value: '4.2', label: 'App Rating' },
];

const products = [
  { icon: TrendingUp, name: 'Stocks', description: 'Trade equities across NSE & BSE with real-time data and seamless execution.' },
  { icon: BarChart3, name: 'F&O', description: 'Futures & Options trading with advanced analytics and strategy tools.' },
  { icon: Landmark, name: 'Retail Debt', description: 'Access government securities and bonds for stable, fixed-income returns.' },
  { icon: Layers, name: 'Commodities', description: 'Trade gold, silver, crude oil and more on MCX with competitive margins.' },
  { icon: Globe, name: 'Currency', description: 'Participate in forex markets with USD/INR, EUR/INR and other currency pairs.' },
  { icon: Rocket, name: 'IPOs', description: 'Apply for IPOs directly through your account with UPI-based mandates.' },
  { icon: RefreshCw, name: 'SLBM', description: 'Securities Lending & Borrowing — earn extra returns on your idle holdings.' },
  { icon: DollarSign, name: 'MTF', description: 'Margin Trade Funding — leverage your capital for delivery trades with flexible funding.' },
];

export const TradingServiceContent = () => (
  <>
    {/* Hero — Choice FinX */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-3">Choice FinX</h2>
            <p className="text-body text-muted-foreground mb-8">
              Only best in class app you need for your access to trade or invest in stocks, commodities and currency markets
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Apple className="w-4 h-4" />
                iOS Download
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Smartphone className="w-4 h-4" />
                Android Download
              </a>
              <Link to="/products/kite" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <img src={tradingShowcase} alt="Choice FinX trading app on desktop, tablet and mobile" className="rounded-xl w-full max-w-[480px]" />
            <div className="flex items-center justify-center gap-8 mt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-small">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Products We Offer */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Products we offer
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          A complete suite of trading instruments across every major asset class.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="feature-card group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <product.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground mb-2">{product.name}</h3>
              <p className="text-small leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);
