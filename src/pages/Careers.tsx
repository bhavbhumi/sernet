import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const openings = [
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Bangalore',
    type: 'Full-time',
  },
  {
    title: 'Customer Support Executive',
    department: 'Operations',
    location: 'Bangalore',
    type: 'Full-time',
  },
  {
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Bangalore',
    type: 'Full-time',
  },
  {
    title: 'Content Writer',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
];

const benefits = [
  'Competitive salary packages',
  'Health insurance for you and family',
  'Flexible work hours',
  'Learning and development budget',
  'Employee stock options',
  'Work from home flexibility',
];

const Careers = () => {
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
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Careers at Zerodha
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us in our mission to make financial services accessible to millions of Indians. 
              We're always looking for talented individuals to join our team.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 mb-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Why work with us?</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{job.department}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    Apply <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Don't see a position that fits? Send us your resume anyway.
            </p>
            <Button>Send Resume</Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
