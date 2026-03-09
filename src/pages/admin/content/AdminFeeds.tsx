
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Eye, EyeOff, Rss, Link, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoryTreeManager, type CategoryNode } from '@/components/admin/CategoryTreeManager';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';

const PAGE_SIZE = 25;

const FEED_TYPES = [
  { value: 'news', label: 'News' },
  { value: 'circular', label: 'Circular' },
] as const;

type FeedType = typeof FEED_TYPES[number]['value'];

const DEFAULT_CATS: CategoryNode[] = [
  { name: 'Market News', children: [{ name: 'Equities', children: [] }, { name: 'Derivatives', children: [] }] },
  { name: 'Corporate Actions', children: [{ name: 'Dividends', children: [] }, { name: 'Buybacks', children: [] }] },
  { name: 'Economy', children: [] },
  { name: 'Global Markets', children: [] },
  { name: 'SEBI Circulars', children: [{ name: 'Margin Rules', children: [] }, { name: 'Investor Protection', children: [] }] },
  { name: 'Exchange Notices', children: [{ name: 'NSE', children: [] }, { name: 'BSE', children: [] }] },
  { name: 'Depository', children: [{ name: 'CDSL', children: [] }, { name: 'NSDL', children: [] }] },
  { name: 'Policy Updates', children: [] },
];

interface FeedItem {
  id: string;
  feed_type: FeedType;
  title: string;
  source: string;
  category: string;
  sub_category: string | null;
  link: string | null;
  summary: string | null;
  is_rss: boolean;
  rss_feed_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

const TIPS = {
  title: 'The headline identifying this item. For RSS feeds, this becomes the feed name.',
  source: 'The publishing organisation or outlet (e.g. Reuters, NSE, SEBI).',
  category: 'Group this item into a category. Use the tree below to manage hierarchy.',
  sub_category: 'Optional sub-category for finer classification.',
  link: 'Direct URL to the original article or notice.',
  rss_feed_url: 'Paste the RSS/Atom feed URL for automatic pulling.',
  summary: 'Short description (1–3 sentences) shown in card preview.',
  status: 'Draft items are invisible to public. Published makes them live.',
  is_rss: 'Toggle ON if powered by RSS feed. OFF for standalone link.',
  feed_type: 'News for market updates. Circular for regulatory notices.',
};

function AdminPagination({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  return (
    <div className="flex items-center justify-end gap-1.5 flex-wrap">
      <span className="text-xs text-muted-foreground mr-2">{start}–{end} of {total}</span>
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Prev
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)} className={`min-w-[28px] h-7 px-1.5 text-xs rounded-md border transition-colors font-medium ${page === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}>{p}</button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Next <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function AdminFeeds() {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeedType, setFilterFeedType] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<FeedItem | null>(null);
  const [saving, setSaving] = useState(false);

  const catKey = 'admin_cats_feeds';
  const [categories, setCategories] = useState<CategoryNode[]>(() => {
    try {
      const stored = localStorage.getItem(catKey);
      return stored ? JSON.parse(stored) : DEFAULT_CATS;
    } catch { return DEFAULT_CATS; }
  });

  const emptyForm = (): Partial<FeedItem> => ({
    feed_type: 'news', title: '', source: '', category: categories[0]?.name ?? '',
    sub_category: '', link: '', summary: '', is_rss: false, rss_feed_url: '', status: 'draft',
  });

  const [form, setForm] = useState<Partial<FeedItem>>(emptyForm());
  const setF = (patch: Partial<FeedItem>) => setForm(f => ({ ...f, ...patch }));

  useEffect(() => { localStorage.setItem(catKey, JSON.stringify(categories)); }, [categories, catKey]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('feeds').select('*').order('created_at', { ascending: false });
    setItems((data as FeedItem[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditItem(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (item: FeedItem) => { setEditItem(item); setForm({ ...item }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title?.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    if (!form.source?.trim()) { toast({ title: 'Source is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload: any = {
      feed_type: form.feed_type, title: form.title, source: form.source, category: form.category,
      sub_category: form.sub_category || null, link: form.link || null, summary: form.summary || null,
      is_rss: form.is_rss ?? false, rss_feed_url: form.is_rss ? (form.rss_feed_url || null) : null,
      status: form.status,
      ...(form.status === 'published' ? { published_at: new Date().toISOString() } : {}),
    };
    const { error } = editItem
      ? await supabase.from('feeds').update(payload).eq('id', editItem.id)
      : await supabase.from('feeds').insert([payload]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editItem ? 'Updated' : 'Created' }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await supabase.from('feeds').delete().eq('id', id);
    fetchItems();
  };

  const toggleStatus = async (item: FeedItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await supabase.from('feeds').update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null }).eq('id', item.id);
    fetchItems();
  };

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchType = filterFeedType === 'all' || item.feed_type === filterFeedType;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const statusCounts = {
    all: items.length,
    published: items.filter(i => i.status === 'published').length,
    draft: items.filter(i => i.status === 'draft').length,
    archived: items.filter(i => i.status === 'archived').length,
  };

  return (
    <AdminLayout
      title="Feeds"
      subtitle="Manage news and regulatory circulars — standalone articles and RSS feeds"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Feed</Button>}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {([
          { key: 'all', label: 'Total' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Draft' },
          { key: 'archived', label: 'Archived' },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => { setFilterStatus(key); setPage(1); }} className={`border rounded-lg p-3 text-left transition-colors ${filterStatus === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{statusCounts[key]}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={filterFeedType} onValueChange={v => { setFilterFeedType(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {FEED_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Feed Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-36">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Mode</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>)
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No items found</td></tr>
              ) : paginated.map(item => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                    {item.summary && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.summary}</p>}
                    <div className="flex items-center gap-0.5 mt-1.5 flex-nowrap">
                      <RowActions actions={[
                        { label: item.status === 'published' ? 'Unpublish' : 'Publish', icon: item.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />, onClick: () => toggleStatus(item) },
                        { label: 'Edit', onClick: () => openEdit(item) },
                        { label: 'Delete', onClick: () => handleDelete(item.id), variant: 'destructive', separator: true },
                      ]} />
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top"><Badge variant="outline" className="text-xs capitalize">{item.feed_type}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground align-top text-xs">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs align-top">{item.source}</td>
                  <td className="px-4 py-3 align-top">
                    {item.is_rss ? <Badge variant="outline" className="text-xs gap-1"><Rss className="h-2.5 w-2.5" />RSS</Badge>
                      : <Badge variant="outline" className="text-xs gap-1"><Link className="h-2.5 w-2.5" />Manual</Badge>}
                  </td>
                  <td className="px-4 py-3 align-top"><Badge variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Feed' : 'New Feed'}</DialogTitle></DialogHeader>
          <div className="space-y-5 mt-2">
            {/* Feed type */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Feed Type <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip={TIPS.feed_type} />
              </div>
              <Select value={form.feed_type} onValueChange={(v: FeedType) => setF({ feed_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FEED_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Source type toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2 flex-1">
                <Link className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${!form.is_rss ? 'text-foreground' : 'text-muted-foreground'}`}>Standalone</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!form.is_rss} onCheckedChange={v => setF({ is_rss: v })} />
                <FieldInfoTooltip tip={TIPS.is_rss} />
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className={`text-sm font-medium ${form.is_rss ? 'text-foreground' : 'text-muted-foreground'}`}>RSS Feed</span>
                <Rss className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Title <span className="text-destructive">*</span></Label><FieldInfoTooltip tip={TIPS.title} /></div>
              <Input value={form.title ?? ''} onChange={e => setF({ title: e.target.value })} placeholder="Item title or feed name" />
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Source <span className="text-destructive">*</span></Label><FieldInfoTooltip tip={TIPS.source} /></div>
              <Input value={form.source ?? ''} onChange={e => setF({ source: e.target.value })} placeholder="e.g. Reuters, SEBI" />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Category</Label><FieldInfoTooltip tip={TIPS.category} /></div>
              <CategoryTreeManager categories={categories} onChange={setCategories} selected={form.category ?? ''} onSelect={v => setF({ category: v })} />
            </div>

            {/* Sub Category */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Sub Category</Label><FieldInfoTooltip tip={TIPS.sub_category} /></div>
              <Input value={form.sub_category ?? ''} onChange={e => setF({ sub_category: e.target.value })} placeholder="Optional sub-category" />
            </div>

            {/* Conditional: RSS URL or Link */}
            {form.is_rss ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5"><Label>RSS Feed URL</Label><FieldInfoTooltip tip={TIPS.rss_feed_url} /></div>
                <Input value={form.rss_feed_url ?? ''} onChange={e => setF({ rss_feed_url: e.target.value })} placeholder="https://example.com/feed.xml" />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5"><Label>Link</Label><FieldInfoTooltip tip={TIPS.link} /></div>
                <Input value={form.link ?? ''} onChange={e => setF({ link: e.target.value })} placeholder="https://..." />
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Summary</Label><FieldInfoTooltip tip={TIPS.summary} /></div>
              <Textarea value={form.summary ?? ''} onChange={e => setF({ summary: e.target.value })} rows={3} placeholder="Brief description..." />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><Label>Status</Label><FieldInfoTooltip tip={TIPS.status} /></div>
              <Select value={form.status} onValueChange={v => setF({ status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {editItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
