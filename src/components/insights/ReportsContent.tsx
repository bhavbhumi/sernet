import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const typeColors: Record<string, string> = {
  Monthly: 'bg-blue-500/10 text-blue-600',
  Quarterly: 'bg-amber-500/10 text-amber-600',
  Annual: 'bg-emerald-500/10 text-emerald-600',
  Special: 'bg-purple-500/10 text-purple-600',
};

export const ReportsContent = () => {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading reports…</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No reports published yet</p>
            <p className="text-sm mt-1">Research reports will appear here once published.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => {
              const dateStr = report.published_at
                ? new Date(report.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
              const colorClass = typeColors[report.report_type] ?? 'bg-muted text-muted-foreground';
              return (
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
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground truncate">{report.title}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full shrink-0 ${colorClass}`}>
                        {report.report_type}
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {dateStr && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {dateStr}</span>}
                      {report.pages ? <span>{report.pages} pages</span> : null}
                    </div>
                  </div>
                  {report.file_url ? (
                    <a
                      href={report.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                    >
                      <Download className="h-4 w-4" /> Download
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium shrink-0 cursor-not-allowed opacity-60">
                      <Download className="h-4 w-4" /> Coming soon
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
