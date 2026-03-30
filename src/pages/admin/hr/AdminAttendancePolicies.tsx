import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Clock, Save, AlertTriangle, Info, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface PolicyRow {
  id: string;
  policy_key: string;
  policy_value: string;
  label: string;
  description: string | null;
}

interface ShiftRow {
  id: string;
  department_name: string;
  weekday_start: string;
  weekday_end: string;
  saturday_start: string;
  saturday_end: string;
  grace_minutes: number;
  is_active: boolean;
}

const AdminAttendancePolicies = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [shiftEdits, setShiftEdits] = useState<Record<string, Partial<ShiftRow>>>({});

  const { data: policies, isLoading } = useQuery({
    queryKey: ['attendance-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_policies')
        .select('*')
        .order('policy_key');
      if (error) throw error;
      return (data || []) as PolicyRow[];
    },
  });

  const { data: shifts = [], isLoading: shiftsLoading } = useQuery({
    queryKey: ['department-shifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_shifts' as any)
        .select('*')
        .order('department_name');
      if (error) throw error;
      return (data || []) as ShiftRow[];
    },
  });

  useEffect(() => {
    if (policies) {
      const m: Record<string, string> = {};
      policies.forEach(p => { m[p.policy_key] = p.policy_value; });
      setForm(m);
    }
  }, [policies]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(form).map(([key, value]) =>
        supabase
          .from('attendance_policies')
          .update({ policy_value: value, updated_at: new Date().toISOString() })
          .eq('policy_key', key)
      );
      const results = await Promise.all(updates);
      const err = results.find(r => r.error);
      if (err?.error) throw err.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance-policies'] });
      toast.success('Attendance policies saved');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const saveShiftsMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(shiftEdits).map(([id, vals]) =>
        supabase.from('department_shifts' as any).update(vals as any).eq('id', id)
      );
      const results = await Promise.all(updates);
      const err = results.find((r: any) => r.error);
      if ((err as any)?.error) throw (err as any).error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['department-shifts'] });
      setShiftEdits({});
      toast.success('Department shifts saved');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const getShiftVal = (shift: ShiftRow, field: keyof ShiftRow) => {
    const edited = shiftEdits[shift.id];
    if (edited && field in edited) return edited[field];
    return shift[field];
  };

  const setShiftField = (id: string, field: string, value: any) => {
    setShiftEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const renderField = (p: PolicyRow) => {
    const key = p.policy_key;
    const value = form[key] ?? p.policy_value;

    if (key === 'auto_absent_if_no_checkin') {
      return (
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">{p.label}</Label>
            <p className="text-xs text-muted-foreground">{p.description}</p>
          </div>
          <Switch
            checked={value === 'true'}
            onCheckedChange={c => setForm(f => ({ ...f, [key]: c ? 'true' : 'false' }))}
          />
        </div>
      );
    }

    const isTime = key.includes('time') && !key.includes('minutes');

    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">{p.label}</Label>
        <p className="text-xs text-muted-foreground">{p.description}</p>
        <Input
          type={isTime ? 'time' : key.includes('minutes') || key.includes('hours') ? 'number' : 'text'}
          step={key.includes('hours') ? '0.5' : undefined}
          value={value}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="max-w-[200px]"
        />
      </div>
    );
  };

  return (
    <AdminLayout title="Attendance Policies">
      <div className="max-w-4xl space-y-6">
        {/* Info banner */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">How attendance status is calculated</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>On Time:</strong> Check-in before department start time + grace period</li>
                <li><strong>Late:</strong> Check-in after start time + grace period</li>
                <li><strong>Half Day:</strong> Worked less than full-day minimum hours but more than half-day minimum</li>
                <li><strong>Absent:</strong> No check-in, OR worked less than half-day minimum hours</li>
                <li><strong>Saturday:</strong> 5-hour full day rule — separate from weekday 7.5 hours</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Global Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Global Attendance Rules
            </CardTitle>
            <CardDescription>Default timings and thresholds (overridden by department shifts where applicable)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
            ) : (
              <>
                {policies?.map(p => (
                  <div key={p.id} className="pb-4 border-b border-border last:border-0">
                    {renderField(p)}
                  </div>
                ))}

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Effective Rules Preview</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Default Start: {form.office_start_time || '10:00'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Grace: {form.grace_period_minutes || '15'} min
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Weekday Full ≥ {form.min_full_day_hours || '7.5'}h
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Half Day ≥ {form.half_day_min_hours || '5'}h
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Saturday Full ≥ {form.saturday_full_day_hours || '5'}h
                    </Badge>
                  </div>
                </div>

                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? 'Saving…' : 'Save Global Policies'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Department Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department-Wise Shifts
            </CardTitle>
            <CardDescription>Set specific start/end times per department for weekdays and Saturdays</CardDescription>
          </CardHeader>
          <CardContent>
            {shiftsLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}</div>
            ) : (
              <>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-center">Weekday Start</TableHead>
                        <TableHead className="text-center">Weekday End</TableHead>
                        <TableHead className="text-center">Saturday Start</TableHead>
                        <TableHead className="text-center">Saturday End</TableHead>
                        <TableHead className="text-center">Grace (min)</TableHead>
                        <TableHead className="text-center">Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shifts.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium text-sm">{s.department_name}</TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              className="h-8 w-24 mx-auto text-center text-xs"
                              value={String(getShiftVal(s, 'weekday_start')).slice(0, 5)}
                              onChange={e => setShiftField(s.id, 'weekday_start', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              className="h-8 w-24 mx-auto text-center text-xs"
                              value={String(getShiftVal(s, 'weekday_end')).slice(0, 5)}
                              onChange={e => setShiftField(s.id, 'weekday_end', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              className="h-8 w-24 mx-auto text-center text-xs"
                              value={String(getShiftVal(s, 'saturday_start')).slice(0, 5)}
                              onChange={e => setShiftField(s.id, 'saturday_start', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              className="h-8 w-24 mx-auto text-center text-xs"
                              value={String(getShiftVal(s, 'saturday_end')).slice(0, 5)}
                              onChange={e => setShiftField(s.id, 'saturday_end', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 w-16 mx-auto text-center text-xs"
                              value={Number(getShiftVal(s, 'grace_minutes'))}
                              onChange={e => setShiftField(s.id, 'grace_minutes', Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={Boolean(getShiftVal(s, 'is_active'))}
                              onCheckedChange={v => setShiftField(s.id, 'is_active', v)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  className="mt-4"
                  onClick={() => saveShiftsMutation.mutate()}
                  disabled={saveShiftsMutation.isPending || Object.keys(shiftEdits).length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveShiftsMutation.isPending ? 'Saving…' : 'Save Department Shifts'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Warning card */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Changes apply to <strong>new check-ins</strong> going forward. Existing attendance records retain their original status.
              Department shifts override global start times — the global rules act as defaults for departments without a configured shift.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendancePolicies;
