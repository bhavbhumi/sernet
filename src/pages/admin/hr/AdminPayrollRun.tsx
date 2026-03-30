import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Play, Eye, IndianRupee, Users, TrendingDown, Wallet, RefreshCw, CalendarDays } from 'lucide-react';
import { PayslipPreview } from '@/components/shared/PayslipPreview';
import { toast } from 'sonner';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAttendancePolicies, calcEffectiveDays, calcLopDays } from '@/hooks/useAttendancePolicies';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getWorkingDays(year: number, month: number, weekOffDays: number[]): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month - 1, d).getDay();
    if (!weekOffDays.includes(day)) count++;
  }
  return count;
}

interface EmployeeCalc {
  employee_id: string;
  full_name: string;
  employee_code: string;
  designation: string;
  department: string;
  date_of_joining: string | null;
  pan: string | null;
  structure_id: string | null;
  s_basic: number; s_hra: number; s_special: number; s_medical: number;
  s_lta: number; s_other: number; s_ctc: number;
  is_pf_applicable: boolean; pf_wage_cap: number;
  is_esi_applicable: boolean; tds_monthly: number;
  days_present: number; lop_days: number;
  effective_present: number; paid_leave_days: number; unpaid_leave_days: number;
  basic: number; hra: number; special_allowance: number;
  medical_allowance: number; lta: number; other_allowance: number;
  gross: number;
  pf_employee: number; pf_employer: number;
  esi_employee: number; esi_employer: number;
  professional_tax: number; tds: number;
  total_deductions: number; net_pay: number;
}

function calcRow(row: EmployeeCalc, workingDays: number, month: number): EmployeeCalc {
  const ratio = workingDays > 0 ? (workingDays - row.lop_days) / workingDays : 0;
  const basic = Math.round(row.s_basic * ratio);
  const hra = Math.round(row.s_hra * ratio);
  const special_allowance = Math.round(row.s_special * ratio);
  const medical_allowance = Math.round(row.s_medical * ratio);
  const lta = Math.round(row.s_lta * ratio);
  const other_allowance = Math.round(row.s_other * ratio);
  const gross = basic + hra + special_allowance + medical_allowance + lta + other_allowance;
  const pf_employee = row.is_pf_applicable ? Math.round(Math.min(basic, row.pf_wage_cap) * 0.12) : 0;
  const pf_employer = pf_employee;
  const esi_employee = (row.is_esi_applicable && gross <= 21000) ? Math.round(gross * 0.0075) : 0;
  const esi_employer = (row.is_esi_applicable && gross <= 21000) ? Math.round(gross * 0.0325) : 0;
  const professional_tax = gross < 7500 ? 0 : gross < 10000 ? 175 : (month === 2 ? 300 : 200);
  const tds = row.tds_monthly;
  const total_deductions = pf_employee + esi_employee + professional_tax + tds;
  const net_pay = gross - total_deductions;
  return { ...row, basic, hra, special_allowance, medical_allowance, lta, other_allowance, gross, pf_employee, pf_employer, esi_employee, esi_employer, professional_tax, tds, total_deductions, net_pay };
}

const AdminPayrollRun = () => {
  const qc = useQueryClient();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [rows, setRows] = useState<EmployeeCalc[]>([]);
  const [previewRow, setPreviewRow] = useState<EmployeeCalc | null>(null);
  const [lopFetched, setLopFetched] = useState(false);
  const { policies, loading: policiesLoading } = useAttendancePolicies();

  const workingDays = useMemo(
    () => getWorkingDays(year, month, policies.week_off_days),
    [year, month, policies.week_off_days]
  );

  // Fetch employees + salary structures
  const { data: empData = [], isLoading } = useQuery({
    queryKey: ['payroll-run-employees'],
    queryFn: async () => {
      const { data: emps, error: e1 } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, designation, department, date_of_joining')
        .eq('status', 'active')
        .order('full_name');
      if (e1) throw e1;

      const { data: structs, error: e2 } = await supabase
        .from('salary_structures')
        .select('*')
        .is('effective_to', null);
      if (e2) throw e2;

      const structMap = new Map((structs || []).map((s: any) => [s.employee_id, s]));

      return (emps || []).map((emp: any) => {
        const s = structMap.get(emp.id);
        return {
          employee_id: emp.id,
          full_name: emp.full_name,
          employee_code: emp.employee_code || '',
          designation: emp.designation || '',
          department: emp.department || '',
          date_of_joining: emp.date_of_joining,
          pan: null,
          structure_id: s?.id || null,
          s_basic: Number(s?.basic) || 0,
          s_hra: Number(s?.hra) || 0,
          s_special: Number(s?.special_allowance) || 0,
          s_medical: Number(s?.medical_allowance) || 0,
          s_lta: Number(s?.lta) || 0,
          s_other: Number(s?.other_allowance) || 0,
          s_ctc: Number(s?.ctc_annual) || 0,
          is_pf_applicable: s?.is_pf_applicable ?? false,
          pf_wage_cap: Number(s?.pf_wage_cap) || 15000,
          is_esi_applicable: s?.is_esi_applicable ?? false,
          tds_monthly: Number(s?.tds_monthly) || 0,
          days_present: 0,
          lop_days: 0,
          effective_present: 0,
          paid_leave_days: 0,
          unpaid_leave_days: 0,
        } as EmployeeCalc;
      });
    },
  });

  // Auto-fetch LOP from attendance + leave data
  const fetchLop = useCallback(async () => {
    if (empData.length === 0) return;
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    const [{ data: logs }, { data: leaveReqs }, { data: leaveTypes }] = await Promise.all([
      supabase.from('attendance_logs').select('employee_id, status').gte('log_date', startDate).lte('log_date', endDate),
      supabase.from('leave_requests').select('employee_id, leave_type_id, days_count')
        .eq('status', 'approved').gte('start_date', startDate).lte('start_date', endDate),
      supabase.from('leave_types').select('id, is_paid'),
    ]);

    const paidTypeIds = new Set((leaveTypes || []).filter((t: any) => t.is_paid).map((t: any) => t.id));

    const updated = empData
      .filter((e: EmployeeCalc) => e.structure_id)
      .map((e: EmployeeCalc) => {
        const empLogs = (logs || []).filter((l: any) => l.employee_id === e.employee_id);
        const empLeaves = (leaveReqs || []).filter((l: any) => l.employee_id === e.employee_id);

        const effectivePresent = calcEffectiveDays(empLogs);
        const paidLeaveDays = empLeaves
          .filter((l: any) => paidTypeIds.has(l.leave_type_id))
          .reduce((s: number, l: any) => s + Number(l.days_count), 0);
        const unpaidLeaveDays = empLeaves
          .filter((l: any) => !paidTypeIds.has(l.leave_type_id))
          .reduce((s: number, l: any) => s + Number(l.days_count), 0);

        const lopDays = Math.max(0, workingDays - effectivePresent - paidLeaveDays);
        const roundedLop = Math.round(lopDays * 2) / 2;

        return calcRow({
          ...e,
          days_present: effectivePresent,
          lop_days: roundedLop,
          effective_present: effectivePresent,
          paid_leave_days: paidLeaveDays,
          unpaid_leave_days: unpaidLeaveDays,
        }, workingDays, month);
      });

    setRows(updated);
    setLopFetched(true);
    toast.success('LOP auto-calculated from attendance & leave data');
  }, [empData, month, year, workingDays]);

  // Initialize rows when data loads
  useEffect(() => {
    if (empData.length > 0 && !lopFetched) {
      setRows(empData
        .filter((e: EmployeeCalc) => e.structure_id)
        .map((e: EmployeeCalc) => calcRow({ ...e, days_present: workingDays, lop_days: 0, effective_present: workingDays, paid_leave_days: 0, unpaid_leave_days: 0 }, workingDays, month))
      );
    }
  }, [empData, workingDays, month]);

  // Reset LOP fetched when month/year changes
  useEffect(() => { setLopFetched(false); }, [month, year]);

  const missingStructure = useMemo(
    () => empData.filter((e: EmployeeCalc) => !e.structure_id),
    [empData]
  );

  const updateRow = useCallback((idx: number, field: 'days_present' | 'lop_days', value: number) => {
    setRows(prev => {
      const copy = [...prev];
      copy[idx] = calcRow({ ...copy[idx], [field]: value }, workingDays, month);
      return copy;
    });
  }, [workingDays, month]);

  const totals = useMemo(() => rows.reduce((acc, r) => ({
    gross: acc.gross + r.gross,
    deductions: acc.deductions + r.total_deductions,
    net: acc.net + r.net_pay,
    pf: acc.pf + r.pf_employee + r.pf_employer,
    lop: acc.lop + r.lop_days,
  }), { gross: 0, deductions: 0, net: 0, pf: 0, lop: 0 }), [rows]);

  const processMutation = useMutation({
    mutationFn: async () => {
      if (rows.length === 0) throw new Error('No employees to process');

      const { data: existingRun } = await supabase
        .from('payroll_runs')
        .select('id, status')
        .eq('month', month)
        .eq('year', year)
        .maybeSingle();

      if (existingRun?.status === 'locked') {
        throw new Error(`Payroll for ${MONTH_NAMES[month - 1]} ${year} is locked.`);
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;

      const runPayload = {
        month, year, working_days: workingDays,
        total_gross: totals.gross,
        total_deductions: totals.deductions,
        total_net_pay: totals.net,
        total_pf: totals.pf,
        total_esi: rows.reduce((s, r) => s + r.esi_employee + r.esi_employer, 0),
        total_lop_days: totals.lop,
        employee_count: rows.length,
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: userId,
      };

      let runId: string;
      if (existingRun) {
        const { error } = await supabase.from('payroll_runs').update(runPayload).eq('id', existingRun.id);
        if (error) throw error;
        runId = existingRun.id;
      } else {
        const { data, error } = await supabase.from('payroll_runs').insert(runPayload).select('id').single();
        if (error) throw error;
        runId = data.id;
      }

      await supabase.from('payroll_entries').delete().eq('payroll_run_id', runId);

      const entries = rows.map(r => ({
        payroll_run_id: runId,
        employee_id: r.employee_id,
        salary_structure_id: r.structure_id,
        days_present: r.days_present,
        lop_days: r.lop_days,
        basic: r.basic, hra: r.hra,
        special_allowance: r.special_allowance,
        medical_allowance: r.medical_allowance,
        lta: r.lta, other_allowance: r.other_allowance,
        gross: r.gross,
        pf_employee: r.pf_employee, pf_employer: r.pf_employer,
        esi_employee: r.esi_employee, esi_employer: r.esi_employer,
        professional_tax: r.professional_tax, tds: r.tds,
        total_deductions: r.total_deductions, net_pay: r.net_pay,
      }));

      const { error: ie } = await supabase.from('payroll_entries').insert(entries);
      if (ie) throw ie;

      return rows.length;
    },
    onSuccess: (count) => {
      toast.success(`Payroll processed for ${count} employees`);
      qc.invalidateQueries({ queryKey: ['payroll-run-employees'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Monthly Payroll Run" subtitle="Calculate salaries with auto LOP from attendance & leave data">
      {/* Top Bar */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <Label className="text-xs">Month</Label>
          <Select value={String(month)} onValueChange={v => { setMonth(Number(v)); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Year</Label>
          <Input type="number" className="w-24" value={year} onChange={e => setYear(Number(e.target.value))} />
        </div>
        <div>
          <Label className="text-xs">Working Days</Label>
          <Input type="number" className="w-20" min={1} max={31} value={workingDays} readOnly
            title="Auto-calculated from calendar (excludes Sundays)" />
        </div>
        <Button variant="outline" onClick={fetchLop} disabled={empData.length === 0}>
          <RefreshCw className="h-4 w-4 mr-1" />Fetch LOP
        </Button>
        <Button onClick={() => processMutation.mutate()} disabled={processMutation.isPending || rows.length === 0}>
          <Play className="h-4 w-4 mr-1" />Process Payroll
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />Total Gross</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{fmt(totals.gross)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5" />Total Deductions</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{fmt(totals.deductions)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />Total Net Payable</CardTitle></CardHeader><CardContent><p className="text-xl font-bold text-primary">{fmt(totals.net)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-1"><Users className="h-3.5 w-3.5" />Combined PF</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{fmt(totals.pf)}</p><p className="text-[10px] text-muted-foreground">Employee + Employer</p></CardContent></Card>
        <Card className={totals.lop > 0 ? 'border-red-500/30' : ''}>
          <CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Total LOP Days</CardTitle></CardHeader>
          <CardContent>
            <p className={`text-xl font-bold ${totals.lop > 0 ? 'text-destructive' : ''}`}>{totals.lop}</p>
            {lopFetched && <p className="text-[10px] text-muted-foreground">Auto-fetched from attendance</p>}
          </CardContent>
        </Card>
      </div>

      {/* LOP info banner */}
      {!lopFetched && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-md border border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CalendarDays className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            Click <strong>"Fetch LOP"</strong> to auto-calculate Loss of Pay from attendance logs and approved leave requests.
            Unpaid leaves and absences will be deducted from salary automatically.
          </div>
        </div>
      )}

      {/* Warning banner */}
      {missingStructure.length > 0 && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Missing salary structure:</span>{' '}
            {missingStructure.map((e: EmployeeCalc) => e.full_name).join(', ')}
          </div>
        </div>
      )}

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-muted-foreground text-sm">Loading employees...</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">No employees with salary structures found.</p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Employee</TableHead>
                    <TableHead className="w-20 text-center">Present</TableHead>
                    <TableHead className="w-20 text-center">Paid Leave</TableHead>
                    <TableHead className="w-20 text-center">
                      <span className="text-destructive">LOP</span>
                    </TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">PT</TableHead>
                    <TableHead className="text-right">TDS</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={r.employee_id}>
                      <TableCell>
                        <p className="font-medium text-sm">{r.full_name}</p>
                        <p className="text-xs text-muted-foreground">{r.designation} · {r.department}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-emerald-600">{r.effective_present || r.days_present}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{r.paid_leave_days || 0}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number" min={0} max={workingDays} step={0.5}
                          className={`h-8 w-16 text-center mx-auto ${r.lop_days > 0 ? 'border-destructive/50 text-destructive' : ''}`}
                          value={r.lop_days}
                          onChange={e => updateRow(idx, 'lop_days', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell className="text-right text-sm">{fmt(r.gross)}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(r.professional_tax)}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(r.tds)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{fmt(r.net_pay)}</TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPreviewRow(r)}>
                          <Eye className="h-4 w-4" />
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

      {/* Payslip Preview Modal */}
      <Dialog open={!!previewRow} onOpenChange={open => { if (!open) setPreviewRow(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Salary Slip Preview</DialogTitle>
          </DialogHeader>
          {previewRow && (
            <PayslipPreview row={previewRow} month={month} year={year} workingDays={workingDays} />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPayrollRun;
