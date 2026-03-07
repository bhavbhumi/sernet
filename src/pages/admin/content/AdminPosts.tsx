
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Upload, X, Loader2, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { createTablePasteHandler } from '@/lib/tableUtils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PAGE_SIZE = 25;

const CONTENT_TYPES = [
  { value: 'article', label: 'Article' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'report', label: 'Report' },
] as const;

type ContentType = typeof CONTENT_TYPES[number]['value'];

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  author: string;
  category: string;
  sub_category: string | null;
  content_type: ContentType;
  read_time: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  body: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  item_date: string | null;
  file_url: string | null;
  source_url: string | null;
}

const emptyForm = {
  title: '', excerpt: '', body: '', author: 'Research Desk',
  content_type: 'article' as ContentType, category: '', sub_category: '',
  media_url: '', status: 'draft', item_date: '', file_url: '', source_url: '',
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

export default function AdminPosts() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterContentType, setFilterContentType] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new');
  const [editItem, setEditItem] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const { data: likeCounts = {} } = useQuery({
    queryKey: ['admin-post-likes'],
    queryFn: async () => {
      const { data } = await supabase.from('article_likes').select('article_id');
      const counts: Record<string, number> = {};
      (data ?? []).forEach(r => { counts[r.article_id] = (counts[r.article_id] ?? 0) + 1; });
      return counts;
    },
  });

  const { data: shareCounts = {} } = useQuery({
    queryKey: ['admin-post-shares'],
    queryFn: async () => {
      const { data } = await supabase.from('article_shares').select('article_id');
      const counts: Record<string, number> = {};
      (data ?? []).forEach(r => { counts[r.article_id] = (counts[r.article_id] ?? 0) + 1; });
      return counts;
    },
  });

  const uploadFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Max file size is 5MB.', variant: 'destructive' });
      return;
    }
    setUploadingMedia(true);
    const ext = file.name.split('.').pop();
    const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: false });
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      const { data } = supabase.storage.from('cms-media').getPublicUrl(path);
      setForm(f => ({ ...f, media_url: data.publicUrl }));
      toast({ title: 'File uploaded' });
    }
    setUploadingMedia(false);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setItems((data as Post[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditItem(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: Post) => {
    setEditItem(item);
    setForm({
      title: item.title, excerpt: item.excerpt ?? '', body: item.body ?? '',
      author: item.author, content_type: item.content_type, category: item.category,
      sub_category: item.sub_category ?? '', media_url: item.media_url ?? '',
      status: item.status, item_date: item.item_date ?? '',
      file_url: item.file_url ?? '', source_url: item.source_url ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) {
      toast({ title: 'Required fields missing', description: 'Title and category are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title, excerpt: form.excerpt || null, body: form.body || null, author: form.author,
      content_type: form.content_type, category: form.category, sub_category: form.sub_category || null,
      media_url: form.media_url || null, thumbnail_url: form.media_url || null,
      status: form.status, item_date: form.item_date || null,
      file_url: form.file_url || null, source_url: form.source_url || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    };
    const { error } = editItem
      ? await supabase.from('articles').update(payload).eq('id', editItem.id)
      : await supabase.from('articles').insert([payload]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editItem ? 'Post updated' : 'Post created' }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchItems();
  };

  const toggleStatus = async (item: Post) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await supabase.from('articles').update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null }).eq('id', item.id);
    fetchItems();
  };

  const filtered = items.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchCat = filterCategory === 'all' || a.category === filterCategory;
    const matchType = filterContentType === 'all' || a.content_type === filterContentType;
    return matchSearch && matchStatus && matchCat && matchType;
  });

  const categoryOptions = ['all', ...Array.from(new Set(items.map(a => a.category).filter(Boolean))).sort()];
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleFilterStatus = (v: string) => { setFilterStatus(v); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilterCategory = (v: string) => { setFilterCategory(v); setPage(1); };
  const handleFilterContentType = (v: string) => { setFilterContentType(v); setPage(1); };

  const statusCounts = {
    all: items.length,
    published: items.filter(a => a.status === 'published').length,
    draft: items.filter(a => a.status === 'draft').length,
    archived: items.filter(a => a.status === 'archived').length,
  };

  const contentTypeLabel = (ct: string) => CONTENT_TYPES.find(t => t.value === ct)?.label ?? ct;

  return (
    <AdminLayout
      title="Posts"
      subtitle="Unified content hub — articles, analysis, awareness, and reports"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Post</Button>}
    >
      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {([
          { key: 'all', label: 'Total' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Draft' },
          { key: 'archived', label: 'Archived' },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => handleFilterStatus(key)} className={`border rounded-lg p-3 text-left transition-colors ${filterStatus === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{statusCounts[key]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." className="pl-9" value={search} onChange={e => handleSearch(e.target.value)} />
        </div>
        <Select value={filterContentType} onValueChange={handleFilterContentType}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CONTENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={handleFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={handleFilterCategory}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            {categoryOptions.map(cat => (
              <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Author</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No posts found</td></tr>
              ) : paginated.map(item => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.excerpt}</p>
                    <div className="flex items-center gap-0.5 mt-1.5 flex-nowrap">
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
                  <td className="px-4 py-3 align-top"><Badge variant="outline" className="text-xs">{contentTypeLabel(item.content_type)}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs align-top">
                    {(item.item_date || item.published_at)
                      ? new Date(item.item_date ?? item.published_at!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground align-top">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground align-top">{item.author}</td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-400" />{likeCounts[item.id] ?? 0}</span>
                      <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5 text-sky-400" />{shareCounts[item.id] ?? 0}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Title <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip="The main headline. Keep it concise and descriptive for SEO." />
              </div>
              <Input placeholder="Post title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Content Type <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip="Determines which section this post appears in: Article, Analysis, Awareness, or Report." />
              </div>
              <Select value={form.content_type} onValueChange={(v: ContentType) => setForm(f => ({ ...f, content_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Category <span className="text-destructive">*</span></Label>
                <FieldInfoTooltip tip="Topic category for filtering (e.g. Fundamentals, Markets, Financial Literacy)." />
              </div>
              <Input placeholder="e.g. Fundamentals, Markets" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Sub Category</Label>
                <FieldInfoTooltip tip="Optional sub-category for finer classification within the category." />
              </div>
              <Input placeholder="e.g. IPO, Derivatives" value={form.sub_category} onChange={e => setForm(f => ({ ...f, sub_category: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Post Date</Label>
                <FieldInfoTooltip tip="The publication date shown on the card. If blank, the publish timestamp is used." />
              </div>
              <Input type="date" value={form.item_date} onChange={e => setForm(f => ({ ...f, item_date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Author</Label>
                <FieldInfoTooltip tip="Author name displayed on the card. Defaults to 'Research Desk'." />
              </div>
              <Input placeholder="Research Desk" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Status</Label>
                <FieldInfoTooltip tip="Draft keeps the post hidden. Published makes it live. Archived removes from public view." />
              </div>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.content_type === 'report' && (
              <div className="col-span-2 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>PDF File URL</Label>
                  <FieldInfoTooltip tip="Publicly accessible download URL for the report PDF." />
                </div>
                <Input placeholder="https://..." value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} />
              </div>
            )}

            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Excerpt</Label>
                <FieldInfoTooltip tip="A short 2–3 sentence summary shown on the card." />
              </div>
              <Textarea placeholder="Short summary..." rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>

            {form.content_type !== 'report' && (
              <div className="col-span-2 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Body Content</Label>
                  <FieldInfoTooltip tip="Markdown body. Use # headings, **bold**, > blockquotes, - lists, [text](url). Read time is auto-calculated." />
                </div>
                <Textarea
                  placeholder="Write your content in Markdown..."
                  rows={12}
                  className="font-mono text-sm"
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  onPaste={createTablePasteHandler((md) => setForm(f => ({ ...f, body: (f.body ? f.body + '\n\n' + md : md) })))}
                />
              </div>
            )}

            {/* Media upload */}
            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label>Media / Thumbnail</Label>
                <FieldInfoTooltip tip="Upload an image, audio, or video file. Also used as the listing thumbnail." />
              </div>
              {form.media_url ? (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  {/\.(jpg|jpeg|png|gif|webp|svg)/i.test(form.media_url) && (
                    <img src={form.media_url} alt="" className="w-16 h-12 object-cover rounded" />
                  )}
                  <span className="flex-1 text-xs text-muted-foreground truncate">{form.media_url}</span>
                  <Button variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, media_url: '' }))}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input placeholder="Paste URL or upload..." value={form.media_url} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))} className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => mediaInputRef.current?.click()} disabled={uploadingMedia}>
                    {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input ref={mediaInputRef} type="file" className="hidden" accept="image/*,audio/*,video/*" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
                </div>
              )}
            </div>

            {form.content_type !== 'report' && (
              <div className="col-span-2 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Source URL</Label>
                  <FieldInfoTooltip tip="Original source URL if this content was imported or syndicated." />
                </div>
                <Input placeholder="https://..." value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} />
              </div>
            )}
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
