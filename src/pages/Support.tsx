import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Phone, Mail, BookOpen, Send, ChevronRight, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketWizard } from '@/components/support/TicketWizard';
import { useDebounce } from '@/hooks/useDebounce';

const db = (t: string) => supabase.from(t as any) as any;

const PRODUCT_LABELS: Record<string, string> = { choicefinx: 'Choice FinX', tickfunds: 'Tick Funds', tushil: 'Tushil', all: 'All Products' };

const Support = () => {
  const [kbSearch, setKbSearch] = useState('');
  const [selectedKbCategory, setSelectedKbCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const debouncedSearch = useDebounce(kbSearch, 300);

  // Fetch published KB articles with enriched fields
  const { data: kbArticles = [] } = useQuery({
    queryKey: ['kb-articles-public', debouncedSearch],
    queryFn: async () => {
      let q = db('kb_articles')
        .select('id, title, slug, category, product, issue_code, short_summary, possible_reasons, what_to_check, resolution_steps, documents_required, resolution_timeline, when_to_raise_ticket, question_variants, search_keywords, body')
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('view_count', { ascending: false })
        .limit(30);
      if (debouncedSearch.trim()) {
        q = q.or(`title.ilike.%${debouncedSearch}%,short_summary.ilike.%${debouncedSearch}%,issue_code.ilike.%${debouncedSearch}%`);
      }
      const { data } = await q;
      return data ?? [];
    },
  });

  const kbCategories = [...new Set(kbArticles.map((a: any) => a.category))].sort();
  const filteredArticles = selectedKbCategory
    ? kbArticles.filter((a: any) => a.category === selectedKbCategory)
    : kbArticles;

  return (
    <Layout>
      <SEOHead title="Support" description="Get help from SERNET — search our knowledge base, raise tickets, FAQs." path="/support" />

      {/* Hero */}
      <section className="section-padding bg-hero">
        <div className="container-zerodha">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="heading-xl text-foreground mb-6">How can we help?</h1>
            <p className="text-body mb-8">Search our knowledge base for instant answers, or raise a ticket for personal support.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Describe your issue, e.g. 'order failed' or 'KYC rejected'..."
                value={kbSearch}
                onChange={e => { setKbSearch(e.target.value); setSelectedKbCategory(null); }}
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
            </TabsList>

            {/* Knowledge Base */}
            <TabsContent value="kb">
              {/* Category filters */}
              {kbCategories.length > 1 && (
                <div className="flex gap-2 flex-wrap mb-6">
                  <Badge
                    variant={selectedKbCategory === null ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedKbCategory(null)}
                  >All</Badge>
                  {kbCategories.map((cat) => (
                    <Badge
                      key={String(cat)}
                      variant={selectedKbCategory === cat ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedKbCategory(selectedKbCategory === cat ? null : String(cat))}
                    >{String(cat)}</Badge>
                  ))}
                </div>
              )}

              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm mt-1">Try a different search term or check back later.</p>
                  <p className="text-sm mt-4">Can't find what you need? <button onClick={() => {}} className="text-primary underline">Raise a ticket</button></p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredArticles.map((article: any) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                    >
                      <button
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        className="w-full p-5 text-left flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="secondary" className="text-[10px]">{article.category}</Badge>
                            {article.product && article.product !== 'all' && (
                              <Badge variant="outline" className="text-[10px]">{PRODUCT_LABELS[article.product] || article.product}</Badge>
                            )}
                            {article.issue_code && (
                              <span className="font-mono text-[10px] text-muted-foreground">{article.issue_code}</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground line-clamp-2">{article.title}</h3>
                          {article.short_summary && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.short_summary}</p>
                          )}
                          {article.resolution_timeline && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                              <Clock className="h-3 w-3" /> {article.resolution_timeline}
                            </span>
                          )}
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform mt-2 ${expandedArticle === article.id ? 'rotate-90' : ''}`} />
                      </button>

                      {expandedArticle === article.id && (
                        <div className="px-5 pb-5 border-t border-border pt-4 ml-14 space-y-4">
                          {article.possible_reasons && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1">Possible Reasons</p>
                              <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.possible_reasons }} />
                            </div>
                          )}
                          {article.what_to_check && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1">What To Check</p>
                              <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.what_to_check }} />
                            </div>
                          )}
                          {article.resolution_steps && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1">Resolution Steps</p>
                              <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.resolution_steps }} />
                            </div>
                          )}
                          {(article.documents_required ?? []).length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1"><FileText className="h-4 w-4" /> Documents Required</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {article.documents_required.map((d: string, i: number) => <li key={i}>{d}</li>)}
                              </ul>
                            </div>
                          )}
                          {article.when_to_raise_ticket && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">When To Raise a Ticket</p>
                              <p className="text-sm text-amber-700 dark:text-amber-400">{article.when_to_raise_ticket}</p>
                            </div>
                          )}
                          {/* Fallback to body if no structured content */}
                          {!article.resolution_steps && !article.possible_reasons && article.body && (
                            <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.body }} />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Raise Ticket — 5-step wizard */}
            <TabsContent value="ticket">
              <TicketWizard showHeading={false} />
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
