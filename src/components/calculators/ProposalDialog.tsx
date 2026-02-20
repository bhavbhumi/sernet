import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, FileText, Download, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CalculatorResult } from './CalculatorShell';

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  calculatorTitle: string;
  result: CalculatorResult;
  aiContext: string;
  calcType: string;
}

type Step = 'lead' | 'proposal';

export const ProposalDialog = ({
  open,
  onOpenChange,
  calculatorTitle,
  result,
  aiContext,
  calcType,
}: ProposalDialogProps) => {
  const [step, setStep] = useState<Step>('lead');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleLeadSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter your name and phone number.');
      return;
    }
    if (!/^\+?[\d\s\-]{10,15}$/.test(phone.trim())) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        source: 'calculator',
        lead_type: 'self',
        status: 'new',
        context: {
          calculator: calcType,
          proposal_requested: true,
          result_summary: result.metrics.map((m) => `${m.label}: ${m.value}`).join(', '),
          primary_result: result.primary ? `${result.primary.label}: ${result.primary.value}` : undefined,
        },
      });
      if (error) throw error;
      setLeadSaved(true);
      setStep('proposal');
    } catch (err) {
      toast.error('Could not save your details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printContent = proposalRef.current?.innerHTML;
    if (!printContent) return;

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${calculatorTitle} – Proposal</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 22px; font-weight: 700; color: #0066cc; }
          .meta { text-align: right; font-size: 12px; color: #6b7280; }
          h1 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; }
          h2 { font-size: 14px; font-weight: 600; color: #374151; margin: 20px 0 10px; border-left: 3px solid #0066cc; padding-left: 10px; }
          .section { margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: center; }
          .card .label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
          .card .value { font-size: 18px; font-weight: 700; color: #111; }
          .card.primary { background: #eff6ff; border-color: #bfdbfe; }
          .card.primary .value { color: #1d4ed8; font-size: 26px; }
          .card.highlight .value { color: #16a34a; }
          .commentary { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 13px; color: #374151; line-height: 1.6; margin-top: 12px; }
          .disclaimer { margin-top: 30px; padding: 14px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; font-size: 11px; color: #92400e; line-height: 1.5; }
          .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
          .client-details { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 10px; }
          .detail-item .d-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-item .d-value { font-size: 13px; font-weight: 600; color: #374151; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 400);
  };

  const resetAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('lead');
      setLeadSaved(false);
      setName(''); setPhone(''); setEmail('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {step === 'lead' ? 'Create Your Proposal' : `${calculatorTitle} – Proposal`}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'lead' ? (
            <motion.div
              key="lead"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 pt-2"
            >
              <p className="text-sm text-muted-foreground">
                Enter your details to generate a personalised financial proposal with calculations and rationale that you can download.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Your full name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="Phone number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={15}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email address (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                onClick={handleLeadSubmit}
                disabled={saving || !name.trim() || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Generate Proposal</>}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                A SerNet advisor may reach out based on your inputs.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pt-2 space-y-4"
            >
              {leadSaved && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Details saved. A SerNet advisor will reach out to you.</span>
                </div>
              )}

              {/* The actual printable proposal */}
              <div ref={proposalRef} className="text-sm">
                {/* Header */}
                <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <div className="logo" style={{ fontSize: '20px', fontWeight: 700, color: '#0066cc' }}>SerNet</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Financial Planning Proposal</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                    <div>Date: {today}</div>
                    <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Prepared for: {name}</div>
                    {email && <div>{email}</div>}
                    <div>{phone}</div>
                  </div>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{calculatorTitle}</h1>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>{aiContext}</p>

                {/* Your Requirement */}
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 10px', borderLeft: '3px solid #0066cc', paddingLeft: '10px' }}>Your Requirement</h2>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
                  Based on your inputs in the {calculatorTitle}, we have prepared a personalised financial analysis with recommendations tailored to your situation.
                </p>

                {/* Key Result */}
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '16px 0 10px', borderLeft: '3px solid #0066cc', paddingLeft: '10px' }}>Key Recommendation</h2>
                {result.primary && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', textAlign: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{result.primary.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1d4ed8' }}>{result.primary.value}</div>
                  </div>
                )}

                {/* Metrics grid */}
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '16px 0 10px', borderLeft: '3px solid #0066cc', paddingLeft: '10px' }}>Detailed Breakdown</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {result.metrics.map((m, i) => (
                    <div key={i} style={{
                      background: m.highlight ? '#f0fdf4' : '#f9fafb',
                      border: `1px solid ${m.highlight ? '#bbf7d0' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>{m.label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: m.highlight ? '#16a34a' : '#374151' }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Rationale / Methodology */}
                {result.commentary && (
                  <>
                    <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '16px 0 10px', borderLeft: '3px solid #0066cc', paddingLeft: '10px' }}>Rationale & Methodology</h2>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
                      {result.commentary}
                    </div>
                  </>
                )}

                {/* Next Steps */}
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '16px 0 10px', borderLeft: '3px solid #0066cc', paddingLeft: '10px' }}>Recommended Next Steps</h2>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
                  <div>1. Review the numbers with your SerNet advisor to validate assumptions</div>
                  <div>2. Start with a small SIP or trial plan to build discipline</div>
                  <div>3. Revisit and replan annually as your income or goals change</div>
                  <div>4. Consider tax implications — LTCG, STCG, and Section 80C deductions may apply</div>
                </div>

                {/* Disclaimer */}
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px', fontSize: '11px', color: '#92400e', lineHeight: 1.5 }}>
                  <strong>Disclaimer:</strong> This proposal is generated based on your inputs and is for illustrative and informational purposes only. It does not constitute investment advice. Actual returns may vary. Please consult a SEBI-registered investment advisor before making any financial decisions. SerNet is a SEBI-registered intermediary.
                </div>

                {/* Footer */}
                <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
                  <span>SerNet Financial Services | www.sernet.in</span>
                  <span>Generated on {today} | Confidential</span>
                </div>
              </div>

              {/* Download button */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download / Print Proposal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
