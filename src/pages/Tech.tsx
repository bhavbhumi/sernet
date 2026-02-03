import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Code, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    name: 'Kite Connect',
    description: 'Official trading APIs for building trading platforms and automating trades.',
    language: 'Multiple',
    stars: '2.1k',
  },
  {
    name: 'GoKite',
    description: 'Official Go client for Kite Connect trading APIs.',
    language: 'Go',
    stars: '890',
  },
  {
    name: 'PyKiteConnect',
    description: 'Official Python client for Kite Connect trading APIs.',
    language: 'Python',
    stars: '1.5k',
  },
  {
    name: 'Kite Publisher',
    description: 'Publisher client for registering instruments on the Kite platform.',
    language: 'JavaScript',
    stars: '340',
  },
];

const blogPosts = [
  {
    title: 'How we built our in-house messaging system',
    date: 'Jan 2024',
  },
  {
    title: 'Scaling PostgreSQL for high-frequency trading',
    date: 'Dec 2023',
  },
  {
    title: 'Our journey with Elixir in production',
    date: 'Nov 2023',
  },
  {
    title: 'Building resilient distributed systems',
    date: 'Oct 2023',
  },
];

const Tech = () => {
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
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Zerodha.tech
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our technology blog and open source projects. We believe in giving back 
              to the developer community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Open Source Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="bg-muted/50 rounded-lg p-6 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Github className="h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <span className="text-xs text-primary">{project.language}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" asChild>
                <a href="https://github.com/zerodha" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View all on GitHub
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Tech Blog</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {blogPosts.map((post) => (
                <a
                  key={post.title}
                  href="#"
                  className="bg-muted/50 rounded-lg p-6 hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{post.title}</h3>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" asChild>
                <a href="https://zerodha.tech" target="_blank" rel="noopener noreferrer">
                  Visit zerodha.tech <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Tech;
