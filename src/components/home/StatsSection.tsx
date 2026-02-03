import { motion } from 'framer-motion';

const stats = [
  {
    number: '1.6+ Cr',
    label: 'Active clients',
    color: 'bg-stat-blue',
  },
  {
    number: '₹6+ L Cr',
    label: 'Equity investments',
    color: 'bg-stat-green',
  },
  {
    number: '15%',
    label: 'Daily retail volumes',
    color: 'bg-stat-orange',
  },
  {
    number: '30+',
    label: 'Fintech startups',
    color: 'bg-stat-purple',
  },
];

export const StatsSection = () => {
  return (
    <section className="py-12 bg-section-alt">
      <div className="container-zerodha">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-full ${stat.color} mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-xl font-bold text-primary-foreground">
                  {stat.number.charAt(0)}
                </span>
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
