import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import pricingZero from '@/assets/pricing-zero-sernet.png';

export const PricingSection = () => {
  const { t } = useTranslation();

  const pricingItems = [
    {
      highlight: '₹0',
      titleKey: 'pricing.trading',
      featureKeys: ['pricing.accountOpening', 'pricing.amc', 'pricing.autoSquareOff', 'pricing.callAndTrade'],
    },
    {
      highlight: '₹0',
      titleKey: 'pricing.investment',
      featureKeys: ['pricing.multipleProfiles', 'pricing.portfolioCheckup', 'pricing.premiumReports', 'pricing.assistedExecution'],
    },
    {
      highlight: '₹0',
      titleKey: 'pricing.insurance',
      featureKeys: ['pricing.familyLogin', 'pricing.policyReview', 'pricing.premiumReports', 'pricing.assistedExecution'],
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-foreground mb-4">{t('pricing.heading')}</h2>
          <p className="text-body max-w-2xl mx-auto">{t('pricing.description')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingItems.map((item, index) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-lg border border-border"
            >
              <img src={pricingZero} alt="₹0" className="w-28 h-auto mx-auto mb-2" />
              <h3 className="heading-md text-foreground mb-6">{t(item.titleKey)}</h3>
              <ul className="space-y-3 text-center">
                {item.featureKeys.map((key) => (
                  <li key={key} className="text-body">{t(key)}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/pricing" className="link-primary font-medium">
            {t('pricing.seePricing')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};