import { motion } from 'framer-motion';

export const EcosystemSection = () => {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        {/* Press logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
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
