import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroIllustration from '@/assets/hero-illustration.webp';

export const HeroSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha text-center">
        {/* Hero Image - centered, large */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8 md:mb-12"
        >
          <img
            src={heroIllustration}
            alt="Sernet wealth management - Trade, Invest and Insure with awareness"
            className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-[2.75rem] md:text-[3rem] font-normal text-foreground leading-tight mb-5">
            Unlock your path to Prosperity
          </h1>
          <p className="text-[1.125rem] md:text-[1.25rem] font-normal text-muted-foreground leading-relaxed mb-8">
            Grow, Preserve, Protect and Manage your Wealth. Trade, Invest and Insure with Awareness through Simple and Friendly Online Platforms from Anywhere.
          </p>
          <Link 
            to="/schedule-call" 
            className="inline-block bg-primary text-primary-foreground text-[1rem] font-medium px-10 py-3.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            Schedule a Call
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
