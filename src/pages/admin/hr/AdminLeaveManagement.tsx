import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Plus, Sprout, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// Default seed allocations by leave type code
const SEED_DEFAULTS: Record<string, number> = {
  CL: 12, SL: 12, EL: 15,
};

const AdminLeaveManagement = () => {
  const qc = useQueryClient();
  const [requestOpen, setRequestOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [form, setForm] = useState({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', days_count: 1, reason: '' });
  const [typeForm, setTypeForm] = useState({ name: '', code: '', default_days: 0, is_paid: true });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*, employees!leave_requests_employee_id_fkey(full_name), leave_types!leave_requests_leave_type_id_fkey(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leave_types').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('id, full_name').eq('status', 'active').order('full_name');
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('leave_requests').update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); qc.invalidateQueries({ queryKey: ['leave-balances'] }); toast.success('Leave request updated'); },
  });

  const createRequest = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('leave_requests').insert({
        employee_id: form.employee_id,
        leave_type_id: form.leave_type_id,
        start_date: form.start_date,
        end_date: form.end_date,
        days_count: form.days_count,
        reason: form.reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request created');
      setRequestOpen(false);
      setForm({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', days_count: 1, reason: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const createType = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('leave_types').insert({
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
      const { error } = await supabase.from('leave_types').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }); toast.success('Leave type updated'); },
  });

  return (
    <AdminLayout title="Leave Management" subtitle="Manage employee leave requests, types, and balances">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['pending', 'approved', 'rejected'].map(s => (
          <Card key={s}>
            <CardHeader className="pb-2"><CardTitle className="text-sm capitalize">{s}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{requests.filter((r: any) => r.status === s).length}</p></CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Leave Types</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{leaveTypes.filter((t: any) => t.is_active).length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="types">Leave Types</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Requests</CardTitle>
              <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Request</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Leave Request</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Employee</Label>
                      <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                        <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Leave Type</Label>
                      <Select value={form.leave_type_id} onValueChange={v => setForm(p => ({ ...p, leave_type_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>{leaveTypes.filter((t: any) => t.is_active).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} /></div>
                      <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} /></div>
                    </div>
                    <div><Label>Days</Label><Input type="number" min={0.5} step={0.5} value={form.days_count} onChange={e => setForm(p => ({ ...p, days_count: Number(e.target.value) }))} /></div>
                    <div><Label>Reason</Label><Textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} /></div>
                    <Button className="w-full" disabled={!form.employee_id || !form.leave_type_id || !form.start_date || !form.end_date} onClick={() => createRequest.mutate()}>Create Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : requests.length === 0 ? <p className="text-muted-foreground text-sm">No leave requests yet.</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.employees?.full_name || '—'}</TableCell>
                        <TableCell>{r.leave_types?.name || '—'}</TableCell>
                        <TableCell>{format(new Date(r.start_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>{format(new Date(r.end_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>{r.days_count}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{r.reason || '—'}</TableCell>
                        <TableCell><Badge className={statusColors[r.status] || ''}>{r.status}</Badge></TableCell>
                        <TableCell>
                          {r.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'approved' })}><Check className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'rejected' })}><X className="h-3 w-3" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances">
          <LeaveBalancesTab employees={employees} leaveTypes={leaveTypes} />
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Types</CardTitle>
              <Dialog open={typeOpen} onOpenChange={setTypeOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Type</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Leave Type</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Name</Label><Input value={typeForm.name} onChange={e => setTypeForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Casual Leave" /></div>
                    <div><Label>Code</Label><Input value={typeForm.code} onChange={e => setTypeForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g. CL" /></div>
                    <div><Label>Default Days per Year</Label><Input type="number" value={typeForm.default_days} onChange={e => setTypeForm(p => ({ ...p, default_days: Number(e.target.value) }))} /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={typeForm.is_paid} onChange={e => setTypeForm(p => ({ ...p, is_paid: e.target.checked }))} id="is_paid" />
                      <Label htmlFor="is_paid">Paid Leave</Label>
                    </div>
                    <Button className="w-full" disabled={!typeForm.name || !typeForm.code} onClick={() => createType.mutate()}>Add Leave Type</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
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
                      <TableCell><Badge className={t.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toggleTypeActive.mutate({ id: t.id, is_active: !t.is_active })}>
                          {t.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

/* ─── Leave Balances Tab ─── */
function LeaveBalancesTab({ employees, leaveTypes }: { employees: any[]; leaveTypes: any[] }) {
  const qc = useQueryClient();
  const currentYear = new Date().getFullYear();
  const activeTypes = useMemo(() => leaveTypes.filter((t: any) => t.is_active), [leaveTypes]);

  const [editEmpId, setEditEmpId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, { opening: number; accrued: number }>>({});

  // Fetch balances for current year
  const { data: balances = [] } = useQuery({
    queryKey: ['leave-balances', currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('year', currentYear);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch approved leave requests for current year to compute "used"
  const { data: approvedRequests = [] } = useQuery({
    queryKey: ['leave-requests-approved', currentYear],
    queryFn: async () => {
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;
      const { data, error } = await supabase
        .from('leave_requests')
        .select('employee_id, leave_type_id, days_count')
        .eq('status', 'approved')
        .gte('start_date', startOfYear)
        .lte('start_date', endOfYear);
      if (error) throw error;
      return data || [];
    },
  });

  // Build used map: { `${empId}_${typeId}`: totalDays }
  const usedMap = useMemo(() => {
    const map: Record<string, number> = {};
    approvedRequests.forEach((r: any) => {
      const key = `${r.employee_id}_${r.leave_type_id}`;
      map[key] = (map[key] || 0) + Number(r.days_count);
    });
    return map;
  }, [approvedRequests]);

  // Build balance map: { `${empId}_${typeId}`: balanceRow }
  const balanceMap = useMemo(() => {
    const map: Record<string, any> = {};
    balances.forEach((b: any) => {
      map[`${b.employee_id}_${b.leave_type_id}`] = b;
    });
    return map;
  }, [balances]);

  const getBalance = (empId: string, typeId: string) => {
    const bal = balanceMap[`${empId}_${typeId}`];
    const used = usedMap[`${empId}_${typeId}`] || 0;
    const opening = Number(bal?.opening_balance) || 0;
    const accrued = Number(bal?.accrued) || 0;
    return { opening, accrued, used, balance: opening + accrued - used, exists: !!bal };
  };

  // Seed balances
  const seedMutation = useMutation({
    mutationFn: async () => {
      const rows: any[] = [];
      for (const emp of employees) {
        for (const lt of activeTypes) {
          const key = `${emp.id}_${lt.id}`;
          if (!balanceMap[key]) {
            rows.push({
              employee_id: emp.id,
              leave_type_id: lt.id,
              year: currentYear,
              opening_balance: SEED_DEFAULTS[lt.code] || 0,
              accrued: 0,
            });
          }
        }
      }
      if (rows.length === 0) { toast.info('All balances already exist'); return 0; }
      const { error } = await supabase.from('leave_balances').insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ['leave-balances'] });
      if (count) toast.success(`Seeded ${count} balance rows`);
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Edit balances for an employee
  const startEdit = (empId: string) => {
    const formData: Record<string, { opening: number; accrued: number }> = {};
    activeTypes.forEach((lt: any) => {
      const b = getBalance(empId, lt.id);
      formData[lt.id] = { opening: b.opening, accrued: b.accrued };
    });
    setEditForm(formData);
    setEditEmpId(empId);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editEmpId) return;
      for (const lt of activeTypes) {
        const vals = editForm[lt.id];
        if (!vals) continue;
        const existing = balanceMap[`${editEmpId}_${lt.id}`];
        if (existing) {
          await supabase.from('leave_balances').update({
            opening_balance: vals.opening,
            accrued: vals.accrued,
          }).eq('id', existing.id);
        } else {
          await supabase.from('leave_balances').insert({
            employee_id: editEmpId,
            leave_type_id: lt.id,
            year: currentYear,
            opening_balance: vals.opening,
            accrued: vals.accrued,
          });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-balances'] });
      toast.success('Balances updated');
      setEditEmpId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leave Balances — {currentYear}</CardTitle>
          <Button size="sm" variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
            <Sprout className="h-4 w-4 mr-1" />Seed Balances
          </Button>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active employees.</p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px] sticky left-0 bg-background z-10">Employee</TableHead>
                    {activeTypes.map((lt: any) => (
                      <TableHead key={lt.id} className="text-center min-w-[100px]">
                        <div className="text-xs">{lt.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">O / A / U = Bal</div>
                      </TableHead>
                    ))}
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp: any) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium text-sm sticky left-0 bg-background z-10">{emp.full_name}</TableCell>
                      {activeTypes.map((lt: any) => {
                        const b = getBalance(emp.id, lt.id);
                        return (
                          <TableCell key={lt.id} className="text-center text-xs">
                            {b.exists ? (
                              <span>
                                {b.opening} / {b.accrued} / {b.used} ={' '}
                                <span className={`font-semibold ${b.balance < 0 ? 'text-destructive' : ''}`}>{b.balance}</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(emp.id)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editEmpId} onOpenChange={open => { if (!open) setEditEmpId(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Leave Balances — {employees.find((e: any) => e.id === editEmpId)?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {activeTypes.map((lt: any) => {
              const vals = editForm[lt.id] || { opening: 0, accrued: 0 };
              const used = usedMap[`${editEmpId}_${lt.id}`] || 0;
              const bal = vals.opening + vals.accrued - used;
              return (
                <div key={lt.id} className="grid grid-cols-5 gap-2 items-center text-sm">
                  <span className="col-span-1 font-medium truncate">{lt.code}</span>
                  <div>
                    <Label className="text-[10px]">Opening</Label>
                    <Input
                      type="number" min={0} step={0.5} className="h-8"
                      value={vals.opening}
                      onChange={e => setEditForm(f => ({ ...f, [lt.id]: { ...f[lt.id], opening: Number(e.target.value) } }))}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Accrued</Label>
                    <Input
                      type="number" min={0} step={0.5} className="h-8"
                      value={vals.accrued}
                      onChange={e => setEditForm(f => ({ ...f, [lt.id]: { ...f[lt.id], accrued: Number(e.target.value) } }))}
                    />
                  </div>
                  <div className="text-center">
                    <Label className="text-[10px]">Used</Label>
                    <p className="text-sm font-medium">{used}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-[10px]">Balance</Label>
                    <p className={`text-sm font-bold ${bal < 0 ? 'text-destructive' : ''}`}>{bal}</p>
                  </div>
                </div>
              );
            })}
            <Button className="w-full" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              Save Balances
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminLeaveManagement;
