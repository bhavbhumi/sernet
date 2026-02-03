import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';

const pressReleases = [
  {
    title: 'Zerodha crosses 1.6 crore customers',
    source: 'Economic Times',
    date: 'Jan 2024',
    link: '#',
  },
  {
    title: 'Zerodha remains the largest broker in India by active clients',
    source: 'Mint',
    date: 'Dec 2023',
    link: '#',
  },
  {
    title: 'Nithin Kamath on the future of retail trading in India',
    source: 'CNBC TV18',
    date: 'Nov 2023',
    link: '#',
  },
  {
    title: 'Zerodha\'s Rainmatter invests in climate-tech startups',
    source: 'Business Standard',
    date: 'Oct 2023',
    link: '#',
  },
  {
    title: 'How Zerodha disrupted the broking industry',
    source: 'Forbes India',
    date: 'Sep 2023',
    link: '#',
  },
];

const mediaAssets = [
  { name: 'Zerodha Logo (PNG)', type: 'PNG' },
  { name: 'Zerodha Logo (SVG)', type: 'SVG' },
  { name: 'Brand Guidelines', type: 'PDF' },
  { name: 'Press Kit', type: 'ZIP' },
];

const Media = () => {
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
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Press & Media
            </h1>
            <p className="text-lg text-muted-foreground">
              News, press releases, and media resources
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">In the News</h2>
              <div className="space-y-4">
                {pressReleases.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="block bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.source}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">Media Assets</h2>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="space-y-4">
                  {mediaAssets.map((asset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-foreground">{asset.name}</span>
                      <span className="text-xs text-muted-foreground">{asset.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-primary/10 rounded-lg p-6">
                <h3 className="font-medium text-foreground mb-2">Media Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For press inquiries, interviews, or media requests, please contact:
                </p>
                <a href="mailto:press@zerodha.com" className="text-primary text-sm font-medium">
                  press@zerodha.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
