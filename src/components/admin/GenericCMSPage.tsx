
// Generic CMS table page factory for simple content types
// Used by: Analysis, Reports, Bulletin, News, Circulars, Press

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
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'url' | 'html' | 'checkbox';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  colSpan?: number;
  tip?: string; // info tooltip text
}

interface GenericCMSPageProps {
  title: string;
  subtitle: string;
  tableName: string;
  fields: FieldDef[];
  emptyForm: Record<string, string | number | boolean>;
  tableColumns: { key: string; label: string; width?: string }[];
  hasStatus?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (tableName: string) => supabase.from(tableName as any) as any;

export function GenericCMSPage({
  title, subtitle, tableName, fields, emptyForm: defaultForm, tableColumns, hasStatus = true
}: GenericCMSPageProps) {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('action') === 'new');
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await db(tableName).select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditItem(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (item: Record<string, unknown>) => { setEditItem(item); setForm({ ...item }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      ...(hasStatus && form.status === 'published' ? { published_at: new Date().toISOString() } : {}),
    };
    const { error } = editItem
      ? await db(tableName).update(payload).eq('id', editItem.id as string)
      : await db(tableName).insert([payload]);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editItem ? 'Updated successfully' : 'Created successfully' }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await db(tableName).delete().eq('id', id);
    fetchItems();
  };

  const toggleStatus = async (item: Record<string, unknown>) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await db(tableName).update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null
    }).eq('id', item.id as string);
    fetchItems();
  };

  const filtered = items.filter(item => {
    const titleVal = String(item.title ?? '');
    const matchSearch = titleVal.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !hasStatus || filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout
      title={title}
      subtitle={subtitle}
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New</Button>}
    >
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {hasStatus && (
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        )}
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
                  <tr key={i}><td colSpan={tableColumns.length + 1} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={tableColumns.length + 1} className="px-4 py-12 text-center text-muted-foreground">No items found. Click "New" to add one.</td></tr>
              ) : filtered.map(item => (
                <tr key={String(item.id)} className="hover:bg-muted/20">
                  {tableColumns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-muted-foreground">
                    {col.key === 'title' ? (
                        <p className="font-medium text-foreground line-clamp-1">{String(item[col.key] ?? '')}</p>
                      ) : col.key === 'status' ? (
                        <Badge variant={item[col.key] === 'published' ? 'default' : 'secondary'}>
                          {String(item[col.key] ?? '')}
                        </Badge>
                      ) : typeof item[col.key] === 'boolean' ? (
                        <Badge variant={item[col.key] ? 'default' : 'secondary'}>
                          {item[col.key] ? 'Yes' : 'No'}
                        </Badge>
                      ) : (
                        <span className="line-clamp-1">{String(item[col.key] ?? '')}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {hasStatus && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(item)} title={item.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {item.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(String(item.id))}>
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
                  <Textarea
                    placeholder={field.placeholder}
                    rows={3}
                    value={String(form[field.key] ?? '')}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  />
                )}
                {field.type === 'html' && (
                  <Textarea
                    placeholder={field.placeholder}
                    rows={8}
                    value={String(form[field.key] ?? '')}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="font-mono text-xs"
                  />
                )}
                {(field.type === 'text' || field.type === 'url' || field.type === 'number') && (
                  <Input
                    type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.placeholder}
                    value={String(form[field.key] ?? '')}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select value={String(form[field.key] ?? '')} onValueChange={v => setForm(f => ({ ...f, [field.key]: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {field.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.key])}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.checked }))}
                      className="w-4 h-4 accent-primary rounded"
                    />
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
