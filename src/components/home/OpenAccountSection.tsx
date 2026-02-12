import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, PartyPopper } from 'lucide-react';

const FloatingShape = ({ className, delay = 0, duration = 3, children }: { className?: string; delay?: number; duration?: number; children: React.ReactNode }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    animate={{
      y: [0, -12, 0],
      rotate: [0, 8, -8, 0],
    }}
    transition={{
      y: { repeat: Infinity, duration, ease: 'easeInOut', delay },
      rotate: { repeat: Infinity, duration: duration * 1.5, ease: 'easeInOut', delay },
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay },
    }}
  >
    {children}
  </motion.div>
);

const Confetti = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 0.7, scale: 1 }}
    viewport={{ once: true }}
    animate={{
      y: [0, -8, 0],
      x: [0, 4, -4, 0],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      repeat: Infinity,
      duration: 2.5,
      ease: 'easeInOut',
      delay,
    }}
  />
);

export const OpenAccountSection = () => {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'var(--gradient-cta)' }}>
      {/* Floating celebration elements */}
      <FloatingShape className="absolute top-8 left-[10%] text-primary/30" delay={0} duration={3.5}>
        <Sparkles className="w-6 h-6" />
      </FloatingShape>
      <FloatingShape className="absolute top-12 right-[12%] text-sernet-yellow/40" delay={0.5} duration={3}>
        <Star className="w-5 h-5 fill-current" />
      </FloatingShape>
      <FloatingShape className="absolute bottom-10 left-[15%] text-success/30" delay={1} duration={4}>
        <PartyPopper className="w-5 h-5" />
      </FloatingShape>
      <FloatingShape className="absolute bottom-8 right-[10%] text-destructive/25" delay={0.3} duration={3.2}>
        <Star className="w-4 h-4 fill-current" />
      </FloatingShape>
      <FloatingShape className="absolute top-1/2 left-[5%] text-destructive/20" delay={0.8} duration={3.8}>
        <Sparkles className="w-4 h-4" />
      </FloatingShape>
      <FloatingShape className="absolute top-1/3 right-[6%] text-success/25" delay={1.2} duration={2.8}>
        <Sparkles className="w-5 h-5" />
      </FloatingShape>

      {/* Confetti dots */}
      <Confetti className="bg-primary/40 top-16 left-[25%]" delay={0.2} />
      <Confetti className="bg-sernet-yellow/50 top-10 right-[20%]" delay={0.6} />
      <Confetti className="bg-success/40 bottom-14 left-[30%]" delay={1.1} />
      <Confetti className="bg-destructive/35 bottom-12 right-[25%]" delay={0.4} />
      <Confetti className="bg-destructive/30 top-1/2 left-[8%]" delay={0.9} />
      <Confetti className="bg-success/35 top-1/3 right-[30%]" delay={1.4} />
      <Confetti className="bg-success/30 top-20 left-[40%]" delay={0.7} />
      <Confetti className="bg-destructive/25 bottom-16 right-[35%]" delay={1.0} />

      <div className="container-zerodha relative z-10">
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
