import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const inr = (v: number) => Math.round(v).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

interface ChallanCard {
  type: string;
  label: string;
  amount: number;
  dueDate: Date;
  link: string;
}

const AdminStatutoryDues = () => {
  const { toast } = useToast();
  const [run, setRun] = useState<any>(null);
  const [filedMap, setFiledMap] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filing, setFiling] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [{ data: runs }, { data: challans }] = await Promise.all([
      supabase.from('payroll_runs').select('*').order('year', { ascending: false }).order('month', { ascending: false }).limit(1),
      supabase.from('statutory_challans').select('*').order('year', { ascending: false }).order('month', { ascending: false }),
    ]);
    setRun(runs?.[0] || null);
    setHistory(challans || []);
    const map: Record<string, any> = {};
    (challans || []).forEach((c: any) => { map[`${c.challan_type}_${c.month}_${c.year}`] = c; });
    setFiledMap(map);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const cards: ChallanCard[] = [];
  if (run) {
    const m = run.month;
    const y = run.year;
    const nextMonth = m === 12 ? 1 : m + 1;
    const nextYear = m === 12 ? y + 1 : y;
    const lastDayCurrentMonth = new Date(y, m, 0);

    const pfTotal = Number(run.total_pf_employee || 0) + Number(run.total_pf_employer || 0);
    if (pfTotal > 0) {
      cards.push({ type: 'pf', label: 'PF Challan', amount: pfTotal, dueDate: new Date(nextYear, nextMonth - 1, 15), link: 'https://unifiedportal-emp.epfindia.gov.in' });
    }

    const esiTotal = Number(run.total_esi_employee || 0) + Number(run.total_esi_employer || 0);
    if (Number(run.total_esi_employee || 0) > 0) {
      cards.push({ type: 'esi', label: 'ESI Challan', amount: esiTotal, dueDate: new Date(nextYear, nextMonth - 1, 15), link: 'https://www.esic.in/EmployerPortal' });
    }

    const ptTotal = Number(run.total_pt || 0);
    if (ptTotal > 0) {
      cards.push({ type: 'pt', label: 'Professional Tax', amount: ptTotal, dueDate: lastDayCurrentMonth, link: 'https://mahagst.gov.in' });
    }

    const tdsTotal = Number(run.total_tds || 0);
    if (tdsTotal > 0) {
      cards.push({ type: 'tds', label: 'TDS', amount: tdsTotal, dueDate: new Date(nextYear, nextMonth - 1, 7), link: 'https://onlineservices.tin.egov-nsdl.com' });
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = run ? cards.filter(c => {
    const key = `${c.type}_${run.month}_${run.year}`;
    return c.dueDate < today && (!filedMap[key] || filedMap[key].status !== 'filed');
  }) : [];

  const handleFile = async (card: ChallanCard) => {
    if (!run) return;
    setFiling(card.type);
    const { error } = await supabase.from('statutory_challans').upsert({
      challan_type: card.type,
      month: run.month,
      year: run.year,
      amount: card.amount,
      status: 'filed',
      filed_on: format(new Date(), 'yyyy-MM-dd'),
    }, { onConflict: 'challan_type,month,year' });
    setFiling(null);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Marked as Filed' });
      loadData();
    }
  };

  const colorMap: Record<string, string> = {
    pf: 'border-blue-500/30 bg-blue-500/5',
    esi: 'border-emerald-500/30 bg-emerald-500/5',
    pt: 'border-violet-500/30 bg-violet-500/5',
    tds: 'border-amber-500/30 bg-amber-500/5',
  };

  return (
    <AdminLayout title="Statutory Dues">
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}</div>
      ) : !run ? (
        <div className="text-center py-16 text-muted-foreground">No payroll run found. Process payroll first.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing dues for <strong className="text-foreground">{MONTH_NAMES[run.month - 1]} {run.year}</strong> payroll run
          </p>

          {overdue.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{overdue.length} overdue challan{overdue.length > 1 ? 's' : ''}:</strong>{' '}
                {overdue.map(c => c.label).join(', ')} — due date has passed and not yet filed.
              </AlertDescription>
            </Alert>
          )}

          {/* Challan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(card => {
              const key = `${card.type}_${run.month}_${run.year}`;
              const filed = filedMap[key]?.status === 'filed' ? filedMap[key] : null;
              const isPastDue = card.dueDate < today && !filed;

              return (
                <Card key={card.type} className={`border ${colorMap[card.type] || 'border-border'} ${isPastDue ? 'ring-2 ring-destructive/40' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground text-sm">{card.label}</h3>
                      <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">{inr(card.amount)}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Due: {format(card.dueDate, 'dd MMM yyyy')}
                    </p>
                    {filed ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Filed on {format(new Date(filed.filed_on), 'dd MMM yyyy')}
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled={filing === card.type} onClick={() => handleFile(card)}>
                        {filing === card.type ? 'Filing...' : 'Mark as Filed'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* History */}
          <h3 className="font-semibold text-foreground mb-3">Filing History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No challans filed yet.</p>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challan</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-sm capitalize">{row.challan_type}</TableCell>
                      <TableCell className="text-sm">{MONTH_NAMES[row.month - 1]} {row.year}</TableCell>
                      <TableCell className="text-right text-sm">{inr(Number(row.amount))}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          row.status === 'filed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.filed_on ? format(new Date(row.filed_on), 'dd MMM yyyy') : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminStatutoryDues;
