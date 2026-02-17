import { motion } from 'framer-motion';
import { Building2, Calendar, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

const corporateEvents = [
  { date: 'Feb 10, 2024', company: 'Reliance Industries', event: 'Board Meeting', type: 'board', details: 'Q3 FY24 results declaration' },
  { date: 'Feb 12, 2024', company: 'TCS', event: 'Dividend', type: 'dividend', details: 'Interim dividend of ₹9 per share, Ex-date' },
  { date: 'Feb 14, 2024', company: 'HDFC Bank', event: 'AGM', type: 'agm', details: 'Annual General Meeting for FY2023-24' },
  { date: 'Feb 15, 2024', company: 'Infosys', event: 'Bonus Issue', type: 'bonus', details: 'Bonus shares in ratio 1:1, Record date' },
  { date: 'Feb 18, 2024', company: 'Bajaj Finance', event: 'Board Meeting', type: 'board', details: 'Consideration of fund raising proposals' },
  { date: 'Feb 20, 2024', company: 'ITC Ltd', event: 'Stock Split', type: 'split', details: 'Stock split from ₹10 to ₹1 face value' },
  { date: 'Feb 22, 2024', company: 'Wipro', event: 'Buyback', type: 'buyback', details: 'Share buyback at ₹405 per share via tender offer' },
  { date: 'Feb 25, 2024', company: 'Maruti Suzuki', event: 'Board Meeting', type: 'board', details: 'Q3 results and interim dividend consideration' },
  { date: 'Feb 27, 2024', company: 'Asian Paints', event: 'Dividend', type: 'dividend', details: 'Final dividend of ₹21.50 per share' },
  { date: 'Mar 1, 2024', company: 'SBI', event: 'Rights Issue', type: 'rights', details: 'Rights issue at ₹580, ratio 1:5' },
  { date: 'Mar 5, 2024', company: 'Hindustan Unilever', event: 'AGM', type: 'agm', details: 'Annual General Meeting, dividend declaration' },
  { date: 'Mar 8, 2024', company: 'L&T', event: 'Board Meeting', type: 'board', details: 'Review of order book and project pipeline' },
];

type EventType = 'board' | 'dividend' | 'agm' | 'bonus' | 'split' | 'buyback' | 'rights';

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: typeof Building2 }> = {
  board: { label: 'Board Meeting', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Users },
  dividend: { label: 'Dividend', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: DollarSign },
  agm: { label: 'AGM', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Building2 },
  bonus: { label: 'Bonus Issue', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: TrendingUp },
  split: { label: 'Stock Split', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: FileText },
  buyback: { label: 'Buyback', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: DollarSign },
  rights: { label: 'Rights Issue', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: FileText },
};

const filters: EventType[] = ['board', 'dividend', 'agm', 'bonus', 'split', 'buyback', 'rights'];

const CorporateEventsContent = () => {
  return (
    <div className="section-padding">
      <div className="container-zerodha">
        {/* Event Type Legend */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center mb-10">
          {filters.map((type) => {
            const config = eventTypeConfig[type];
            return (
              <button
                key={type}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-border hover:opacity-80 transition-opacity ${config.color}`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Events Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Corporate Events
              </h2>
              <span className="text-xs text-muted-foreground">{corporateEvents.length} events</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Company</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Event</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {corporateEvents.map((event, index) => {
                    const config = eventTypeConfig[event.type as EventType];
                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6 text-foreground font-medium whitespace-nowrap">{event.date}</td>
                        <td className="py-4 px-6 text-foreground font-medium">{event.company}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground max-w-xs">{event.details}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">About Corporate Events</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Board Meetings</strong> — Companies announce quarterly results, dividends, and key strategic decisions.</li>
              <li>• <strong>Dividends</strong> — Cash or stock distributions to shareholders. Track ex-dates and record dates.</li>
              <li>• <strong>Bonus & Splits</strong> — Changes in share structure that affect your holdings and cost basis.</li>
              <li>• <strong>Buybacks & Rights Issues</strong> — Opportunities to tender shares or subscribe to new offerings at set prices.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateEventsContent;
