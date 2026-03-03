import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, FileText, Phone, Mail, BookOpen, Send, ChevronRight, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PRODUCTS, PRIORITY_CONFIG, RISK_TAGS, matchAutomationRules } from '@/lib/supportClassification';

const db = (t: string) => supabase.from(t as any) as any;

const faqs = [
  { question: 'How do I open an account?', answer: 'You can open a SERNET account online in a few minutes. All you need is your Aadhaar, PAN, and a bank account.' },
  { question: 'What documents are required?', answer: 'PAN card, Aadhaar (linked to mobile for e-sign), bank account details, and a recent passport size photograph.' },
  { question: 'How long does account opening take?', answer: 'If all documents are in order, your account can be opened within 24 hours.' },
  { question: 'Is there any account opening fee?', answer: 'Account opening is completely free. There are no hidden charges or annual maintenance fees.' },
  { question: 'How do I transfer funds?', answer: 'You can add funds instantly using UPI, net banking, or NEFT/RTGS.' },
  { question: 'What is the brokerage for equity delivery?', answer: 'Equity delivery is absolutely free with SERNET. Zero brokerage on all equity delivery trades.' },
];

const Support = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [kbSearch, setKbSearch] = useState('');

  // --- Ticket wizard state ---
  const [wizStep, setWizStep] = useState(1); // 1=product, 2=category, 3=issue, 4=details, 5=success
  const [categories, setCategories] = useState<any[]>([]);
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '', contact_name: '', contact_email: '', contact_phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  // Fetch taxonomy data on mount
  useEffect(() => {
    const load = async () => {
      const [{ data: cats }, { data: types }, { data: rules }] = await Promise.all([
        db('support_issue_categories').select('*').eq('is_active', true).order('sort_order'),
        db('support_issue_types').select('*, support_issue_categories(name, slug)').eq('is_active', true).order('sort_order'),
        db('support_automation_rules').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setCategories(cats ?? []);
      setIssueTypes(types ?? []);
      setAutomationRules(rules ?? []);
    };
    load();
  }, []);

  // Fetch published KB articles
  const { data: kbArticles = [] } = useQuery({
    queryKey: ['kb-articles-public', kbSearch],
    queryFn: async () => {
      let q = db('kb_articles').select('id, title, slug, category, excerpt, body').eq('status', 'published').order('view_count', { ascending: false }).limit(12);
      if (kbSearch.trim()) q = q.ilike('title', `%${kbSearch}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const kbCategories = [...new Set(kbArticles.map((a: any) => a.category))].sort();

  const filteredIssueTypes = issueTypes.filter(t =>
    (t.product === selectedProduct || t.product === 'all') &&
    t.category_id === selectedCategory?.id
  );

  const handleSubmitTicket = async () => {
    if (!ticketForm.contact_name.trim() || !ticketForm.subject.trim()) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const fullText = `${ticketForm.subject} ${ticketForm.description}`;
    const autoMatch = matchAutomationRules(fullText, automationRules);
    const priority = autoMatch?.priority ?? selectedIssue?.priority ?? 'standard';
    const tatHours = autoMatch?.tat_hours ?? selectedIssue?.tat_hours ?? 48;

    const payload: any = {
      subject: ticketForm.subject,
      description: ticketForm.description,
      contact_name: ticketForm.contact_name,
      contact_email: ticketForm.contact_email || null,
      contact_phone: ticketForm.contact_phone || null,
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
      setWizStep(5);
    }
    setSubmitting(false);
  };

  const resetWizard = () => {
    setWizStep(1);
    setSelectedProduct('');
    setSelectedCategory(null);
    setSelectedIssue(null);
    setTicketForm({ subject: '', description: '', contact_name: '', contact_email: '', contact_phone: '' });
    setTicketNumber('');
  };

  return (
    <Layout>
      <SEOHead title="Support" description="Get help from SERNET — search our knowledge base, raise tickets, FAQs." path="/support" />

      {/* Hero */}
      <section className="section-padding bg-hero">
        <div className="container-zerodha">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="heading-xl text-foreground mb-6">Support</h1>
            <p className="text-body mb-8">Search our knowledge base or raise a support ticket.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={kbSearch}
                onChange={e => setKbSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <Tabs defaultValue="kb" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="kb"><BookOpen className="h-4 w-4 mr-1.5" /> Knowledge Base</TabsTrigger>
              <TabsTrigger value="ticket"><Send className="h-4 w-4 mr-1.5" /> Raise Ticket</TabsTrigger>
              <TabsTrigger value="faq"><MessageCircle className="h-4 w-4 mr-1.5" /> FAQ</TabsTrigger>
            </TabsList>

            {/* Knowledge Base */}
            <TabsContent value="kb">
              {kbArticles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm mt-1">Try a different search term or check back later.</p>
                </div>
              ) : (
                <div>
                  {kbCategories.length > 1 && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {kbCategories.map((cat) => (
                        <Badge key={String(cat)} variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setKbSearch(String(cat))}>
                          {String(cat)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kbArticles.map((article: any) => (
                      <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <Badge variant="secondary" className="mb-2 text-[10px]">{article.category}</Badge>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{article.body ? article.body.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : ''}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Raise Ticket — 4-step wizard */}
            <TabsContent value="ticket">
              <div className="max-w-2xl mx-auto">
                {/* Progress */}
                {wizStep < 5 && (
                  <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          s === wizStep ? 'bg-primary text-primary-foreground' :
                          s < wizStep ? 'bg-primary/20 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>{s}</div>
                        {s < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    ))}
                    <span className="ml-3 text-sm text-muted-foreground">
                      {wizStep === 1 && 'Select Product'}
                      {wizStep === 2 && 'Issue Category'}
                      {wizStep === 3 && 'Issue Type'}
                      {wizStep === 4 && 'Your Details'}
                    </span>
                  </div>
                )}

                {/* Step 1: Product */}
                {wizStep === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Which product is this regarding?</h2>
                    <p className="text-muted-foreground mb-6">Select the product you need help with</p>
                    <div className="grid gap-4">
                      {PRODUCTS.map(p => (
                        <button
                          key={p.key}
                          onClick={() => { setSelectedProduct(p.key); setWizStep(2); }}
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
                {wizStep === 2 && (
                  <div>
                    <button onClick={() => setWizStep(1)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to products</button>
                    <h2 className="text-xl font-bold text-foreground mb-2">What's the issue about?</h2>
                    <p className="text-muted-foreground mb-6">Select the category that best describes your issue</p>
                    <div className="grid gap-3">
                      {categories.map(c => {
                        const count = issueTypes.filter(t => t.category_id === c.id && (t.product === selectedProduct || t.product === 'all')).length;
                        return (
                          <button
                            key={c.id}
                            onClick={() => { setSelectedCategory(c); setWizStep(3); }}
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
                {wizStep === 3 && (
                  <div>
                    <button onClick={() => setWizStep(2)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to categories</button>
                    <h2 className="text-xl font-bold text-foreground mb-2">{selectedCategory?.name}</h2>
                    <p className="text-muted-foreground mb-6">Select the specific issue</p>
                    <div className="grid gap-3">
                      {filteredIssueTypes.map(t => {
                        const pri = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                        const risk = RISK_TAGS[t.risk_tag as keyof typeof RISK_TAGS];
                        return (
                          <button
                            key={t.id}
                            onClick={() => { setSelectedIssue(t); setTicketForm(f => ({ ...f, subject: t.title })); setWizStep(4); }}
                            className="border border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{t.title}</p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                        onClick={() => { setSelectedIssue(null); setWizStep(4); }}
                        className="border border-dashed border-border rounded-xl p-4 text-left transition-all hover:border-primary hover:bg-muted/30"
                      >
                        <p className="font-medium text-muted-foreground">Other / Not listed above</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Describe your issue in the next step</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Details */}
                {wizStep === 4 && (
                  <div>
                    <button onClick={() => setWizStep(3)} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to issue types</button>
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
                          <Input value={ticketForm.contact_name} onChange={e => setTicketForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Your full name" />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Phone</Label>
                          <Input value={ticketForm.contact_phone} onChange={e => setTicketForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="+91 98765 43210" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input type="email" value={ticketForm.contact_email} onChange={e => setTicketForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="your@email.com" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Subject <span className="text-destructive">*</span></Label>
                        <Input value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of your issue" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Detailed Description</Label>
                        <Textarea rows={5} value={ticketForm.description} onChange={e => setTicketForm(f => ({ ...f, description: e.target.value }))} placeholder="Provide as much detail as possible..." />
                      </div>
                      <Button onClick={handleSubmitTicket} disabled={submitting} className="w-full" size="lg">
                        {submitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Success */}
                {wizStep === 5 && (
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
                    <Button variant="outline" onClick={resetWizard}>
                      Raise Another Ticket
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq">
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      <span className={`text-2xl text-muted-foreground transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openFaq === index && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 pb-4">
                        <p className="text-body">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
            <h2 className="heading-lg text-foreground mb-8">Contact us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="feature-card">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-body">080-47181888</p>
              </div>
              <div className="feature-card">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-body">support@sernetindia.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <h2 className="heading-lg text-foreground mb-4">Ready to get started?</h2>
            <p className="text-body mb-8">Open a SERNET account today and start your wealth journey.</p>
            <Link to="/signup" className="btn-primary">Sign up for free</Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
