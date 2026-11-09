import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Row = {
  id: string; rating: number; comment: string | null; follow_up_status: string; created_at: string;
  support_tickets: { ticket_number: string | null; subject: string; contact_name: string | null } | null;
};

function Content() {
  const qc = useQueryClient();
  const { data = [], error, isLoading } = useQuery({
    queryKey: ['ticket-feedback'],
    queryFn: () => readAllMISRows<Row>((from, to) => supabase.from('ticket_feedback')
      .select('id,rating,comment,follow_up_status,created_at,support_tickets(ticket_number,subject,contact_name)')
      .order('created_at', { ascending: false }).range(from, to) as unknown as PromiseLike<{ data: Row[] | null; error: { message: string } | null }>),
  });

  const avg = data.length ? (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1) : '—';
  const pending = data.filter(r => r.follow_up_status === 'pending').length;

  const markDone = async (id: string) => {
    const { error: e } = await supabase.from('ticket_feedback').update({ follow_up_status: 'done' }).eq('id', id);
    if (e) { toast.error('Could not update', { description: e.message }); return; }
    void qc.invalidateQueries({ queryKey: ['ticket-feedback'] });
  };

  return (
    <AdminLayout title="Service Ratings" subtitle="Private 1–5 ratings clients give after a ticket is resolved. Ratings of 3 or below need a follow-up.">
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-xl">
        {[['Ratings', data.length], ['Average', avg], ['Follow-ups pending', pending]].map(([l, v]) => (
          <div key={l as string} className="border border-border rounded-lg p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="text-2xl font-semibold text-foreground">{isLoading ? '…' : v}</p></div>
        ))}
      </div>
      {error ? <p className="text-sm text-destructive">Could not load ratings: {(error as Error).message}</p> : (
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {data.length === 0 && !isLoading && <p className="p-8 text-center text-sm text-muted-foreground">No service ratings yet.</p>}
          {data.map(r => (
            <div key={r.id} className="p-4 flex flex-wrap items-start gap-3">
              <span className="text-lg font-semibold text-foreground w-10">{r.rating}★</span>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-medium text-foreground">{r.support_tickets?.ticket_number} · {r.support_tickets?.subject}</p>
                <p className="text-xs text-muted-foreground">{r.support_tickets?.contact_name ?? 'Client'} · {format(new Date(r.created_at), 'dd MMM yyyy')}</p>
                {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
              </div>
              {r.follow_up_status === 'pending' ? (
                <Button size="sm" variant="outline" onClick={() => markDone(r.id)}>Mark follow-up done</Button>
              ) : r.follow_up_status === 'done' ? <Badge variant="secondary">Followed up</Badge> : null}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminTicketFeedback() {
  return <AdminGuard><Content /></AdminGuard>;
}
