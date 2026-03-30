import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Download, ChevronDown, ChevronRight, Users, Clock, Award, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAttendancePolicies, calcEffectiveDays, getEffectiveShift } from '@/hooks/useAttendancePolicies';

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

interface EmpRow {
  id: string;
  full_name: string;
  employee_code: string | null;
  department: string;
  present: number;
  halfDays: number;
  effectiveDays: number;
  absent: number;
  late: number;
  lop: number;
  totalHours: number;
  workingDays: number;
  paidLeave: number;
  details: any[];
}

const AdminAttendanceReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [deptFilter, setDeptFilter] = useState('all');
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { policies, shifts, loading: policiesLoading } = useAttendancePolicies();

  useEffect(() => {
    supabase.from('departments').select('id, name').eq('is_active', true).order('sort_order').then(({ data }) => setDepartments(data || []));
    supabase.from('leave_types').select('id, is_paid').then(({ data }) => setLeaveTypes(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    Promise.all([
      supabase.from('employees').select('id, full_name, employee_code, department').eq('status', 'active'),
      supabase.from('attendance_logs').select('*').gte('log_date', startDate).lte('log_date', endDate),
      supabase.from('leave_requests').select('employee_id, leave_type_id, days_count')
        .eq('status', 'approved').gte('start_date', startDate).lte('start_date', endDate),
    ]).then(([empRes, logRes, leaveRes]) => {
      setEmployees(empRes.data || []);
      setLogs(logRes.data || []);
      setLeaveData(leaveRes.data || []);
      setLoading(false);
    });
  }, [month, year]);

  const paidTypeIds = useMemo(() => new Set(leaveTypes.filter((t: any) => t.is_paid).map((t: any) => t.id)), [leaveTypes]);

  const workingDays = useMemo(() => getWorkingDays(year, month, policies.week_off_days), [year, month, policies.week_off_days]);

  const rows: EmpRow[] = useMemo(() => {
    const filtered = deptFilter === 'all' ? employees : employees.filter(e => e.department === deptFilter);

    return filtered.map(emp => {
      const empLogs = logs.filter(l => l.employee_id === emp.id);
      const empLeaves = leaveData.filter((l: any) => l.employee_id === emp.id);

      let late = 0;
      let halfDays = 0;
      let fullDays = 0;
      let totalHours = 0;

      empLogs.forEach(l => {
        if (l.status === 'present') fullDays++;
        if (l.status === 'half_day') halfDays++;

        if (l.check_in) {
          const checkInDate = new Date(l.check_in);
          const logDate = new Date(l.log_date);
          const effective = getEffectiveShift(emp.department, logDate, shifts, policies);
          const [sH, sM] = effective.startTime.split(':').map(Number);
          const ciMin = checkInDate.getHours() * 60 + checkInDate.getMinutes();
          if (ciMin > (sH * 60 + sM + effective.graceMinutes)) late++;
        }

        if (l.check_in && l.check_out) {
          const diff = (new Date(l.check_out).getTime() - new Date(l.check_in).getTime()) / (1000 * 60 * 60);
          if (diff > 0) totalHours += diff;
        }
      });

      const effectiveDays = calcEffectiveDays(empLogs);
      const paidLeave = empLeaves
        .filter((l: any) => paidTypeIds.has(l.leave_type_id))
        .reduce((s: number, l: any) => s + Number(l.days_count), 0);
      const lop = Math.max(0, workingDays - effectiveDays - paidLeave);

      return {
        id: emp.id,
        full_name: emp.full_name,
        employee_code: emp.employee_code,
        department: emp.department,
        present: fullDays,
        halfDays,
        effectiveDays,
        absent: Math.max(0, workingDays - effectiveDays - paidLeave),
        late,
        lop: Math.round(lop * 2) / 2,
        totalHours: Math.round(totalHours * 10) / 10,
        workingDays,
        paidLeave,
        details: empLogs.sort((a: any, b: any) => a.log_date.localeCompare(b.log_date)),
      };
    });
  }, [employees, logs, leaveData, deptFilter, workingDays, policies, shifts, paidTypeIds]);

  const avgAttendance = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + (r.effectiveDays / r.workingDays) * 100, 0) / rows.length) : 0;
  const totalLate = rows.reduce((s, r) => s + r.late, 0);
  const perfectCount = rows.filter(r => r.effectiveDays >= r.workingDays).length;
  const totalLop = rows.reduce((s, r) => s + r.lop, 0);

  const exportCSV = () => {
    const header = 'Employee Name,Code,Department,Working Days,Full Days,Half Days,Effective Days,Paid Leave,LOP,Late,Total Hrs,Attendance %\n';
    const body = rows.map(r => {
      const pct = r.workingDays > 0 ? Math.round((r.effectiveDays / r.workingDays) * 100) : 0;
      return `"${r.full_name}","${r.employee_code || ''}","${r.department}",${r.workingDays},${r.present},${r.halfDays},${r.effectiveDays},${r.paidLeave},${r.lop},${r.late},${r.totalHours},${pct}%`;
    }).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${MONTH_NAMES[month - 1]}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Attendance Report">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[year - 1, year, year + 1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Departments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={rows.length === 0}>
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Attendance</p>
              <p className="text-xl font-bold text-foreground">{avgAttendance}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Late Arrivals</p>
              <p className="text-xl font-bold text-foreground">{totalLate}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Perfect Attendance</p>
              <p className="text-xl font-bold text-foreground">{perfectCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={totalLop > 0 ? 'border-red-500/30' : ''}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total LOP Days</p>
              <p className={`text-xl font-bold ${totalLop > 0 ? 'text-destructive' : 'text-foreground'}`}>{totalLop}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No employees found.</div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Employee</TableHead>
                <TableHead>Dept</TableHead>
                <TableHead className="text-center">Working</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">½ Day</TableHead>
                <TableHead className="text-center">Effective</TableHead>
                <TableHead className="text-center">Paid Leave</TableHead>
                <TableHead className="text-center">LOP</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Hrs</TableHead>
                <TableHead className="text-center">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(row => {
                const pct = row.workingDays > 0 ? Math.round((row.effectiveDays / row.workingDays) * 100) : 0;
                const isExpanded = expandedId === row.id;
                return (
                  <>
                    <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(isExpanded ? null : row.id)}>
                      <TableCell>
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground text-sm">{row.full_name}</p>
                        {row.employee_code && <p className="text-xs text-muted-foreground">{row.employee_code}</p>}
                      </TableCell>
                      <TableCell className="text-xs">{row.department}</TableCell>
                      <TableCell className="text-center text-sm">{row.workingDays}</TableCell>
                      <TableCell className="text-center text-sm font-medium text-emerald-600">{row.present}</TableCell>
                      <TableCell className="text-center text-sm text-amber-600">{row.halfDays || '—'}</TableCell>
                      <TableCell className="text-center text-sm font-semibold">{row.effectiveDays}</TableCell>
                      <TableCell className="text-center text-sm text-blue-600">{row.paidLeave || '—'}</TableCell>
                      <TableCell className="text-center text-sm">
                        {row.lop > 0 ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">{row.lop}</Badge>
                        ) : '0'}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {row.late > 0 ? <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">{row.late}</Badge> : '0'}
                      </TableCell>
                      <TableCell className="text-center text-sm">{row.totalHours}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={pct} className="h-2 w-12" />
                          <span className="text-xs font-medium text-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${row.id}-detail`}>
                        <TableCell colSpan={12} className="bg-muted/30 p-0">
                          <div className="p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Day-by-Day Log — {MONTH_NAMES[month - 1]} {year}</p>
                            {row.details.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No logs recorded this month.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {row.details.map((log: any) => {
                                  const inTime = log.check_in ? format(new Date(log.check_in), 'HH:mm') : '—';
                                  const outTime = log.check_out ? format(new Date(log.check_out), 'HH:mm') : '—';
                                  const logDate = new Date(log.log_date);
                                  const effective = getEffectiveShift(row.department, logDate, shifts, policies);
                                  const [sH, sM] = effective.startTime.split(':').map(Number);
                                  const ciMin = log.check_in ? new Date(log.check_in).getHours() * 60 + new Date(log.check_in).getMinutes() : 0;
                                  const isLate = log.check_in && ciMin > (sH * 60 + sM + effective.graceMinutes);
                                  const isSat = logDate.getDay() === 6;
                                  return (
                                    <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs">
                                      <span className="font-medium text-foreground">
                                        {format(logDate, 'dd MMM, EEE')}
                                        {isSat && <span className="ml-1 text-muted-foreground">(Short)</span>}
                                      </span>
                                      <span className="text-muted-foreground">{inTime} – {outTime}</span>
                                      <div className="flex gap-1">
                                        <Badge variant="outline" className={
                                          log.status === 'present' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                          log.status === 'half_day' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                          'bg-red-500/10 text-red-600 border-red-500/20'
                                        }>{log.status === 'half_day' ? '½ Day' : log.status}</Badge>
                                        {isLate && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Late</Badge>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAttendanceReport;
