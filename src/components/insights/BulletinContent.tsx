import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Calendar } from 'lucide-react';

const bulletins = [
  {
    id: 1,
    title: 'Trading Holiday: Republic Day — Markets Closed on 26th January',
    description: 'Both NSE and BSE will remain closed on 26th January 2026 on account of Republic Day. Normal trading resumes on 27th January.',
    date: 'Jan 24, 2026',
    priority: 'info',
  },
  {
    id: 2,
    title: 'SEBI Circular: New Margin Framework for Cash Segment',
    description: 'SEBI has released new guidelines for margin collection in the cash segment effective March 1, 2026. All clients must ensure adequate margins.',
    date: 'Feb 10, 2026',
    priority: 'important',
  },
  {
    id: 3,
    title: 'System Maintenance: Scheduled Downtime on Feb 16',
    description: 'Our trading systems will undergo scheduled maintenance from 12 AM to 6 AM on February 16, 2026. No disruption during market hours.',
    date: 'Feb 12, 2026',
    priority: 'warning',
  },
  {
    id: 4,
    title: 'New Feature: GTT Orders Now Available for Commodity Trading',
    description: 'Good Till Triggered (GTT) orders are now live for MCX commodity contracts. Set price triggers and let your orders execute automatically.',
    date: 'Feb 8, 2026',
    priority: 'success',
  },
  {
    id: 5,
    title: 'Revised Stamp Duty Rates Effective April 1, 2026',
    description: 'As per government notification, stamp duty rates for securities transactions will be revised. Updated charges will reflect in contract notes.',
    date: 'Feb 5, 2026',
    priority: 'important',
  },
  {
    id: 6,
    title: 'Annual Maintenance Charges — Debit Notification',
    description: 'Annual maintenance charges (AMC) of ₹300 for demat accounts will be debited in March 2026. Ensure sufficient ledger balance.',
    date: 'Feb 1, 2026',
    priority: 'info',
  },
];

const priorityConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  info: { icon: Info, color: 'bg-blue-500/10 text-blue-600', label: 'Info' },
  important: { icon: AlertTriangle, color: 'bg-amber-500/10 text-amber-600', label: 'Important' },
  warning: { icon: Bell, color: 'bg-orange-500/10 text-orange-600', label: 'Notice' },
  success: { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-600', label: 'New' },
};

export const BulletinContent = () => {
  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">Bulletin Board</h2>
          <p className="text-muted-foreground">Important notices, platform updates, and regulatory announcements.</p>
        </motion.div>

        <div className="space-y-4">
          {bulletins.map((item, index) => {
            const config = priorityConfig[item.priority];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-1 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full shrink-0 ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
