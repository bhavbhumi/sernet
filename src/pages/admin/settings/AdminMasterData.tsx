
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Plus, Pencil, Trash2, Package, Building2, Award, MapPin, Receipt,
  CalendarClock, Wallet, ClipboardList, ExternalLink, ArrowUp, ArrowDown, ArrowUpDown,
  Globe, Landmark, TrendingUp, ShieldCheck, Headphones, Users, Briefcase,
  GitBranch, FileText, BarChart3, Scale, Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';

// ── Imported Content Components (inlined from department pages) ──
import { TaxRatesContent } from '@/pages/admin/accounts/AdminTaxRates';
import { PaymentTermsContent } from '@/pages/admin/accounts/AdminPaymentTerms';
import { ServiceCatalogContent } from '@/pages/admin/accounts/AdminServiceCatalog';
import { SalaryComponentsContent } from '@/pages/admin/accounts/AdminSalaryComponents';
import { BankAccountsContent } from '@/pages/admin/accounts/AdminBankAccounts';
import { PipelineConfigContent } from '@/pages/admin/sales/AdminPipelineConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

// ── Sortable Header Helper ───────────────────────────────
type SortDir = 'asc' | 'desc' | null;
type SortState = { col: string; dir: SortDir };

function SortableHead({ label, col, sort, onSort }: { label: string; col: string; sort: SortState; onSort: (col: string) => void }) {
  const active = sort.col === col;
  return (
    <TableHead className="cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => onSort(col)}>
      <span className="inline-flex items-center gap-1">
        {label}
        {active && sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : active && sort.dir === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-30" />}
      </span>
    </TableHead>
  );
}

function useSort(defaultCol: string) {
  const [sort, setSort] = useState<SortState>({ col: defaultCol, dir: 'asc' });
  const toggle = (col: string) => {
    setSort(prev => {
      if (prev.col !== col) return { col, dir: 'asc' };
      if (prev.dir === 'asc') return { col, dir: 'desc' };
      return { col, dir: 'asc' };
    });
  };
  const sortFn = (data: any[]) => {
    if (!sort.col || !sort.dir) return data;
    return [...data].sort((a, b) => {
      const av = a[sort.col] ?? '';
      const bv = b[sort.col] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return sort.dir === 'asc' ? av - bv : bv - av;
      if (typeof av === 'boolean' && typeof bv === 'boolean') return sort.dir === 'asc' ? (av === bv ? 0 : av ? -1 : 1) : (av === bv ? 0 : av ? 1 : -1);
      const cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  };
  return { sort, toggle, sortFn };
}

// ── Delete Confirm Dialog ─────────────────────────────────
function DeleteConfirm({ open, onOpenChange, onConfirm, label }: { open: boolean; onOpenChange: (v: boolean) => void; onConfirm: () => void; label: string }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently remove this {label.toLowerCase()} from the master data.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Link Card (for masters that link to existing pages) ──
function MasterLinkCard({ label, desc, icon: Icon, href }: { label: string; desc: string; icon: any; href: string }) {
  return (
    <Link to={href} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════
// GLOBAL MASTERS — Inline CRUD
// ═══════════════════════════════════════════════════════════

// ── Firm Profile Link ─────────────────────────────────────
function FirmProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Organisation Identity</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Legal name, PAN, GSTIN, ARN, registered address — the root identity of the firm.</p>
      </CardHeader>
      <CardContent>
        <MasterLinkCard label="Firm Profile" desc="Legal name, registrations, bank details" icon={Landmark} href={ADMIN_ROUTES.accounts.firmProfile} />
      </CardContent>
    </Card>
  );
}

// ── Products Tab ──────────────────────────────────────────
const PRODUCT_EMPTY = { name: '', slug: '', description: '', icon_name: '', parent_id: '', is_active: true, sort_order: 0 };

function ProductsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(PRODUCT_EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { sort, toggle, sortFn } = useSort('sort_order');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['master-products'],
    queryFn: async () => {
      const { data, error } = await db('products').select('*').order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, sort_order: Number(form.sort_order), parent_id: form.parent_id || null };
      if (editing) {
        const { error } = await db('products').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await db('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-products'] }); toast.success('Product saved'); setOpen(false); setEditing(null); setForm(PRODUCT_EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-products'] }); toast.success('Product deleted'); setDeleteTarget(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, slug: r.slug, description: r.description || '', icon_name: r.icon_name || '', parent_id: r.parent_id || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };
  const parents = products.filter((p: any) => !p.parent_id);
  const sorted = useMemo(() => sortFn(products), [products, sort]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Products & Sub-Products</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Consumed by: CRM Deals, Pipeline Config, Support KB</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(PRODUCT_EMPTY); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Slug *</Label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Icon Name</Label><Input value={form.icon_name} onChange={e => setForm(p => ({ ...p, icon_name: e.target.value }))} /></div>
                <div>
                  <Label>Parent Product</Label>
                  <Select value={form.parent_id || 'none'} onValueChange={v => setForm(p => ({ ...p, parent_id: v === 'none' ? '' : v }))}>
                    <SelectTrigger><SelectValue placeholder="None (Top-level)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top-level)</SelectItem>
                      {parents.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <div><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-20" /></div>
              </div>
              <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || !form.slug || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Product" col="name" sort={sort} onSort={toggle} />
                <SortableHead label="Slug" col="slug" sort={sort} onSort={toggle} />
                <TableHead>Parent</TableHead>
                <SortableHead label="Sort" col="sort_order" sort={sort} onSort={toggle} />
                <SortableHead label="Status" col="is_active" sort={sort} onSort={toggle} />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.parent_id ? <span className="ml-4 text-muted-foreground">↳ </span> : null}{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.slug}</TableCell>
                  <TableCell className="text-sm">{r.parent_id ? parents.find((p: any) => p.id === r.parent_id)?.name || '—' : '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.sort_order}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: r.id, name: r.name })}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <DeleteConfirm open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)} label="Product" />
    </Card>
  );
}

// ── Departments Tab ───────────────────────────────────────
const DEPT_EMPTY = { name: '', code: '', description: '', is_active: true, sort_order: 0 };

function DepartmentsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(DEPT_EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { sort, toggle, sortFn } = useSort('sort_order');

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['master-departments'],
    queryFn: async () => {
      const { data, error } = await db('departments').select('*').order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, sort_order: Number(form.sort_order) };
      if (editing) {
        const { error } = await db('departments').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await db('departments').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-departments'] }); toast.success('Department saved'); setOpen(false); setEditing(null); setForm(DEPT_EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-departments'] }); toast.success('Department deleted'); setDeleteTarget(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, code: r.code, description: r.description || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };
  const sorted = useMemo(() => sortFn(departments), [departments, sort]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Departments</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Consumed by: HR, Job Openings, CRM, Reporting</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(DEPT_EMPTY); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Department</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Department</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sales" /></div>
                <div><Label>Code *</Label><Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SALES" /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <div><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-20" /></div>
              </div>
              <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || !form.code || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Department" col="name" sort={sort} onSort={toggle} />
                <SortableHead label="Code" col="code" sort={sort} onSort={toggle} />
                <TableHead>Description</TableHead>
                <SortableHead label="Sort" col="sort_order" sort={sort} onSort={toggle} />
                <SortableHead label="Status" col="is_active" sort={sort} onSort={toggle} />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{r.description || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.sort_order}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: r.id, name: r.name })}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <DeleteConfirm open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)} label="Department" />
    </Card>
  );
}

// ── Locations Tab ─────────────────────────────────────────
const LOC_EMPTY = { name: '', city: '', state: '', pincode: '', address: '', location_type: 'branch', is_active: true, sort_order: 0 };

function LocationsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(LOC_EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { sort, toggle, sortFn } = useSort('sort_order');

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['master-locations'],
    queryFn: async () => {
      const { data, error } = await db('locations').select('*').order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, sort_order: Number(form.sort_order) };
      if (editing) {
        const { error } = await db('locations').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await db('locations').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-locations'] }); toast.success('Location saved'); setOpen(false); setEditing(null); setForm(LOC_EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db('locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-locations'] }); toast.success('Location deleted'); setDeleteTarget(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, city: r.city, state: r.state || '', pincode: r.pincode || '', address: r.address || '', location_type: r.location_type, is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };
  const sorted = useMemo(() => sortFn(locations), [locations, sort]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Locations & Branches</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Consumed by: HR Job Openings, CRM Contacts, Firm Profile</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(LOC_EMPTY); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Location</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Location</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mumbai HO" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City *</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
                <div><Label>State</Label><Input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Pincode</Label><Input value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value }))} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.location_type} onValueChange={v => setForm(p => ({ ...p, location_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head_office">Head Office</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Address</Label><Textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <div><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-20" /></div>
              </div>
              <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || !form.city || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Location" col="name" sort={sort} onSort={toggle} />
                <SortableHead label="City" col="city" sort={sort} onSort={toggle} />
                <SortableHead label="State" col="state" sort={sort} onSort={toggle} />
                <SortableHead label="Type" col="location_type" sort={sort} onSort={toggle} />
                <SortableHead label="Sort" col="sort_order" sort={sort} onSort={toggle} />
                <SortableHead label="Status" col="is_active" sort={sort} onSort={toggle} />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell className="text-sm">{r.state || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.location_type.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.sort_order}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: r.id, name: r.name })}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <DeleteConfirm open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)} label="Location" />
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
// DEPARTMENT MASTERS — Inline CRUD
// ═══════════════════════════════════════════════════════════

// ── Designations (HR Department Master) ───────────────────
const DESIG_EMPTY = { title: '', level: 0, department_id: '', is_active: true, sort_order: 0 };

function DesignationsContent() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(DESIG_EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { sort, toggle, sortFn } = useSort('sort_order');

  const { data: designations = [], isLoading } = useQuery({
    queryKey: ['master-designations'],
    queryFn: async () => {
      const { data, error } = await db('designations').select('*, departments(name)').order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['master-departments'],
    queryFn: async () => {
      const { data } = await db('departments').select('id, name').eq('is_active', true).order('sort_order');
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, level: Number(form.level), sort_order: Number(form.sort_order), department_id: form.department_id || null };
      if (editing) {
        const { error } = await db('designations').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await db('designations').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-designations'] }); toast.success('Designation saved'); setOpen(false); setEditing(null); setForm(DESIG_EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db('designations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['master-designations'] }); toast.success('Designation deleted'); setDeleteTarget(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ title: r.title, level: r.level, department_id: r.department_id || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  const sortedData = useMemo(() => {
    if (sort.col === 'department_name') {
      return [...designations].sort((a: any, b: any) => {
        const av = a.departments?.name || '';
        const bv = b.departments?.name || '';
        const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }
    return sortFn(designations);
  }, [designations, sort]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Designations</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Consumed by: HR Employees, CRM Contact KMPs</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(DESIG_EMPTY); } }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Designation</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Designation</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Associate" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Level (Seniority)</Label><Input type="number" value={form.level} onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))} /></div>
                <div>
                  <Label>Department</Label>
                  <Select value={form.department_id || 'none'} onValueChange={v => setForm(p => ({ ...p, department_id: v === 'none' ? '' : v }))}>
                    <SelectTrigger><SelectValue placeholder="Any department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Any Department</SelectItem>
                      {departments.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <div><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-20" /></div>
              </div>
              <Button className="w-full" onClick={() => save.mutate()} disabled={!form.title || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Title" col="title" sort={sort} onSort={toggle} />
                <SortableHead label="Level" col="level" sort={sort} onSort={toggle} />
                <SortableHead label="Department" col="department_name" sort={sort} onSort={toggle} />
                <SortableHead label="Sort" col="sort_order" sort={sort} onSort={toggle} />
                <SortableHead label="Status" col="is_active" sort={sort} onSort={toggle} />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.level}</TableCell>
                  <TableCell className="text-sm">{r.departments?.name || 'Any'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.sort_order}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: r.id, name: r.title })}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <DeleteConfirm open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)} label="Designation" />
    </Card>
  );
}

// ── Leave Types (HR Department Master) ────────────────────
function LeaveTypesContent() {
  const qc = useQueryClient();
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeForm, setTypeForm] = useState({ name: '', code: '', default_days: 0, is_paid: true });

  const { data: leaveTypes = [], isLoading } = useQuery({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data, error } = await db('leave_types').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const createType = useMutation({
    mutationFn: async () => {
      const { error } = await db('leave_types').insert({
        name: typeForm.name,
        code: typeForm.code,
        default_days: typeForm.default_days,
        is_paid: typeForm.is_paid,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-types'] });
      toast.success('Leave type created');
      setTypeOpen(false);
      setTypeForm({ name: '', code: '', default_days: 0, is_paid: true });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleTypeActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await db('leave_types').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }); toast.success('Leave type updated'); },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Leave Types</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Consumed by: Leave Management, Attendance</p>
        </div>
        <Dialog open={typeOpen} onOpenChange={setTypeOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Type</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Leave Type</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={typeForm.name} onChange={e => setTypeForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Casual Leave" /></div>
              <div><Label>Code</Label><Input value={typeForm.code} onChange={e => setTypeForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g. CL" /></div>
              <div><Label>Default Days per Year</Label><Input type="number" value={typeForm.default_days} onChange={e => setTypeForm(p => ({ ...p, default_days: Number(e.target.value) }))} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={typeForm.is_paid} onChange={e => setTypeForm(p => ({ ...p, is_paid: e.target.checked }))} id="is_paid_master" />
                <Label htmlFor="is_paid_master">Paid Leave</Label>
              </div>
              <Button className="w-full" disabled={!typeForm.name || !typeForm.code} onClick={() => createType.mutate()}>Add Leave Type</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : leaveTypes.length === 0 ? <p className="text-sm text-muted-foreground">No leave types configured.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Default Days</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveTypes.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono">{t.code}</TableCell>
                  <TableCell>{t.default_days}</TableCell>
                  <TableCell>{t.is_paid ? 'Yes' : 'No'}</TableCell>
                  <TableCell><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => toggleTypeActive.mutate({ id: t.id, is_active: !t.is_active })}>
                      {t.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
// DEPARTMENT ACCORDION CONFIG
// ═══════════════════════════════════════════════════════════

// ── Sales: Pipeline Config (inline) ──
function SalesDeptMasters() {
  return <PipelineConfigContent />;
}

// ── Finance: Sub-tabs with inline CRUDs ──
function FinanceDeptMasters() {
  const [tab, setTab] = useState('tax-rates');
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 w-full justify-start mb-4">
        <TabsTrigger value="tax-rates" className="text-xs">Tax Rates</TabsTrigger>
        <TabsTrigger value="payment-terms" className="text-xs">Payment Terms</TabsTrigger>
        <TabsTrigger value="service-catalog" className="text-xs">Service Catalog</TabsTrigger>
        <TabsTrigger value="salary-components" className="text-xs">Salary Components</TabsTrigger>
        <TabsTrigger value="bank-accounts" className="text-xs">Bank Accounts</TabsTrigger>
      </TabsList>
      <TabsContent value="tax-rates"><TaxRatesContent /></TabsContent>
      <TabsContent value="payment-terms"><PaymentTermsContent /></TabsContent>
      <TabsContent value="service-catalog"><ServiceCatalogContent /></TabsContent>
      <TabsContent value="salary-components"><SalaryComponentsContent /></TabsContent>
      <TabsContent value="bank-accounts"><BankAccountsContent /></TabsContent>
    </Tabs>
  );
}

// ── HR: Designations + Leave Types ──
function HRDeptMasters() {
  const [tab, setTab] = useState('designations');
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 w-full justify-start mb-4">
        <TabsTrigger value="designations" className="text-xs">Designations</TabsTrigger>
        <TabsTrigger value="leave-types" className="text-xs">Leave Types</TabsTrigger>
      </TabsList>
      <TabsContent value="designations"><DesignationsContent /></TabsContent>
      <TabsContent value="leave-types"><LeaveTypesContent /></TabsContent>
    </Tabs>
  );
}

// ── Support: Links to existing pages ──
function SupportDeptMasters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <MasterLinkCard label="Issue Types" desc="Ticket classification taxonomy" icon={FileText} href={ADMIN_ROUTES.support.issueTypes} />
      <MasterLinkCard label="Escalation Matrix" desc="SLA tiers & auto-escalation rules" icon={BarChart3} href={ADMIN_ROUTES.support.escalation} />
      <MasterLinkCard label="Canned Responses" desc="Template replies for agents" icon={FileText} href={ADMIN_ROUTES.support.cannedResponses} />
    </div>
  );
}

// ── Legal: Links to existing pages ──
function LegalDeptMasters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <MasterLinkCard label="Legal Pages" desc="Terms, Privacy, Disclaimer templates" icon={Scale} href={ADMIN_ROUTES.legal.pages} />
      <MasterLinkCard label="Investor Charter" desc="SEBI mandated disclosures" icon={ShieldCheck} href={ADMIN_ROUTES.legal.investorCharter} />
    </div>
  );
}

// ── Marketing: Links to campaigns/events ──
function MarketingDeptMasters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <MasterLinkCard label="Campaigns" desc="Campaign types, UTM configurations" icon={BarChart3} href={ADMIN_ROUTES.marketing.campaigns.tracker} />
      <MasterLinkCard label="Events" desc="Event types and templates" icon={CalendarClock} href={ADMIN_ROUTES.marketing.campaigns.events} />
      <MasterLinkCard label="Lead Attribution" desc="Source & medium mapping" icon={TrendingUp} href={ADMIN_ROUTES.marketing.campaigns.attribution} />
    </div>
  );
}

const DEPT_MASTERS = [
  { key: 'marketing', label: 'Marketing', icon: BarChart3, component: MarketingDeptMasters },
  { key: 'sales', label: 'Sales & CRM', icon: TrendingUp, component: SalesDeptMasters },
  { key: 'hr', label: 'HR & People', icon: Users, component: HRDeptMasters },
  { key: 'finance', label: 'Finance & Accounts', icon: Receipt, component: FinanceDeptMasters },
  { key: 'support', label: 'Support', icon: Headphones, component: SupportDeptMasters },
  { key: 'legal', label: 'Legal & Compliance', icon: ShieldCheck, component: LegalDeptMasters },
];

// ═══════════════════════════════════════════════════════════
// TOP-LEVEL TABS
// ═══════════════════════════════════════════════════════════

const TOP_TABS = [
  { value: 'entity', label: 'Entity', icon: Landmark },
  { value: 'departments', label: 'Departments', icon: Building2 },
  { value: 'blueprints', label: 'Blueprints', icon: GitBranch },
  { value: 'workflows', label: 'Workflows', icon: Zap },
];

export default function AdminMasterData() {
  const [topTab, setTopTab] = useState('entity');
  const [openDepts, setOpenDepts] = useState<string[]>([]);

  return (
    <AdminLayout
      title="Master Data"
      subtitle="Central source of truth — all modules consume from here"
    >
      <Tabs value={topTab} onValueChange={setTopTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 w-full justify-start">
          {TOP_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs sm:text-sm">
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── ENTITY TAB: Profile + Departments + Products + Locations stacked ── */}
        <TabsContent value="entity" className="space-y-4">
          <FirmProfileCard />
          <DepartmentsTab />
          <ProductsTab />
          <LocationsTab />
        </TabsContent>

        {/* ── DEPARTMENTS TAB: Accordion per department ── */}
        <TabsContent value="departments">
          <Accordion type="multiple" value={openDepts} onValueChange={setOpenDepts} className="space-y-2">
            {DEPT_MASTERS.map(dept => (
              <AccordionItem key={dept.key} value={dept.key} className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <dept.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{dept.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1">
                  <dept.component />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* ── BLUEPRINTS TAB ── */}
        <TabsContent value="blueprints">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Blueprints</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Process blueprints define the allowed transitions, mandatory fields, and approval gates for each module's lifecycle.</p>
            </CardHeader>
            <CardContent>
              <MasterLinkCard label="Pipeline Blueprints" desc="Stage transitions & field requirements for CRM deals" icon={GitBranch} href={ADMIN_ROUTES.sales.pipelineConfig} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── WORKFLOWS TAB ── */}
        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Workflows</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Automation rules and triggers that operate across all departments.</p>
            </CardHeader>
            <CardContent>
              <MasterLinkCard label="Workflow Rules" desc="Automation triggers, conditions, and actions" icon={Zap} href={ADMIN_ROUTES.settings.workflows} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
