import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, Key, Lightbulb, Shield, Compass } from 'lucide-react';
import bhaveshVora from '@/assets/bhavesh-vora.png';

const values = [
  {
    icon: Key,
    title: 'Luck',
    description: 'Fortune favours those who take the first step towards financial freedom.',
  },
  {
    icon: Lightbulb,
    title: 'Wisdom',
    description: 'Informed decisions driven by knowledge and deep market understanding.',
  },
  {
    icon: Shield,
    title: 'Courage',
    description: 'Bold conviction to stay the course and seize opportunities.',
  },
  {
    icon: Compass,
    title: 'Control',
    description: 'Discipline and strategy to master your financial journey.',
  },
];

export const CompanyContent = () => {
  return (
    <>
      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-body">
                <p>
                  SERNET was founded by Bhavesh Vora in 2004 with a mission to make wealth creation holistic and enjoyable for the world.
                </p>
                <p>
                  Our <span className="text-primary font-medium">Vision</span> is to be one's first choice for any financial decision and execution.
                </p>
                <p>
                  And our strategy to achieve is through creative futuristic solutions with an ethical approach and giving excellent service experience.
                </p>
                <p>
                  We named our brand <span className="text-primary font-medium">SERNET</span>, as a fusion of "<strong>SER</strong>VICE" and "<strong>NET</strong>WORK", two most basic ingredients for Prosperity. Our logo reveals four keys of <em>Luck, Wisdom, Courage</em> and <em>Control</em> to achieve required financial success.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="text-center">
                <img
                  src={bhaveshVora}
                  alt="Bhavesh Vora - Founder, SERNET"
                  className="rounded-2xl shadow-lg max-w-[320px] w-full h-auto mx-auto"
                />
                <h3 className="heading-md text-foreground mt-5 mb-1">Bhavesh Vora</h3>
                <p className="text-primary text-sm font-medium">Founder & Promoter</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-md text-foreground mb-2">{value.title}</h3>
                <p className="text-small">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
};
