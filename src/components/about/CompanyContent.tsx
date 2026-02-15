import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Lightbulb, Shield, Compass, Linkedin, Twitter } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
              className="flex justify-center"
            >
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Decorative background glow */}
                <motion.div
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-xl"
                  animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <motion.img
                    src={bhaveshVora}
                    alt="Bhavesh Vora - Founder, SERNET"
                    className="max-w-[280px] w-full h-auto object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Hover overlay with name & social links */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 py-5 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white text-lg font-semibold">Bhavesh Vora</h3>
                    <p className="text-white/70 text-sm mb-3">Founder & Promoter</p>
                    <div className="flex gap-3">
                      <a
                        href="https://www.linkedin.com/in/bhaveshvora"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                      <a
                        href="https://x.com/bhaveshvora"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </motion.div>
                </div>
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
