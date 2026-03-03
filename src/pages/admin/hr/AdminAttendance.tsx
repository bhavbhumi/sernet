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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  half_day: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  on_leave: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const AdminAttendance = () => {
  const qc = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employee_id: '', log_date: today, status: 'present', check_in: '', check_out: '', notes: '' });

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['attendance-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*, employees!attendance_logs_employee_id_fkey(full_name, employee_code)')
        .order('log_date', { ascending: false })
        .limit(200);
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

  const createLog = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('attendance_logs').insert({
        employee_id: form.employee_id,
        log_date: form.log_date,
        status: form.status,
        check_in: form.check_in ? `${form.log_date}T${form.check_in}:00` : null,
        check_out: form.check_out ? `${form.log_date}T${form.check_out}:00` : null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance-logs'] });
      toast.success('Attendance logged');
      setOpen(false);
      setForm({ employee_id: '', log_date: today, status: 'present', check_in: '', check_out: '', notes: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const todayLogs = logs.filter((l: any) => l.log_date === today);

  return (
    <AdminLayout title="Attendance" subtitle="Track employee check-in/out and daily attendance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Today Present</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{todayLogs.filter((l: any) => l.status === 'present').length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Today Absent</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{todayLogs.filter((l: any) => l.status === 'absent').length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Records</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{logs.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Log</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Log Attendance</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Attendance</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={form.log_date} onChange={e => setForm(p => ({ ...p, log_date: e.target.value }))} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Check In</Label><Input type="time" value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></div>
                  <div><Label>Check Out</Label><Input type="time" value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></div>
                </div>
                <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
                <Button className="w-full" disabled={!form.employee_id || !form.log_date} onClick={() => createLog.mutate()}>Log Attendance</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : logs.length === 0 ? <p className="text-muted-foreground text-sm">No attendance records yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.employees?.full_name || '—'}</TableCell>
                    <TableCell>{l.employees?.employee_code || '—'}</TableCell>
                    <TableCell>{format(new Date(l.log_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{l.check_in ? format(new Date(l.check_in), 'HH:mm') : '—'}</TableCell>
                    <TableCell>{l.check_out ? format(new Date(l.check_out), 'HH:mm') : '—'}</TableCell>
                    <TableCell><Badge className={statusColors[l.status] || ''}>{l.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAttendance;