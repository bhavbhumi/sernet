import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, PieChart, Wallet, BookOpen, LineChart } from 'lucide-react';

const products = [
  {
    icon: TrendingUp,
    name: 'Kite',
    tagline: 'Our ultra-fast flagship trading platform',
    description: 'Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.',
    link: '#',
  },
  {
    icon: BarChart3,
    name: 'Console',
    tagline: 'The central dashboard for your Zerodha account',
    description: 'The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.',
    link: '#',
  },
  {
    icon: PieChart,
    name: 'Coin',
    tagline: 'Buy direct mutual funds online',
    description: 'Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the low-cost MF experience on your mobile app.',
    link: '#',
  },
  {
    icon: Wallet,
    name: 'Kite Connect',
    tagline: 'Build your own trading and investing app',
    description: 'Build trading and investment platforms with our powerful APIs. Perfect for businesses looking to build their own products.',
    link: '#',
  },
  {
    icon: BookOpen,
    name: 'Varsity',
    tagline: 'Free and open stock market education',
    description: 'An extensive and in-depth collection of stock market tutorials and content. The most popular and trusted free online learning destination.',
    link: '#',
  },
  {
    icon: LineChart,
    name: 'Streak',
    tagline: 'Algo trading and backtesting platform',
    description: 'Algo trading platform that lets you create and backtest strategies without any coding. Test your trading ideas before putting real money on the line.',
    link: '#',
  },
];

const Products = () => {
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
              The Zerodha Universe
            </h1>
            <p className="text-body">
              Not just an app, but a whole ecosystem. Our investment in 30+ fintech startups offers you a tailor-made solution to your every financial need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <a href={product.link} className="link-primary text-sm font-medium">
                  Learn more →
                </a>
              </motion.div>
            ))}
          </div>
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
              Want to know more?
            </h2>
            <p className="text-body mb-8">
              Check out our pricing or get started with a free account today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing" className="btn-secondary">
                See pricing
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up for free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
