import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="bg-hero py-12 md:py-20">
      <div className="container-zerodha">
        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <img
            src="https://zerodha.com/static/images/landing.svg"
            alt="Zerodha Trading Platform"
            className="max-w-full h-auto"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="heading-xl text-foreground mb-4">
            Invest in everything
          </h1>
          <p className="text-body mb-8">
            Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
          </p>
          <Link to="/signup" className="btn-primary text-base px-8 py-4">
            Sign up for free
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
