import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Heart, Users, Leaf, GraduationCap } from 'lucide-react';

const initiatives = [
  {
    icon: Leaf,
    title: 'Climate Action',
    description: 'Through Rainmatter Foundation, we invest in climate-tech startups and grassroots organizations working on environmental conservation.',
    impact: '₹750 Cr committed',
  },
  {
    icon: GraduationCap,
    title: 'Financial Literacy',
    description: 'Varsity provides free, open-source stock market education to millions of learners across India.',
    impact: '10M+ learners',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'We support various NGOs and community organizations working on education, healthcare, and livelihoods.',
    impact: '50+ organizations',
  },
  {
    icon: Heart,
    title: 'Employee Volunteering',
    description: 'Our employees actively participate in volunteering programs and community service activities.',
    impact: '1000+ volunteer hours',
  },
];

const CSR = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Zerodha Cares
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to creating positive social and environmental impact 
              through responsible corporate citizenship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-muted/50 rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <initiative.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{initiative.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{initiative.description}</p>
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-sm font-medium text-primary">{initiative.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 text-center"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Rainmatter Foundation</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our non-profit foundation focuses on climate action, supporting startups and 
              organizations working on sustainable solutions for a better future.
            </p>
            <a
              href="https://rainmatter.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Learn more at rainmatter.org →
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CSR;
