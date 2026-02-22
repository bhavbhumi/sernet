import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PageHeroProps {
  title: string;
  highlight?: string;
  description: string;
  breadcrumbLabel?: string;
}

const routeLabels: Record<string, string> = {
  '/services': 'Services',
  '/insights': 'Insights',
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
  const { t } = useTranslation();
  const label = breadcrumbLabel || routeLabels[pathname] || pathname.replace('/', '').replace(/-/g, ' ');

  return (
    <section className="relative py-8 md:py-10 bg-section-alt overflow-hidden">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large diamond — top right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
          animate={{ opacity: 1, scale: 1, rotate: 45 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-12 -right-12 w-48 h-48 md:w-64 md:h-64 border border-primary/[0.07] rounded-lg"
        />
        {/* Small circle — mid right */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-1/2 right-[15%] w-5 h-5 rounded-full bg-primary/[0.06]"
        />
        {/* Dotted grid cluster — bottom right */}
        <div className="absolute bottom-4 right-[8%] grid grid-cols-4 gap-2 opacity-[0.05]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />
          ))}
        </div>
        {/* Angled line — left side */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-8 -left-4 w-32 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent origin-left"
        />
      </div>

      <div className="container-zerodha relative z-10">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground transition-colors">{t('breadcrumb.home', 'Home')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium capitalize">{label}</span>
        </motion.nav>

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