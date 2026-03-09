
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
import {
  ExternalLink, Eye, EyeOff, AlertTriangle, CheckCircle2,
  Search, Plus, Archive, Globe,
} from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { toast } from 'sonner';

interface SitePage {
  id: string;
  title: string;
  path: string;
  section: string;
  tab_name: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  maintenance_mode: boolean;
  status: string;
  sort_order: number;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: 'live', label: 'Live', color: 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400' },
  { value: 'hidden', label: 'Hidden', color: 'bg-muted text-muted-foreground border-border' },
  { value: 'coming_soon', label: 'Coming Soon', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400' },
  { value: 'archived', label: 'Archived', color: 'bg-destructive/10 text-destructive border-destructive/30' },
];

const SECTIONS = ['Main', 'About', 'Network', 'Insights', 'Tools', 'Engagement', 'Support', 'Legal', 'Company'];

function StatusBadge({ status, maintenance }: { status: string; maintenance: boolean }) {
  if (maintenance) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border bg-warning/10 text-warning border-warning/30">
      <AlertTriangle className="h-3 w-3" /> Maintenance
    </span>
  );
  const s = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${s.color}`}>
      {status === 'live' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'archived' && <Archive className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

const BLANK_PAGE: Partial<SitePage> = {
  title: '', path: '', section: 'Main', tab_name: '',
  meta_title: '', meta_description: '', description: '',
  status: 'live', maintenance_mode: false, sort_order: 0,
};

export default function AdminSitePages() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [editPage, setEditPage] = useState<SitePage | null>(null);
  const [newPage, setNewPage] = useState<Partial<SitePage> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<SitePage | null>(null);
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_pages'] }); toast.success('Page updated'); setEditPage(null); },
    onError: () => toast.error('Failed to update page'),
  });

  const createMutation = useMutation({
    mutationFn: async (page: Partial<SitePage>) => {
      const { error } = await supabase.from('site_pages' as any).insert(page);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_pages'] }); toast.success('Page created'); setNewPage(null); },
    onError: () => toast.error('Failed to create page'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('site_pages' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_pages'] }); toast.success('Page deleted'); setDeleteConfirm(null); },
    onError: () => toast.error('Failed to delete'),
  });

  const sections = ['All', ...Array.from(new Set(pages.map(p => p.section))).sort()];

  const filtered = pages.filter(p => {
    const inSection = activeTab === 'All' || p.section === activeTab;
    const inSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase()) ||
      (p.tab_name || '').toLowerCase().includes(search.toLowerCase());
    return inSection && inSearch;
  });

  const grouped = sections
    .filter(s => s !== 'All')
    .map(s => ({ section: s, pages: filtered.filter(p => p.section === s) }))
    .filter(g => g.pages.length > 0);

  const displayGroups = activeTab === 'All' ? grouped : grouped.filter(g => g.section === activeTab);

  const total = pages.length;
  const live = pages.filter(p => p.status === 'live' && !p.maintenance_mode).length;
  const maintenance = pages.filter(p => p.maintenance_mode).length;
  const hidden = pages.filter(p => p.status === 'hidden').length;
  const archived = pages.filter(p => p.status === 'archived').length;
  const seoMissing = pages.filter(p => !p.meta_title || !p.meta_description).length;

  const quickStatus = (page: SitePage, status: string) => updateMutation.mutate({ id: page.id, status });
  const quickMaintenance = (page: SitePage) => updateMutation.mutate({ id: page.id, maintenance_mode: !page.maintenance_mode });

  return (
    <AdminLayout title="Page Directory" subtitle="Manage SEO, visibility, tab names and maintenance status for every route">

      {/* Stat chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Total', value: total, color: 'bg-muted/60 text-foreground border-border' },
          { label: 'Live', value: live, color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200' },
          { label: 'Maintenance', value: maintenance, color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200' },
          { label: 'Hidden', value: hidden, color: 'bg-muted text-muted-foreground border-border' },
          { label: 'Archived', value: archived, color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200' },
          { label: 'SEO Incomplete', value: seoMissing, color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200' },
        ].map(chip => (
          <span key={chip.label} className={`text-xs font-medium px-3 py-1 rounded-full border ${chip.color}`}>
            {chip.label}: <span className="font-bold">{chip.value}</span>
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search pages…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setNewPage({ ...BLANK_PAGE })}>
          <Plus className="h-3.5 w-3.5" /> Add Page
        </Button>
      </div>

      {/* Section tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1">
          {sections.map(s => <TabsTrigger key={s} value={s} className="text-xs px-3 py-1.5">{s}</TabsTrigger>)}
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
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">Page / Path</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs hidden md:table-cell">Tab Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs hidden lg:table-cell">SEO Title</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.pages.map(page => (
                      <tr key={page.id} className="hover:bg-muted/20 align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground text-sm">{page.title}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{page.path}</p>
                          <div className="flex flex-wrap items-center gap-0.5 mt-1.5">
                            <RowActions actions={[
                              { label: 'Edit', onClick: () => setEditPage(page) },
                              { label: 'Publish', icon: <Globe className="h-3.5 w-3.5" />, onClick: () => quickStatus(page, 'live'), disabled: page.status === 'live' },
                              { label: 'Unpublish', icon: <EyeOff className="h-3.5 w-3.5" />, onClick: () => quickStatus(page, 'hidden'), disabled: page.status === 'hidden' },
                              { label: 'Archive', onClick: () => quickStatus(page, 'archived'), disabled: page.status === 'archived' },
                              { label: page.maintenance_mode ? 'Go Live' : 'Maintenance', icon: <AlertTriangle className="h-3.5 w-3.5" />, onClick: () => quickMaintenance(page) },
                              { label: 'Visit', icon: <ExternalLink className="h-3.5 w-3.5" />, onClick: () => window.open(`${baseUrl}${page.path}`, '_blank') },
                            ]} />
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{page.tab_name || '—'}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {page.meta_title
                            ? <span className="text-xs text-foreground">{page.meta_title}</span>
                            : <span className="text-xs text-muted-foreground italic">Missing</span>
                          }
                          {page.meta_description
                            ? <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{page.meta_description}</p>
                            : <p className="text-xs text-muted-foreground italic mt-0.5">No description</p>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={page.status} maintenance={page.maintenance_mode} />
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

      {/* Edit Dialog */}
      {editPage && (
        <Dialog open onOpenChange={() => setEditPage(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Page — {editPage.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Page Title</Label>
                  <Input value={editPage.title} onChange={e => setEditPage({ ...editPage, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tab Name</Label>
                  <Input value={editPage.tab_name ?? ''} onChange={e => setEditPage({ ...editPage, tab_name: e.target.value })} placeholder="e.g. Company" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Path</Label>
                  <Input value={editPage.path} onChange={e => setEditPage({ ...editPage, path: e.target.value })} className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label>Section</Label>
                  <Select value={editPage.section} onValueChange={v => setEditPage({ ...editPage, section: v })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description <span className="text-xs text-muted-foreground">(internal note)</span></Label>
                <Input value={editPage.description ?? ''} onChange={e => setEditPage({ ...editPage, description: e.target.value })} placeholder="Brief note about this page…" />
              </div>
              <div className="space-y-1.5">
                <Label>SEO Meta Title <span className="text-muted-foreground text-xs">(60 chars)</span></Label>
                <Input maxLength={60} value={editPage.meta_title ?? ''} onChange={e => setEditPage({ ...editPage, meta_title: e.target.value })} />
                <p className="text-xs text-muted-foreground text-right">{(editPage.meta_title ?? '').length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label>SEO Meta Description <span className="text-muted-foreground text-xs">(160 chars)</span></Label>
                <Textarea maxLength={160} rows={3} value={editPage.meta_description ?? ''} onChange={e => setEditPage({ ...editPage, meta_description: e.target.value })} />
                <p className="text-xs text-muted-foreground text-right">{(editPage.meta_description ?? '').length}/160</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={editPage.status} onValueChange={v => setEditPage({ ...editPage, status: v })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input type="number" value={editPage.sort_order} onChange={e => setEditPage({ ...editPage, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Visitors see a maintenance notice</p>
                </div>
                <Switch checked={editPage.maintenance_mode} onCheckedChange={v => setEditPage({ ...editPage, maintenance_mode: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPage(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate({
                id: editPage.id, title: editPage.title, path: editPage.path,
                section: editPage.section, tab_name: editPage.tab_name,
                description: editPage.description, meta_title: editPage.meta_title,
                meta_description: editPage.meta_description, status: editPage.status,
                maintenance_mode: editPage.maintenance_mode, sort_order: editPage.sort_order,
              })} disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add New Page Dialog */}
      {newPage !== null && (
        <Dialog open onOpenChange={() => setNewPage(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Page</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Page Title *</Label>
                  <Input value={newPage.title || ''} onChange={e => setNewPage({ ...newPage, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tab Name</Label>
                  <Input value={newPage.tab_name || ''} onChange={e => setNewPage({ ...newPage, tab_name: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Path *</Label>
                  <Input value={newPage.path || ''} onChange={e => setNewPage({ ...newPage, path: e.target.value })} className="font-mono text-xs" placeholder="/my-page" />
                </div>
                <div className="space-y-1.5">
                  <Label>Section</Label>
                  <Select value={newPage.section || 'Main'} onValueChange={v => setNewPage({ ...newPage, section: v })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>SEO Meta Title</Label>
                <Input maxLength={60} value={newPage.meta_title || ''} onChange={e => setNewPage({ ...newPage, meta_title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>SEO Meta Description</Label>
                <Textarea maxLength={160} rows={3} value={newPage.meta_description || ''} onChange={e => setNewPage({ ...newPage, meta_description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={newPage.status || 'live'} onValueChange={v => setNewPage({ ...newPage, status: v })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewPage(null)}>Cancel</Button>
              <Button onClick={() => {
                if (!newPage.title || !newPage.path) return toast.error('Title and Path are required');
                createMutation.mutate(newPage);
              }} disabled={createMutation.isPending}>
                Create Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <Dialog open onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Delete Page</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{deleteConfirm.title}</span> (<code className="text-xs">{deleteConfirm.path}</code>) from the directory? This cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteConfirm.id)} disabled={deleteMutation.isPending}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
