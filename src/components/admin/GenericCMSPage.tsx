
// Generic CMS table page factory for simple content types
// Used by: Reports, Bulletin, News, Circulars, Press

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';
import { logAudit } from '@/lib/auditLog';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'url' | 'html' | 'checkbox' | 'date';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  colSpan?: number;
  tip?: string;
}

interface GenericCMSPageProps {
  title: string;
  subtitle: string;
  tableName: string;
  fields: FieldDef[];
  emptyForm: Record<string, string | number | boolean | string[]>;
  tableColumns: { key: string; label: string; width?: string; format?: 'date' }[];
  hasStatus?: boolean;
  hasFeatured?: boolean;
  categoryField?: string; // e.g. 'category', 'report_type' — enables category filter dropdown
  headerActions?: React.ReactNode; // optional extra buttons in the header bar
  orderBy?: { column: string; ascending: boolean }; // custom sort order
  onRowAction?: (item: Record<string, unknown>) => React.ReactNode; // custom action button per row
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (tableName: string) => supabase.from(tableName as any) as any;

const PAGE_SIZE = 25;

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
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Prev
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`min-w-[28px] h-7 px-1.5 text-xs rounded-md border transition-colors font-medium ${
              page === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function formatCellDate(val: unknown): string {
  if (!val) return '—';
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function GenericCMSPage({
  title, subtitle, tableName, fields, emptyForm: defaultForm, tableColumns, hasStatus = true, hasFeatured = false, categoryField, headerActions, orderBy, onRowAction
}: GenericCMSPageProps) {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new');
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const sortCol = orderBy?.column ?? 'published_at';
    const sortAsc = orderBy?.ascending ?? false;
    const { data } = await db(tableName).select('*')
      .order(sortCol, { ascending: sortAsc, nullsFirst: false })
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditItem(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (item: Record<string, unknown>) => { setEditItem(item); setForm({ ...item }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    const adminEnteredDate = form.published_at ? String(form.published_at).trim() : '';
    const payload = {
      ...form,
      ...(hasStatus && form.status === 'published' && !adminEnteredDate
        ? { published_at: new Date().toISOString() }
        : {}),
    };
    const { error } = editItem
      ? await db(tableName).update(payload).eq('id', editItem.id as string)
      : await db(tableName).insert([payload]);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      logAudit({
        action: editItem ? 'update' : 'create',
        entity_type: tableName,
        entity_id: editItem ? String(editItem.id) : undefined,
        details: { title: form.title || form.question || form.name || '' },
      });
      toast({ title: editItem ? 'Updated successfully' : 'Created successfully' }); setDialogOpen(false); fetchItems();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const item = items.find(i => String(i.id) === id);
    await db(tableName).delete().eq('id', id);
    logAudit({ action: 'delete', entity_type: tableName, entity_id: id, details: { title: item?.title || '' } });
    fetchItems();
  };

  const toggleFeatured = async (item: Record<string, unknown>) => {
    const newVal = !item.is_featured;
    await db(tableName).update({ is_featured: newVal }).eq('id', item.id as string);
    logAudit({ action: newVal ? 'feature' : 'unfeature', entity_type: tableName, entity_id: String(item.id) });
    fetchItems();
  };

  const toggleStatus = async (item: Record<string, unknown>) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const existingDate = item.published_at ? String(item.published_at).trim() : '';
    await db(tableName).update({
      status: newStatus,
      ...(newStatus === 'published' && !existingDate ? { published_at: new Date().toISOString() } : {}),
    }).eq('id', item.id as string);
    logAudit({ action: newStatus === 'published' ? 'publish' : 'unpublish', entity_type: tableName, entity_id: String(item.id), details: { title: item.title || '' } });
    fetchItems();
  };

  const filtered = items.filter(item => {
    const titleVal = String(item.title ?? '');
    const matchSearch = titleVal.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !hasStatus || filterStatus === 'all' || item.status === filterStatus;
    const matchCat = !categoryField || filterCategory === 'all' || String(item[categoryField] ?? '') === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const categoryOptions = categoryField
    ? ['all', ...Array.from(new Set(items.map(i => String(i[categoryField] ?? '')).filter(Boolean))).sort()]
    : [];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when filter changes
  const handleFilterStatus = (v: string) => { setFilterStatus(v); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilterCategory = (v: string) => { setFilterCategory(v); setPage(1); };

  // Status counts for stat chips
  const statusCounts = hasStatus ? {
    all: items.length,
    draft: items.filter(i => i.status === 'draft').length,
    published: items.filter(i => i.status === 'published').length,
    archived: items.filter(i => i.status === 'archived').length,
  } : null;

  const colSpan = tableColumns.length + 1;

  return (
    <AdminLayout
      title={title}
      subtitle={subtitle}
      actions={<div className="flex items-center gap-2">{headerActions}<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New</Button></div>}
    >
      {/* Status stat chips */}
      {statusCounts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {([
            { key: 'all', label: 'Total' },
            { key: 'published', label: 'Published' },
            { key: 'draft', label: 'Draft' },
            { key: 'archived', label: 'Archived' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterStatus(key)}
              className={`border rounded-lg p-3 text-left transition-colors ${filterStatus === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold text-foreground">{statusCounts[key]}</p>
            </button>
          ))}
        </div>
      )}

      {/* Search + status + category filter */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" value={search} onChange={e => handleSearch(e.target.value)} />
        </div>
        {hasStatus && (
          <Select value={filterStatus} onValueChange={handleFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        )}
        {categoryField && categoryOptions.length > 1 && (
          <Select value={filterCategory} onValueChange={handleFilterCategory}>
            <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              {categoryOptions.map(cat => (
                <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {/* Top pagination — right-aligned */}
        <div className="ml-auto">
          <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {tableColumns.map(col => (
                  <th key={col.key} className={`px-4 py-3 text-left font-medium text-muted-foreground ${col.width ?? ''}`}>{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={colSpan} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={colSpan} className="px-4 py-12 text-center text-muted-foreground">No items found. Click "New" to add one.</td></tr>
              ) : paginated.map(item => (
                <tr key={String(item.id)} className="hover:bg-muted/20 group">
                  {tableColumns.map((col, colIdx) => (
                    <td key={col.key} className="px-4 py-3 text-muted-foreground">
                      {colIdx === 0 ? (
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{String(item[col.key] ?? '')}</p>
                          <div className="flex items-center gap-0.5 mt-1.5 flex-wrap">
                            {onRowAction && onRowAction(item)}
                            {hasStatus && (
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1" onClick={() => toggleStatus(item)} title={item.status === 'published' ? 'Unpublish' : 'Publish'}>
                                {item.status === 'published' ? <><EyeOff className="h-3 w-3" /> Unpublish</> : <><Eye className="h-3 w-3" /> Publish</>}
                              </Button>
                            )}
                            {hasFeatured && (
                              <Button variant="ghost" size="sm" className={`h-6 px-2 text-xs gap-1 ${item.is_featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => toggleFeatured(item)}>
                                <Star className={`h-3 w-3 ${item.is_featured ? 'fill-yellow-400' : ''}`} />
                                {item.is_featured ? 'Unfeature' : 'Feature'}
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1" onClick={() => openEdit(item)}>
                              <Pencil className="h-3 w-3" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive gap-1" onClick={() => handleDelete(String(item.id))}>
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </div>
                      ) : col.key === 'status' ? (
                        <Badge variant={item[col.key] === 'published' ? 'default' : 'secondary'}>
                          {String(item[col.key] ?? '')}
                        </Badge>
                      ) : col.format === 'date' ? (
                        <span className="text-xs whitespace-nowrap">{formatCellDate(item[col.key])}</span>
                      ) : Array.isArray(item[col.key]) ? (
                        <span className="line-clamp-1">{(item[col.key] as string[]).join(', ')}</span>
                      ) : typeof item[col.key] === 'boolean' ? (
                        <Badge variant={item[col.key] ? 'default' : 'secondary'}>
                          {item[col.key] ? 'Yes' : 'No'}
                        </Badge>
                      ) : (
                        <span className="line-clamp-1">{String(item[col.key] ?? '')}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 w-6" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom pagination — right-aligned */}
      <div className="mt-4 flex justify-end">
        <AdminPagination page={page} totalPages={totalPages} total={filtered.length} onPage={handlePage} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {fields.map(field => (
              <div key={field.key} className={`space-y-1.5 ${field.colSpan === 2 ? 'col-span-2' : ''}`}>
                <div className="flex items-center gap-1.5">
                  <Label>{field.label}{field.required ? <span className="text-destructive ml-0.5">*</span> : ''}</Label>
                  {field.tip && <FieldInfoTooltip tip={field.tip} />}
                </div>
                {field.type === 'textarea' && (
                  <Textarea placeholder={field.placeholder} rows={3} value={String(form[field.key] ?? '')} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                )}
                {field.type === 'html' && (
                  <Textarea placeholder={field.placeholder} rows={8} value={String(form[field.key] ?? '')} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="font-mono text-xs" />
                )}
                {(field.type === 'text' || field.type === 'url' || field.type === 'number') && (
                  <Input type={field.type === 'number' ? 'number' : 'text'} placeholder={field.placeholder} value={String(form[field.key] ?? '')} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                )}
                {field.type === 'date' && (
                  <Input type="date" placeholder={field.placeholder} value={String(form[field.key] ?? '')} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                )}
                {field.type === 'select' && field.options && (
                  <Select value={String(form[field.key] ?? '')} onValueChange={v => setForm(f => ({ ...f, [field.key]: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {field.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'multiselect' && field.options && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {field.options.map(opt => {
                      const raw = form[field.key];
                      const selected: string[] = Array.isArray(raw) ? (raw as string[]) : (raw ? String(raw).split(',').map(s => s.trim()).filter(Boolean) : []);
                      const isChecked = selected.includes(opt);
                      return (
                        <label key={opt} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${isChecked ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              const cur: string[] = Array.isArray(raw) ? (raw as string[]) : (raw ? String(raw).split(',').map(s => s.trim()).filter(Boolean) : []);
                              const next = e.target.checked ? [...cur, opt] : cur.filter(v => v !== opt);
                              setForm(f => ({ ...f, [field.key]: next }));
                            }}
                            className="w-3.5 h-3.5 accent-primary"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                )}
                {field.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input type="checkbox" checked={Boolean(form[field.key])} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.checked }))} className="w-4 h-4 accent-primary rounded" />
                    <span className="text-sm text-muted-foreground">{field.placeholder || `Enable ${field.label}`}</span>
                  </label>
                )}
              </div>
            ))}
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
