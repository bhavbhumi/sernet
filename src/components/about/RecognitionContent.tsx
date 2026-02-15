import { motion } from 'framer-motion';
import { Award, Trophy, Star, Medal } from 'lucide-react';

const recognitions = [
  { icon: Trophy, title: "Best Investment Advisory Firm", year: "2024", organization: "Financial Excellence Awards" },
  { icon: Award, title: "Most Trusted Financial Partner", year: "2023", organization: "India Finance Forum" },
  { icon: Star, title: "Excellence in Customer Service", year: "2023", organization: "BFSI Awards" },
  { icon: Medal, title: "Best Wealth Management Services", year: "2022", organization: "Economic Times" },
];

export const RecognitionContent = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <p className="text-body mb-8 max-w-2xl">
          Over the years, SERNET has been recognized for its commitment to excellence, 
          innovation, and customer-centric approach in financial services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recognitions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.year} • {item.organization}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
