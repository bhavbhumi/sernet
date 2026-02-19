
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
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Upload, X, Loader2, Heart, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  format: string;
  category: string;
  read_time: string;
  status: string;
  published_at: string | null;
  created_at: string;
  body: string;
  media_url: string;
  thumbnail_url: string;
  item_date: string | null;
}

const emptyForm = {
  title: '', excerpt: '', body: '', author: 'Research Desk',
  format: 'Text', category: '', read_time: '', media_url: '',
  thumbnail_url: '', status: 'draft', item_date: '',
};

export default function AdminArticles() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new');
  const [editItem, setEditItem] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Engagement counts
  const { data: likeCounts = {} } = useQuery({
    queryKey: ['admin-article-likes'],
    queryFn: async () => {
      const { data } = await supabase.from('article_likes').select('article_id');
      const counts: Record<string, number> = {};
      (data ?? []).forEach(r => { counts[r.article_id] = (counts[r.article_id] ?? 0) + 1; });
      return counts;
    },
  });

  const { data: shareCounts = {} } = useQuery({
    queryKey: ['admin-article-shares'],
    queryFn: async () => {
      const { data } = await supabase.from('article_shares').select('article_id');
      const counts: Record<string, number> = {};
      (data ?? []).forEach(r => { counts[r.article_id] = (counts[r.article_id] ?? 0) + 1; });
      return counts;
    },
  });

  const uploadFile = async (file: File, field: 'media_url' | 'thumbnail_url') => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Max file size is 5MB.', variant: 'destructive' });
      return;
    }
    const setter = field === 'media_url' ? setUploadingMedia : setUploadingThumb;
    setter(true);
    const ext = file.name.split('.').pop();
    const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: false });
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      const { data } = supabase.storage.from('cms-media').getPublicUrl(path);
      setForm(f => ({ ...f, [field]: data.publicUrl }));
      toast({ title: 'File uploaded' });
    }
    setter(false);
  };

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const openNew = () => { setEditItem(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: Article) => { setEditItem(item); setForm({ ...item, item_date: item.item_date ?? '' }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.category) {
      toast({ title: 'Required fields missing', description: 'Title and category are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      body: form.body,
      author: form.author,
      format: form.format as 'Text' | 'Image' | 'Audio' | 'Video',
      category: form.category,
      read_time: form.read_time,
      media_url: form.media_url,
      thumbnail_url: form.thumbnail_url,
      status: form.status as 'draft' | 'published' | 'archived',
      item_date: form.item_date || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    };
    const { error } = editItem
      ? await supabase.from('articles').update(payload).eq('id', editItem.id)
      : await supabase.from('articles').insert([payload]);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: editItem ? 'Article updated' : 'Article created' });
      setDialogOpen(false);
      fetchArticles();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchArticles();
  };

  const toggleStatus = async (item: Article) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await supabase.from('articles').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null
    }).eq('id', item.id);
    fetchArticles();
  };

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout
      title="Articles"
      subtitle="Manage insight articles — text, image, audio, and video formats"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Article</Button>}
    >
      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Format</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Author</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Engagement</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No articles found</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.excerpt}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary">{item.format}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.author}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-red-400" />
                        {likeCounts[item.id] ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5 text-blue-400" />
                        {shareCounts[item.id] ?? 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(item)} title={item.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {item.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Article' : 'New Article'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2 space-y-1.5">
              <Label>Title *</Label>
              <Input placeholder="Article title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Format</Label>
              <Select value={form.format} onValueChange={v => setForm(f => ({ ...f, format: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Text', 'Image', 'Audio', 'Video'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Input placeholder="e.g. Fundamentals, Markets" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input placeholder="Research Desk" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Read Time</Label>
              <Input placeholder="e.g. 6 min read" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea placeholder="Short summary..." rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Body Content (HTML supported)</Label>
              <Textarea placeholder="Full article body..." rows={8} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} className="font-mono text-xs" />
            </div>
            {/* Media file / URL */}
            <div className="col-span-2 space-y-1.5">
              <Label>Media File <span className="text-muted-foreground text-xs">(audio/video/image — max 5MB)</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste URL or upload a file →"
                  value={form.media_url}
                  onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))}
                  className="flex-1"
                />
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="audio/*,video/*,image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'media_url'); }}
                />
                <Button type="button" variant="outline" size="sm" disabled={uploadingMedia} onClick={() => mediaInputRef.current?.click()}>
                  {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span className="ml-1.5">{uploadingMedia ? 'Uploading…' : 'Upload'}</span>
                </Button>
                {form.media_url && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setForm(f => ({ ...f, media_url: '' }))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Thumbnail file / URL */}
            <div className="col-span-2 space-y-1.5">
              <Label>Thumbnail <span className="text-muted-foreground text-xs">(image — max 5MB)</span></Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL or upload →"
                  value={form.thumbnail_url}
                  onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  className="flex-1"
                />
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'thumbnail_url'); }}
                />
                <Button type="button" variant="outline" size="sm" disabled={uploadingThumb} onClick={() => thumbInputRef.current?.click()}>
                  {uploadingThumb ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span className="ml-1.5">{uploadingThumb ? 'Uploading…' : 'Upload'}</span>
                </Button>
                {form.thumbnail_url && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setForm(f => ({ ...f, thumbnail_url: '' }))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {form.thumbnail_url && (
                <img src={form.thumbnail_url} alt="Thumbnail preview" className="mt-2 h-24 rounded-lg object-cover border border-border" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Article Date <span className="text-muted-foreground text-xs">(shown on card)</span></Label>
              <Input type="date" value={form.item_date} onChange={e => setForm(f => ({ ...f, item_date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
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
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
