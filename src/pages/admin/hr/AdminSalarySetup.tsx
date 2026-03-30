import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, AlertTriangle, Calculator, Save, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo, useCallback } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface SalaryForm {
  ctc_annual: number;
  basic: number;
  hra: number;
  special_allowance: number;
  medical_allowance: number;
  lta: number;
  other_allowance: number;
  is_pf_applicable: boolean;
  pf_wage_cap: number;
  is_esi_applicable: boolean;
  tds_monthly: number;
  regime: string;
  effective_from: string;
  notes: string;
}

const emptyForm: SalaryForm = {
  ctc_annual: 0, basic: 0, hra: 0, special_allowance: 0,
  medical_allowance: 0, lta: 0, other_allowance: 0,
  is_pf_applicable: true, pf_wage_cap: 15000, is_esi_applicable: false,
  tds_monthly: 0, regime: 'new', effective_from: new Date().toISOString().slice(0, 10), notes: '',
};

const AdminSalarySetup = () => {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<SalaryForm>(emptyForm);
  const [existingRecordId, setExistingRecordId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Fetch employees
  const { data: employees = [] } = useQuery({
    queryKey: ['salary-setup-employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, designation')
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all active salary structures (effective_to is null)
  const { data: structures = [] } = useQuery({
    queryKey: ['salary-structures-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_structures')
        .select('id, employee_id')
        .is('effective_to', null);
      if (error) throw error;
      return data || [];
    },
  });

  const structuredEmployeeIds = useMemo(
    () => new Set(structures.map((s: any) => s.employee_id)),
    [structures]
  );

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e: any) =>
      e.full_name?.toLowerCase().includes(q) ||
      e.employee_code?.toLowerCase().includes(q) ||
      e.designation?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  // Load salary structure when employee selected
  const loadStructure = useCallback(async (empId: string) => {
    setSelectedId(empId);
    const { data, error } = await supabase
      .from('salary_structures')
      .select('*')
      .eq('employee_id', empId)
      .is('effective_to', null)
      .maybeSingle();
    if (error) { toast.error(error.message); return; }
    if (data) {
      setExistingRecordId(data.id);
      setForm({
        ctc_annual: Number(data.ctc_annual) || 0,
        basic: Number(data.basic) || 0,
        hra: Number(data.hra) || 0,
        special_allowance: Number(data.special_allowance) || 0,
        medical_allowance: Number(data.medical_allowance) || 0,
        lta: Number(data.lta) || 0,
        other_allowance: Number(data.other_allowance) || 0,
        is_pf_applicable: data.is_pf_applicable ?? true,
        pf_wage_cap: Number(data.pf_wage_cap) || 15000,
        is_esi_applicable: data.is_esi_applicable ?? false,
        tds_monthly: Number(data.tds_monthly) || 0,
        regime: data.regime || 'new',
        effective_from: data.effective_from || new Date().toISOString().slice(0, 10),
        notes: data.notes || '',
      });
    } else {
      setExistingRecordId(null);
      setForm({ ...emptyForm, effective_from: new Date().toISOString().slice(0, 10) });
    }
  }, []);

  // Derived calculations
  const gross = form.basic + form.hra + form.special_allowance + form.medical_allowance + form.lta + form.other_allowance;
  const pfEmployee = form.is_pf_applicable ? Math.round(Math.min(form.basic, form.pf_wage_cap) * 0.12) : 0;
  const esiEmployee = (form.is_esi_applicable && gross <= 21000) ? Math.round(gross * 0.0075) : 0;
  const pt = gross < 7500 ? 0 : gross < 10000 ? 175 : 200;
  const netPay = gross - pfEmployee - esiEmployee - pt - form.tds_monthly;

  // Auto-fill from CTC
  const autoFill = () => {
    if (form.ctc_annual <= 0) { toast.error('Enter CTC first'); return; }
    const monthly = form.ctc_annual / 12;
    const basic = Math.round(monthly * 0.45);
    const hra = Math.round(basic * 0.40);
    const medical = 1250;
    const pfEmployer = Math.round(Math.min(basic, 15000) * 0.24);
    const special = Math.round(monthly - basic - hra - medical - pfEmployer);
    setForm(f => ({
      ...f,
      basic, hra, medical_allowance: medical,
      special_allowance: Math.max(0, special),
      lta: 0, other_allowance: 0,
    }));
  };

  // Save
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedId) throw new Error('Select an employee');
      const payload = {
        employee_id: selectedId,
        effective_from: form.effective_from,
        effective_to: null,
        ctc_annual: form.ctc_annual,
        basic: form.basic,
        hra: form.hra,
        special_allowance: form.special_allowance,
        medical_allowance: form.medical_allowance,
        lta: form.lta,
        other_allowance: form.other_allowance,
        is_pf_applicable: form.is_pf_applicable,
        pf_wage_cap: form.pf_wage_cap,
        is_esi_applicable: form.is_esi_applicable,
        tds_monthly: form.tds_monthly,
        regime: form.regime,
        notes: form.notes || null,
      };
      if (existingRecordId) {
        const { error } = await supabase.from('salary_structures').update(payload).eq('id', existingRecordId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('salary_structures').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['salary-structures-active'] });
      toast.success(existingRecordId ? 'Salary structure updated' : 'Salary structure created');
      if (selectedId) loadStructure(selectedId);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const selectedEmployee = employees.find((e: any) => e.id === selectedId);

  const setField = (key: keyof SalaryForm, value: any) => setForm(f => ({ ...f, [key]: value }));
  const setNum = (key: keyof SalaryForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setField(key, Number(e.target.value) || 0);

  return (
    <AdminLayout title="Salary Structure Setup" subtitle="Define monthly earnings, statutory deductions, and tax regime for each employee">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Left Panel — Employee List */}
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Employees</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, code, role..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-0.5 px-4 pb-4">
                {filteredEmployees.map((emp: any) => {
                  const hasSalary = structuredEmployeeIds.has(emp.id);
                  const isSelected = selectedId === emp.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => loadStructure(emp.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{emp.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.employee_code ? `${emp.employee_code} · ` : ''}{emp.designation || '—'}
                        </p>
                      </div>
                      {hasSalary ? (
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No employees found</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Panel — Salary Form */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-auto">
          {!selectedId ? (
            <Card className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select an employee from the list</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedEmployee?.full_name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedEmployee?.employee_code} · {selectedEmployee?.designation}
                      {existingRecordId && <Badge variant="outline" className="ml-2 text-green-600 border-green-300">Active Structure</Badge>}
                      {!existingRecordId && <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">No Structure</Badge>}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={autoFill}>
                    <Calculator className="h-4 w-4 mr-1" />Auto-fill from CTC
                  </Button>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* CTC & Effective Date */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Annual CTC (₹)</Label>
                      <Input type="number" min={0} value={form.ctc_annual || ''} onChange={setNum('ctc_annual')} />
                    </div>
                    <div>
                      <Label>Effective From</Label>
                      <Input type="date" value={form.effective_from} onChange={e => setField('effective_from', e.target.value)} />
                    </div>
                    <div>
                      <Label>Tax Regime</Label>
                      <Select value={form.regime} onValueChange={v => setField('regime', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Regime</SelectItem>
                          <SelectItem value="old">Old Regime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Earnings — monthly */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Monthly Earnings</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div><Label>Basic</Label><Input type="number" min={0} value={form.basic || ''} onChange={setNum('basic')} /></div>
                      <div><Label>HRA</Label><Input type="number" min={0} value={form.hra || ''} onChange={setNum('hra')} /></div>
                      <div><Label>Special Allowance</Label><Input type="number" min={0} value={form.special_allowance || ''} onChange={setNum('special_allowance')} /></div>
                      <div><Label>Medical Allowance</Label><Input type="number" min={0} value={form.medical_allowance || ''} onChange={setNum('medical_allowance')} /></div>
                      <div><Label>LTA</Label><Input type="number" min={0} value={form.lta || ''} onChange={setNum('lta')} /></div>
                      <div><Label>Other Allowance</Label><Input type="number" min={0} value={form.other_allowance || ''} onChange={setNum('other_allowance')} /></div>
                    </div>
                  </div>

                  <Separator />

                  {/* Statutory */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Statutory & Tax</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={form.is_pf_applicable}
                          onCheckedChange={v => setField('is_pf_applicable', !!v)}
                          id="pf"
                        />
                        <Label htmlFor="pf" className="cursor-pointer">PF Applicable</Label>
                      </div>
                      <div>
                        <Label>PF Wage Cap</Label>
                        <Input type="number" min={0} value={form.pf_wage_cap || ''} onChange={setNum('pf_wage_cap')} disabled={!form.is_pf_applicable} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={form.is_esi_applicable}
                          onCheckedChange={v => setField('is_esi_applicable', !!v)}
                          id="esi"
                          disabled={gross > 21000}
                        />
                        <Label htmlFor="esi" className="cursor-pointer">
                          ESI Applicable
                          {gross > 21000 && <span className="text-xs text-muted-foreground block">Gross &gt; ₹21k</span>}
                        </Label>
                      </div>
                      <div>
                        <Label>TDS Monthly (₹)</Label>
                        <Input type="number" min={0} value={form.tds_monthly || ''} onChange={setNum('tds_monthly')} />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={form.notes}
                      onChange={e => setField('notes', e.target.value)}
                      placeholder="Any remarks..."
                      className="h-16"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pay Slip Preview (Monthly)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div className="font-medium text-muted-foreground">Gross Salary</div>
                    <div className="text-right font-semibold">{fmt(gross)}</div>

                    <Separator className="col-span-2 my-1" />

                    <div className="text-muted-foreground">PF (Employee 12%)</div>
                    <div className="text-right text-destructive">- {fmt(pfEmployee)}</div>

                    <div className="text-muted-foreground">ESI (Employee 0.75%)</div>
                    <div className="text-right text-destructive">- {fmt(esiEmployee)}</div>

                    <div className="text-muted-foreground">Professional Tax</div>
                    <div className="text-right text-destructive">- {fmt(pt)}</div>

                    <div className="text-muted-foreground">TDS</div>
                    <div className="text-right text-destructive">- {fmt(form.tds_monthly)}</div>

                    <Separator className="col-span-2 my-1" />

                    <div className="font-semibold">Estimated Net Pay</div>
                    <div className="text-right font-bold text-lg text-primary">{fmt(netPay)}</div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !form.basic}
              >
                <Save className="h-4 w-4 mr-2" />
                {existingRecordId ? 'Update Salary Structure' : 'Save Salary Structure'}
              </Button>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalarySetup;
