import { motion } from 'framer-motion';
import ctaGradientBar from '@/assets/cta-gradient-bar.png.asset.json';

const sweepStyle = {
  backgroundImage: `url(${ctaGradientBar.url})`,
  backgroundSize: '200% 100%',
  backgroundRepeat: 'repeat-x',
} as const;

const sweepTransition = { repeat: Infinity, duration: 5, ease: 'easeInOut' } as const;
const sweepAnimate = { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] };

/** Animated gradient ring that draws attention to a primary action. */
export const GradientRing = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.span
    className={`inline-block rounded-md p-[2px] ${className}`}
    style={sweepStyle}
    animate={sweepAnimate}
    transition={sweepTransition}
  >
    {children}
  </motion.span>
);

/** Small animated gradient underline for headings. */
export const GradientBar = ({ className = '' }: { className?: string }) => (
  <motion.div
    aria-hidden="true"
    className={`rounded-full ${className}`}
    style={sweepStyle}
    animate={sweepAnimate}
    transition={sweepTransition}
  />
);
