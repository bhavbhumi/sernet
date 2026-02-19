import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Clock, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroIllustration from '@/assets/hero-illustration-transparent.png';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image - shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center lg:justify-end lg:order-2"
          >
            <img
              src={heroIllustration}
              alt="Sernet wealth management - Trade, Invest and Insure with awareness"
              className="w-full max-w-[420px] lg:max-w-[500px] h-auto mix-blend-multiply dark:mix-blend-screen dark:brightness-[1.8] dark:contrast-[0.9]"
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
            <p className="text-body max-w-lg mb-8">
              {t('hero.description')}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
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
                  <p className="text-sm font-medium text-foreground leading-tight">{t('hero.years', '35+ Years')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.ofPractice', 'of Practice')}</p>
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