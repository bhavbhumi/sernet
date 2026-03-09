
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star, Eye, Search, Plus } from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

interface Review {
  id: string;
  name: string;
  occupation: string | null;
  city: string | null;
  country: string | null;
  rating: number;
  review: string;
  review_type: string | null;
  source: string | null;
  is_featured: boolean | null;
  status: string;
  created_at: string;
  published_at: string | null;
  video_url: string | null;
  has_video: boolean | null;
}

const emptyForm = () => ({
  name: '', occupation: '', city: '', country: 'IN',
  rating: 5, review: '', review_type: 'Client', source: 'website',
  video_url: '', has_video: false,
});

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editItem, setEditItem] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    let query = db('reviews').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (filterType !== 'all') query = query.eq('review_type', filterType);
    const { data } = await query;
    setReviews(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [filterStatus, filterType]);

  const updateStatus = async (id: string, status: string) => {
    await db('reviews').update({
      status,
      published_at: status === 'approved' ? new Date().toISOString() : null
    }).eq('id', id);
    toast({ title: `Review ${status}` });
    fetchReviews();
    setSelectedReview(null);
  };

  const toggleFeatured = async (item: Review) => {
    await db('reviews').update({ is_featured: !item.is_featured }).eq('id', item.id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await db('reviews').delete().eq('id', id);
    fetchReviews();
  };

  const openNew = () => {
    setEditItem(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (r: Review) => {
    setEditItem(r);
    setForm({
      name: r.name, occupation: r.occupation ?? '', city: r.city ?? '', country: r.country ?? 'IN',
      rating: r.rating, review: r.review, review_type: r.review_type ?? 'Client', source: r.source ?? 'website',
      video_url: r.video_url ?? '', has_video: r.has_video ?? false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) {
      toast({ title: 'Name and review are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      occupation: form.occupation.trim() || null,
      city: form.city.trim() || null,
      country: form.country,
      rating: form.rating,
      review: form.review.trim(),
      review_type: form.review_type,
      source: form.source,
      video_url: form.video_url.trim() || null,
      has_video: !!form.video_url.trim(),
    };
    if (editItem) {
      await db('reviews').update(payload).eq('id', editItem.id);
      toast({ title: 'Review updated' });
    } else {
      await db('reviews').insert([{ ...payload, status: 'approved', published_at: new Date().toISOString() }]);
      toast({ title: 'Review added and published' });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchReviews();
  };

  // Stats by type
  const typeCounts = reviews.reduce<Record<string, number>>((acc, r) => {
    const t = r.review_type ?? 'Unknown';
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = reviews.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.review.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Approve, reject, and feature reviews from Clients, Partners, Employees and Principals"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Review</Button>}
    >
      {/* Type stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {['Client', 'Partner', 'Employee', 'Principal'].map(type => (
          <div
            key={type}
            onClick={() => setFilterType(filterType === type.toLowerCase() ? 'all' : type)}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${filterType === type ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
          >
            <p className="text-xs text-muted-foreground">{type}s</p>
            <p className="text-xl font-semibold text-foreground">{typeCounts[type] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reviews..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Client">Client</SelectItem>
            <SelectItem value="Partner">Partner</SelectItem>
            <SelectItem value="Employee">Employee</SelectItem>
            <SelectItem value="Principal">Principal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No reviews found</div>
        ) : filtered.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
                <span className="text-sm font-semibold ml-1">{review.rating}</span>
              </div>
              <Badge variant="secondary">{review.review_type}</Badge>
              <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'}>
                {review.status}
              </Badge>
              {review.is_featured && <Badge>Featured</Badge>}
              {review.has_video && <Badge variant="outline">📹 Video</Badge>}
            </div>
            <p className="text-sm text-muted-foreground italic line-clamp-2 mb-2">"{review.review}"</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mb-3">
              <span className="font-medium text-foreground">{review.name}</span>
              {review.occupation && <span>{review.occupation}</span>}
              {(review.city || review.country) && <span>{[review.city, review.country].filter(Boolean).join(', ')}</span>}
              {review.source && <span>via {review.source}</span>}
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 pt-2 border-t border-border/60 flex-wrap">
              <RowActions actions={[
                { label: 'View', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => setSelectedReview(review) },
                { label: 'Edit', onClick: () => openEdit(review) },
                { label: review.status !== 'approved' ? 'Approve' : 'Approved', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: () => updateStatus(review.id, 'approved'), hidden: review.status === 'approved' },
                { label: review.status !== 'rejected' ? 'Reject' : 'Rejected', icon: <XCircle className="h-3.5 w-3.5" />, onClick: () => updateStatus(review.id, 'rejected'), hidden: review.status === 'rejected', variant: 'destructive' },
                { label: review.is_featured ? 'Unfeature' : 'Feature', icon: <Star className={`h-3.5 w-3.5 ${review.is_featured ? 'fill-yellow-400' : ''}`} />, onClick: () => toggleFeatured(review) },
                { label: 'Delete', onClick: () => handleDelete(review.id), variant: 'destructive', separator: true },
              ]} />
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review by {selectedReview?.name}</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(selectedReview.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
                <span className="text-sm font-semibold ml-1.5">{selectedReview.rating}</span>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">"{selectedReview.review}"</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {selectedReview.name}</div>
                <div><span className="text-muted-foreground">Type:</span> {selectedReview.review_type}</div>
                <div><span className="text-muted-foreground">Occupation:</span> {selectedReview.occupation ?? '—'}</div>
                <div><span className="text-muted-foreground">Location:</span> {[selectedReview.city, selectedReview.country].filter(Boolean).join(', ')}</div>
                <div><span className="text-muted-foreground">Source:</span> {selectedReview.source}</div>
                <div><span className="text-muted-foreground">Status:</span> {selectedReview.status}</div>
                {selectedReview.video_url && <div className="col-span-2"><span className="text-muted-foreground">Video:</span> <a href={selectedReview.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{selectedReview.video_url}</a></div>}
              </div>
              <div className="flex gap-2 pt-2">
                {selectedReview.status !== 'approved' && <Button className="flex-1" onClick={() => updateStatus(selectedReview.id, 'approved')}><CheckCircle className="h-4 w-4 mr-2" /> Approve</Button>}
                {selectedReview.status !== 'rejected' && <Button variant="destructive" className="flex-1" onClick={() => updateStatus(selectedReview.id, 'rejected')}><XCircle className="h-4 w-4 mr-2" /> Reject</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Review' : 'Add Review'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input placeholder="Reviewer name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Occupation</Label>
                <Input placeholder="e.g. Business Owner" value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input placeholder="Mumbai" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select value={form.country} onValueChange={v => setForm(f => ({ ...f, country: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">🇮🇳 India</SelectItem>
                    <SelectItem value="US">🇺🇸 USA</SelectItem>
                    <SelectItem value="UK">🇬🇧 UK</SelectItem>
                    <SelectItem value="AE">🇦🇪 UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.review_type} onValueChange={v => setForm(f => ({ ...f, review_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, rating: r }))} className="transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${r <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground self-center">{form.rating}.0</span>
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Review *</Label>
                <Textarea placeholder="Review text..." rows={4} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Video URL (optional)</Label>
                <Input placeholder="https://youtube.com/..." value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Add & Publish'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
