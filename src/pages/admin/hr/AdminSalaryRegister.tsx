import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, IndianRupee } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

export default function AdminSalaryRegister() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [mode, setMode] = useState<'monthly' | 'annual'>('monthly');

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['salary-register', mode, month, year],
    queryFn: async () => {
      if (mode === 'monthly') {
        const { data: runs } = await supabase
          .from('payroll_runs')
          .select('id')
          .eq('month', month)
          .eq('year', year)
          .limit(1);
        if (!runs?.length) return [];
        const { data } = await supabase
          .from('payroll_entries')
          .select('*, employees!payroll_entries_employee_id_fkey(full_name, employee_code, department, designation)')
          .eq('payroll_run_id', runs[0].id);
        return data || [];
      } else {
        const { data: runs } = await supabase
          .from('payroll_runs')
          .select('id')
          .eq('year', year);
        if (!runs?.length) return [];
        const runIds = runs.map(r => r.id);
        const { data } = await supabase
          .from('payroll_entries')
          .select('*, employees!payroll_entries_employee_id_fkey(full_name, employee_code, department, designation)')
          .in('payroll_run_id', runIds);
        // Aggregate by employee
        const map = new Map<string, any>();
        (data || []).forEach((e: any) => {
          const key = e.employee_id;
          if (!map.has(key)) {
            map.set(key, { ...e, months_count: 1 });
          } else {
            const prev = map.get(key)!;
            ['basic','hra','special_allowance','medical_allowance','lta','other_allowance','gross','pf_employee','pf_employer','esi_employee','esi_employer','professional_tax','tds','total_deductions','net_pay'].forEach(f => {
              prev[f] = Number(prev[f]) + Number(e[f]);
            });
            prev.months_count++;
            map.set(key, prev);
          }
        });
        return Array.from(map.values());
      }
    },
  });

  const totals = entries.reduce((acc: any, e: any) => {
    ['gross','total_deductions','net_pay'].forEach(f => {
      acc[f] = (acc[f] || 0) + Number(e[f]);
    });
    return acc;
  }, {} as Record<string, number>);

  const exportCSV = () => {
    const headers = ['Employee','Code','Department','Designation','Gross','Deductions','Net Pay'];
    const rows = entries.map((e: any) => {
      const emp = e.employees as any;
      return [emp?.full_name, emp?.employee_code, emp?.department, emp?.designation, Math.round(Number(e.gross)), Math.round(Number(e.total_deductions)), Math.round(Number(e.net_pay))].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-register-${mode === 'monthly' ? `${MONTHS[month-1]}-${year}` : year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Salary Register" subtitle={mode === 'monthly' ? `${MONTHS[month-1]} ${year}` : `FY ${year}`}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={mode} onValueChange={(v) => setMode(v as any)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
        {mode === 'monthly' && (
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[2024,2025,2026,2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={!entries.length}>
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Gross', value: totals.gross || 0 },
          { label: 'Total Deductions', value: totals.total_deductions || 0 },
          { label: 'Total Net Pay', value: totals.net_pay || 0 },
        ].map(c => (
          <Card key={c.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-foreground flex items-center gap-1"><IndianRupee className="h-5 w-5" />{fmt(c.value)}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payroll data found for this period.</TableCell></TableRow>
            ) : entries.map((e: any) => {
              const emp = e.employees as any;
              return (
                <TableRow key={e.id || e.employee_id}>
                  <TableCell className="font-medium">{emp?.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{emp?.employee_code || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{emp?.department}</TableCell>
                  <TableCell className="text-right">₹{fmt(Number(e.gross))}</TableCell>
                  <TableCell className="text-right">₹{fmt(Number(e.total_deductions))}</TableCell>
                  <TableCell className="text-right font-semibold">₹{fmt(Number(e.net_pay))}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
