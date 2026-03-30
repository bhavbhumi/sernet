import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer } from 'lucide-react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export interface PayslipData {
  full_name: string;
  employee_code: string;
  designation: string;
  department: string;
  date_of_joining: string | null;
  pan: string | null;
  days_present: number;
  basic: number;
  hra: number;
  special_allowance: number;
  medical_allowance: number;
  lta: number;
  other_allowance: number;
  gross: number;
  pf_employee: number;
  pf_employer: number;
  esi_employee: number;
  esi_employer: number;
  professional_tax: number;
  tds: number;
  total_deductions: number;
  net_pay: number;
}

interface Props {
  row: PayslipData;
  month: number;
  year: number;
  workingDays: number;
}

export function PayslipPreview({ row, month, year, workingDays }: Props) {
  const earnings = [
    { label: 'Basic', value: row.basic },
    { label: 'HRA', value: row.hra },
    { label: 'Special Allowance', value: row.special_allowance },
    { label: 'Medical Allowance', value: row.medical_allowance },
    { label: 'LTA', value: row.lta },
    { label: 'Other Allowance', value: row.other_allowance },
  ].filter(e => e.value > 0);

  const deductions = [
    { label: 'Provident Fund (PF)', value: row.pf_employee },
    { label: 'ESI', value: row.esi_employee },
    { label: 'Professional Tax', value: row.professional_tax },
    { label: 'TDS', value: row.tds },
  ].filter(d => d.value > 0);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          [data-payslip], [data-payslip] * { visibility: visible !important; }
          [data-payslip] { position: absolute; top: 0; left: 0; width: 100%; }
          [role="dialog"] { position: absolute !important; top: 0; left: 0; width: 100%; max-width: 100% !important; box-shadow: none !important; border: none !important; }
          button[data-print-hide] { display: none !important; }
        }
      `}</style>

      <div data-payslip className="space-y-4 text-sm">
        <div className="text-center border-b pb-3">
          <h2 className="font-bold text-base">SERNET Financial Services Pvt. Ltd.</h2>
          <p className="text-xs text-muted-foreground">Hemu Classic Shopping Centre, B-201, S V Road, Malad West, Mumbai 400064</p>
          <Badge variant="outline" className="mt-2">SALARY SLIP — {MONTH_NAMES[month - 1].toUpperCase()} {year}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{row.full_name}</span></div>
          <div><span className="text-muted-foreground">Employee Code:</span> <span className="font-medium">{row.employee_code || '—'}</span></div>
          <div><span className="text-muted-foreground">Designation:</span> <span className="font-medium">{row.designation}</span></div>
          <div><span className="text-muted-foreground">Department:</span> <span className="font-medium">{row.department}</span></div>
          <div><span className="text-muted-foreground">Date of Joining:</span> <span className="font-medium">{row.date_of_joining || '—'}</span></div>
          <div><span className="text-muted-foreground">PAN:</span> <span className="font-medium">{row.pan || '—'}</span></div>
          <div><span className="text-muted-foreground">Working Days:</span> <span className="font-medium">{workingDays}</span></div>
          <div><span className="text-muted-foreground">Days Present:</span> <span className="font-medium">{row.days_present}</span></div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-xs mb-2 uppercase tracking-wider text-muted-foreground">Earnings</h4>
            <div className="space-y-1">
              {earnings.map(e => (
                <div key={e.label} className="flex justify-between text-xs">
                  <span>{e.label}</span><span className="font-medium">{fmt(e.value)}</span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex justify-between text-xs font-bold">
                <span>Gross Total</span><span>{fmt(row.gross)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs mb-2 uppercase tracking-wider text-muted-foreground">Deductions</h4>
            <div className="space-y-1">
              {deductions.map(d => (
                <div key={d.label} className="flex justify-between text-xs">
                  <span>{d.label}</span><span className="font-medium">{fmt(d.value)}</span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex justify-between text-xs font-bold">
                <span>Total Deductions</span><span>{fmt(row.total_deductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {row.pf_employer > 0 && (
          <p className="text-[10px] text-muted-foreground italic">
            Employer Contributions — PF: {fmt(row.pf_employer)}
            {row.esi_employer > 0 ? `, ESI: ${fmt(row.esi_employer)}` : ''}
          </p>
        )}

        <Separator />

        <div className="flex justify-between items-center p-3 rounded-md bg-primary/5">
          <span className="font-bold">Net Pay</span>
          <span className="text-xl font-bold text-primary">{fmt(row.net_pay)}</span>
        </div>

        <Button data-print-hide variant="outline" className="w-full" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />Print Payslip
        </Button>
      </div>
    </>
  );
}
