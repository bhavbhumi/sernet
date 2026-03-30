import { useState, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle2, AlertTriangle, Users, Wallet, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

/* ── helpers ── */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (vals[i] || '').replace(/^"|"$/g, '').trim(); });
    return row;
  });
}

function findCol(row: Record<string, string>, variants: string[]): string {
  const keys = Object.keys(row);
  for (const v of variants) {
    const match = keys.find(k => k.toLowerCase().replace(/[_\s]+/g, '') === v.toLowerCase().replace(/[_\s]+/g, ''));
    if (match) return row[match];
  }
  return '';
}

function parseDateDMY(val: string): string | null {
  if (!val) return null;
  const m = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : format(d, 'yyyy-MM-dd');
}

function cleanNum(val: string): number {
  if (!val) return 0;
  return Number(val.replace(/[₹,\s]/g, '')) || 0;
}

function yesNo(val: string, def = true): boolean {
  if (!val) return def;
  return ['yes', 'y', 'true', '1'].includes(val.toLowerCase().trim());
}

/* ── main ── */
const AdminImportSpine = () => {
  const { toast } = useToast();

  // State per section
  const [empRows, setEmpRows] = useState<Record<string, string>[]>([]);
  const [salRows, setSalRows] = useState<Record<string, string>[]>([]);
  const [leaveRows, setLeaveRows] = useState<Record<string, string>[]>([]);

  const [empResult, setEmpResult] = useState<{ count: number; errors: string[] } | null>(null);
  const [salResult, setSalResult] = useState<{ count: number; errors: string[] } | null>(null);
  const [leaveResult, setLeaveResult] = useState<{ count: number; errors: string[] } | null>(null);

  const [importing, setImporting] = useState<string | null>(null);

  const handleFile = (setter: (rows: Record<string, string>[]) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setter(parseCSV(text));
    };
    reader.readAsText(file);
  };

  /* ── Import employees ── */
  const importEmployees = async () => {
    setImporting('emp');
    const errors: string[] = [];
    let count = 0;

    for (let i = 0; i < empRows.length; i++) {
      const r = empRows[i];
      const code = findCol(r, ['employee_code', 'employee code', 'emp code', 'emp_code', 'code']);
      const name = findCol(r, ['full_name', 'employee name', 'name', 'emp name']);
      if (!code || !name) { errors.push(`Row ${i + 2}: missing employee code or name`); continue; }

      const rec: any = {
        employee_code: code,
        full_name: name,
        department: findCol(r, ['department']) || 'General',
        designation: findCol(r, ['designation']) || 'Associate',
        status: 'active',
      };

      const doj = parseDateDMY(findCol(r, ['date_of_joining', 'doj', 'joining date']));
      if (doj) rec.date_of_joining = doj;
      const email = findCol(r, ['email', 'email id']);
      if (email) rec.email = email;
      const phone = findCol(r, ['mobile', 'phone', 'contact']);
      if (phone) rec.phone = phone;

      const { error } = await supabase.from('employees').upsert(rec, { onConflict: 'employee_code' });
      if (error) { errors.push(`Row ${i + 2} (${code}): ${error.message}`); } else { count++; }
    }

    setEmpResult({ count, errors });
    setImporting(null);
    toast({ title: `${count} employees imported` });
  };

  /* ── Import salary structures ── */
  const importSalary = async () => {
    setImporting('sal');
    const errors: string[] = [];
    let count = 0;

    // Build code→id map
    const { data: emps } = await supabase.from('employees').select('id, employee_code').eq('status', 'active');
    const codeMap: Record<string, string> = {};
    (emps || []).forEach((e: any) => { if (e.employee_code) codeMap[e.employee_code.toLowerCase()] = e.id; });

    const today = format(new Date(), 'yyyy-MM-dd');

    for (let i = 0; i < salRows.length; i++) {
      const r = salRows[i];
      const code = findCol(r, ['employee_code', 'employee code', 'emp code', 'emp_code', 'code']);
      const empId = codeMap[code?.toLowerCase()];
      if (!empId) { errors.push(`Row ${i + 2}: employee code "${code}" not found`); continue; }

      const rec = {
        employee_id: empId,
        effective_from: today,
        effective_to: null as string | null,
        ctc_annual: cleanNum(findCol(r, ['ctc_annual', 'ctc', 'annual ctc'])),
        basic: cleanNum(findCol(r, ['basic'])),
        hra: cleanNum(findCol(r, ['hra'])),
        special_allowance: cleanNum(findCol(r, ['special_allowance', 'special allowance'])),
        medical_allowance: cleanNum(findCol(r, ['medical_allowance', 'medical allowance'])) || 1250,
        lta: cleanNum(findCol(r, ['lta'])),
        other_allowance: cleanNum(findCol(r, ['other_allowance', 'other allowance'])),
        is_pf_applicable: yesNo(findCol(r, ['pf_applicable', 'pf applicable']), true),
        pf_wage_cap: 15000,
        is_esi_applicable: false,
        tds_monthly: cleanNum(findCol(r, ['tds_monthly', 'tds monthly', 'tds'])),
        regime: 'new' as const,
      };

      // Upsert: update existing open structure or insert new
      const { data: existing } = await supabase.from('salary_structures')
        .select('id').eq('employee_id', empId).is('effective_to', null).limit(1);

      let error;
      if (existing && existing.length > 0) {
        ({ error } = await supabase.from('salary_structures').update(rec).eq('id', existing[0].id));
      } else {
        ({ error } = await supabase.from('salary_structures').insert(rec));
      }
      if (error) { errors.push(`Row ${i + 2} (${code}): ${error.message}`); } else { count++; }
    }

    setSalResult({ count, errors });
    setImporting(null);
    toast({ title: `${count} salary structures imported` });
  };

  /* ── Import leave balances ── */
  const importLeave = async () => {
    setImporting('leave');
    const errors: string[] = [];
    let count = 0;
    const currentYear = new Date().getFullYear();

    // Maps
    const { data: emps } = await supabase.from('employees').select('id, employee_code').eq('status', 'active');
    const codeMap: Record<string, string> = {};
    (emps || []).forEach((e: any) => { if (e.employee_code) codeMap[e.employee_code.toLowerCase()] = e.id; });

    const { data: leaveTypes } = await supabase.from('leave_types').select('id, name');
    const plType = (leaveTypes || []).find((t: any) => t.name.toLowerCase().includes('privilege') || t.name.toLowerCase().includes('earned'));
    const slType = (leaveTypes || []).find((t: any) => t.name.toLowerCase().includes('sick'));
    const clType = (leaveTypes || []).find((t: any) => t.name.toLowerCase().includes('casual'));

    for (let i = 0; i < leaveRows.length; i++) {
      const r = leaveRows[i];
      const code = findCol(r, ['employee_code', 'employee code', 'emp code', 'emp_code', 'code']);
      const empId = codeMap[code?.toLowerCase()];
      if (!empId) { errors.push(`Row ${i + 2}: employee code "${code}" not found`); continue; }

      const balances = [
        { typeId: plType?.id, val: cleanNum(findCol(r, ['pl_balance', 'pl', 'privilege leave', 'earned leave'])) },
        { typeId: slType?.id, val: cleanNum(findCol(r, ['sl_balance', 'sl', 'sick leave'])) },
        { typeId: clType?.id, val: cleanNum(findCol(r, ['cl_balance', 'cl', 'casual leave'])) },
      ];

      for (const b of balances) {
        if (!b.typeId) continue;
        const { error } = await supabase.from('leave_balances').upsert({
          employee_id: empId,
          leave_type_id: b.typeId,
          year: currentYear,
          opening_balance: b.val,
          accrued: 0,
        }, { onConflict: 'employee_id,leave_type_id,year' });
        if (error) { errors.push(`Row ${i + 2} (${code}): ${error.message}`); } else { count++; }
      }
    }

    setLeaveResult({ count, errors });
    setImporting(null);
    toast({ title: `${count} leave balances imported` });
  };

  const allDone = empResult && salResult && leaveResult;

  const PreviewTable = ({ rows }: { rows: Record<string, string>[] }) => {
    if (rows.length === 0) return null;
    const headers = Object.keys(rows[0]);
    const preview = rows.slice(0, 5);
    return (
      <div className="border border-border rounded-lg overflow-auto max-h-48 mt-3">
        <Table>
          <TableHeader>
            <TableRow>{headers.map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}</TableRow>
          </TableHeader>
          <TableBody>
            {preview.map((r, i) => (
              <TableRow key={i}>{headers.map(h => <TableCell key={h} className="text-xs py-1 whitespace-nowrap">{r[h]}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length > 5 && <p className="text-xs text-muted-foreground p-2">...and {rows.length - 5} more rows</p>}
      </div>
    );
  };

  const ResultBadge = ({ result }: { result: { count: number; errors: string[] } | null }) => {
    if (!result) return null;
    return (
      <div className="mt-3 space-y-2">
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
          <CheckCircle2 className="h-3 w-3 mr-1" /> {result.count} imported
        </Badge>
        {result.errors.length > 0 && (
          <div className="max-h-32 overflow-auto space-y-1">
            {result.errors.map((e, i) => (
              <p key={i} className="text-xs text-destructive flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" /> {e}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout title="Import from Spine HR">
      <p className="text-sm text-muted-foreground mb-6">
        One-time migration tool. Upload CSV exports from Spine HR to populate employees, salary structures, and leave balances.
      </p>

      {allDone && (
        <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
            Import complete: {empResult.count} employees, {salResult.count} salary structures, {leaveResult.count} leave balances imported.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Section 1: Employees */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">1. Employee Data</CardTitle>
            </div>
            <CardDescription>
              CSV with: employee code, name, department, designation, DOJ, email, phone, PAN, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input type="file" accept=".csv" onChange={handleFile(setEmpRows)} className="max-w-sm" />
              {empRows.length > 0 && (
                <Button onClick={importEmployees} disabled={importing === 'emp'} size="sm">
                  <Upload className="h-4 w-4 mr-1.5" />
                  {importing === 'emp' ? 'Importing...' : `Import ${empRows.length} rows`}
                </Button>
              )}
            </div>
            <PreviewTable rows={empRows} />
            <ResultBadge result={empResult} />
          </CardContent>
        </Card>

        {/* Section 2: Salary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">2. Salary Structures</CardTitle>
            </div>
            <CardDescription>
              CSV with: employee code, CTC, basic, HRA, special allowance, medical, LTA, other, PF applicable, TDS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input type="file" accept=".csv" onChange={handleFile(setSalRows)} className="max-w-sm" />
              {salRows.length > 0 && (
                <Button onClick={importSalary} disabled={importing === 'sal'} size="sm">
                  <Upload className="h-4 w-4 mr-1.5" />
                  {importing === 'sal' ? 'Importing...' : `Import ${salRows.length} rows`}
                </Button>
              )}
            </div>
            <PreviewTable rows={salRows} />
            <ResultBadge result={salResult} />
          </CardContent>
        </Card>

        {/* Section 3: Leave */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">3. Leave Balances</CardTitle>
            </div>
            <CardDescription>
              CSV with: employee code, PL balance, SL balance, CL balance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input type="file" accept=".csv" onChange={handleFile(setLeaveRows)} className="max-w-sm" />
              {leaveRows.length > 0 && (
                <Button onClick={importLeave} disabled={importing === 'leave'} size="sm">
                  <Upload className="h-4 w-4 mr-1.5" />
                  {importing === 'leave' ? 'Importing...' : `Import ${leaveRows.length} rows`}
                </Button>
              )}
            </div>
            <PreviewTable rows={leaveRows} />
            <ResultBadge result={leaveResult} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminImportSpine;
