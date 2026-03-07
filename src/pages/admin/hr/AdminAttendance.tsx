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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState, useCallback } from 'react';

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  half_day: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  on_leave: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  field: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const locationTypeLabels: Record<string, string> = {
  office: '🏢 Office',
  client_site: '🤝 Client Site',
  event: '📅 Event',
  field: '🚗 Field Visit',
  wfh: '🏠 Work From Home',
};

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  address: string;
  loading: boolean;
  captured: boolean;
  error: string;
}

const AdminAttendance = () => {
  const qc = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', log_date: today, status: 'present',
    check_in: '', check_out: '', notes: '', location_type: 'office',
  });
  const [geo, setGeo] = useState<GeoState>({
    latitude: null, longitude: null, address: '', loading: false, captured: false, error: '',
  });

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo(g => ({ ...g, error: 'Geolocation not supported by this browser' }));
      return;
    }
    setGeo(g => ({ ...g, loading: true, error: '' }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Try reverse geocoding via a free API
        let address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=0`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) address = data.display_name;
          }
        } catch { /* fallback to coords */ }
        setGeo({ latitude, longitude, address, loading: false, captured: true, error: '' });
        toast.success('Location captured');
      },
      (err) => {
        setGeo(g => ({ ...g, loading: false, error: err.message || 'Location access denied' }));
        toast.error('Could not capture location — please allow location access');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

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
      const payload: Record<string, any> = {
        employee_id: form.employee_id,
        log_date: form.log_date,
        status: form.status,
        check_in: form.check_in ? `${form.log_date}T${form.check_in}:00` : null,
        check_out: form.check_out ? `${form.log_date}T${form.check_out}:00` : null,
        notes: form.notes || null,
        location_type: form.location_type,
      };
      if (geo.captured) {
        payload.latitude = geo.latitude;
        payload.longitude = geo.longitude;
        payload.address_snapshot = geo.address;
      }
      const { error } = await supabase.from('attendance_logs').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance-logs'] });
      toast.success('Attendance logged');
      resetForm();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const resetForm = () => {
    setOpen(false);
    setForm({ employee_id: '', log_date: today, status: 'present', check_in: '', check_out: '', notes: '', location_type: 'office' });
    setGeo({ latitude: null, longitude: null, address: '', loading: false, captured: false, error: '' });
  };

  const todayLogs = logs.filter((l: any) => l.log_date === today);
  const fieldToday = todayLogs.filter((l: any) => l.location_type && l.location_type !== 'office');
  const noGeoField = todayLogs.filter((l: any) => l.location_type && l.location_type !== 'office' && !l.latitude);

  return (
    <AdminLayout title="Attendance" subtitle="Track employee check-in/out with geo-tagged location">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Today Present</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{todayLogs.filter((l: any) => ['present', 'field'].includes(l.status)).length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">In Field Today</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-purple-600">{fieldToday.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Today Absent</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{todayLogs.filter((l: any) => l.status === 'absent').length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> No Geo (Field)
          </CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-600">{noGeoField.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Log</CardTitle>
          <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); else setOpen(true); }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Log Attendance</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Log Attendance</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Date</Label><Input type="date" value={form.log_date} onChange={e => setForm(p => ({ ...p, log_date: e.target.value }))} /></div>
                  <div>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="field">Field / Outdoor</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Location Type</Label>
                  <Select value={form.location_type} onValueChange={v => setForm(p => ({ ...p, location_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">🏢 Office</SelectItem>
                      <SelectItem value="client_site">🤝 Client Site</SelectItem>
                      <SelectItem value="event">📅 Event / Seminar</SelectItem>
                      <SelectItem value="field">🚗 Field Visit</SelectItem>
                      <SelectItem value="wfh">🏠 Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Geo capture section */}
                <div className="rounded-lg border border-dashed p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Navigation className="h-4 w-4" /> Geo Location
                    </Label>
                    <Button
                      type="button"
                      variant={geo.captured ? 'outline' : 'default'}
                      size="sm"
                      onClick={captureLocation}
                      disabled={geo.loading}
                    >
                      {geo.loading && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
                      {geo.captured ? '📍 Re-capture' : '📍 Capture Location'}
                    </Button>
                  </div>
                  {geo.captured && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-mono">{geo.latitude?.toFixed(5)}, {geo.longitude?.toFixed(5)}</p>
                      <p className="truncate" title={geo.address}>{geo.address}</p>
                    </div>
                  )}
                  {geo.error && <p className="text-xs text-destructive">{geo.error}</p>}
                  {form.location_type !== 'office' && !geo.captured && !geo.loading && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">⚠️ Location capture recommended for field attendance</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Check In</Label><Input type="time" value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></div>
                  <div><Label>Check Out</Label><Input type="time" value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></div>
                </div>
                <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. Meeting with XYZ client at Nariman Point" /></div>
                <Button className="w-full" disabled={!form.employee_id || !form.log_date} onClick={() => createLog.mutate()}>
                  Log Attendance
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : logs.length === 0 ? <p className="text-muted-foreground text-sm">No attendance records yet.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Geo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((l: any) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">
                        <div>{l.employees?.full_name || '—'}</div>
                        {l.employees?.employee_code && <div className="text-xs text-muted-foreground">{l.employees.employee_code}</div>}
                      </TableCell>
                      <TableCell>{format(new Date(l.log_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{l.check_in ? format(new Date(l.check_in), 'HH:mm') : '—'}</TableCell>
                      <TableCell>{l.check_out ? format(new Date(l.check_out), 'HH:mm') : '—'}</TableCell>
                      <TableCell><Badge className={statusColors[l.status] || ''}>{l.status}</Badge></TableCell>
                      <TableCell>
                        <span className="text-xs">{locationTypeLabels[l.location_type] || l.location_type || '—'}</span>
                      </TableCell>
                      <TableCell>
                        {l.latitude && l.longitude ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={`https://www.google.com/maps?q=${l.latitude},${l.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  <MapPin className="h-3.5 w-3.5" /> View
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs text-xs">
                                {l.address_snapshot || `${l.latitude.toFixed(5)}, ${l.longitude.toFixed(5)}`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          l.location_type && l.location_type !== 'office' ? (
                            <span className="text-xs text-amber-600">⚠️ No geo</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAttendance;
