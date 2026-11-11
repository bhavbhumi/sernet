import { readAllMISRows } from '@/lib/misRefresh';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users } from 'lucide-react';
import { format } from 'date-fns';
import { EVENT_TYPES } from '@/lib/marketingWorkflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function EventRegistrationsDialog({ eventId, eventTitle, open, onClose }: {
  eventId: string; eventTitle: string; open: boolean; onClose: () => void;
}) {
  const client = useQueryClient();
  const [form,setForm]=useState({name:'',phone:'',email:'',company:''});
  const [saving,setSaving]=useState(false);
  const { data: registrations = [], error: loadError } = useQuery({
    queryKey: ['event-registrations', eventId],
    enabled: open,
    queryFn: async () => {
      return readAllMISRows((from, to) => supabase.from('event_registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).order('id').range(from, to));
    },
  });

  const attended = registrations.filter(r => r.attended).length;
  async function register() {
    if (!form.name.trim() || !form.phone.trim()) {toast.error('Name and phone are required');return;}
    setSaving(true);
    try {
      const {error} = await supabase.from('event_registrations').insert({...form,event_id:eventId});
      if(error) throw error;
      await client.invalidateQueries({queryKey:['event-registrations',eventId]});setForm({name:'',phone:'',email:'',company:''});toast.success('Registration saved');
    } catch(e) {toast.error(e instanceof Error ? e.message : 'Could not register');} finally {setSaving(false);}
  }
  async function attendance(id:string,value:boolean) {
    const {error}=await supabase.from('event_registrations').update({attended:value}).eq('id',id);
    if(error) {toast.error(error.message);return;} await client.invalidateQueries({queryKey:['event-registrations',eventId]});
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Registrations — {eventTitle}
          </DialogTitle>
        </DialogHeader>
        {loadError && <p role="alert" className="text-destructive">Registrations could not be refreshed.</p>}
        <div className="grid grid-cols-2 gap-2">{Object.entries(form).map(([key,value])=><div key={key}><Label htmlFor={`event-${key}`}>{key.replace(/^\w/,c=>c.toUpperCase())}</Label><Input id={`event-${key}`} value={value} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} /></div>)}</div><Button onClick={register} disabled={saving}>{saving?'Saving…':'Add registration'}</Button>
        <div className="flex gap-2 text-xs text-muted-foreground mb-3">
          <Badge variant="outline">{registrations.length} registered</Badge>
          <Badge variant="secondary">{attended} attended</Badge>
        </div>
        {registrations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No registrations yet.</p>
        ) : (
          <div className="space-y-2">
            {registrations.map((r: any) => (
              <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg border text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{r.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{r.phone}</span>
                    {r.email && <span>· {r.email}</span>}
                    {r.company && <span>· {r.company}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={r.attended ? 'default' : 'outline'} className="text-[10px]">
                    {r.attended ? 'Attended' : r.status}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={()=>attendance(r.id,!r.attended)}>{r.attended ? 'Undo attendance' : 'Mark attended'}</Button>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(r.created_at), 'dd MMM yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminEvents() {
  const [viewEvent, setViewEvent] = useState<{ id: string; title: string } | null>(null);

  return (
    <AdminGuard>
      <GenericCMSPage
        title="Events"
        subtitle="Manage investor meets, webinars, and seminars"
        tableName="events"
        tableColumns={[
          { key: 'title', label: 'Event' },
          { key: 'event_type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'event_date', label: 'Date', format: 'date' },
          { key: 'event_time', label: 'Time' },
          { key: 'speaker', label: 'Speaker' },
          { key: 'venue', label: 'Venue' },
          { key: 'capacity', label: 'Capacity' },
        ]}
        fields={[
          { key: 'title', label: 'Event Title', type: 'text', required: true },
          { key: 'event_type', label: 'Type', type: 'select', options: EVENT_TYPES },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'event_date', label: 'Event Date', type: 'date', required: true },
          { key: 'event_time', label: 'Time', type: 'text', placeholder: 'e.g. 10:00 AM IST' },
          { key: 'duration_minutes', label: 'Duration (mins)', type: 'number', placeholder: '60' },
          { key: 'speaker', label: 'Speaker / Host', type: 'text' },
          { key: 'venue', label: 'Venue / Location', type: 'text' },
          { key: 'meeting_link', label: 'Meeting Link', type: 'text', placeholder: 'Zoom / Teams link' },
          { key: 'capacity', label: 'Max Capacity', type: 'number' },
        ]}
        emptyForm={{
          title: '', event_type: 'webinar', description: '',
          event_date: '', event_time: '', duration_minutes: '60',
          speaker: '', venue: '', meeting_link: '', capacity: '',
        }}
        hasStatus
        categoryField="event_type"
        orderBy={{ column: 'event_date', ascending: false }}
        onRowAction={(item) => (
          <Button
            variant="ghost" size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setViewEvent({ id: String(item.id), title: String(item.title || '') })}
          >
            <Eye className="h-3 w-3" /> Registrations
          </Button>
        )}
      />
      {viewEvent && (
        <EventRegistrationsDialog
          eventId={viewEvent.id}
          eventTitle={viewEvent.title}
          open={!!viewEvent}
          onClose={() => setViewEvent(null)}
        />
      )}
    </AdminGuard>
  );
}
