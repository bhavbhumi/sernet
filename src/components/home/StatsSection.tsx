import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Calendar, TrendingUp, MapPin, Globe, Award } from 'lucide-react';
import { useEffect, useRef } from 'react';

const stats = [
  {
    number: 35,
    suffix: '',
    label: 'Years of Practice',
    icon: Calendar,
  },
  {
    number: 94.5,
    suffix: '%',
    label: 'Client Retention Rate',
    icon: TrendingUp,
  },
  {
    number: 500,
    suffix: '+',
    label: 'Products & Solutions',
    icon: Award,
  },
  {
    number: 54,
    suffix: '',
    label: 'Cities Domestic Reach',
    icon: MapPin,
  },
  {
    number: 18,
    suffix: '',
    label: 'Countries International Reach',
    icon: Globe,
  },
];

const AnimatedCounter = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2, ease: 'easeOut' });
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export const StatsSection = () => {
  return (
    <section className="py-16 bg-section-alt">
      <div className="container-zerodha">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <div className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight">
                  <AnimatedCounter
                    value={stat.number}
                    suffix={stat.suffix}
                    decimals={stat.number % 1 !== 0 ? 1 : 0}
                  />
                </div>
                <div className="text-[0.875rem] text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
