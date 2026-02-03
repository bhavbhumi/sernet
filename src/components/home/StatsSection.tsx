import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, MapPin, Globe } from 'lucide-react';

const stats = [
  {
    number: '35',
    label: 'Years of Practice',
    icon: Calendar,
  },
  {
    number: '1500+',
    label: 'Families being Served',
    icon: Users,
  },
  {
    number: '94.5%',
    label: 'Client Retention Rate',
    icon: TrendingUp,
  },
  {
    number: '54',
    label: 'Cities Domestic Reach',
    icon: MapPin,
  },
  {
    number: '18',
    label: 'Countries International Reach',
    icon: Globe,
  },
];

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
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <div className="text-[2rem] md:text-[2.5rem] font-light text-foreground leading-tight">
                  {stat.number}
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
