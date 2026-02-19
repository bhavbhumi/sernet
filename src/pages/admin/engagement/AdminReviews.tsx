
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star, Eye, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  name: string;
  occupation: string;
  city: string;
  country: string;
  rating: number;
  review: string;
  review_type: string;
  source: string;
  is_featured: boolean;
  status: string;
  created_at: string;
}

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = (supabase.from('reviews') as any).select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') query.eq('status', filterStatus);
    const { data } = await query;
    setReviews(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('reviews') as any).update({
      status,
      published_at: status === 'approved' ? new Date().toISOString() : null
    }).eq('id', id);
    toast({ title: `Review ${status}` });
    fetchReviews();
    setSelectedReview(null);
  };

  const toggleFeatured = async (item: Review) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('reviews') as any).update({ is_featured: !item.is_featured }).eq('id', item.id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('reviews') as any).delete().eq('id', id);
    fetchReviews();
  };

  const filtered = reviews.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.review.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Approve, reject, and feature client reviews submitted through the website"
    >
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reviews..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No reviews found</div>
        ) : filtered.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-xl p-5 flex gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
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
              </div>
              <p className="text-sm text-muted-foreground italic line-clamp-2 mb-2">"{review.review}"</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{review.name}</span>
                <span>{review.occupation}</span>
                <span>{review.city}, {review.country}</span>
                <span>via {review.source}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedReview(review)} title="View"><Eye className="h-4 w-4" /></Button>
              {review.status !== 'approved' && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-600" onClick={() => updateStatus(review.id, 'approved')} title="Approve">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
              {review.status !== 'rejected' && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => updateStatus(review.id, 'rejected')} title="Reject">
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${review.is_featured ? 'text-yellow-500' : ''}`} onClick={() => toggleFeatured(review)} title="Toggle Featured">
                <Star className={`h-4 w-4 ${review.is_featured ? 'fill-yellow-400' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(review.id)} title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
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
                <div><span className="text-muted-foreground">Location:</span> {selectedReview.city}, {selectedReview.country}</div>
                <div><span className="text-muted-foreground">Source:</span> {selectedReview.source}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => updateStatus(selectedReview.id, 'approved')}><CheckCircle className="h-4 w-4 mr-2" /> Approve</Button>
                <Button variant="destructive" className="flex-1" onClick={() => updateStatus(selectedReview.id, 'rejected')}><XCircle className="h-4 w-4 mr-2" /> Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
