
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Pencil, Eye, EyeOff, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SitePage {
  id: string;
  title: string;
  path: string;
  section: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  maintenance_mode: boolean;
  status: string;
  sort_order: number;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: 'live', label: 'Live', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200' },
  { value: 'hidden', label: 'Hidden', color: 'bg-muted text-muted-foreground border-border' },
  { value: 'coming_soon', label: 'Coming Soon', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200' },
];

function StatusBadge({ status, maintenance }: { status: string; maintenance: boolean }) {
  if (maintenance) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200">
        <AlertTriangle className="h-3 w-3" /> Maintenance
      </span>
    );
  }
  const s = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${s.color}`}>
      {status === 'live' && <CheckCircle2 className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

export default function AdminSitePages() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [editPage, setEditPage] = useState<SitePage | null>(null);
  const baseUrl = window.location.origin.replace(/\/admin.*/, '');

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['site_pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_pages' as any)
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data as unknown) as SitePage[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<SitePage> & { id: string }) => {
      const { id, ...rest } = updates;
      const { error } = await supabase.from('site_pages' as any).update(rest).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_pages'] });
      toast.success('Page updated');
      setEditPage(null);
    },
    onError: () => toast.error('Failed to update page'),
  });

  const sections = ['All', ...Array.from(new Set(pages.map(p => p.section)))];

  const filtered = pages.filter(p => {
    const inSection = activeTab === 'All' || p.section === activeTab;
    const inSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.path.toLowerCase().includes(search.toLowerCase());
    return inSection && inSearch;
  });

  const grouped = sections
    .filter(s => s !== 'All')
    .map(s => ({ section: s, pages: filtered.filter(p => p.section === s) }))
    .filter(g => g.pages.length > 0);

  const displayGroups = activeTab === 'All' ? grouped : grouped.filter(g => g.section === activeTab);

  // Stats
  const total = pages.length;
  const live = pages.filter(p => p.status === 'live' && !p.maintenance_mode).length;
  const maintenance = pages.filter(p => p.maintenance_mode).length;
  const hidden = pages.filter(p => p.status === 'hidden').length;
  const seoMissing = pages.filter(p => !p.meta_title || !p.meta_description).length;

  const handleQuickToggle = (page: SitePage, field: 'maintenance_mode' | 'status') => {
    if (field === 'maintenance_mode') {
      updateMutation.mutate({ id: page.id, maintenance_mode: !page.maintenance_mode });
    } else {
      updateMutation.mutate({ id: page.id, status: page.status === 'live' ? 'hidden' : 'live' });
    }
  };

  return (
    <AdminLayout
      title="Page Directory"
      subtitle="Manage SEO metadata, visibility and maintenance status for every page"
    >
      {/* Stat chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Total Pages', value: total, color: 'bg-muted/60 text-foreground border-border' },
          { label: 'Live', value: live, color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200' },
          { label: 'Maintenance', value: maintenance, color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200' },
          { label: 'Hidden', value: hidden, color: 'bg-muted text-muted-foreground border-border' },
          { label: 'SEO Incomplete', value: seoMissing, color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200' },
        ].map(chip => (
          <span key={chip.label} className={`text-xs font-medium px-3 py-1 rounded-full border ${chip.color}`}>
            {chip.label}: <span className="font-bold">{chip.value}</span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Section tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1">
          {sections.map(s => (
            <TabsTrigger key={s} value={s} className="text-xs px-3 py-1.5">{s}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading pages…</p>
          ) : displayGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No pages found.</p>
          ) : displayGroups.map(group => (
            <div key={group.section}>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                {group.section}
                <Badge variant="secondary" className="text-xs font-normal">{group.pages.length} pages</Badge>
              </h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Page / Path</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden lg:table-cell">SEO Title</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden xl:table-cell">Meta Description</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-32">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.pages.map(page => (
                      <tr key={page.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{page.title}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{page.path}</p>
                          {/* Action bar */}
                          <div className="flex items-center gap-0.5 mt-1.5">
                            <Button
                              variant="ghost" size="sm"
                              className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditPage(page)}
                            >
                              <Pencil className="h-3 w-3" /> Edit SEO
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className={`h-6 px-2 text-xs gap-1 ${page.maintenance_mode ? 'text-orange-600' : 'text-muted-foreground'} hover:text-foreground`}
                              onClick={() => handleQuickToggle(page, 'maintenance_mode')}
                            >
                              <AlertTriangle className="h-3 w-3" />
                              {page.maintenance_mode ? 'Live Mode' : 'Maintenance'}
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() => window.open(`${baseUrl}${page.path}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" /> Visit
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {page.meta_title
                            ? <span className="text-xs text-foreground">{page.meta_title}</span>
                            : <span className="text-xs text-red-500 italic">Missing</span>
                          }
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          {page.meta_description
                            ? <span className="text-xs text-muted-foreground line-clamp-2">{page.meta_description}</span>
                            : <span className="text-xs text-red-500 italic">Missing</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={page.status} maintenance={page.maintenance_mode} />
                          <div className="mt-1.5">
                            <Button
                              variant="ghost" size="sm"
                              className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() => handleQuickToggle(page, 'status')}
                            >
                              {page.status === 'live' ? <><EyeOff className="h-3 w-3" /> Hide</> : <><Eye className="h-3 w-3" /> Show</>}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit SEO Dialog */}
      {editPage && (
        <Dialog open onOpenChange={() => setEditPage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Page — {editPage.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs text-muted-foreground">Page Path</Label>
                <p className="font-mono text-sm text-muted-foreground mt-0.5">{editPage.path}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta_title">SEO Meta Title <span className="text-muted-foreground text-xs">(60 chars max)</span></Label>
                <Input
                  id="meta_title"
                  maxLength={60}
                  value={editPage.meta_title ?? ''}
                  onChange={e => setEditPage({ ...editPage, meta_title: e.target.value })}
                  placeholder="e.g. SERNET – Zero Brokerage Trading"
                />
                <p className="text-xs text-muted-foreground text-right">{(editPage.meta_title ?? '').length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta_desc">SEO Meta Description <span className="text-muted-foreground text-xs">(160 chars max)</span></Label>
                <Textarea
                  id="meta_desc"
                  maxLength={160}
                  rows={3}
                  value={editPage.meta_description ?? ''}
                  onChange={e => setEditPage({ ...editPage, meta_description: e.target.value })}
                  placeholder="Short description shown in search results…"
                />
                <p className="text-xs text-muted-foreground text-right">{(editPage.meta_description ?? '').length}/160</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pg_status">Page Status</Label>
                <Select
                  value={editPage.status}
                  onValueChange={v => setEditPage({ ...editPage, status: v })}
                >
                  <SelectTrigger id="pg_status" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Visitors will see a maintenance notice</p>
                </div>
                <Switch
                  checked={editPage.maintenance_mode}
                  onCheckedChange={v => setEditPage({ ...editPage, maintenance_mode: v })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPage(null)}>Cancel</Button>
              <Button
                onClick={() => updateMutation.mutate({
                  id: editPage.id,
                  meta_title: editPage.meta_title,
                  meta_description: editPage.meta_description,
                  status: editPage.status,
                  maintenance_mode: editPage.maintenance_mode,
                })}
                disabled={updateMutation.isPending}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
