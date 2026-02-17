import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const pressLogos = [
  { name: 'Economic Times', width: 140 },
  { name: 'Mint', width: 80 },
  { name: 'CNBC TV18', width: 120 },
  { name: 'Business Standard', width: 150 },
  { name: 'Forbes India', width: 120 },
  { name: 'Money Control', width: 140 },
  { name: 'The Times of India', width: 150 },
  { name: 'NDTV Profit', width: 120 },
];

export const EcosystemSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        {/* Press logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-12">
            {pressLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300"
              >
                <span
                  className="text-base md:text-lg font-semibold tracking-tight whitespace-nowrap select-none"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/media"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4 transition-all"
            >
              {t('ecosystem.featuredIn')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
