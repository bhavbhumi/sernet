import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PRODUCTS as BASE_PRODUCTS, PRIORITY_CONFIG, RISK_TAGS, matchAutomationRules } from '@/lib/supportClassification';

const PRODUCTS = [
  ...BASE_PRODUCTS,
  { key: 'all', label: 'General / KYC', description: 'Account & KYC queries', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
];
import { CheckCircle, Clock, Shield, FileText, ChevronRight, AlertTriangle, BookOpen, ThumbsUp, ArrowRight } from 'lucide-react';

const db = (t: string) => supabase.from(t as any) as any;

interface TicketWizardProps {
  showHeading?: boolean;
}

export function TicketWizard({ showHeading = true }: TicketWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [kbArticles, setKbArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: cats }, { data: types }, { data: rules }, { data: kb }] = await Promise.all([
        db('support_issue_categories').select('*').eq('is_active', true).order('sort_order'),
        db('support_issue_types').select('*, support_issue_categories(name, slug)').eq('is_active', true).order('sort_order'),
        db('support_automation_rules').select('*').eq('is_active', true).order('sort_order'),
        db('kb_articles').select('id, title, slug, category, product, issue_code, short_summary, possible_reasons, what_to_check, resolution_steps, documents_required, resolution_timeline, when_to_raise_ticket, suggested_article_group, question_variants, search_keywords').eq('status', 'published').eq('visibility', 'public'),
      ]);
      setCategories(cats ?? []);
      setIssueTypes(types ?? []);
      setAutomationRules(rules ?? []);
      setKbArticles(kb ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filteredIssueTypes = issueTypes.filter(t =>
    (t.product === selectedProduct || t.product === 'all') &&
    t.category_id === selectedCategory?.id
  );

  // Suggested articles: match by issue_code, product, category, or suggested_article_group
  const suggestedArticles = useMemo(() => {
    if (!selectedIssue && !selectedCategory) return [];
    return kbArticles.filter(a => {
      // Match by issue_code
      if (selectedIssue?.issue_code && a.issue_code === selectedIssue.issue_code) return true;
      // Match by product + category
      if ((a.product === selectedProduct || a.product === 'all') && a.category === selectedCategory?.name) return true;
      // Match by suggested_article_group if issue has one
      if (selectedIssue?.issue_code && a.suggested_article_group && a.issue_code?.startsWith(selectedIssue.issue_code.split('-').slice(0, 2).join('-'))) return true;
      return false;
    }).slice(0, 5);
  }, [selectedIssue, selectedCategory, selectedProduct, kbArticles]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.subject.trim()) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
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
      product: selectedProduct || null,
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
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      setTicketNumber(data?.ticket_number ?? '');
      setStep(6);
    }
    setSubmitting(false);
  };

  const reset = () => {
    setStep(1);
    setSelectedProduct('');
    setSelectedCategory(null);
    setSelectedIssue(null);
    setForm({ name: '', email: '', phone: '', subject: '', description: '' });
    setTicketNumber('');
  };

  if (loading) return <div className="animate-pulse h-64 bg-muted rounded-xl" />;

  // Steps: 1=Product, 2=Category, 3=IssueType, 4=SuggestedArticles, 5=Details, 6=Success
  const stepLabels = ['Product', 'Category', 'Issue Type', 'Self-Help', 'Details'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      {step <= 5 && (
        <div className="flex items-center gap-1.5 mb-8 flex-wrap">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  s === step ? 'bg-primary text-primary-foreground' :
                  s < step ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>{s}</div>
                <span className={`text-xs hidden sm:inline ${s === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
                {s < 5 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1: Product */}
      {step === 1 && (
        <div>
          {showHeading && <h1 className="text-2xl font-bold text-foreground mb-2">How can we help?</h1>}
          <p className="text-muted-foreground mb-6">Select the product you need help with</p>
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

      {/* Step 2: Category */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back</button>
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

      {/* Step 3: Issue Type */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back</button>
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
                </button>
              );
            })}
            <button
              onClick={() => { setSelectedIssue(null); setStep(5); }}
              className="border border-dashed border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30"
            >
              <p className="font-medium text-muted-foreground">Other / Not listed above</p>
              <p className="text-xs text-muted-foreground mt-0.5">Describe your issue in the next step</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Suggested Articles (Self-Resolution) */}
      {step === 4 && (
        <div>
          <button onClick={() => setStep(3)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back</button>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Try these solutions first</h2>
          </div>
          <p className="text-muted-foreground mb-6">These articles may help resolve your issue without waiting for support.</p>

          {suggestedArticles.length > 0 ? (
            <div className="space-y-4 mb-8">
              {suggestedArticles.map(article => (
                <SuggestedArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 border border-border rounded-xl p-8 text-center mb-8">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No specific articles found for this issue yet.</p>
              <p className="text-xs text-muted-foreground mt-1">You can proceed to raise a ticket below.</p>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-3">Still need help? Our team is ready to assist.</p>
            <Button onClick={() => setStep(5)} size="lg" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" /> Continue to Raise Ticket
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Details */}
      {step === 5 && (
        <div>
          <button onClick={() => selectedIssue ? setStep(4) : setStep(3)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back</button>
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

      {/* Step 6: Success */}
      {step === 6 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Submitted</h2>
          <p className="text-muted-foreground mb-4">Your ticket has been registered and routed to the right team.</p>
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
          <Button variant="outline" onClick={reset}>Raise Another Ticket</Button>
        </div>
      )}
    </div>
  );
}

/** Expandable suggested article card */
function SuggestedArticleCard({ article }: { article: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all hover:border-primary/40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm">{article.title}</p>
          {article.short_summary && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.short_summary}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            {article.issue_code && <span className="font-mono text-[10px] text-muted-foreground">{article.issue_code}</span>}
            {article.resolution_timeline && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{article.resolution_timeline}</span>
            )}
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {article.possible_reasons && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Possible Reasons</p>
              <div className="text-xs text-muted-foreground prose-sm" dangerouslySetInnerHTML={{ __html: article.possible_reasons }} />
            </div>
          )}
          {article.what_to_check && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">What To Check</p>
              <div className="text-xs text-muted-foreground prose-sm" dangerouslySetInnerHTML={{ __html: article.what_to_check }} />
            </div>
          )}
          {article.resolution_steps && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Resolution Steps</p>
              <div className="text-xs text-muted-foreground prose-sm" dangerouslySetInnerHTML={{ __html: article.resolution_steps }} />
            </div>
          )}
          {(article.documents_required ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Documents Required</p>
              <ul className="text-xs text-muted-foreground list-disc list-inside">
                {article.documents_required.map((d: string, i: number) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}
          {article.when_to_raise_ticket && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> When To Raise a Ticket
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">{article.when_to_raise_ticket}</p>
            </div>
          )}
          <div className="flex items-center gap-1.5 pt-1">
            <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Was this helpful?</span>
          </div>
        </div>
      )}
    </div>
  );
}
