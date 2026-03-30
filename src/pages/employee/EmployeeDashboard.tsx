
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeGuard, useEmployeeSession } from '@/components/portal/EmployeeGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Clock, Wallet, Users, LogOut, Shield, CreditCard, FileText } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PayslipPreview } from '@/components/shared/PayslipPreview';
import { toast as sonnerToast } from 'sonner';
import { useAttendancePolicies, determineStatus, getEffectiveShift } from '@/hooks/useAttendancePolicies';

/* ─── Profile Tab ─── */
function ProfileTab() {
  const { session } = useEmployeeSession();
  if (!session) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-4 mb-6">
        {session.photoUrl ? (
          <img src={session.photoUrl} alt={session.fullName} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary">
            {session.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{session.fullName}</h3>
          <p className="text-sm text-muted-foreground">{session.designation} · {session.department}</p>
          {session.employeeCode && (
            <Badge variant="outline" className="mt-1 text-xs">{session.employeeCode}</Badge>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground text-xs">Email</span>
          <p className="text-foreground">{session.email}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">Date of Joining</span>
          <p className="text-foreground">
            {session.dateOfJoining ? format(new Date(session.dateOfJoining), 'dd MMM yyyy') : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Attendance Tab ─── */
function AttendanceTab() {
  const { session } = useEmployeeSession();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [locationType, setLocationType] = useState('office');
  const [geoLoading, setGeoLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const { policies, shifts } = useAttendancePolicies();

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadLogs = async () => {
    if (!session) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const [{ data: allLogs }, { data: todayData }] = await Promise.all([
      supabase
        .from('attendance_logs')
        .select('*')
        .eq('employee_id', session.employeeId)
        .order('log_date', { ascending: false })
        .limit(30),
      supabase
        .from('attendance_logs')
        .select('*')
        .eq('employee_id', session.employeeId)
        .eq('log_date', today)
        .maybeSingle(),
    ]);
    setLogs(allLogs || []);
    setTodayLog(todayData);
    setLoading(false);
  };

  useEffect(() => { loadLogs(); }, [session]);

  const getGeoLocation = (): Promise<{ lat: number; lng: number; address: string }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return; }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            if (data.display_name) address = data.display_name;
          } catch { /* keep coords as fallback */ }
          resolve({ lat, lng, address });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  };

  const handleCheckIn = async () => {
    if (!session) return;
    setGeoLoading(true);
    try {
      const geo = await getGeoLocation();
      const today = format(new Date(), 'yyyy-MM-dd');
      const checkInTime = new Date();
      const { status, isLate } = determineStatus(checkInTime, null, policies, session.department, shifts);
      const { error } = await supabase.from('attendance_logs').insert({
        employee_id: session.employeeId,
        log_date: today,
        check_in: checkInTime.toISOString(),
        latitude: geo.lat,
        longitude: geo.lng,
        address_snapshot: geo.address,
        location_type: locationType,
        status,
        notes: isLate ? 'Late arrival' : null,
      });
      if (error) { sonnerToast.error(error.message); return; }
      sonnerToast.success('Checked in successfully');
      loadLogs();
    } catch (err: any) {
      sonnerToast.error(err.message || 'Could not get location');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!session || !todayLog) return;
    setGeoLoading(true);
    try {
      const checkOutTime = new Date();
      const checkInTime = new Date(todayLog.check_in);
      const { status, isLate } = determineStatus(checkInTime, checkOutTime, policies);
      const { error } = await supabase.from('attendance_logs')
        .update({
          check_out: checkOutTime.toISOString(),
          status,
          notes: isLate ? 'Late arrival' : todayLog.notes,
        })
        .eq('id', todayLog.id);
      if (error) { sonnerToast.error(error.message); return; }
      sonnerToast.success('Checked out successfully');
      loadLogs();
    } catch (err: any) {
      sonnerToast.error(err.message || 'Check-out failed');
    } finally {
      setGeoLoading(false);
    }
  };

  if (loading) return <div className="p-6 space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>;

  const hasCheckedIn = !!todayLog;
  const hasCheckedOut = todayLog?.check_out;

  return (
    <div className="space-y-4">
      {/* Check-in / Check-out card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Today's Attendance</h3>
            <p className="text-xs text-muted-foreground">{format(now, 'EEEE, dd MMMM yyyy')}</p>
          </div>
          <div className="text-2xl font-mono font-bold text-primary">{format(now, 'HH:mm:ss')}</div>
        </div>

        {!hasCheckedIn && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">Location</Label>
              <Select value={locationType} onValueChange={setLocationType}>
                <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="client_site">Client Site</SelectItem>
                  <SelectItem value="field_visit">Field Visit</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="wfh">Work from Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCheckIn} disabled={geoLoading} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              {geoLoading ? 'Getting location…' : 'Check In'}
            </Button>
          </div>
        )}

        {hasCheckedIn && !hasCheckedOut && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Checked in at</span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {format(new Date(todayLog.check_in), 'hh:mm a')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">📍 {todayLog.address_snapshot || todayLog.location_type}</p>
            <Button variant="destructive" onClick={handleCheckOut} disabled={geoLoading} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              {geoLoading ? 'Processing…' : 'Check Out'}
            </Button>
          </div>
        )}

        {hasCheckedIn && hasCheckedOut && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium text-foreground">{format(new Date(todayLog.check_in), 'hh:mm a')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium text-foreground">{format(new Date(todayLog.check_out), 'hh:mm a')}</span>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 w-full justify-center">
              ✓ Attendance recorded for today
            </Badge>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent History</h3>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No attendance records found.</div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{format(new Date(log.log_date), 'EEE, dd MMM yyyy')}</p>
                  <p className="text-xs text-muted-foreground">{log.location_type}{log.address_snapshot ? ` · ${log.address_snapshot.slice(0, 40)}…` : ''}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={
                    log.status === 'present' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                    log.status === 'half_day' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    'bg-red-500/10 text-red-600 border-red-500/20'
                  }>
                    {log.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.check_in ? format(new Date(log.check_in), 'HH:mm') : '--:--'} – {log.check_out ? format(new Date(log.check_out), 'HH:mm') : '--:--'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Leave Balance Summary ─── */
function LeaveBalanceSummary() {
  const { session } = useEmployeeSession();
  const [balances, setBalances] = useState<any[]>([]);
  const [usedMap, setUsedMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const currentYear = new Date().getFullYear();
    const load = async () => {
      const [{ data: bals }, { data: reqs }] = await Promise.all([
        supabase
          .from('leave_balances')
          .select('*, leave_types(name, code)')
          .eq('employee_id', session.employeeId)
          .eq('year', currentYear),
        supabase
          .from('leave_requests')
          .select('leave_type_id, days_count')
          .eq('employee_id', session.employeeId)
          .eq('status', 'approved')
          .gte('start_date', `${currentYear}-01-01`)
          .lte('start_date', `${currentYear}-12-31`),
      ]);
      setBalances(bals || []);
      const map: Record<string, number> = {};
      (reqs || []).forEach((r: any) => {
        map[r.leave_type_id] = (map[r.leave_type_id] || 0) + Number(r.days_count);
      });
      setUsedMap(map);
      setLoading(false);
    };
    load();
  }, [session]);

  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>;
  if (balances.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {balances.map((bal: any) => {
        const total = Number(bal.opening_balance) + Number(bal.accrued);
        const used = usedMap[bal.leave_type_id] || 0;
        const available = total - used;
        const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
        const isLow = available < 2 && available >= 0;
        const typeName = (bal.leave_types as any)?.name || 'Leave';

        return (
          <div
            key={bal.id}
            className={`rounded-xl border p-4 ${isLow ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-card'}`}
          >
            <p className={`text-sm font-medium mb-2 ${isLow ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>{typeName}</p>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total: <strong className="text-foreground">{total}</strong></span>
              <span>Used: <strong className="text-foreground">{used}</strong></span>
              <span>Avail: <strong className={isLow ? 'text-amber-600' : 'text-foreground'}>{available}</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Leave Tab ─── */
function LeaveTab() {
  const { session } = useEmployeeSession();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data } = await supabase
        .from('leave_requests')
        .select('*, leave_types(name)')
        .eq('employee_id', session.employeeId)
        .order('created_at', { ascending: false })
        .limit(20);
      setRequests(data || []);
      setLoading(false);
    };
    load();
  }, [session]);

  if (loading) return <div className="p-6 space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>;

  return (
    <div>
      <LeaveBalanceSummary />
      <div className="bg-card border border-border rounded-xl">
      {requests.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">No leave requests found.</div>
      ) : (
        <div className="divide-y divide-border">
          {requests.map((req) => (
            <div key={req.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{(req.leave_types as any)?.name || 'Leave'}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(req.start_date), 'dd MMM')} – {format(new Date(req.end_date), 'dd MMM yyyy')} · {req.days_count} day{req.days_count > 1 ? 's' : ''}
                </p>
                {req.reason && <p className="text-xs text-muted-foreground mt-0.5">{req.reason}</p>}
              </div>
              <Badge variant="outline" className={
                req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                'bg-red-500/10 text-red-600 border-red-500/20'
              }>
                {req.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

/* ─── Payslips Tab ─── */
function PayslipsTab() {
  const { session } = useEmployeeSession();
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<{ entry: any; run: any } | null>(null);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data } = await supabase
        .from('payroll_entries')
        .select('*, payroll_runs!payroll_entries_payroll_run_id_fkey(month, year, working_days)')
        .eq('employee_id', session.employeeId)
        .order('created_at', { ascending: false });
      setPayslips(data || []);
      setLoading(false);
    };
    load();
  }, [session]);

  if (loading) return <div className="p-6 space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>;

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  if (payslips.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium text-foreground mb-1">Payslips</h3>
        <p className="text-sm text-muted-foreground">Your payslips will appear here once payroll is processed.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {payslips.map((entry) => {
          const run = entry.payroll_runs as any;
          const monthName = run ? MONTH_NAMES[run.month - 1] : '';
          return (
            <div key={entry.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{monthName} {run?.year}</p>
                <p className="text-xl font-bold text-primary mt-0.5">
                  ₹{Math.round(Number(entry.net_pay)).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gross: ₹{Math.round(Number(entry.gross)).toLocaleString('en-IN')} · Deductions: ₹{Math.round(Number(entry.total_deductions)).toLocaleString('en-IN')}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPreviewData({ entry, run })}>
                View Payslip
              </Button>
            </div>
          );
        })}
      </div>

      {/* Payslip modal */}
      <Dialog open={!!previewData} onOpenChange={open => { if (!open) setPreviewData(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Salary Slip</DialogTitle>
          </DialogHeader>
          {previewData && session && (
            <PayslipPreview
              row={{
                full_name: session.fullName,
                employee_code: session.employeeCode || '',
                designation: session.designation,
                department: session.department,
                date_of_joining: session.dateOfJoining || null,
                pan: null,
                days_present: Number(previewData.entry.days_present),
                basic: Number(previewData.entry.basic),
                hra: Number(previewData.entry.hra),
                special_allowance: Number(previewData.entry.special_allowance),
                medical_allowance: Number(previewData.entry.medical_allowance),
                lta: Number(previewData.entry.lta),
                other_allowance: Number(previewData.entry.other_allowance),
                gross: Number(previewData.entry.gross),
                pf_employee: Number(previewData.entry.pf_employee),
                pf_employer: Number(previewData.entry.pf_employer),
                esi_employee: Number(previewData.entry.esi_employee),
                esi_employer: Number(previewData.entry.esi_employer),
                professional_tax: Number(previewData.entry.professional_tax),
                tds: Number(previewData.entry.tds),
                total_deductions: Number(previewData.entry.total_deductions),
                net_pay: Number(previewData.entry.net_pay),
              }}
              month={previewData.run?.month || 1}
              year={previewData.run?.year || 2026}
              workingDays={previewData.run?.working_days || 26}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─── Team Directory Tab ─── */
function TeamTab() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, designation, department, photo_url, email')
        .eq('status', 'active')
        .eq('is_public', true)
        .order('sort_order', { ascending: true })
        .limit(50);
      setTeam(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-6 space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>;

  return (
    <div className="bg-card border border-border rounded-xl">
      {team.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">No team members found.</div>
      ) : (
        <div className="divide-y divide-border">
          {team.map((member) => (
            <div key={member.id} className="p-4 flex items-center gap-3">
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.full_name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {member.full_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{member.full_name}</p>
                <p className="text-xs text-muted-foreground">{member.designation} · {member.department}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Expenses Tab ─── */
function ExpensesTab() {
  const { session } = useEmployeeSession();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ category: 'travel', description: '', amount: 0, claim_date: format(new Date(), 'yyyy-MM-dd') });

  const loadClaims = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('expense_claims')
      .select('*')
      .eq('employee_id', session.employeeId)
      .order('created_at', { ascending: false });
    setClaims(data || []);
    setLoading(false);
  };

  useEffect(() => { loadClaims(); }, [session]);

  const handleSubmit = async () => {
    if (!session) return;
    const { error } = await supabase.from('expense_claims').insert({
      employee_id: session.employeeId,
      category: form.category,
      description: form.description,
      amount: form.amount,
      claim_date: form.claim_date,
    });
    if (error) { sonnerToast.error(error.message); return; }
    sonnerToast.success('Expense claim submitted');
    setDialogOpen(false);
    setForm({ category: 'travel', description: '', amount: 0, claim_date: format(new Date(), 'yyyy-MM-dd') });
    loadClaims();
  };

  if (loading) return <div className="p-6 space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>;

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    reimbursed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><CreditCard className="h-4 w-4 mr-1.5" /> New Claim</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit Expense Claim</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['travel','food','office_supplies','communication','medical','other'].map(c => (
                      <SelectItem key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.claim_date} onChange={e => setForm(p => ({ ...p, claim_date: e.target.value }))} />
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={!form.description || !form.amount}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border border-border rounded-xl">
        {claims.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No expense claims submitted yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {claims.map((c: any) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{c.category?.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(c.claim_date), 'dd MMM yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{Math.round(Number(c.amount)).toLocaleString('en-IN')}</p>
                  <Badge variant="outline" className={statusColors[c.status] || ''}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Documents Tab ─── */
function DocumentsTab() {
  const { session } = useEmployeeSession();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', session.employeeId)
        .order('created_at', { ascending: false });
      setDocs(data || []);
      setLoading(false);
    };
    load();
  }, [session]);

  if (loading) return <div className="p-6 space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>;

  return (
    <div className="bg-card border border-border rounded-xl">
      {docs.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p>No documents uploaded yet. Your HR team will add documents here.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {docs.map((d: any) => (
            <div key={d.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{d.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{d.document_type?.replace('_', ' ')} · {format(new Date(d.created_at), 'dd MMM yyyy')}</p>
                </div>
              </div>
              {d.file_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={d.file_url} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─── */
function EmployeeDashboardContent() {
  const { session } = useEmployeeSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><img src={sernetLogo} alt="SERNET" className="h-7 object-contain" /></Link>
            <Badge variant="outline" className="text-xs">Employee Portal</Badge>
          </div>
          <div className="flex items-center gap-3">
            {session.hasAdminAccess && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Shield className="h-3.5 w-3.5 mr-1" /> Admin
                </Button>
              </Link>
            )}
            <span className="text-sm text-foreground hidden sm:block">{session.fullName}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Welcome, {session.fullName.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">{session.designation} · {session.department}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="attendance" className="gap-1.5"><Clock className="h-4 w-4" /> Attendance</TabsTrigger>
            <TabsTrigger value="leave" className="gap-1.5"><Calendar className="h-4 w-4" /> Leave</TabsTrigger>
            <TabsTrigger value="payslips" className="gap-1.5"><Wallet className="h-4 w-4" /> Payslips</TabsTrigger>
            <TabsTrigger value="expenses" className="gap-1.5"><CreditCard className="h-4 w-4" /> Expenses</TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5"><Users className="h-4 w-4" /> Team</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="attendance"><AttendanceTab /></TabsContent>
          <TabsContent value="leave"><LeaveTab /></TabsContent>
          <TabsContent value="payslips"><PayslipsTab /></TabsContent>
          <TabsContent value="expenses"><ExpensesTab /></TabsContent>
          <TabsContent value="documents"><DocumentsTab /></TabsContent>
          <TabsContent value="team"><TeamTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function EmployeeDashboard() {
  return (
    <EmployeeGuard>
      <EmployeeDashboardContent />
    </EmployeeGuard>
  );
}
