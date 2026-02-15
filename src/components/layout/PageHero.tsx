import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  highlight?: string;
  description: string;
  icon: LucideIcon;
  ctaText?: string;
  ctaLink?: string;
  customImage?: string;
  customImageAlt?: string;
}

export const PageHero = ({
  title,
  highlight,
  description,
  icon: Icon,
  ctaText = 'Schedule a Call',
  ctaLink = '/schedule-call',
  customImage,
  customImageAlt,
}: PageHeroProps) => {
  return (
    <section className="section-padding" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Icon / Custom Image — shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center lg:justify-end lg:order-2"
          >
            {customImage ? (
              <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
                {/* Background decorative blobs */}
                <motion.div
                  className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full bg-primary/8 blur-2xl"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-sernet-yellow/10 blur-xl translate-x-6 -translate-y-4"
                  animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                {/* Floating particles */}
                {[
                  { x: -60, y: -50, size: 3, delay: 0 },
                  { x: 70, y: -30, size: 2, delay: 0.5 },
                  { x: -40, y: 60, size: 2.5, delay: 1 },
                  { x: 50, y: 50, size: 2, delay: 1.5 },
                  { x: -70, y: 10, size: 3, delay: 2 },
                  { x: 80, y: -60, size: 2, delay: 0.8 },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary/25"
                    style={{ width: p.size * 4, height: p.size * 4, left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)` }}
                    animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                  />
                ))}
                {/* Logo — free, no enclosing shape */}
                <img
                  src={customImage}
                  alt={customImageAlt || 'Logo'}
                  className="w-32 h-32 md:w-44 md:h-44 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-20 h-20 md:w-28 md:h-28 text-primary" strokeWidth={1.2} />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:order-1"
          >
            <h1 className="text-[2.25rem] md:text-[2.75rem] font-light text-foreground leading-[1.15] mb-4 tracking-tight">
              {title}
              {highlight && (
                <>
                  {' '}
                  <span className="text-primary font-normal">{highlight}</span>
                </>
              )}
            </h1>
            <p className="text-body max-w-lg mb-8">{description}</p>

            <Link
              to={ctaLink}
              className="btn-primary px-8 py-3.5 text-base inline-flex items-center"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
