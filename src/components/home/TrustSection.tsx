import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductOrbit } from './ProductOrbit';

export const TrustSection = () => {
  const { t } = useTranslation();

  const features = [
    { titleKey: 'trust.feature1Title', descKey: 'trust.feature1Desc' },
    { titleKey: 'trust.feature2Title', descKey: 'trust.feature2Desc' },
    { titleKey: 'trust.feature3Title', descKey: 'trust.feature3Desc' },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-sernet">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-2">{t('trust.heading')}</h2>
            <p className="text-muted-foreground text-body mb-6">{t('trust.subheading')}</p>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3 className="heading-md text-foreground mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-body">{t(feature.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-6 lg:pt-4"
           >
            <ProductOrbit />
            <Link
              to="/services"
              className="text-primary font-medium text-body hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              {t('trust.exploreProducts')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};