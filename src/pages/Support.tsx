import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, BookOpen, Send, ChevronRight, ChevronDown, Clock, FileText, Phone, Mail, ExternalLink,
  AlertTriangle, Ticket, HelpCircle, Download, TrendingUp, Shield, BarChart3, Landmark
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

const db = (t: string) => supabase.from(t as any) as any;

const PRODUCT_META: Record<string, { label: string; description: string; icon: typeof TrendingUp; colorClass: string; bgClass: string }> = {
  choicefinx: { label: 'Choice FinX', description: 'Trading & Broking', icon: BarChart3, colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  tickfunds: { label: 'Tick Funds', description: 'Mutual Funds & Investment', icon: TrendingUp, colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  tushil: { label: 'Tushil', description: 'Insurance', icon: Shield, colorClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  all: { label: 'General / KYC', description: 'Account & KYC', icon: Landmark, colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
};

const PRODUCT_LABELS: Record<string, string> = { choicefinx: 'Choice FinX', tickfunds: 'Tick Funds', tushil: 'Tushil', all: 'General / KYC' };

const Support = () => {
  const [kbSearch, setKbSearch] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const debouncedSearch = useDebounce(kbSearch, 300);

  // Fetch published KB articles
  const { data: kbArticles = [] } = useQuery({
    queryKey: ['kb-articles-public', debouncedSearch],
    queryFn: async () => {
      let q = db('kb_articles')
        .select('id, title, slug, category, product, issue_code, short_summary, possible_reasons, what_to_check, resolution_steps, documents_required, resolution_timeline, when_to_raise_ticket, question_variants, search_keywords, body')
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('view_count', { ascending: false })
        .limit(300);
      if (debouncedSearch.trim()) {
        q = q.or(`title.ilike.%${debouncedSearch}%,short_summary.ilike.%${debouncedSearch}%,issue_code.ilike.%${debouncedSearch}%`);
      }
      const { data } = await q;
      return data ?? [];
    },
  });

  // Fetch bulletins
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

  // Build product → category → articles tree
  const productTree = useMemo(() => {
    const products = ['choicefinx', 'tickfunds', 'tushil', 'all'];
    return products.map(pKey => {
      const articles = kbArticles.filter((a: any) => a.product === pKey);
      const categories = [...new Set(articles.map((a: any) => String(a.category)))].sort();
      return {
        key: pKey,
        meta: PRODUCT_META[pKey],
        articleCount: articles.length,
        categories: categories.map((cat: string) => ({
          name: cat,
          articles: articles.filter((a: any) => a.category === cat),
        })),
      };
    }).filter(p => p.articleCount > 0);
  }, [kbArticles]);

  // Search results mode
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <Layout>
      <SEOHead title="Support Portal — SERNET Financial Services" description="Search our knowledge base, raise tickets, and get expert help for Choice FinX, Tick Funds, and Tushil products." path="/support" />

      {/* Bulletin Banner */}
      {bulletins.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="container-sernet py-2.5 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              {bulletins.map((b: any) => (
                <p key={b.id as string} className="text-sm text-amber-800 dark:text-amber-300">
                  <span className="font-medium">{b.title as string}</span>
                  {b.description && <span className="text-amber-700 dark:text-amber-400"> — {(b.description as string).slice(0, 120)}{(b.description as string).length > 120 ? '…' : ''}</span>}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero + Search */}
      <section className="bg-hero section-padding">
        <div className="container-sernet">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl text-foreground mb-3">Support Portal</h1>
            <p className="text-body mb-8">Search our knowledge base for instant answers, or raise a ticket for personal support.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Eg: How do I add a nominee? How do I activate F&O?"
                value={kbSearch}
                onChange={e => setKbSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-padding bg-background">
        <div className="container-sernet">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

            {/* Left: KB Content */}
            <div className="min-w-0">

              {/* Product Cards (hidden when searching) */}
              {!isSearching && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {productTree.map(p => {
                    const Icon = p.meta.icon;
                    return (
                      <button
                        key={p.key}
                        onClick={() => {
                          setExpandedProduct(expandedProduct === p.key ? null : p.key);
                          setExpandedCategory(null);
                          setExpandedArticle(null);
                        }}
                        className={`border rounded-xl p-5 text-left transition-all hover:shadow-md ${p.meta.bgClass} ${expandedProduct === p.key ? 'ring-2 ring-primary/40' : ''}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${p.meta.colorClass}`} />
                          </div>
                          <div>
                            <p className={`text-lg font-semibold ${p.meta.colorClass}`}>{p.meta.label}</p>
                            <p className="text-xs text-muted-foreground">{p.meta.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{p.articleCount} Articles</span>
                          <span>·</span>
                          <span>{p.categories.length} Sections</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Accordion KB Browse */}
              {!isSearching && expandedProduct && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                  {(() => {
                    const prod = productTree.find(p => p.key === expandedProduct);
                    if (!prod) return null;
                    return (
                      <div className="space-y-2">
                        <h2 className="heading-md mb-4 flex items-center gap-2">
                          <prod.meta.icon className={`h-5 w-5 ${prod.meta.colorClass}`} />
                          {prod.meta.label} — Knowledge Base
                        </h2>
                        {prod.categories.map(cat => (
                          <div key={cat.name} className="border border-border rounded-xl overflow-hidden">
                            <button
                              onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="font-medium text-foreground">{cat.name}</span>
                                <Badge variant="secondary" className="text-[10px]">{cat.articles.length}</Badge>
                              </div>
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedCategory === cat.name ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedCategory === cat.name && (
                              <div className="border-t border-border">
                                {cat.articles.map((article: any) => (
                                  <ArticleRow key={article.id} article={article} expanded={expandedArticle === article.id} onToggle={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)} />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* Search Results */}
              {isSearching && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">{kbArticles.length} result{kbArticles.length !== 1 ? 's' : ''} for "{debouncedSearch}"</p>
                  {kbArticles.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-medium">No articles found</p>
                      <p className="text-sm mt-1">Try a different search term.</p>
                      <Link to="/raise-ticket" className="text-primary underline text-sm mt-4 inline-block">Raise a ticket instead →</Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {kbArticles.map((article: any) => (
                        <ArticleRow key={article.id} article={article} expanded={expandedArticle === article.id} onToggle={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Default state: no product selected, not searching */}
              {!isSearching && !expandedProduct && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a product above to browse articles, or use the search bar.</p>
                </div>
              )}
            </div>

            {/* Right: Sticky Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link to="/raise-ticket" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Send className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Raise a Ticket</p>
                        <p className="text-[11px] text-muted-foreground">Get personal support</p>
                      </div>
                    </Link>
                    <Link to="/contact/schedule-call" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Schedule a Call</p>
                        <p className="text-[11px] text-muted-foreground">Talk to our team</p>
                      </div>
                    </Link>
                    <Link to="/downloads/documents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <Download className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Download Forms</p>
                        <p className="text-[11px] text-muted-foreground">KYC, account forms</p>
                      </div>
                    </Link>
                  </div>
                </div>

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
                      <Phone className="h-3.5 w-3.5" />
                      <span>080-47181888</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>support@sernetindia.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Mon–Sat, 9 AM – 6 PM</span>
                    </div>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile Quick Actions (shown only on mobile) */}
      <section className="lg:hidden section-padding bg-section-alt">
        <div className="container-sernet">
          <h2 className="heading-md mb-6 text-center">Need More Help?</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/raise-ticket" className="feature-card text-center">
              <Send className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Raise Ticket</p>
            </Link>
            <Link to="/contact/schedule-call" className="feature-card text-center">
              <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Schedule Call</p>
            </Link>
            <a href="tel:08047181888" className="feature-card text-center">
              <Phone className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Call Us</p>
            </a>
            <Link to="/downloads/documents" className="feature-card text-center">
              <Download className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Forms</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ─── Article Row Component ─── */
function ArticleRow({ article, expanded, onToggle }: { article: any; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
      <button onClick={onToggle} className="w-full px-5 py-3.5 text-left flex items-start gap-3">
        <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {article.product && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{PRODUCT_LABELS[article.product] || article.product}</Badge>
            )}
            {article.issue_code && (
              <span className="font-mono text-[10px] text-muted-foreground">{article.issue_code}</span>
            )}
          </div>
          <h4 className="text-sm font-medium text-foreground leading-snug">{article.title}</h4>
          {article.short_summary && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.short_summary}</p>
          )}
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-4 ml-7 space-y-3 border-t border-border pt-3">
          {article.possible_reasons && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Possible Reasons</p>
              <div className="text-xs text-muted-foreground prose prose-xs max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.possible_reasons }} />
            </div>
          )}
          {article.what_to_check && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">What To Check</p>
              <div className="text-xs text-muted-foreground prose prose-xs max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.what_to_check }} />
            </div>
          )}
          {article.resolution_steps && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Resolution Steps</p>
              <div className="text-xs text-muted-foreground prose prose-xs max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.resolution_steps }} />
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
          {article.resolution_timeline && (
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {article.resolution_timeline}</p>
          )}
          {article.when_to_raise_ticket && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-0.5">When To Raise a Ticket</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">{article.when_to_raise_ticket}</p>
            </div>
          )}
          {!article.resolution_steps && !article.possible_reasons && article.body && (
            <div className="text-xs text-muted-foreground prose prose-xs max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.body }} />
          )}
          <div className="pt-1">
            <Link to="/raise-ticket" className="text-xs text-primary hover:underline flex items-center gap-1">
              <Send className="h-3 w-3" /> Still need help? Raise a ticket
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Support;
