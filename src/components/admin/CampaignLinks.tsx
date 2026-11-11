import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { trackedLink } from '@/lib/marketingWorkflow';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download, Link2 } from 'lucide-react';
import { toast } from 'sonner';

export function CampaignLinks({ campaign }: { campaign: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: '', destination_url: 'https://sernetindia.com/open-account?tab=invest', utm_source: String(campaign.utm_source || ''), utm_medium: String(campaign.utm_medium || ''), utm_campaign: String(campaign.utm_campaign || campaign.id), utm_content: '', utm_term: '' });
  const client = useQueryClient();
  const id = String(campaign.id);
  const { data: links = [], error } = useQuery({ queryKey: ['campaign-links', id], enabled: open, queryFn: () => readAllMISRows((from,to) => supabase.from('campaign_links').select('*').eq('campaign_id',id).order('created_at').order('id').range(from,to)) });
  let preview = ''; try { preview = trackedLink(form.destination_url, form); } catch { /* incomplete inputs */ }
  async function save() {
    if (!form.label.trim()) { toast.error('Give this link a name'); return; }
    setSaving(true);
    try {
      const url = trackedLink(form.destination_url, form);
      const { error } = await supabase.from('campaign_links').insert({ ...form, campaign_id: id, tracked_url: url });
      if (error) throw error;
      await client.invalidateQueries({ queryKey: ['campaign-links',id] }); toast.success('Tracked link saved');
    } catch(e) { toast.error(e instanceof Error ? e.message : 'Could not save link'); } finally { setSaving(false); }
  }
  async function qr(url: string) {
    try {
      const QR = await import('qrcode');
      const a = document.createElement('a'); a.href = await QR.toDataURL(url, { width: 600, margin: 4 }); a.download = 'sernet-campaign-qr.png'; a.click();
    } catch { toast.error('Could not generate QR code'); }
  }
  return <><Button variant="outline" size="sm" onClick={() => setOpen(true)}><Link2 className="h-4 w-4" /> Tracked links</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Tracked links — {String(campaign.name)}</DialogTitle></DialogHeader>
      <div className="grid sm:grid-cols-2 gap-3">{Object.entries(form).map(([key,value]) => <div key={key} className={key === 'destination_url' ? 'sm:col-span-2' : ''}><Label htmlFor={key}>{key.replace('utm_','').replaceAll('_',' ').replace(/^\w/,c=>c.toUpperCase())}</Label><Input id={key} value={value} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} /></div>)}</div>
      {preview && <p className="text-xs break-all text-muted-foreground">{preview}</p>}
      <Button disabled={!preview || saving} onClick={save}>{saving ? 'Saving…' : 'Save tracked link'}</Button>
      {error && <p role="alert" className="text-destructive">Could not load links.</p>}
      <ul className="divide-y divide-border">{links.map(link=><li key={link.id} className="py-3"><div className="flex items-center gap-2"><span className="flex-1 font-medium text-sm">{link.label}</span><Button variant="ghost" size="icon" aria-label="Copy tracked link" title="Copy tracked link" onClick={()=>navigator.clipboard.writeText(link.tracked_url).then(()=>toast.success('Link copied')).catch(()=>toast.error('Could not copy'))}><Copy className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Download QR code" title="Download QR code" onClick={()=>qr(link.tracked_url)}><Download className="h-4 w-4" /></Button></div><p className="text-xs break-all text-muted-foreground">{link.tracked_url}</p></li>)}</ul>
    </DialogContent></Dialog></>;
}