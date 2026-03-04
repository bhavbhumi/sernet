import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { PageHero } from '@/components/layout/PageHero';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, BookOpen, Send, ChevronRight, Clock, FileText, Phone, Mail, ExternalLink,
  AlertTriangle, Download, TrendingUp, Shield, BarChart3, Landmark, ArrowRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { TicketWizard } from '@/components/support/TicketWizard';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const db = (t: string) => supabase.from(t as any) as any;

const TABS = ['Knowledge Base', 'Raise a Ticket', 'Downloads'] as const;
type SupportTab = (typeof TABS)[number];

const PRODUCT_META: Record<string, { label: string; description: string; icon: typeof TrendingUp; colorClass: string; bgClass: string; slug: string }> = {
  choicefinx: { label: 'Choice FinX', description: 'Trading & Broking', icon: BarChart3, colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', slug: 'choicefinx' },
  tickfunds: { label: 'Tick Funds', description: 'Mutual Funds & Investment', icon: TrendingUp, colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', slug: 'tickfunds' },
  tushil: { label: 'Tushil', description: 'Insurance', icon: Shield, colorClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', slug: 'tushil' },
  all: { label: 'General / KYC', description: 'Account & KYC', icon: Landmark, colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', slug: 'general' },
};

const TAB_PARAM_MAP: Record<string, SupportTab> = { kb: 'Knowledge Base', ticket: 'Raise a Ticket', downloads: 'Downloads' };
const TAB_KEY_MAP: Record<SupportTab, string> = { 'Knowledge Base': 'kb', 'Raise a Ticket': 'ticket', 'Downloads': 'downloads' };

const Support = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'kb';
  const activeTab: SupportTab = TAB_PARAM_MAP[tabParam] || 'Knowledge Base';

  const setActiveTab = (tab: SupportTab) => {
    setSearchParams({ tab: TAB_KEY_MAP[tab] }, { replace: true });
  };

  const [kbSearch, setKbSearch] = useState('');
  const debouncedSearch = useDebounce(kbSearch, 300);

  const { data: kbArticles = [] } = useQuery({
    queryKey: ['kb-articles-public', debouncedSearch],
    queryFn: async () => {
      let q = db('kb_articles')
        .select('id, title, slug, category, product, issue_code, short_summary')
        .eq('status', 'published')
        .eq('visibility', 'public');
      if (debouncedSearch.trim()) {
        q = q.or(`title.ilike.%${debouncedSearch}%,short_summary.ilike.%${debouncedSearch}%,issue_code.ilike.%${debouncedSearch}%`);
      }
      q = q.order('created_at', { ascending: false }).limit(20);
      const { data } = await q;
      return data ?? [];
    },
  });

  const { data: productCounts = {} } = useQuery({
    queryKey: ['kb-product-counts'],
    queryFn: async () => {
      const { data } = await db('kb_articles')
        .select('product')
        .eq('status', 'published')
        .eq('visibility', 'public');
      const counts: Record<string, number> = {};
      (data ?? []).forEach((r: any) => { counts[r.product] = (counts[r.product] || 0) + 1; });
      return counts;
    },
  });

  const { data: bulletins = [] } = useQuery({
    queryKey: ['support-bulletins'],
    queryFn: async () => {
      const { data } = await db('bulletins')
        .select('id, title, description, priority')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['support-documents-public'],
    queryFn: async () => {
      const { data } = await db('support_documents')
        .select('id, title, description, category, file_url, file_name, file_type, file_size_kb')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true });
      return data ?? [];
    },
    enabled: activeTab === 'Downloads',
  });

  const isSearching = debouncedSearch.trim().length > 0;
  const productKeys = ['choicefinx', 'tickfunds', 'tushil', 'all'];
  const PRODUCT_LABELS: Record<string, string> = { choicefinx: 'Choice FinX', tickfunds: 'Tick Funds', tushil: 'Tushil', all: 'General / KYC' };

  const docCategories = useMemo(() => {
    const cats = [...new Set(documents.map((d: any) => d.category as string))].sort();
    return cats.map(cat => ({ name: cat, docs: documents.filter((d: any) => d.category === cat) }));
  }, [documents]);

  return (
    <Layout>
      <SEOHead title="Support Portal — SERNET Financial Services" description="Search our knowledge base, raise tickets, and get expert help for Choice FinX, Tick Funds, and Tushil products." path="/support" />

      <PageHero
        title="Support"
        highlight="Portal"
        description="Search our knowledge base for instant answers, or raise a ticket for personal support."
        breadcrumbLabel="Support"
      />

      {/* Tabs */}
      <div className="border-b border-border sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
        <div className="container-sernet">
          <div className="flex gap-8 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 pt-4 text-[1.0625rem] transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="support-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

          {/* ─── Knowledge Base Tab ─── */}
          {activeTab === 'Knowledge Base' && (
              <section className="section-padding bg-background">
                <div className="container-sernet">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
                    {/* Main Content */}
                    <div className="min-w-0">
                      {/* Search Bar */}
                      <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search articles — e.g. How do I add a nominee?"
                          value={kbSearch}
                          onChange={e => setKbSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        />
                      </div>

                      {isSearching ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-4">{kbArticles.length} result{kbArticles.length !== 1 ? 's' : ''} for "{debouncedSearch}"</p>
                          {kbArticles.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                              <p className="text-lg font-medium">No articles found</p>
                              <p className="text-sm mt-1">Try a different search term.</p>
                              <button onClick={() => setActiveTab('Raise a Ticket')} className="text-primary underline text-sm mt-4 inline-block">Raise a ticket instead →</button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {kbArticles.map((article: any) => (
                                <Link
                                  key={article.id}
                                  to={`/support/${PRODUCT_META[article.product]?.slug || 'general'}?article=${article.slug}`}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors group"
                                >
                                  <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{PRODUCT_LABELS[article.product] || article.product}</Badge>
                                      {article.issue_code && <span className="font-mono text-[10px] text-muted-foreground">{article.issue_code}</span>}
                                    </div>
                                    <h4 className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">{article.title}</h4>
                                    {article.short_summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.short_summary}</p>}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {productKeys.map(pKey => {
                              const meta = PRODUCT_META[pKey];
                              const Icon = meta.icon;
                              const count = (productCounts as any)[pKey] || 0;
                              return (
                                <Link
                                  key={pKey}
                                  to={`/support/${meta.slug}`}
                                  className={`border rounded-xl p-5 text-left transition-all hover:shadow-md hover:scale-[1.02] ${meta.bgClass} group`}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center">
                                      <Icon className={`h-5 w-5 ${meta.colorClass}`} />
                                    </div>
                                    <div className="flex-1">
                                      <p className={`text-lg font-semibold ${meta.colorClass}`}>{meta.label}</p>
                                      <p className="text-xs text-muted-foreground">{meta.description}</p>
                                    </div>
                                    <ArrowRight className={`h-5 w-5 ${meta.colorClass} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span>{count} Articles</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <h2 className="heading-md mb-4">Recent Articles</h2>
                          <div className="space-y-1 border border-border rounded-xl overflow-hidden">
                            {kbArticles.slice(0, 10).map((article: any) => (
                              <Link
                                key={article.id}
                                to={`/support/${PRODUCT_META[article.product]?.slug || 'general'}?article=${article.slug}`}
                                className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors border-b border-border last:border-b-0 group"
                              >
                                <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{PRODUCT_LABELS[article.product] || article.product}</Badge>
                                  </div>
                                  <h4 className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">{article.title}</h4>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                      <div className="sticky top-24 space-y-5">
                        {bulletins.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Notices</h3>
                            </div>
                            <div className="space-y-2">
                              {bulletins.map((b: any) => (
                                <div key={b.id as string} className="text-xs text-amber-800 dark:text-amber-300">
                                  <p className="font-medium leading-snug">{b.title as string}</p>
                                  {b.description && <p className="text-amber-700 dark:text-amber-400 mt-0.5 line-clamp-2">{b.description as string}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Links */}
                        <div className="bg-card border border-border rounded-xl p-5">
                          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
                          <div className="space-y-2 text-sm">
                            <a href="https://choicefinx.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Choice FinX Portal
                            </a>
                            <a href="https://tickfunds.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Tick Funds Portal
                            </a>
                            <Link to="/complaints" className="flex items-center gap-2 text-primary hover:underline">
                              <FileText className="h-3 w-3" /> Complaints & Grievances
                            </Link>
                            <Link to="/investor-charter" className="flex items-center gap-2 text-primary hover:underline">
                              <FileText className="h-3 w-3" /> Investor Charter
                            </Link>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-card border border-border rounded-xl p-5">
                          <h3 className="text-sm font-semibold text-foreground mb-3">Contact Us</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" /> <span>080-47181888</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" /> <span>support@sernetindia.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" /> <span>Mon–Sat, 9 AM – 6 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              </section>
          )}

          {/* ─── Raise a Ticket Tab ─── */}
          {activeTab === 'Raise a Ticket' && (
            <section className="section-padding bg-background">
              <div className="container-sernet max-w-3xl mx-auto">
                <TicketWizard showHeading={false} />
              </div>
            </section>
          )}

          {/* ─── Downloads Tab ─── */}
          {activeTab === 'Downloads' && (
            <section className="section-padding bg-background">
              <div className="container-sernet">
                {documents.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium">No documents available</p>
                    <p className="text-sm mt-1">Check back later for downloadable forms and resources.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {docCategories.map((cat: { name: string; docs: any[] }) => (
                      <div key={cat.name}>
                        <h2 className="heading-md mb-4">{cat.name}</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cat.docs.map((doc: any) => (
                            <a
                              key={doc.id as string}
                              href={doc.file_url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-muted/50 rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{doc.title}</p>
                                  <p className="text-xs text-muted-foreground">{doc.file_type}{doc.file_size_kb ? ` · ${Math.round(doc.file_size_kb / 1024 * 10) / 10} MB` : ''}</p>
                                </div>
                              </div>
                              <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Support;
