import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PAGE_SIZE = 10;

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="px-2 py-2 text-sm text-muted-foreground">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)} className={`min-w-[36px] h-9 px-2 text-sm rounded-lg border transition-colors font-medium ${page === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}>{p}</button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

const priorityConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  info: { icon: Info, color: 'bg-blue-500/10 text-blue-600', label: 'Info' },
  important: { icon: AlertTriangle, color: 'bg-amber-500/10 text-amber-600', label: 'Important' },
  warning: { icon: Bell, color: 'bg-orange-500/10 text-orange-600', label: 'Notice' },
  success: { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-600', label: 'New' },
};

export const BulletinContent = () => {
  const [page, setPage] = useState(1);

  const { data: bulletins = [], isLoading } = useQuery({
    queryKey: ['bulletins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulletins')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Filter out expired bulletins
  const active = bulletins.filter(item => !item.expires_at || new Date(item.expires_at) >= new Date());
  const totalPages = Math.ceil(active.length / PAGE_SIZE);
  const paginated = active.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

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

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading bulletins…</span>
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No active bulletins</p>
            <p className="text-sm mt-1">Notices and announcements will appear here once published.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, active.length)} of {active.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {paginated.map((item, index) => {
                  const config = priorityConfig[item.priority] ?? priorityConfig['info'];
                  const Icon = config.icon;
                  const dateStr = item.published_at
                    ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.06 * index }}
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
                        {dateStr && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {dateStr}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
            <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
          </>
        )}
      </div>
    </section>
  );
};
