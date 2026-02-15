import { motion } from 'framer-motion';
import { FileText, Download, Calendar, ArrowRight } from 'lucide-react';

const reports = [
  {
    id: 1,
    title: 'Monthly Market Report — January 2026',
    description: 'Comprehensive overview of market performance, sector analysis, and outlook for the month ahead.',
    date: 'Feb 1, 2026',
    type: 'Monthly',
    pages: 24,
  },
  {
    id: 2,
    title: 'Quarterly Earnings Roundup — Q3 FY26',
    description: 'Summary of key earnings results, surprises, and misses from the latest quarterly reporting season.',
    date: 'Jan 25, 2026',
    type: 'Quarterly',
    pages: 38,
  },
  {
    id: 3,
    title: 'Annual Equity Outlook 2026',
    description: 'Our flagship annual report covering macro themes, sector picks, and portfolio strategy for the year.',
    date: 'Jan 5, 2026',
    type: 'Annual',
    pages: 56,
  },
  {
    id: 4,
    title: 'Mutual Fund Performance Tracker — Jan 2026',
    description: 'Category-wise mutual fund performance rankings with risk-adjusted return metrics.',
    date: 'Feb 3, 2026',
    type: 'Monthly',
    pages: 18,
  },
  {
    id: 5,
    title: 'IPO Analysis Report — Upcoming Listings Q1 2026',
    description: 'Detailed analysis of upcoming IPOs including financials, valuations, and subscription recommendations.',
    date: 'Jan 20, 2026',
    type: 'Special',
    pages: 30,
  },
];

const typeColors: Record<string, string> = {
  Monthly: 'bg-blue-500/10 text-blue-600',
  Quarterly: 'bg-amber-500/10 text-amber-600',
  Annual: 'bg-emerald-500/10 text-emerald-600',
  Special: 'bg-purple-500/10 text-purple-600',
};

export const ReportsContent = () => {
  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">Research Reports</h2>
          <p className="text-muted-foreground">Downloadable reports covering markets, sectors, and investment opportunities.</p>
        </motion.div>

        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
              className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">{report.title}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full shrink-0 ${typeColors[report.type] || ''}`}>
                    {report.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
                  <span>{report.pages} pages</span>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
                <Download className="h-4 w-4" /> Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
