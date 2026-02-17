import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface PageHeroProps {
  title: string;
  highlight?: string;
  description: string;
  icon?: any; // kept for backward compat, no longer rendered
  ctaText?: string;
  ctaLink?: string;
  customImage?: string;
  customImageAlt?: string;
  breadcrumbLabel?: string;
}

const routeLabels: Record<string, string> = {
  '/services': 'Services',
  '/z-connect': 'Insights',
  '/about': 'About',
  '/network': 'Network',
  '/pricing': 'Pricing',
  '/opinions': 'Opinions',
  '/updates': 'Updates',
  '/calculators': 'Calculators',
  '/calendars': 'Calendars',
  '/downloads': 'Downloads',
};

export const PageHero = ({
  title,
  highlight,
  description,
  breadcrumbLabel,
}: PageHeroProps) => {
  const { pathname } = useLocation();
  const label = breadcrumbLabel || routeLabels[pathname] || pathname.replace('/', '').replace(/-/g, ' ');

  return (
    <section className="py-12 md:py-16" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container-zerodha">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium capitalize">{label}</span>
        </motion.nav>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl"
        >
          <h1 className="text-[2.25rem] md:text-[2.75rem] font-light text-foreground leading-[1.15] mb-3 tracking-tight">
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-primary font-normal">{highlight}</span>
              </>
            )}
          </h1>
          <p className="text-body">{description}</p>
        </motion.div>
      </div>
    </section>
  );
};
