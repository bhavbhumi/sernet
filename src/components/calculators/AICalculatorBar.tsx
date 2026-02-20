import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ProductType = 'sip' | 'lumpsum' | 'brokerage' | 'margin' | 'insurance';

interface AIResult {
  product: ProductType;
  params: {
    monthlyInvestment?: number;
    lumpsum?: number;
    targetAmount?: number;
    expectedReturn?: number;
    timePeriod?: number;
    coverAmount?: number;
  };
  result?: {
    futureValue?: number;
    totalInvested?: number;
    wealthGained?: number;
    requiredMonthly?: number;
  };
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AICalculatorBarProps {
  onResult: (product: ProductType, params: AIResult['params']) => void;
}

const PRODUCT_LABELS: Record<ProductType, string> = {
  sip: 'SIP Calculator',
  lumpsum: 'Lumpsum Calculator',
  brokerage: 'Brokerage Calculator',
  margin: 'Margin Calculator',
  insurance: 'Insurance Estimator',
};

const EXAMPLES = [
  'I want ₹1 Crore for my retirement in 20 years',
  'Save ₹50 Lakh for my daughter\'s wedding in 10 years',
  'I invest ₹10,000/month — how much will I have in 15 years?',
  'I want to insure my family for ₹2 Crore cover',
];

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

export const AICalculatorBar = ({ onResult }: AICalculatorBarProps) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (text?: string) => {
    const query = (text ?? goal).trim();
    if (!query || loading) return;

    setLoading(true);
    setAiResult(null);
    setShowLeadForm(false);
    setLeadSaved(false);

    try {
      const { data, error } = await supabase.functions.invoke('ai-calculator', {
        body: { goalText: query },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result: AIResult = data.data;
      setAiResult(result);
      setExpanded(true);

      // Switch to relevant calculator tab and pre-fill
      onResult(result.product, result.params);

      // Show lead form after a short delay
      setTimeout(() => setShowLeadForm(true), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async () => {
    if (!leadName.trim() || !leadPhone.trim()) {
      toast.error('Please enter your name and phone number.');
      return;
    }
    if (!/^\+?[\d\s\-]{10,15}$/.test(leadPhone.trim())) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    setSavingLead(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-calculator', {
        body: {
          goalText: goal,
          saveLead: {
            name: leadName.trim(),
            phone: leadPhone.trim(),
            email: leadEmail.trim() || undefined,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setLeadSaved(true);
      toast.success('A SerNet advisor will reach out to you shortly!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not save your details. Please try again.');
    } finally {
      setSavingLead(false);
    }
  };

  return (
    <div className="border-b border-border bg-muted/20">
      <div className="container-zerodha py-4">
        {/* Header bar */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 w-full text-left mb-3"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Goal Planner</span>
          <span className="text-xs text-muted-foreground ml-1">— describe your goal, we'll do the math</span>
          <span className="ml-auto text-muted-foreground">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {/* Input area */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="e.g. I want ₹1 Crore for retirement in 20 years…"
                    rows={2}
                    maxLength={500}
                    className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={loading || !goal.trim()}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Analysing…' : 'Analyse'}
                </button>
              </div>

              {/* Example prompts */}
              {!aiResult && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => {
                        setGoal(ex);
                        handleSubmit(ex);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary hover:text-primary text-muted-foreground transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              )}

              {/* AI Result */}
              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 grid md:grid-cols-2 gap-4"
                  >
                    {/* Left: Explanation + result numbers */}
                    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {PRODUCT_LABELS[aiResult.product]}
                        </span>
                        {aiResult.confidence === 'low' && (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" /> Low confidence — please adjust sliders
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{aiResult.explanation}</p>

                      {aiResult.result && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {aiResult.result.futureValue && (
                            <div className="p-3 rounded-md bg-primary/5 text-center">
                              <p className="text-xs text-muted-foreground mb-0.5">Projected Value</p>
                              <p className="text-base font-semibold text-primary">{formatCurrency(aiResult.result.futureValue)}</p>
                            </div>
                          )}
                          {aiResult.result.requiredMonthly && (
                            <div className="p-3 rounded-md bg-primary/5 text-center">
                              <p className="text-xs text-muted-foreground mb-0.5">Monthly SIP Needed</p>
                              <p className="text-base font-semibold text-primary">{formatCurrency(aiResult.result.requiredMonthly)}</p>
                            </div>
                          )}
                          {aiResult.result.totalInvested && (
                            <div className="p-3 rounded-md bg-muted/50 text-center">
                              <p className="text-xs text-muted-foreground mb-0.5">Total Invested</p>
                              <p className="text-sm font-medium text-foreground">{formatCurrency(aiResult.result.totalInvested)}</p>
                            </div>
                          )}
                          {aiResult.result.wealthGained && (
                            <div className="p-3 rounded-md bg-muted/50 text-center">
                              <p className="text-xs text-muted-foreground mb-0.5">Est. Returns</p>
                              <p className="text-sm font-medium text-green-600">{formatCurrency(aiResult.result.wealthGained)}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Lead capture */}
                    <AnimatePresence>
                      {showLeadForm && (
                        <motion.div
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="rounded-lg border border-primary/20 bg-primary/5 p-4"
                        >
                          {leadSaved ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-4 text-center">
                              <CheckCircle2 className="w-8 h-8 text-green-500" />
                              <p className="text-sm font-medium text-foreground">You're all set!</p>
                              <p className="text-xs text-muted-foreground">A SerNet advisor will call you within 24 hours to build your personalised plan.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">Get a personalised plan</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Our advisors will help you execute this goal — at zero cost.</p>
                              </div>
                              <div className="space-y-2">
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                  <input
                                    type="text"
                                    placeholder="Your name"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    maxLength={100}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                  />
                                </div>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                  <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    maxLength={15}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                  />
                                </div>
                                <input
                                  type="email"
                                  placeholder="Email (optional)"
                                  value={leadEmail}
                                  onChange={(e) => setLeadEmail(e.target.value)}
                                  maxLength={255}
                                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                              </div>
                              <button
                                onClick={handleSaveLead}
                                disabled={savingLead || !leadName.trim() || !leadPhone.trim()}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                              >
                                {savingLead ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    Request Free Consultation
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                              <p className="text-[10px] text-muted-foreground text-center">
                                By submitting, you agree to be contacted by a SerNet advisor.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
