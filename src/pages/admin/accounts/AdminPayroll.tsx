import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  processed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const AdminPayroll = () => {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['payroll-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*, employees!payroll_records_employee_id_fkey(full_name, employee_code)')
        .order('pay_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const totalNetPay = records.reduce((s: number, r: any) => s + Number(r.net_pay || 0), 0);

  return (
    <AdminLayout title="Payroll Register" subtitle="Monthly salary records and pay processing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Records</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{records.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Net Pay</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{totalNetPay.toLocaleString('en-IN')}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{records.filter((r: any) => r.status === 'draft').length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payroll Records</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payroll records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead className="text-right">Basic</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.employees?.full_name || '—'}</TableCell>
                    <TableCell>{r.employees?.employee_code || '—'}</TableCell>
                    <TableCell>{r.pay_period}</TableCell>
                    <TableCell>{format(new Date(r.pay_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.basic_salary).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.allowances).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.deductions).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right font-medium">₹{Number(r.net_pay).toLocaleString('en-IN')}</TableCell>
                    <TableCell><Badge className={statusColors[r.status] || ''}>{r.status}</Badge></TableCell>
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

export default AdminPayroll;
