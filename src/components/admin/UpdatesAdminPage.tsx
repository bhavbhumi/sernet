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
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Rss, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoryTreeManager, type CategoryNode } from '@/components/admin/CategoryTreeManager';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';

// ─── Default category trees ───────────────────────────────────────────────────

const DEFAULT_NEWS_CATS: CategoryNode[] = [
  {
    name: 'Market News',
    children: [
      { name: 'Equities', children: [] },
      { name: 'Derivatives', children: [] },
    ],
  },
  {
    name: 'Corporate Actions',
    children: [
      { name: 'Dividends', children: [] },
      { name: 'Buybacks', children: [] },
      { name: 'Splits', children: [] },
    ],
  },
  { name: 'Economy', children: [] },
  { name: 'Global Markets', children: [] },
  { name: 'Commodities', children: [] },
];

const DEFAULT_CIRCULARS_CATS: CategoryNode[] = [
  {
    name: 'SEBI Circulars',
    children: [
      { name: 'Margin Rules', children: [] },
      { name: 'Investor Protection', children: [] },
    ],
  },
  { name: 'Exchange Notices', children: [{ name: 'NSE', children: [] }, { name: 'BSE', children: [] }] },
  { name: 'Depository', children: [{ name: 'CDSL', children: [] }, { name: 'NSDL', children: [] }] },
  { name: 'Policy Updates', children: [] },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  link: string | null;
  summary: string | null;
  is_rss: boolean | null;
  rss_feed_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface UpdatesAdminPageProps {
  mode: 'news' | 'circulars';
}

// ─── Info tips ────────────────────────────────────────────────────────────────

const TIPS = {
  title: 'The headline identifying this item. For RSS feeds, this becomes the feed name shown in listings.',
  source: 'The publishing organisation or outlet (e.g. Reuters, NSE, SEBI). Shown as the byline.',
  category: 'Group this item into a category or sub-category. Use the tree below to manage your category hierarchy.',
  link: 'Direct URL to the original article or notice. Users will be taken here when they click "Read more".',
  rss_feed_url: 'Paste the RSS/Atom feed URL. The system will periodically pull the latest entries from this feed automatically.',
  summary: 'A short description (1–3 sentences). Shown in the card preview before the user clicks through.',
  status: 'Draft items are invisible to the public. Set to Published to make this item live on the site.',
  is_rss: 'Toggle ON if this entry is powered by an RSS feed. Toggle OFF to manually add a standalone article link.',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdatesAdminPage({ mode }: UpdatesAdminPageProps) {
  const isNews = mode === 'news';
  const tableName = isNews ? 'news_items' : 'circulars';
  const title = isNews ? 'News' : 'Circulars';
  const subtitle = isNews
    ? 'Manage market news, corporate actions, and economic updates'
    : 'Manage SEBI circulars, exchange notices, and regulatory updates';

  const { toast } = useToast();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Category tree (persisted per table in localStorage for now)
  const catKey = `admin_cats_${tableName}`;
  const [categories, setCategories] = useState<CategoryNode[]>(() => {
    try {
      const stored = localStorage.getItem(catKey);
      return stored ? JSON.parse(stored) : (isNews ? DEFAULT_NEWS_CATS : DEFAULT_CIRCULARS_CATS);
    } catch { return isNews ? DEFAULT_NEWS_CATS : DEFAULT_CIRCULARS_CATS; }
  });

  const emptyForm = (): Partial<NewsItem> => ({
    title: '',
    source: '',
    category: categories[0]?.name ?? '',
    link: '',
    summary: '',
    is_rss: false,
    rss_feed_url: '',
    status: 'draft',
  });

  const [form, setForm] = useState<Partial<NewsItem>>(emptyForm());

  const setF = (patch: Partial<NewsItem>) => setForm(f => ({ ...f, ...patch }));

  // Persist categories
  useEffect(() => {
    localStorage.setItem(catKey, JSON.stringify(categories));
  }, [categories, catKey]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase.from(tableName as 'news_items' | 'circulars') as any)
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [mode]);

  const openNew = () => { setEditItem(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (item: NewsItem) => { setEditItem(item); setForm({ ...item }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title?.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    if (!form.source?.trim()) { toast({ title: 'Source is required', variant: 'destructive' }); return; }
    setSaving(true);

    const payload = {
      title: form.title,
      source: form.source,
      category: form.category,
      link: form.link || null,
      summary: form.summary || null,
      is_rss: form.is_rss ?? false,
      rss_feed_url: form.is_rss ? (form.rss_feed_url || null) : null,
      status: form.status,
      ...(form.status === 'published' ? { published_at: new Date().toISOString() } : {}),
    };

    const { error } = editItem
      ? await (supabase.from(tableName as any) as any).update(payload).eq('id', editItem.id)
      : await (supabase.from(tableName as any) as any).insert([payload]);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editItem ? 'Updated' : 'Created' }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await (supabase.from(tableName as any) as any).delete().eq('id', id);
    fetchItems();
  };

  const toggleStatus = async (item: NewsItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await (supabase.from(tableName as any) as any)
      .update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null })
      .eq('id', item.id);
    fetchItems();
  };

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout
      title={title}
      subtitle={subtitle}
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New</Button>}
    >
      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-36">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                <th className="px-4 py-3 w-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No items found. Click "New" to add one.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                    {item.summary && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.summary}</p>}
                    {/* Horizontal action bar */}
                    <div className="flex items-center gap-0.5 mt-1.5">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1" onClick={() => toggleStatus(item)}>
                        {item.status === 'published' ? <><EyeOff className="h-3 w-3" /> Unpublish</> : <><Eye className="h-3 w-3" /> Publish</>}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1" onClick={() => openEdit(item)}>
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive gap-1" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="line-clamp-1 text-xs">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs line-clamp-1">{item.source}</td>
                  <td className="px-4 py-3">
                    {item.is_rss ? (
                      <Badge variant="outline" className="text-xs gap-1"><Rss className="h-2.5 w-2.5" />RSS</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1"><Link className="h-2.5 w-2.5" />Manual</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 w-4" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Source type toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2 flex-1">
                <Link className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${!form.is_rss ? 'text-foreground' : 'text-muted-foreground'}`}>Standalone Article</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!form.is_rss}
                  onCheckedChange={v => setF({ is_rss: v })}
                />
                <FieldInfoTooltip tip={TIPS.is_rss} />
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className={`text-sm font-medium ${form.is_rss ? 'text-foreground' : 'text-muted-foreground'}`}>RSS Feed</span>
                <Rss className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip={TIPS.title} />
              </div>
              <Input
                id="title"
                placeholder={form.is_rss ? 'RSS feed display name (e.g. SEBI Official Feed)' : 'News headline or article title'}
                value={form.title ?? ''}
                onChange={e => setF({ title: e.target.value })}
              />
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="source">Source <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip={TIPS.source} />
              </div>
              <Input
                id="source"
                placeholder={isNews ? 'e.g. Reuters, Economic Times, Moneycontrol' : 'e.g. SEBI, NSE, BSE, CDSL'}
                value={form.source ?? ''}
                onChange={e => setF({ source: e.target.value })}
              />
            </div>

            {/* Category tree */}
            <CategoryTreeManager
              categories={categories}
              selected={form.category ?? ''}
              onSelect={cat => setF({ category: cat })}
              onChange={setCategories}
            />

            {/* Conditional URL fields */}
            {form.is_rss ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="rss_feed_url">RSS Feed URL</Label>
                  <FieldInfoTooltip tip={TIPS.rss_feed_url} />
                </div>
                <Input
                  id="rss_feed_url"
                  placeholder="https://www.sebi.gov.in/rss/circulars.xml"
                  value={form.rss_feed_url ?? ''}
                  onChange={e => setF({ rss_feed_url: e.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="link">Article / Notice URL</Label>
                  <FieldInfoTooltip tip={TIPS.link} />
                </div>
                <Input
                  id="link"
                  placeholder="https://..."
                  value={form.link ?? ''}
                  onChange={e => setF({ link: e.target.value })}
                />
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="summary">Summary</Label>
                <FieldInfoTooltip tip={TIPS.summary} />
              </div>
              <Textarea
                id="summary"
                placeholder="Brief description shown in the card preview..."
                rows={3}
                value={form.summary ?? ''}
                onChange={e => setF({ summary: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Status</Label>
                <FieldInfoTooltip tip={TIPS.status} />
              </div>
              <Select value={form.status ?? 'draft'} onValueChange={v => setF({ status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
