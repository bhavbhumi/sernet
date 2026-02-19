import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const priorityConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  info: { icon: Info, color: 'bg-blue-500/10 text-blue-600', label: 'Info' },
  important: { icon: AlertTriangle, color: 'bg-amber-500/10 text-amber-600', label: 'Important' },
  warning: { icon: Bell, color: 'bg-orange-500/10 text-orange-600', label: 'Notice' },
  success: { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-600', label: 'New' },
};

export const BulletinContent = () => {
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
        ) : bulletins.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No active bulletins</p>
            <p className="text-sm mt-1">Notices and announcements will appear here once published.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bulletins.map((item, index) => {
              const config = priorityConfig[item.priority] ?? priorityConfig['info'];
              const Icon = config.icon;
              const dateStr = item.published_at
                ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
              // Hide expired bulletins on the frontend
              if (item.expires_at && new Date(item.expires_at) < new Date()) return null;
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
                    {dateStr && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {dateStr}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
