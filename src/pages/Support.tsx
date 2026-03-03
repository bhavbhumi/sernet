import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, FileText, Phone, Mail, ExternalLink, BookOpen, Send, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '', contact_name: '', contact_email: '', contact_phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // Fetch KB categories
  const categories = [...new Set(kbArticles.map((a: any) => a.category))].sort();

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.contact_name.trim()) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await db('support_tickets').insert([{
      subject: ticketForm.subject,
      description: ticketForm.description,
      contact_name: ticketForm.contact_name,
      contact_email: ticketForm.contact_email,
      contact_phone: ticketForm.contact_phone,
      channel: 'website',
      status: 'open',
    }]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      setSubmitted(true);
      toast({ title: 'Ticket submitted!', description: 'We\'ll get back to you soon.' });
    }
    setSubmitting(false);
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
                  {categories.length > 1 && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {categories.map((cat, i) => (
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

            {/* Raise Ticket */}
            <TabsContent value="ticket">
              <div className="max-w-xl mx-auto">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="heading-md text-foreground mb-2">Ticket Submitted!</h3>
                    <p className="text-body mb-6">Our support team will get back to you within 24 hours.</p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setTicketForm({ subject: '', description: '', contact_name: '', contact_email: '', contact_phone: '' }); }}>
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="heading-md text-foreground mb-2">Raise a Support Ticket</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label>Subject <span className="text-destructive">*</span></Label>
                        <Input value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of your issue" />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label>Description</Label>
                        <Textarea rows={4} value={ticketForm.description} onChange={e => setTicketForm(f => ({ ...f, description: e.target.value }))} placeholder="Provide details about your issue..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Your Name <span className="text-destructive">*</span></Label>
                        <Input value={ticketForm.contact_name} onChange={e => setTicketForm(f => ({ ...f, contact_name: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input type="email" value={ticketForm.contact_email} onChange={e => setTicketForm(f => ({ ...f, contact_email: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Phone</Label>
                        <Input value={ticketForm.contact_phone} onChange={e => setTicketForm(f => ({ ...f, contact_phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSubmitTicket} disabled={submitting || !ticketForm.subject.trim() || !ticketForm.contact_name.trim()}>
                        {submitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </div>
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
