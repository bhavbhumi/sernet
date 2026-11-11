import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { salesDealSchema, productLabel } from '@/lib/salesWorkflow';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
export function SalesDealDialog({ contactId, contactName, onCreated }: { contactId?: string; contactName?: string; onCreated?: () => void }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: contactName ? `Opportunity — ${contactName}` : '', contact: contactId ?? '', product: '', value: '0' });
  const [saving, setSaving] = useState(false);
  const { data: products = [], error: productError } = useQuery({ queryKey: ['sales-products'], enabled: open, queryFn: () => readAllMISRows((from,to) => supabase.from('products').select('id,name,parent_id').eq('is_active',true).order('sort_order').order('id').range(from,to)) });
  const { data: contacts = [], error: contactError } = useQuery({ queryKey: ['sales-contact-options'], enabled: open && !contactId, queryFn: () => readAllMISRows((from,to) => supabase.from('crm_contacts').select('id,full_name,phone').order('full_name').order('id').range(from,to)) });
  async function save() {
    const result = salesDealSchema.safeParse(form);
    if (!result.success) { toast.error(result.error.issues[0]?.message ?? 'Check opportunity details'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.rpc('create_sales_deal', { _title: result.data.title, _contact: result.data.contact, _product: result.data.product, _value: result.data.value });
      if (error) throw error;
      await Promise.all(['crm-deals','contact-deals','admin-dashboard-stats'].map(key => client.invalidateQueries({queryKey:[key]})));
      toast.success('Opportunity created');setOpen(false);setForm({title:contactName ? `Opportunity — ${contactName}` : '',contact:contactId ?? '',product:'',value:'0'});onCreated?.();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not create opportunity'); } finally {setSaving(false);}
  }
  return <><Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />{contactId ? 'Add Deal' : 'New Deal'}</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Create opportunity</DialogTitle></DialogHeader>
      {(productError || contactError) && <p role="alert" className="text-destructive">Contacts or products could not be loaded.</p>}
      <Label htmlFor="opportunity-title">Title</Label><Input id="opportunity-title" maxLength={200} value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))} />
      <Label>Contact</Label>{contactId ? <p className="text-sm font-medium">{contactName}</p> : <Select value={form.contact} onValueChange={v => setForm(f => ({...f,contact:v}))}><SelectTrigger aria-label="Opportunity contact"><SelectValue placeholder="Select existing contact" /></SelectTrigger><SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name}{c.phone ? ` · ${c.phone}` : ''}</SelectItem>)}</SelectContent></Select>}
      <Label>Product</Label><Select value={form.product} onValueChange={v => setForm(f => ({...f,product:v}))}><SelectTrigger aria-label="Opportunity product"><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{productLabel(p,products)}</SelectItem>)}</SelectContent></Select>
      <Label htmlFor="opportunity-value">Opportunity value (₹)</Label><Input id="opportunity-value" type="number" min={0} value={form.value} onChange={e => setForm(f => ({...f,value:e.target.value}))} />
      <Button disabled={saving || !!productError || !!contactError} onClick={save}>{saving ? 'Saving…' : 'Create Deal'}</Button>
    </DialogContent></Dialog></>;
}