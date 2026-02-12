import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import tickfundsLogo from '@/assets/tickfunds-logo.png';
import tushilLogo from '@/assets/tushil-logo.png';
import choicefinxLogo from '@/assets/choicefinx-logo.jpeg';

const features = [
  {
    title: 'Trust and Confidence',
    description: (
      <>
        Thousands trust us for <span className="font-semibold text-foreground">easy, convenient & efficient</span> Investments, Insurance and Trading platforms.
      </>
    ),
  },
  {
    title: 'Clarity Over Chaos',
    description: (
      <>
        No flashy gimmicks, no sales traps. Just <span className="font-semibold text-foreground">transparent, high-quality</span> financial services built for <span className="text-primary font-medium">your success</span>.
      </>
    ),
  },
  {
    title: 'Beyond Transactions, Towards Transformation',
    description: (
      <>
        Not just a platform, but a <span className="font-semibold text-foreground">financial ecosystem</span>. From equities and bullion to fixed income, we help you <span className="text-primary font-medium">build wealth effortlessly</span>.
      </>
    ),
  },
  {
    title: 'Client First Approach',
    description: (
      <>
        Every decision we make starts with <span className="font-semibold text-foreground">you</span>. Personalised guidance, dedicated support, and solutions crafted around <span className="text-primary font-medium">your financial goals</span> — because your growth is our measure of success.
      </>
    ),
  },
];

const products = [
  { name: 'Tick Funds', logo: tickfundsLogo },
  { name: 'Tushil', logo: tushilLogo },
  { name: 'Choice FinX', logo: choicefinxLogo },
];

export const TrustSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Part */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-1">Achieve and Prosper</h2>
            <p className="text-muted-foreground text-lg mb-8">Your financial progress, our priority.</p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Part */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-between gap-8"
          >
            {/* Product logos */}
            <div className="w-full bg-muted/40 border border-border rounded-2xl p-8">
              <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-6 font-medium">Our Products</p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {products.map((product) => (
                  <div key={product.name} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-xl bg-background border border-border flex items-center justify-center p-2 shadow-sm">
                      <img
                        src={product.logo}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{product.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore link */}
            <Link
              to="/products"
              className="text-primary font-medium text-sm hover:underline underline-offset-4 transition-colors"
            >
              Explore our Products →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
