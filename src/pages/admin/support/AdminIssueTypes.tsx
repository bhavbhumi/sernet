import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PRODUCTS, PRIORITY_CONFIG, RISK_TAGS } from '@/lib/supportClassification';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const db = (t: string) => supabase.from(t as any) as any;
const PAGE_SIZE = 25;

export function IssueTypesContent() {
  const { toast } = useToast();
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category_id: '', product: 'tickfunds', issue_code: '', title: '', description: '',
    priority: 'standard', tat_hours: 48, risk_tag: 'operational', regulator: '',
    required_documents: '', auto_assign_team: 'support', keyword_triggers: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: types }, { data: cats }] = await Promise.all([
      db('support_issue_types').select('*, support_issue_categories(name)').order('issue_code'),
      db('support_issue_categories').select('id, name, slug').order('sort_order'),
    ]);
    setIssueTypes(types ?? []);
    setCategories(cats ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ category_id: categories[0]?.id ?? '', product: 'tickfunds', issue_code: '', title: '', description: '', priority: 'standard', tat_hours: 48, risk_tag: 'operational', regulator: '', required_documents: '', auto_assign_team: 'support', keyword_triggers: '' });
    setDialogOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      category_id: t.category_id, product: t.product, issue_code: t.issue_code, title: t.title,
      description: t.description ?? '', priority: t.priority, tat_hours: t.tat_hours,
      risk_tag: t.risk_tag ?? 'operational', regulator: t.regulator ?? '',
      required_documents: (t.required_documents ?? []).join(', '),
      auto_assign_team: t.auto_assign_team ?? 'support',
      keyword_triggers: (t.keyword_triggers ?? []).join(', '),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: any = {
      category_id: form.category_id, product: form.product, issue_code: form.issue_code,
      title: form.title, description: form.description || null, priority: form.priority,
      tat_hours: form.tat_hours, risk_tag: form.risk_tag, regulator: form.regulator || null,
      required_documents: form.required_documents ? form.required_documents.split(',').map(s => s.trim()).filter(Boolean) : [],
      auto_assign_team: form.auto_assign_team || null,
      keyword_triggers: form.keyword_triggers ? form.keyword_triggers.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    const { error } = editingId
      ? await db('support_issue_types').update(payload).eq('id', editingId)
      : await db('support_issue_types').insert([payload]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingId ? 'Updated' : 'Created' }); setDialogOpen(false); fetchAll(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this issue type?')) return;
    await db('support_issue_types').delete().eq('id', id);
    toast({ title: 'Deleted' });
    fetchAll();
  };

  const filtered = issueTypes.filter(t => {
    const matchSearch = (t.title + ' ' + t.issue_code).toLowerCase().includes(search.toLowerCase());
    const matchProduct = filterProduct === 'all' || t.product === filterProduct || t.product === 'all';
    const matchCat = filterCategory === 'all' || t.category_id === filterCategory;
    return matchSearch && matchProduct && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const productStats = {
    all: issueTypes.length,
    tickfunds: issueTypes.filter(t => t.product === 'tickfunds').length,
    choicefinx: issueTypes.filter(t => t.product === 'choicefinx').length,
    tushil: issueTypes.filter(t => t.product === 'tushil').length,
    shared: issueTypes.filter(t => t.product === 'all').length,
  };

  return (
    <AdminLayout
      title="Issue Type Taxonomy"
      subtitle="3-tier issue classification engine — manage issue types per product × category"
      actions={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Issue Type</Button>}
    >
      {/* Product stat chips */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { key: 'all', label: 'Total' },
          { key: 'tickfunds', label: 'Tick Funds' },
          { key: 'choicefinx', label: 'Choice FinX' },
          { key: 'tushil', label: 'Tushil' },
          { key: 'shared', label: 'Shared' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilterProduct(key === 'shared' ? 'all' : key); setPage(1); }}
            className={`border rounded-lg p-3 text-left transition-colors ${filterProduct === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{productStats[key as keyof typeof productStats]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search issue types..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={filterProduct} onValueChange={v => { setFilterProduct(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {PRODUCTS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => { setFilterCategory(v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issue Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">TAT</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Regulator</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No issue types found.</td></tr>
              ) : paginated.map(t => {
                const pri = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                const risk = RISK_TAGS[t.risk_tag as keyof typeof RISK_TAGS];
                const prod = PRODUCTS.find(p => p.key === t.product);
                return (
                  <tr key={t.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.issue_code}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{t.title}</p>
                      {t.auto_assign_team && <p className="text-xs text-muted-foreground">→ {t.auto_assign_team}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={prod?.bg}>{prod?.label ?? t.product}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.support_issue_categories?.name}</td>
                    <td className="px-4 py-3"><Badge className={pri?.color}>{pri?.label ?? t.priority}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{t.tat_hours}h</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={`text-[10px] ${risk?.color}`}>{risk?.label}</Badge></td>
                    <td className="px-4 py-3 text-xs">{t.regulator ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-2">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1.5 text-xs rounded-md border border-border disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5 inline" /> Prev</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1.5 text-xs rounded-md border border-border disabled:opacity-40">Next <ChevronRight className="h-3.5 w-3.5 inline" /></button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Issue Type' : 'Add Issue Type'}</DialogTitle>
            <DialogDescription>Configure issue classification, priority, TAT, and automation routing</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-1.5">
              <Label>Product <span className="text-destructive">*</span></Label>
              <Select value={form.product} onValueChange={v => setForm(f => ({ ...f, product: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
                  <SelectItem value="all">All Products (Shared)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Issue Code <span className="text-destructive">*</span></Label>
              <Input value={form.issue_code} onChange={e => setForm(f => ({ ...f, issue_code: e.target.value }))} placeholder="TF-KYC-001" />
            </div>
            <div className="space-y-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="KYC Not Verified" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical (4h TAT)</SelectItem>
                  <SelectItem value="high">High (24h TAT)</SelectItem>
                  <SelectItem value="standard">Standard (48-72h TAT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>TAT (hours)</Label>
              <Input type="number" value={form.tat_hours} onChange={e => setForm(f => ({ ...f, tat_hours: parseInt(e.target.value) || 48 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Risk Tag</Label>
              <Select value={form.risk_tag} onValueChange={v => setForm(f => ({ ...f, risk_tag: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="reputational">Reputational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Regulator</Label>
              <Select value={form.regulator || '__none'} onValueChange={v => setForm(f => ({ ...f, regulator: v === '__none' ? '' : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  <SelectItem value="SEBI">SEBI</SelectItem>
                  <SelectItem value="IRDAI">IRDAI</SelectItem>
                  <SelectItem value="Exchange">Exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Auto-Assign Team</Label>
              <Select value={form.auto_assign_team} onValueChange={v => setForm(f => ({ ...f, auto_assign_team: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Required Documents</Label>
              <Input value={form.required_documents} onChange={e => setForm(f => ({ ...f, required_documents: e.target.value }))} placeholder="PAN Card, Aadhaar, Bank Statement" />
              <p className="text-[10px] text-muted-foreground">Comma-separated</p>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Keyword Triggers</Label>
              <Input value={form.keyword_triggers} onChange={e => setForm(f => ({ ...f, keyword_triggers: e.target.value }))} placeholder="redemption not credited, funds stuck" />
              <p className="text-[10px] text-muted-foreground">Comma-separated phrases that auto-match this issue type</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.issue_code.trim() || !form.title.trim()}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
