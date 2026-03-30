import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { IndianRupee, Calculator } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

export default function AdminLeaveEncashment() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const queryClient = useQueryClient();

  // Get all employees with leave balances and salary structures
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['leave-encashment', year],
    queryFn: async () => {
      const [{ data: balances }, { data: salaries }] = await Promise.all([
        supabase
          .from('leave_balances')
          .select('*, leave_types(name, code, encashable), employees!leave_balances_employee_id_fkey(id, full_name, employee_code, department, status)')
          .eq('year', year),
        supabase
          .from('salary_structures')
          .select('employee_id, basic')
          .eq('is_active', true),
      ]);

      // Get approved leave requests for the year
      const { data: requests } = await supabase
        .from('leave_requests')
        .select('employee_id, leave_type_id, days_count')
        .eq('status', 'approved')
        .gte('start_date', `${year}-01-01`)
        .lte('start_date', `${year}-12-31`);

      const usedMap: Record<string, Record<string, number>> = {};
      (requests || []).forEach((r: any) => {
        if (!usedMap[r.employee_id]) usedMap[r.employee_id] = {};
        usedMap[r.employee_id][r.leave_type_id] = (usedMap[r.employee_id][r.leave_type_id] || 0) + Number(r.days_count);
      });

      const salaryMap = new Map((salaries || []).map((s: any) => [s.employee_id, Number(s.basic)]));

      // Group by employee, only encashable leave types
      const empMap = new Map<string, any>();
      (balances || []).forEach((b: any) => {
        const lt = b.leave_types as any;
        if (!lt?.encashable) return;
        const emp = b.employees as any;
        if (!emp || emp.status !== 'active') return;

        const total = Number(b.opening_balance) + Number(b.accrued);
        const used = usedMap[b.employee_id]?.[b.leave_type_id] || 0;
        const available = total - used;
        if (available <= 0) return;

        const dailyBasic = (salaryMap.get(b.employee_id) || 0) / 26;
        const encashAmount = Math.round(available * dailyBasic);

        if (!empMap.has(b.employee_id)) {
          empMap.set(b.employee_id, {
            employee_id: b.employee_id,
            full_name: emp.full_name,
            employee_code: emp.employee_code,
            department: emp.department,
            leaves: [],
            total_encashment: 0,
          });
        }
        const entry = empMap.get(b.employee_id)!;
        entry.leaves.push({ type: lt.name, days: available, amount: encashAmount });
        entry.total_encashment += encashAmount;
      });

      return Array.from(empMap.values());
    },
  });

  const grandTotal = employees.reduce((s: number, e: any) => s + e.total_encashment, 0);

  return (
    <AdminLayout title="Leave Encashment" subtitle={`Year ${year} — Privilege Leave encashment calculator`}>
      <div className="flex items-center gap-3 mb-6">
        <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[2024,2025,2026,2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Employees Eligible</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">{employees.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Encashment Liability</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground flex items-center gap-1"><IndianRupee className="h-5 w-5" />{fmt(grandTotal)}</p></CardContent>
        </Card>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead className="text-right">Days</TableHead>
              <TableHead className="text-right">Encashment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : employees.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No encashable leave balances found.</TableCell></TableRow>
            ) : employees.map((emp: any) => (
              emp.leaves.map((lv: any, i: number) => (
                <TableRow key={`${emp.employee_id}-${i}`}>
                  {i === 0 && (
                    <>
                      <TableCell rowSpan={emp.leaves.length} className="font-medium">{emp.full_name}</TableCell>
                      <TableCell rowSpan={emp.leaves.length} className="text-muted-foreground">{emp.employee_code || '—'}</TableCell>
                      <TableCell rowSpan={emp.leaves.length} className="text-muted-foreground">{emp.department}</TableCell>
                    </>
                  )}
                  <TableCell>{lv.type}</TableCell>
                  <TableCell className="text-right">{lv.days}</TableCell>
                  <TableCell className="text-right font-semibold">₹{fmt(lv.amount)}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
