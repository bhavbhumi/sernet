import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';

const Philosophy = () => {
  const philosophies = [
    {
      title: 'Customer-first always',
      description: 'Every decision we make starts with one question: "Is this good for the customer?" If the answer is no, we don\'t do it. This has been our guiding principle since day one.',
    },
    {
      title: 'No spam or gimmicks',
      description: 'We don\'t send promotional emails, SMSs, or push notifications. We don\'t have sales executives calling you. We believe in earning trust through our products and service, not through aggressive marketing.',
    },
    {
      title: 'Transparency in everything',
      description: 'From pricing to policies, everything is clearly documented and available on our website. No hidden charges, no fine print tricks, no surprises.',
    },
    {
      title: 'Technology as an enabler',
      description: 'We build technology that empowers users rather than making them dependent. Our platforms are designed to be intuitive, fast, and reliable.',
    },
    {
      title: 'Education over selling',
      description: 'We believe informed investors make better decisions. That\'s why we invest heavily in free educational content through Varsity and TradingQ&A.',
    },
    {
      title: 'Simplicity over complexity',
      description: 'Markets are complex enough. Our job is to make investing and trading simple, not to add more complexity. Every feature we build is designed with simplicity in mind.',
    },
    {
      title: 'Long-term thinking',
      description: 'We don\'t optimize for short-term gains. Our decisions are made keeping the next decade in mind, not the next quarter.',
    },
    {
      title: 'Bootstrapped and profitable',
      description: 'We\'ve been profitable since 2014 and have never raised external funding. This gives us the freedom to prioritize customers over investors.',
    },
  ];

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="heading-xl text-center mb-6">Our Philosophy</h1>
            <p className="text-body text-center mb-16 max-w-2xl mx-auto">
              The principles that guide everything we do at Zerodha
            </p>

            <div className="space-y-12">
              {philosophies.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-border pb-8 last:border-0"
                >
                  <h2 className="heading-md mb-3">
                    {item.title}
                  </h2>
                  <p className="text-body">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-muted/50 rounded-lg">
              <h3 className="heading-md mb-4">
                Why we do things differently
              </h3>
              <p className="text-body">
                In an industry known for opaque practices and aggressive sales tactics, 
                we chose a different path. We believe that the best way to build a 
                sustainable business is to genuinely help customers succeed. When our 
                customers do well, we do well. It's as simple as that.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Philosophy;
