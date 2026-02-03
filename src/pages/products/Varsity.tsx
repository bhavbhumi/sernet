import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Smartphone, GraduationCap, Award } from 'lucide-react';

const modules = [
  { title: 'Introduction to Stock Markets', chapters: 16 },
  { title: 'Technical Analysis', chapters: 22 },
  { title: 'Fundamental Analysis', chapters: 16 },
  { title: 'Futures Trading', chapters: 13 },
  { title: 'Options Theory', chapters: 25 },
  { title: 'Option Strategies', chapters: 14 },
  { title: 'Markets and Taxation', chapters: 8 },
  { title: 'Currency and Commodity Markets', chapters: 19 },
  { title: 'Risk Management', chapters: 16 },
  { title: 'Trading Systems', chapters: 16 },
  { title: 'Personal Finance', chapters: 28 },
];

const Varsity = () => {
  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Varsity
            </h1>
            <p className="text-lg text-muted-foreground">
              The largest online stock market education book in the world covering 
              everything from the basics to advanced trading.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <a href="https://zerodha.com/varsity" target="_blank" rel="noopener noreferrer">
                  Start Learning <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 bg-muted/50 rounded-lg"
            >
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">11+</h3>
              <p className="text-muted-foreground">Modules</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 bg-muted/50 rounded-lg"
            >
              <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">200+</h3>
              <p className="text-muted-foreground">Chapters</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 bg-muted/50 rounded-lg"
            >
              <Award className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground">Forever</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Course Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module, index) => (
                <div
                  key={module.title}
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{module.title}</span>
                    <span className="text-xs text-muted-foreground">{module.chapters} chapters</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Download Varsity App</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Android App
              </Button>
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                iOS App
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Varsity;
