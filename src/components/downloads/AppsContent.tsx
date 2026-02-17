import { Button } from '@/components/ui/button';
import { Download, Monitor, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const downloadCategories = [
  {
    category: 'Trading Platforms',
    items: [
      { name: 'Kite for Windows', size: '45 MB', icon: Monitor },
      { name: 'Kite for Mac', size: '52 MB', icon: Monitor },
      { name: 'Kite Android App', size: '25 MB', icon: Smartphone },
      { name: 'Kite iOS App', size: '28 MB', icon: Smartphone },
    ],
  },
  {
    category: 'Coin - Mutual Funds',
    items: [
      { name: 'Coin Android App', size: '18 MB', icon: Smartphone },
      { name: 'Coin iOS App', size: '20 MB', icon: Smartphone },
    ],
  },
  {
    category: 'Varsity - Education',
    items: [
      { name: 'Varsity Android App', size: '15 MB', icon: Smartphone },
      { name: 'Varsity iOS App', size: '17 MB', icon: Smartphone },
    ],
  },
];

const AppsContent = () => {
  return (
    <div className="section-padding">
      <div className="container-zerodha">
        <div className="space-y-12">
          {downloadCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * catIndex }}
            >
              <h2 className="heading-lg mb-6">{category.category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((item) => (
                  <div key={item.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsContent;
