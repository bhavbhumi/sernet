import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Globe, Monitor, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_LINKS, TICKFUNDS_LINKS, TUSHIL_LINKS } from '@/lib/appLinks';

type Item = { name: string; size: string; icon: typeof Monitor; link: string | null; web?: boolean };

const downloadCategories: { category: string; items: Item[] }[] = [
  {
    category: 'Choice FinX - Trading',
    items: [
      { name: 'Choice FinX for Windows', size: '45 MB', icon: Monitor, link: null },
      { name: 'Choice FinX for Mac', size: '52 MB', icon: Monitor, link: null },
      { name: 'Choice FinX Android App', size: 'Google Play', icon: Smartphone, link: APP_LINKS.PLAY_STORE },
      { name: 'Choice FinX iOS App', size: 'App Store', icon: Smartphone, link: APP_LINKS.APP_STORE },
    ],
  },
  {
    category: 'Tick Funds - Mutual Funds',
    items: [
      { name: 'Tick Funds Web', size: 'Browser', icon: Globe, link: TICKFUNDS_LINKS.START_INVESTING, web: true },
      { name: 'Tick Funds Android App', size: 'Google Play', icon: Smartphone, link: TICKFUNDS_LINKS.PLAY_STORE },
      { name: 'Tick Funds iOS App', size: 'App Store', icon: Smartphone, link: TICKFUNDS_LINKS.APP_STORE },
    ],
  },
  {
    category: 'Tushil - Insurance',
    items: [
      { name: 'Tushil Web', size: 'Browser', icon: Globe, link: TUSHIL_LINKS.WEB, web: true },
      { name: 'Tushil Mobile', size: 'Mobile browser', icon: Smartphone, link: TUSHIL_LINKS.WEB, web: true },
    ],
  },
];

const AppsContent = () => (
  <div className="section-padding">
    <div className="container-sernet">
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
              {category.items.map((item) => {
                const Icon = item.web ? ExternalLink : Download;
                return (
                  <div key={item.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      </div>
                    </div>
                    {item.link ? (
                      <Button asChild size="sm" variant="ghost" className="shrink-0">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.name}`}>
                          <Icon className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled className="shrink-0" aria-label={`${item.name} coming soon`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default AppsContent;
