import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const EcosystemSection = () => {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <img
            src="https://zerodha.com/static/images/ecosystem.png"
            alt="The Zerodha Universe"
            className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/products" className="btn-primary">
            Explore our products
          </Link>
          <a href="#" className="btn-secondary">
            Try Kite demo
          </a>
        </motion.div>

        {/* Press logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <img
            src="https://zerodha.com/static/images/press-logos.png"
            alt="Featured in press"
            className="max-w-full h-auto mx-auto opacity-60"
          />
        </motion.div>
      </div>
    </section>
  );
};
