import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

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

/* ---------- route-specific geometric patterns ---------- */
type PatternKey = 'default' | 'services' | 'insights' | 'about' | 'network' | 'pricing' | 'opinions' | 'updates' | 'calculators' | 'calendars' | 'downloads' | 'contact' | 'reviews';

const resolvePattern = (pathname: string): PatternKey => {
  const base = '/' + pathname.split('/').filter(Boolean)[0];
  const map: Record<string, PatternKey> = {
    '/services': 'services',
    '/insights': 'insights',
    '/about': 'about',
    '/network': 'network',
    '/pricing': 'pricing',
    '/opinions': 'opinions',
    '/updates': 'updates',
    '/calculators': 'calculators',
    '/calendars': 'calendars',
    '/downloads': 'downloads',
    '/contact': 'contact',
    '/reviews': 'reviews',
  };
  return map[base] || 'default';
};

const GeometricPattern = ({ pattern }: { pattern: PatternKey }) => {
  switch (pattern) {
    case 'services':
      return (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="absolute bottom-0 right-[8%] flex items-end gap-3">
            {[28, 48, 68, 88].map((h, i) => (
              <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="w-4 rounded-t-sm bg-primary/25 origin-bottom" style={{ height: h }} />
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-4 right-[18%] w-28 h-28 border-2 border-dashed border-primary/20 rounded-full" />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-1/2 -left-2 w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left" />
        </>
      );

    case 'insights':
      return (
        <>
          {[96, 64, 36].map((size, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="absolute rounded-full border-2 border-primary/20"
              style={{ width: size, height: size, top: '15%', right: '10%', transform: 'translate(50%, -50%)' }} />
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="absolute bottom-4 right-[5%] w-4 h-4 rounded-full bg-primary/25" />
          <motion.div initial={{ width: 0 }} animate={{ width: 56 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-8 left-[4%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
        </>
      );

    case 'about':
      return (
        <>
          <motion.div initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 30 }} transition={{ duration: 1 }}
            className="absolute -top-6 -right-6 w-52 h-52 border-2 border-primary/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="absolute bottom-6 right-[16%] w-10 h-10 border-2 border-primary/15" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          <div className="absolute bottom-3 left-[4%] grid grid-cols-3 gap-2 opacity-[0.2]">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-foreground" />)}
          </div>
        </>
      );

    case 'network':
      return (
        <>
          <svg className="absolute top-2 right-[6%] w-48 h-36 opacity-[0.25]" viewBox="0 0 160 128">
            <circle cx="30" cy="20" r="5" className="fill-primary" />
            <circle cx="130" cy="30" r="6" className="fill-primary" />
            <circle cx="80" cy="100" r="5" className="fill-primary" />
            <circle cx="50" cy="60" r="4" className="fill-primary" />
            <circle cx="120" cy="90" r="4" className="fill-primary" />
            <line x1="30" y1="20" x2="130" y2="30" className="stroke-primary" strokeWidth="1.2" />
            <line x1="30" y1="20" x2="80" y2="100" className="stroke-primary" strokeWidth="1.2" />
            <line x1="130" y1="30" x2="120" y2="90" className="stroke-primary" strokeWidth="1.2" />
            <line x1="50" y1="60" x2="80" y2="100" className="stroke-primary" strokeWidth="1.2" />
            <line x1="50" y1="60" x2="130" y2="30" className="stroke-primary" strokeWidth="1.2" />
          </svg>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="absolute bottom-4 left-[5%] w-5 h-5 rounded-full border-2 border-primary/20" />
        </>
      );

    case 'pricing':
      return (
        <>
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="absolute border-2 border-primary/20 rounded-md"
              style={{ width: 96 - i * 16, height: 56 - i * 10, top: `${18 + i * 18}%`, right: `${6 + i * 3}%` }} />
          ))}
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute left-[3%] top-4 w-0.5 h-20 bg-gradient-to-b from-primary/30 to-transparent origin-top" />
        </>
      );

    case 'calculators':
      return (
        <>
          <div className="absolute top-3 right-[5%] grid grid-cols-5 gap-3 opacity-[0.2]">
            {Array.from({ length: 25 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="absolute bottom-4 right-[14%] w-16 h-16 border-2 border-primary/20 rounded-lg rotate-12" />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7 }}
            className="absolute top-1/2 -left-2 w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left" />
        </>
      );

    case 'calendars':
      return (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
            className="absolute -top-4 -right-4 w-48 h-48 rounded-full border-2 border-primary/15" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="absolute top-[28%] right-[13%] w-0.5 h-12 bg-primary/25 origin-top" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="absolute top-[28%] right-[13%] w-8 h-0.5 bg-primary/25 origin-left" />
          <div className="absolute bottom-3 left-[4%] flex gap-4 opacity-[0.2]">
            {[14, 24, 18, 28].map((h, i) => <div key={i} className="w-1.5 rounded-sm bg-foreground" style={{ height: h }} />)}
          </div>
        </>
      );

    case 'opinions':
      return (
        <>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="absolute top-3 right-[8%] w-32 h-20 border-2 border-primary/20 rounded-xl rounded-bl-sm" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-6 right-[18%] w-24 h-14 border-2 border-primary/15 rounded-xl rounded-br-sm" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="absolute top-1/2 left-[3%] w-4 h-4 rounded-full bg-primary/25" />
        </>
      );

    case 'updates':
      return (
        <>
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0.3, scale: 0.6 }} animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity }}
              className="absolute top-[22%] right-[10%] w-20 h-20 rounded-full border-2 border-primary/25" />
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="absolute top-[22%] right-[10%] w-4 h-4 rounded-full bg-primary/30" style={{ transform: 'translate(8px, 8px)' }} />
        </>
      );

    case 'downloads':
      return (
        <>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="absolute top-4 right-[8%] flex flex-col items-center gap-1 opacity-[0.25]">
            <div className="w-0.5 h-12 bg-foreground" />
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-foreground" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="absolute bottom-3 right-[16%] w-20 h-12 border-2 border-dashed border-primary/15 rounded-md" />
          <div className="absolute bottom-4 left-[4%] grid grid-cols-3 gap-2 opacity-[0.15]">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-foreground" />)}
          </div>
        </>
      );

    case 'contact':
      return (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="absolute top-3 right-[6%] w-36 h-24 border-2 border-primary/20 rounded-md overflow-hidden">
            <div className="absolute inset-0 border-t-[48px] border-t-transparent border-l-[72px] border-l-primary/15 border-r-[72px] border-r-primary/15" />
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-6 left-[4%] w-24 h-0.5 bg-gradient-to-r from-primary/30 to-transparent origin-left" />
        </>
      );

    case 'reviews':
      return (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -15 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8 }}
            className="absolute top-3 right-[8%] text-primary/25">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="absolute bottom-4 right-[18%] text-primary/15">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </motion.div>
          <div className="absolute bottom-3 left-[4%] flex gap-1.5 opacity-[0.2]">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-foreground" />)}
          </div>
        </>
      );

    default:
      return (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 45 }} animate={{ opacity: 1, scale: 1, rotate: 45 }} transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -top-10 -right-10 w-56 h-56 md:w-72 md:h-72 border-2 border-primary/20 rounded-lg" />
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-1/2 right-[14%] w-6 h-6 rounded-full bg-primary/25" />
          <div className="absolute bottom-3 right-[7%] grid grid-cols-4 gap-2 opacity-[0.2]">
            {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-foreground" />)}
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-6 -left-4 w-36 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left" />
        </>
      );
  }
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
  const pattern = useMemo(() => resolvePattern(pathname), [pathname]);

  return (
    <section className="relative py-8 md:py-10 bg-section-alt overflow-hidden">
      {/* Route-specific geometric pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <GeometricPattern pattern={pattern} />
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