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
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                {/* Decorative rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-3 rounded-full border border-dashed border-primary/15"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full bg-primary/5"
                />
                {/* Decorative dots */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <motion.div
                    key={deg}
                    className="absolute w-2 h-2 rounded-full bg-primary/30"
                    style={{
                      top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
                      left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: deg / 360 }}
                  />
                ))}
                <img
                  src={customImage}
                  alt={customImageAlt || 'Logo'}
                  className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10"
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
