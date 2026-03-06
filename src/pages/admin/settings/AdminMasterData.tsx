
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Package, Building2, Award, MapPin, Receipt, CalendarClock, Wallet, ClipboardList, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

// ── Products Tab ──────────────────────────────────────────
const PRODUCT_EMPTY = { name: '', slug: '', description: '', icon_name: '', parent_id: '', is_active: true, sort_order: 0 };

function ProductsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(PRODUCT_EMPTY);

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

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, slug: r.slug, description: r.description || '', icon_name: r.icon_name || '', parent_id: r.parent_id || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  const parents = products.filter((p: any) => !p.parent_id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Products & Sub-Products</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Referenced by: CRM Deals, Pipeline Config, Support KB</p>
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
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Slug</TableHead><TableHead>Parent</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {products.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.parent_id ? <span className="ml-4 text-muted-foreground">↳ </span> : null}{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.slug}</TableCell>
                  <TableCell className="text-sm">{r.parent_id ? parents.find((p: any) => p.id === r.parent_id)?.name || '—' : '—'}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
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

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, code: r.code, description: r.description || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Departments</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Referenced by: HR Employees, Job Openings, CRM, Reporting</p>
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
            <TableHeader><TableRow><TableHead>Department</TableHead><TableHead>Code</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {departments.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{r.description || '—'}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ── Designations Tab ──────────────────────────────────────
const DESIG_EMPTY = { title: '', level: 0, department_id: '', is_active: true, sort_order: 0 };

function DesignationsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(DESIG_EMPTY);

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

  const edit = (r: any) => { setEditing(r.id); setForm({ title: r.title, level: r.level, department_id: r.department_id || '', is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Designations</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Referenced by: HR Employees, CRM Contact KMPs</p>
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
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Level</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {designations.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.level}</TableCell>
                  <TableCell className="text-sm">{r.departments?.name || 'Any'}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
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

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, city: r.city, state: r.state || '', pincode: r.pincode || '', address: r.address || '', location_type: r.location_type, is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Locations & Branches</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Referenced by: HR Job Openings, CRM Contacts, Firm Profile</p>
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
            <TableHeader><TableRow><TableHead>Location</TableHead><TableHead>City</TableHead><TableHead>State</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {locations.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell className="text-sm">{r.state || '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.location_type.replace('_', ' ')}</Badge></TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ── Financial Masters (links to existing pages) ───────────
function FinancialMastersTab() {
  const links = [
    { label: 'Leave Types', desc: 'HR Leave Management', icon: CalendarClock, href: ADMIN_ROUTES.hr.leave },
    { label: 'Tax Rates', desc: 'Invoicing & Accounts', icon: Receipt, href: ADMIN_ROUTES.accounts.taxRates },
    { label: 'Salary Components', desc: 'Payroll Register', icon: Wallet, href: ADMIN_ROUTES.accounts.salaryComponents },
    { label: 'Service Catalog', desc: 'Invoice Line Items', icon: ClipboardList, href: ADMIN_ROUTES.accounts.serviceCatalog },
    { label: 'Payment Terms', desc: 'Invoice Payment Cycles', icon: Receipt, href: ADMIN_ROUTES.accounts.paymentTerms },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Financial Masters</CardTitle>
        <p className="text-xs text-muted-foreground">These masters are managed in their respective Accounts/HR modules. Quick links below:</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map(l => (
            <Link key={l.href} to={l.href} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <l.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────
const tabs = [
  { value: 'products', label: 'Products', icon: Package },
  { value: 'departments', label: 'Departments', icon: Building2 },
  { value: 'designations', label: 'Designations', icon: Award },
  { value: 'locations', label: 'Locations', icon: MapPin },
  { value: 'financial', label: 'Financial Masters', icon: Receipt },
];

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <AdminLayout
      title="Master Data"
      subtitle="Central source of truth — referenced across all modules"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs">
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="departments"><DepartmentsTab /></TabsContent>
        <TabsContent value="designations"><DesignationsTab /></TabsContent>
        <TabsContent value="locations"><LocationsTab /></TabsContent>
        <TabsContent value="financial"><FinancialMastersTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
