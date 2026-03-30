import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Save, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface PolicyRow {
  id: string;
  policy_key: string;
  policy_value: string;
  label: string;
  description: string | null;
}

const AdminAttendancePolicies = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});

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
          value={value}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="max-w-[200px]"
        />
      </div>
    );
  };

  return (
    <AdminLayout title="Attendance Policies">
      <div className="max-w-2xl space-y-6">
        {/* Info banner */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">How attendance status is calculated</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>On Time:</strong> Check-in before start time + grace period</li>
                <li><strong>Late:</strong> Check-in after start time + grace period but before half-day cutoff</li>
                <li><strong>Half Day:</strong> Check-in after half-day time, OR worked less than full-day hours</li>
                <li><strong>Absent:</strong> No check-in, OR worked less than half-day minimum hours</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Attendance Rules
            </CardTitle>
            <CardDescription>Configure office timings, grace periods, and attendance thresholds</CardDescription>
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

                {/* Quick preview of effective rules */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Effective Rules Preview</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Office: {form.office_start_time || '10:00'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Grace: {form.grace_period_minutes || '15'} min
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Half-day after: {form.half_day_after_time || '12:00'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Full day ≥ {form.min_full_day_hours || '7'}h
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Half day ≥ {form.half_day_min_hours || '3'}h
                    </Badge>
                  </div>
                </div>

                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? 'Saving…' : 'Save Policies'}
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
              Use the Attendance page to manually adjust historical records if needed.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendancePolicies;
