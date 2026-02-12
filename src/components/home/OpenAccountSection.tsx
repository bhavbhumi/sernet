import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const OpenAccountSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="heading-lg text-foreground mb-4">Open a SERNET Account</h2>
          <p className="text-body mb-8">
            Modern and Simple Tools to Invest, Insure and Trade
          </p>
          <Link to="/signup" className="btn-primary text-base px-8 py-4">
            Signup for FREE
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
