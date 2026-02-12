import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import productShowcase from '@/assets/product-showcase.png';

const features = [
  {
    title: 'Trust and Confidence',
    description: (
      <>
        Thousands trust us for <span className="font-semibold text-foreground">easy, convenient & efficient</span> Investments, Insurance and Trading platforms crafted around your financial goals — because your growth is our measure of success.
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
];

export const TrustSection = () => {
  return (
    <section className="section-padding" style={{ background: 'var(--gradient-section-warm)' }}>
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
            className="flex flex-col items-center gap-6 lg:pt-4"
           >
            <img
              src={productShowcase}
              alt="Sernet product ecosystem — Tick Funds, Tushil, ChoiceFinX, Findemy"
              className="w-full max-w-lg h-auto mix-blend-multiply"
            />
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
