import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PRODUCTS, PRIORITY_CONFIG, RISK_TAGS, matchAutomationRules } from '@/lib/supportClassification';
import { CheckCircle, Clock, Shield, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

const db = (t: string) => supabase.from(t as any) as any;

export default function RaiseTicket() {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1=product, 2=category, 3=issue, 4=details, 5=success
  const [categories, setCategories] = useState<any[]>([]);
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: cats }, { data: types }, { data: rules }] = await Promise.all([
        db('support_issue_categories').select('*').eq('is_active', true).order('sort_order'),
        db('support_issue_types').select('*, support_issue_categories(name, slug)').eq('is_active', true).order('sort_order'),
        db('support_automation_rules').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setCategories(cats ?? []);
      setIssueTypes(types ?? []);
      setAutomationRules(rules ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredIssueTypes = issueTypes.filter(t =>
    (t.product === selectedProduct || t.product === 'all') &&
    t.category_id === selectedCategory?.id
  );

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.subject.trim()) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);

    // Check automation rules
    const fullText = `${form.subject} ${form.description}`;
    const autoMatch = matchAutomationRules(fullText, automationRules);

    const priority = autoMatch?.priority ?? selectedIssue?.priority ?? 'standard';
    const tatHours = autoMatch?.tat_hours ?? selectedIssue?.tat_hours ?? 48;

    const payload: any = {
      subject: form.subject,
      description: form.description,
      contact_name: form.name,
      contact_email: form.email || null,
      contact_phone: form.phone,
      product: selectedProduct,
      issue_category_id: selectedCategory?.id ?? null,
      issue_type_id: selectedIssue?.id ?? null,
      issue_code: selectedIssue?.issue_code ?? null,
      priority: priority === 'critical' ? 'urgent' : priority === 'high' ? 'high' : 'medium',
      risk_tag: selectedIssue?.risk_tag ?? 'operational',
      regulator: selectedIssue?.regulator ?? null,
      tat_hours: tatHours,
      tat_deadline: new Date(Date.now() + tatHours * 60 * 60 * 1000).toISOString(),
      documents_required: selectedIssue?.required_documents ?? [],
      department: autoMatch?.assign_team ?? selectedIssue?.auto_assign_team ?? 'support',
      auto_assigned: !!autoMatch,
      channel: 'website',
      status: 'open',
    };

    const { data, error } = await db('support_tickets').insert([payload]).select('ticket_number').single();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setTicketNumber(data?.ticket_number ?? '');
      setStep(5);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-sernet py-20">
          <div className="animate-pulse h-64 bg-muted rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Raise a Support Ticket — SERNET Financial Services" description="Submit a support request for Tick Funds, Choice FinX, or Tushil products" />

      <div className="container-sernet py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          {step < 5 && (
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s === step ? 'bg-primary text-primary-foreground' :
                    s < step ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>{s}</div>
                  {s < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
              <span className="ml-3 text-sm text-muted-foreground">
                {step === 1 && 'Select Product'}
                {step === 2 && 'Issue Category'}
                {step === 3 && 'Issue Type'}
                {step === 4 && 'Your Details'}
              </span>
            </div>
          )}

          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Raise a Support Ticket</h1>
              <p className="text-muted-foreground mb-8">Which product is this regarding?</p>
              <div className="grid gap-4">
                {PRODUCTS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => { setSelectedProduct(p.key); setStep(2); }}
                    className={`border rounded-xl p-6 text-left transition-all hover:border-primary hover:shadow-md ${p.bg}`}
                  >
                    <p className={`text-lg font-semibold ${p.color}`}>{p.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Category Selection */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to products</button>
              <h2 className="text-xl font-bold text-foreground mb-2">What's the issue about?</h2>
              <p className="text-muted-foreground mb-6">Select the category that best describes your issue</p>
              <div className="grid gap-3">
                {categories.map(c => {
                  const count = issueTypes.filter(t => t.category_id === c.id && (t.product === selectedProduct || t.product === 'all')).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c); setStep(3); }}
                      className="border border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{count} types</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Issue Type Selection */}
          {step === 3 && (
            <div>
              <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to categories</button>
              <h2 className="text-xl font-bold text-foreground mb-2">{selectedCategory?.name}</h2>
              <p className="text-muted-foreground mb-6">Select the specific issue</p>
              <div className="grid gap-3">
                {filteredIssueTypes.map(t => {
                  const pri = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  const risk = RISK_TAGS[t.risk_tag as keyof typeof RISK_TAGS];
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedIssue(t); setForm(f => ({ ...f, subject: t.title })); setStep(4); }}
                      className="border border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{t.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="font-mono text-[10px] text-muted-foreground">{t.issue_code}</span>
                            <Badge className={`text-[10px] ${pri?.color}`}>{pri?.label}</Badge>
                            <Badge variant="outline" className={`text-[10px] ${risk?.color}`}>{risk?.label}</Badge>
                            {t.regulator && <Badge variant="outline" className="text-[10px]">{t.regulator}</Badge>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.tat_hours}h TAT</p>
                        </div>
                      </div>
                      {(t.required_documents ?? []).length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <FileText className="h-3 w-3" /> Required: {t.required_documents.join(', ')}
                        </div>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => { setSelectedIssue(null); setStep(4); }}
                  className="border border-dashed border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30"
                >
                  <p className="font-medium text-muted-foreground">Other / Not listed above</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Describe your issue in the next step</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div>
              <button onClick={() => setStep(3)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to issue types</button>
              <h2 className="text-xl font-bold text-foreground mb-2">Your Details</h2>

              {selectedIssue && (
                <div className="bg-muted/30 border border-border rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{selectedIssue.issue_code}</span>
                    <span className="text-sm font-medium text-foreground">{selectedIssue.title}</span>
                    <Badge className={`text-[10px] ${PRIORITY_CONFIG[selectedIssue.priority as keyof typeof PRIORITY_CONFIG]?.color}`}>
                      {PRIORITY_CONFIG[selectedIssue.priority as keyof typeof PRIORITY_CONFIG]?.label}
                    </Badge>
                  </div>
                  {(selectedIssue.required_documents ?? []).length > 0 && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>Please keep ready: {selectedIssue.required_documents.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name <span className="text-destructive">*</span></Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone <span className="text-destructive">*</span></Label>
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Subject <span className="text-destructive">*</span></Label>
                  <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-1.5">
                  <Label>Detailed Description</Label>
                  <Textarea rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Provide as much detail as possible..." />
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full" size="lg">
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Submitted</h2>
              <p className="text-muted-foreground mb-4">Your ticket has been registered successfully.</p>
              <div className="bg-muted/30 border border-border rounded-xl p-6 max-w-sm mx-auto mb-8">
                <p className="text-sm text-muted-foreground">Ticket Number</p>
                <p className="text-2xl font-bold text-primary font-mono">{ticketNumber}</p>
                {selectedIssue && (
                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                    <p>Issue: {selectedIssue.issue_code} — {selectedIssue.title}</p>
                    <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Expected resolution: {selectedIssue.tat_hours} hours</p>
                    {selectedIssue.regulator && <p className="flex items-center gap-1"><Shield className="h-3 w-3" /> Regulated by: {selectedIssue.regulator}</p>}
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => { setStep(1); setSelectedProduct(''); setSelectedCategory(null); setSelectedIssue(null); setForm({ name: '', email: '', phone: '', subject: '', description: '' }); }}>
                Raise Another Ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
