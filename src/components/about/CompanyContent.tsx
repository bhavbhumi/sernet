import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Shield, Star, Award, Lightbulb, Users, Heart, Clock } from 'lucide-react';
import bhaveshVora from '@/assets/bhavesh-vora.png';

const sernetValues = [
  { letter: 'S', value: 'Security', description: 'Safeguarding your wealth with robust risk management and compliance frameworks.' },
  { letter: 'E', value: 'Integrity', description: 'Upholding the highest ethical standards in every transaction and relationship.' },
  { letter: 'R', value: 'Reliability', description: 'Delivering consistent, dependable service you can count on, every single time.' },
  { letter: 'N', value: 'Innovation', description: 'Pioneering creative futuristic solutions to stay ahead of the evolving financial landscape.' },
  { letter: 'E', value: 'Excellence', description: 'Striving for exceptional quality in every aspect of our service experience.' },
  { letter: 'T', value: 'Team Work', description: 'Collaborating as one cohesive unit to achieve shared prosperity and success.' },
];

const people = [
  { name: 'Arvind Vora', relation: 'Father', role: 'Guiding Legacy Star', icon: Star },
  { name: 'Kiran Vora', relation: 'Mother', role: 'Guiding Legacy Star', icon: Star },
  { name: 'Bhumika Vora', relation: 'Spouse', role: 'Partner in Prosperity', icon: Heart },
  { name: 'Akshat Vora', relation: 'Son', role: 'The Bright Future', icon: Lightbulb },
];

const journeyEvents = [
  { year: '1990', title: 'The Spark', description: 'Bhavesh Vora begins his career in financial services, laying the groundwork for a lifelong mission.' },
  { year: '1995', title: 'Market Immersion', description: 'Deep dive into equity and commodity markets, gaining invaluable hands-on trading and advisory experience.' },
  { year: '2000', title: 'Building Expertise', description: 'Expanded into insurance and mutual fund distribution, broadening the financial service horizon.' },
  { year: '2004', title: 'SERNET Founded', description: 'The brand SERNET is born — a fusion of SERVICE and NETWORK — with a mission to make wealth creation holistic and enjoyable.' },
  { year: '2008', title: 'Weathering the Storm', description: 'Navigated the global financial crisis with client-first principles, strengthening trust and credibility.' },
  { year: '2012', title: 'Technology Adoption', description: 'Embraced digital trading platforms and online advisory, modernising the client experience.' },
  { year: '2016', title: 'Network Expansion', description: 'Grew the partner and principal network significantly, extending reach across multiple geographies.' },
  { year: '2020', title: 'Digital Transformation', description: 'Accelerated digital-first strategy during the pandemic, ensuring uninterrupted service to all stakeholders.' },
  { year: '2024', title: '20 Years of SERNET', description: 'Celebrating two decades of empowering prosperity with a vision to be one\'s first choice for any financial decision.' },
  { year: '2025', title: 'NextGen Platform', description: 'Launching the next generation financial service network with cutting-edge technology and holistic wealth solutions.' },
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
                  SERNET was founded by Bhavesh Vora in 2004 with a mission to make wealth creation holistic and enjoyable for the world. Our{' '}
                  <span className="text-primary font-medium">Vision</span> is to be one's first choice for any financial decision and execution, and our{' '}
                  <span className="text-primary font-medium">Strategy</span> to achieve this is through creative futuristic solutions with an ethical approach and giving excellent service experience.
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
                    className="w-full h-auto object-cover max-w-[320px] md:max-w-[360px]"
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
                        href="https://www.linkedin.com/in/bhaveshvora-wealthmanagement/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                      <a
                        href="https://x.com/bhavtweetss"
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

      {/* Values — SERNET Letters */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sernetValues.map((v, index) => (
              <motion.div
                key={`${v.letter}-${v.value}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="feature-card flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">{v.letter}</span>
                </div>
                <div>
                  <h3 className="heading-md text-foreground mb-1">{v.value}</h3>
                  <p className="text-small">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* People */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            The People Behind SERNET
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {people.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <person.icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="heading-md text-foreground">{person.name}</h3>
                <p className="text-small text-primary font-medium mt-1">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey So Far */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Journey So Far
          </motion.h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-8 md:space-y-12">
              {journeyEvents.map((event, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={event.year}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                      <span className="text-primary font-bold text-lg">{event.year}</span>
                      <h3 className="heading-md text-foreground mt-1">{event.title}</h3>
                      <p className="text-small mt-1">{event.description}</p>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1/2 mt-1.5 z-10" />

                    {/* Spacer for the other side on desktop */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
