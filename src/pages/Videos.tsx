import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Play, Clock, BookOpen } from 'lucide-react';

const videoCategories = [
  {
    title: 'Getting Started',
    videos: [
      { title: 'How to open a SERNET account', duration: '5:30' },
      { title: 'Setting up your trading platform for the first time', duration: '8:15' },
      { title: 'Understanding your investment dashboard', duration: '12:00' },
    ],
  },
  {
    title: 'Trading Basics',
    videos: [
      { title: 'How to place your first order', duration: '6:45' },
      { title: 'Understanding order types', duration: '10:20' },
      { title: 'Reading charts and indicators', duration: '15:30' },
    ],
  },
  {
    title: 'Mutual Funds',
    videos: [
      { title: 'Getting started with Coin', duration: '7:00' },
      { title: 'Setting up SIPs', duration: '5:45' },
      { title: 'Choosing the right mutual fund', duration: '11:15' },
    ],
  },
  {
    title: 'Advanced Trading',
    videos: [
      { title: 'Options trading basics', duration: '18:30' },
      { title: 'Using GTT orders', duration: '8:45' },
      { title: 'Margin trading explained', duration: '14:00' },
    ],
  },
];

const Videos = () => {
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
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-xl mb-4">
              Video Tutorials
            </h1>
            <p className="text-body">
              Learn trading and investing through our comprehensive video library
            </p>
          </motion.div>

          <div className="space-y-12">
            {videoCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * catIndex }}
              >
                <h2 className="heading-lg mb-6">{category.title}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {category.videos.map((video) => (
                    <div
                      key={video.title}
                      className="bg-muted/50 rounded-lg overflow-hidden hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground text-sm mb-2">{video.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 bg-primary/10 rounded-lg p-8 text-center"
          >
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="heading-md mb-2">Want to learn more?</h2>
            <p className="text-small mb-4">
              Check out Varsity for comprehensive stock market education
            </p>
            <a href="/products/varsity" className="text-primary font-medium hover:underline">
              Explore Varsity →
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Videos;
