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
        No flashy gimmicks, no sales traps. Just <span className="font-semibold text-foreground">transparent, high-quality</span> financial services built for your success.
      </>
    ),
  },
  {
    title: 'Beyond Transactions, Towards Transformation',
    description: (
      <>
        Not just a platform, but a <span className="font-semibold text-foreground">financial ecosystem</span>. From equities and bullion to fixed income, we help you build wealth effortlessly.
      </>
    ),
  },
  {
    title: 'Client First Approach',
    description: (
      <>
        Every decision we make starts with <span className="font-semibold text-foreground">you</span>. Personalised guidance, dedicated support, and solutions crafted around your financial goals — because your growth is our measure of success.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left Part */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-2">Achieve and Prosper</h2>
            <p className="text-muted-foreground text-body mb-10">Your financial progress, our priority.</p>

            <div className="space-y-7">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3 className="heading-md text-foreground mb-1">{feature.title}</h3>
                  <p className="text-body">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Part */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-6 lg:pt-8"
          >
            {/* Product visual element */}
            <div className="relative w-full max-w-md">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" />

              <div className="relative rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] text-center mb-8 font-medium">Powered by</p>

                <div className="flex items-center justify-center gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-[88px] h-[88px] rounded-2xl bg-background border border-border/80 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img
                          src={product.logo}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{product.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explore link */}
            <Link
              to="/products"
              className="text-primary font-medium text-body hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              Explore our Products →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
