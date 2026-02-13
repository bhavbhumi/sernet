import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, Building2 } from 'lucide-react';

const teamMembers = [
  {
    name: 'Nithin Kamath',
    role: 'Founder, CEO',
    description: 'Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader.',
  },
  {
    name: 'Nikhil Kamath',
    role: 'Co-founder',
    description: 'Nikhil is an astute investor who started trading at 17, and along with his brother Nithin, co-founded Zerodha.',
  },
];

const values = [
  {
    icon: Users,
    title: 'Customer-first',
    description: 'We put our customers at the heart of everything we do.',
  },
  {
    icon: Target,
    title: 'Transparency',
    description: 'We believe in being open and honest with our customers.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in all our products and services.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We conduct our business with the highest ethical standards.',
  },
];

const About = () => {
  return (
    <Layout>
      <PageHero
        title="We pioneered the discount broking model in"
        highlight="India"
        description="Now, we are breaking ground with our technology. Discover our story, values, and the people behind our mission."
        icon={Building2}
      />

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
                  Zerodha was founded by Nithin Kamath in 2010 with the aim to break all barriers that traders and investors face in India in terms of cost, support, and technology.
                </p>
                <p>
                  We named the company Zerodha, a combination of Zero and "Rodha", the Sanskrit word for barrier.
                </p>
                <p>
                  Today, our disruptive pricing models and in-house technology have made us the biggest stock broker in India.
                </p>
                <p>
                  Over 1.6+ crore customers place millions of orders every day through our powerful ecosystem of investment platforms, contributing to over 15% of all Indian retail trading volumes.
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
              <img
                src="https://zerodha.com/static/images/founder.jpg"
                alt="Zerodha Founders"
                className="rounded-lg shadow-lg max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
                }}
              />
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

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            People
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-card"
              >
                <h3 className="heading-md text-foreground mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-body text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
