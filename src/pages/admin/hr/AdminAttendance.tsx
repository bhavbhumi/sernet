import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  half_day: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  on_leave: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const AdminAttendance = () => {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['attendance-logs', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*, employees!attendance_logs_employee_id_fkey(full_name, employee_code)')
        .order('log_date', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
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
        <CardHeader><CardTitle>Attendance Log</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No attendance records yet.</p>
          ) : (
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
