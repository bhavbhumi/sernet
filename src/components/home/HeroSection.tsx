import { companyHistory } from '@/lib/companyHistory';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, BadgeCheck, Clock, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroIllustration from '@/assets/hero-illustration.webp';
import heroIllustrationDark from '@/assets/hero-illustration-dark.png';

export const HeroSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 32]);

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image - shows first on mobile. No entry-fade so it's a valid LCP paint */}
          <motion.div style={{ y: reducedMotion ? 0 : parallaxY }} className="hero-motion flex justify-center lg:justify-end lg:order-2">
            <motion.img
              src={heroIllustration}
              alt="SERNET wealth management platform – online trading, mutual fund investment and insurance solutions across 54 cities"
              className="w-full max-w-[420px] lg:max-w-[500px] h-auto dark:hidden"
              width={1200}
              height={1075}
              decoding="async"
              // @ts-ignore fetchpriority not in React types yet
              fetchpriority="high"
              animate={{ y: reducedMotion ? 0 : [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src={heroIllustrationDark}
              alt="SERNET wealth management platform – online trading, mutual fund investment and insurance solutions across 54 cities"
              className="w-full max-w-[420px] lg:max-w-[500px] h-auto hidden dark:block"
              width={1536}
              height={1024}
              decoding="async"
              style={{ mixBlendMode: 'lighten' }}
              animate={{ y: reducedMotion ? 0 : [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:order-1"
          >
            <h1 className="text-[2.5rem] md:text-[3.25rem] font-light text-foreground leading-[1.15] mb-5 tracking-tight">
              {t('hero.title')}{' '}
              <span className="text-primary font-normal">{t('hero.highlight')}</span>
            </h1>
            <p className="text-body max-w-lg mb-6">
              {t('hero.description')}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/schedule-call"
                className="btn-primary px-8 py-3.5 text-base"
              >
                {t('common.bookConsultation')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/open-account"
                className="btn-secondary px-8 py-3.5 text-base"
              >
                {t('common.openAccount')}
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{t('hero.amfiRegistered', 'AMFI Registered')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.regulated', 'Regulated & Compliant')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{t('hero.years', { year: companyHistory.familyPracticeStarted.slice(0, 4), defaultValue: companyHistory.familyLegacyLabel })}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.ofPractice', 'Family practice')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{t('hero.clientRetention', '94.5% Client')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.retentionRate', 'Retention Rate')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};