import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, ExternalLink, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Distribution = Database['public']['Tables']['content_distribution']['Row'];
const empty = { campaign_id:'', article_id:'', platform:'linkedin', copy_text:'', tracked_url:'', status:'draft', published_url:'', posted_on:'' };
export default function AdminContentDistribution() {
  const client = useQueryClient();
  const [open,setOpen] = useState(false);
  const [editId,setEditId] = useState<string | null>(null);
  const [form,setForm] = useState(empty);
  const [search,setSearch] = useState('');
  const [saving,setSaving] = useState(false);
  const { data, error, isLoading } = useQuery({ queryKey:['content-distribution'], queryFn: async()=> {
    const [posts,campaigns,rows,links] = await Promise.all([
      readAllMISRows((f,t)=>supabase.from('articles').select('id,title,excerpt,format').eq('status','published').order('item_date',{ascending:false}).order('id').range(f,t)),
      readAllMISRows((f,t)=>supabase.from('campaigns').select('id,name').order('created_at',{ascending:false}).order('id').range(f,t)),
      readAllMISRows((f,t)=>supabase.from('content_distribution').select('*').order('created_at',{ascending:false}).order('id').range(f,t)),
      readAllMISRows((f,t)=>supabase.from('campaign_links').select('*').order('created_at').order('id').range(f,t)),
    ]); return {posts,campaigns,rows,links};
  }});
  const posts = (data?.posts ?? []).filter(p=>p.title.toLowerCase().includes(search.toLowerCase())).slice(0,50);
  function edit(row: Distribution) { setEditId(row.id); setForm({ campaign_id:row.campaign_id, article_id:row.article_id, platform:row.platform, copy_text:row.copy_text ?? '', tracked_url:row.tracked_url ?? '', status:row.status, published_url:row.published_url ?? '', posted_on:row.posted_on ?? '' }); setOpen(true); }
  async function save() {
    if (!form.campaign_id || !form.article_id || !form.copy_text.trim()) { toast.error('Select campaign and post, and prepare the caption'); return; }
    if (form.status === 'posted' && (!form.published_url || !form.posted_on)) { toast.error('Published URL and posting date are required'); return; }
    if (form.published_url && !/^https?:\/\//i.test(form.published_url)) { toast.error('Use an HTTP or HTTPS published URL'); return; }
    setSaving(true);
    try {
      const payload = {...form, posted_on:form.posted_on || null, published_url:form.published_url || null, updated_at:new Date().toISOString()};
      const result = editId ? await supabase.from('content_distribution').update(payload).eq('id',editId) : await supabase.from('content_distribution').insert(payload);
      if (result.error) throw result.error; await client.invalidateQueries({queryKey:['content-distribution']}); setOpen(false); toast.success('Distribution saved');
    } catch(e) { toast.error(e instanceof Error ? e.message : 'Could not save'); } finally {setSaving(false);}
  }
  return <AdminLayout title="Content Distribution" actions={<Button size="sm" onClick={()=>{setEditId(null);setForm(empty);setSearch('');setOpen(true);}}><Plus className="h-4 w-4" /> Prepare post</Button>}>
    {error && <p role="alert" className="text-destructive">Could not load content distribution.</p>}
    {isLoading && <p className="text-muted-foreground">Loading…</p>}
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b border-border">{['Post','Campaign','Platform','Status','Actions'].map(v=><th className="py-3 pr-4" key={v}>{v}</th>)}</tr></thead><tbody>{data?.rows.map(row=><tr key={row.id} className="border-b border-border"><td className="py-3 pr-4 min-w-48">{data.posts.find(p=>p.id===row.article_id)?.title ?? 'Post unavailable'}</td><td className="pr-4">{data.campaigns.find(c=>c.id===row.campaign_id)?.name}</td><td className="pr-4 capitalize">{row.platform}</td><td className="pr-4"><Badge variant="outline">{row.status.replaceAll('_',' ')}</Badge></td><td><div className="flex"><Button variant="ghost" size="icon" aria-label="Edit distribution" onClick={()=>edit(row)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Copy post caption" onClick={()=>navigator.clipboard.writeText([row.copy_text,row.tracked_url].filter(Boolean).join('\n\n')).then(()=>toast.success('Caption copied')).catch(()=>toast.error('Could not copy'))}><Copy className="h-4 w-4" /></Button>{row.published_url && <Button variant="ghost" size="icon" asChild><a href={row.published_url} target="_blank" rel="noopener noreferrer" aria-label="Open posted content"><ExternalLink className="h-4 w-4" /></a></Button>}</div></td></tr>)}</tbody></table></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{editId ? 'Edit distribution' : 'Prepare platform post'}</DialogTitle></DialogHeader>
      <Label>Campaign</Label><Select value={form.campaign_id} onValueChange={v=>setForm(f=>({...f,campaign_id:v,tracked_url:''}))}><SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger><SelectContent>{data?.campaigns.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
      <Label htmlFor="post-search">Find Insights post</Label><Input id="post-search" value={search} onChange={e=>setSearch(e.target.value)} />
      <Select value={form.article_id} onValueChange={v=>{const p=data?.posts.find(p=>p.id===v);setForm(f=>({...f,article_id:v,copy_text:p?.excerpt ?? ''}));}}><SelectTrigger className="h-auto min-h-9 [&>span]:whitespace-normal"><SelectValue placeholder="Select Read, Watch or Listen post" /></SelectTrigger><SelectContent>{posts.map(p=><SelectItem key={p.id} value={p.id}>{p.title} · {p.format}</SelectItem>)}</SelectContent></Select>
      <div className="grid grid-cols-2 gap-3"><div><Label>Platform</Label><Select value={form.platform} onValueChange={v=>setForm(f=>({...f,platform:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['linkedin','facebook','instagram','youtube','whatsapp','email','podcast','other'].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={form.status} onValueChange={v=>setForm(f=>({...f,status:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['draft','in_review','approved','posted'].map(s=><SelectItem key={s} value={s}>{s.replaceAll('_',' ')}</SelectItem>)}</SelectContent></Select></div></div>
      <Label htmlFor="caption">Platform caption</Label><Textarea id="caption" value={form.copy_text} onChange={e=>setForm(f=>({...f,copy_text:e.target.value}))} />
      <Label>Saved campaign link</Label><Select value={form.tracked_url} onValueChange={v=>setForm(f=>({...f,tracked_url:v}))}><SelectTrigger><SelectValue placeholder="Select tracked link" /></SelectTrigger><SelectContent>{data?.links.filter(l=>l.campaign_id===form.campaign_id).map(l=><SelectItem key={l.id} value={l.tracked_url}>{l.label}</SelectItem>)}</SelectContent></Select>
      <Label htmlFor="published-url">Published platform URL</Label><Input id="published-url" type="url" value={form.published_url} onChange={e=>setForm(f=>({...f,published_url:e.target.value}))} />
      <Label htmlFor="posted-on">Posting date</Label><Input id="posted-on" type="date" value={form.posted_on} onChange={e=>setForm(f=>({...f,posted_on:e.target.value}))} />
      <Button disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save distribution'}</Button>
    </DialogContent></Dialog>
  </AdminLayout>;
}