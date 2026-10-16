import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProposalDialog } from './ProposalDialog';

export interface CalculatorResult {
  label: string;
  primary?: { label: string; value: string };
  metrics: { label: string; value: string; highlight?: boolean }[];
  commentary?: string;
}

interface CalculatorShellProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  formInputs: React.ReactNode;
  result: CalculatorResult;
  calcType: string;
  methodology: string;
}

export const CalculatorShell = ({ title, description, icon, formInputs, result, calcType, methodology }: CalculatorShellProps) => {
  const [showProposal, setShowProposal] = useState(false);

  return (
    <div className="container-sernet py-6">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-5 min-w-0">{formInputs}</div>
        <div className="space-y-4 min-w-0">
          {/* Result card */}
          <motion.div
            key={result.primary?.value}
            initial={{ opacity: 0.8, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-muted/40 border border-border rounded-lg p-6 space-y-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground">{result.label}</h3>

            {result.primary && (
              <div className="text-center py-4 bg-primary/8 rounded-lg border border-primary/15">
                <p className="text-xs text-muted-foreground mb-1">{result.primary.label}</p>
                <motion.p
                  key={result.primary.value}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold text-primary break-words"
                >
                  {result.primary.value}
                </motion.p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {result.metrics.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-center ${
                    m.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-background border border-border'
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground mb-0.5">{m.label}</p>
                  <p className={`text-sm font-semibold ${m.highlight ? 'text-primary' : 'text-foreground'}`}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {result.commentary && (
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-medium text-foreground mb-2">Calculation summary</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.commentary}</p>
            </div>
          )}
          <Button onClick={() => setShowProposal(true)} className="w-full gap-2">
            <FileText className="w-4 h-4" />
            Create Proposal
          </Button>
        </div>
      </div>
      <ProposalDialog
        open={showProposal}
        onOpenChange={setShowProposal}
        calculatorTitle={title}
        result={result}
        methodology={methodology}
        calcType={calcType}
      />
    </div>
  );
};
