import { motion } from 'framer-motion';
import { Users, ShieldCheck, Layers, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Customer-first always',
    description: "That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments, making us India's largest broker; contributing to 15% of daily retail exchange volumes in India.",
  },
  {
    icon: ShieldCheck,
    title: 'No spam or gimmicks',
    description: 'No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like.',
  },
  {
    icon: Layers,
    title: 'The Zerodha universe',
    description: 'Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.',
  },
  {
    icon: TrendingUp,
    title: 'Do better with money',
    description: "With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.",
  },
];

export const TrustSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="heading-lg text-foreground mb-2">Trust with confidence</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="heading-md text-foreground mb-2">{feature.title}</h3>
                <p className="text-body">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
