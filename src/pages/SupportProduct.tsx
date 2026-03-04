import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Search, BookOpen, Send, ChevronRight, Clock, FileText, Phone, Mail, ExternalLink,
  AlertTriangle, Download, TrendingUp, Shield, BarChart3, Landmark
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from '@/components/ui/breadcrumb';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';

const db = (t: string) => supabase.from(t as any) as any;

const SLUG_TO_PRODUCT: Record<string, string> = {
  choicefinx: 'choicefinx',
  tickfunds: 'tickfunds',
  tushil: 'tushil',
  general: 'all',
};

const PRODUCT_META: Record<string, { label: string; description: string; icon: typeof TrendingUp; colorClass: string; bgClass: string }> = {
  choicefinx: { label: 'Choice FinX', description: 'Trading & Broking', icon: BarChart3, colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-900/20' },
  tickfunds: { label: 'Tick Funds', description: 'Mutual Funds & Investment', icon: TrendingUp, colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20' },
  tushil: { label: 'Tushil', description: 'Insurance', icon: Shield, colorClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-50 dark:bg-purple-900/20' },
  all: { label: 'General / KYC', description: 'Account & KYC', icon: Landmark, colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-900/20' },
};

const SupportProduct = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const productKey = SLUG_TO_PRODUCT[productSlug || ''] || 'all';
  const meta = PRODUCT_META[productKey];
  const Icon = meta?.icon || Landmark;

  const articleSlug = searchParams.get('article');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [kbSearch, setKbSearch] = useState('');
  const debouncedSearch = useDebounce(kbSearch, 300);

  // Fetch KB articles for this product
  const { data: kbArticles = [] } = useQuery({
    queryKey: ['kb-product-articles', productKey, debouncedSearch],
    queryFn: async () => {
      let q = db('kb_articles')
        .select('id, title, slug, category, product, issue_code, short_summary, possible_reasons, what_to_check, resolution_steps, documents_required, resolution_timeline, when_to_raise_ticket, question_variants, body')
        .eq('status', 'published')
        .eq('visibility', 'public')
        .eq('product', productKey)
        .order('category', { ascending: true })
        .order('title', { ascending: true });
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

  // Build category tree
  const categoryTree = useMemo(() => {
    const cats = [...new Set(kbArticles.map((a: any) => String(a.category)))].sort();
    return cats.map((cat: string) => ({
      name: cat,
      articles: kbArticles.filter((a: any) => a.category === cat),
    }));
  }, [kbArticles]);

  // Auto-select article from URL param
  useEffect(() => {
    if (articleSlug && kbArticles.length > 0) {
      const found = kbArticles.find((a: any) => a.slug === articleSlug);
      if (found) setSelectedArticleId((found as any).id);
    }
  }, [articleSlug, kbArticles]);

  // Auto-expand first category with auto-select first article
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  useEffect(() => {
    if (categoryTree.length > 0 && openCategories.length === 0 && !selectedArticleId) {
      const firstCat = categoryTree[0];
      setOpenCategories([firstCat.name]);
      if (firstCat.articles.length > 0) {
        setSelectedArticleId(firstCat.articles[0].id);
      }
    }
  }, [categoryTree]);

  // If article selected from URL, expand its category
  useEffect(() => {
    if (selectedArticleId) {
      const article = kbArticles.find((a: any) => a.id === selectedArticleId);
      if (article && !openCategories.includes((article as any).category)) {
        setOpenCategories(prev => [...prev, (article as any).category]);
      }
    }
  }, [selectedArticleId, kbArticles]);

  const selectedArticle = kbArticles.find((a: any) => a.id === selectedArticleId) as any;

  const handleArticleClick = (article: any) => {
    setSelectedArticleId(article.id);
    setSearchParams({ article: article.slug }, { replace: true });
  };

  return (
    <Layout>
      <SEOHead
        title={`${meta?.label || 'Support'} — Knowledge Base — SERNET`}
        description={`Browse support articles and FAQs for ${meta?.label || 'our products'}.`}
        path={`/support/${productSlug}`}
      />

      {/* Breadcrumb bar */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container-sernet py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/support">Support</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {selectedArticle ? (
                  <BreadcrumbLink asChild>
                    <button onClick={() => { setSelectedArticleId(null); setSearchParams({}, { replace: true }); }} className="hover:text-foreground transition-colors">
                      {meta?.label}
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{meta?.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {selectedArticle && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="max-w-[260px] truncate">{selectedArticle.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main 2-column layout */}
      <section className="bg-background min-h-[calc(100vh-200px)]">
        <div className="container-sernet py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

            {/* Left Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Product Header */}
                <div className={`${meta?.bgClass} rounded-xl p-4 border border-border`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-background/60 flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${meta?.colorClass}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${meta?.colorClass}`}>{meta?.label}</p>
                      <p className="text-[11px] text-muted-foreground">{kbArticles.length} articles</p>
                    </div>
                  </div>
                </div>

                {/* Search within product */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Filter articles…"
                    value={kbSearch}
                    onChange={e => setKbSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Category Accordion */}
                <div className="max-h-[calc(100vh-420px)] overflow-y-auto pr-1 -mr-1">
                  <Accordion
                    type="multiple"
                    value={openCategories}
                    onValueChange={setOpenCategories}
                  >
                    {categoryTree.map(cat => (
                      <AccordionItem key={cat.name} value={cat.name} className="border-b-0">
                        <AccordionTrigger className="py-2.5 px-3 text-sm hover:no-underline hover:bg-muted/40 rounded-lg data-[state=open]:bg-muted/30">
                          <div className="flex items-center gap-2 text-left">
                            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-foreground font-medium text-[13px] leading-snug">{cat.name}</span>
                            <Badge variant="secondary" className="text-[9px] px-1 py-0 ml-auto">{cat.articles.length}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-1 pt-0">
                          <div className="ml-2 border-l border-border pl-3 space-y-0.5">
                            {cat.articles.map((article: any) => (
                              <button
                                key={article.id}
                                onClick={() => handleArticleClick(article)}
                                className={`w-full text-left px-2.5 py-2 rounded-md text-[12px] leading-snug transition-colors ${
                                  selectedArticleId === article.id
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                }`}
                              >
                                {article.title}
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

              </div>
            </aside>

            {/* Content Area */}
            <main className="min-w-0">
              {/* Mobile: Category selector */}
              <div className="lg:hidden mb-6">
                <div className={`${meta?.bgClass} rounded-xl p-4 border border-border mb-4`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${meta?.colorClass}`} />
                    <div>
                      <p className={`font-semibold ${meta?.colorClass}`}>{meta?.label}</p>
                      <p className="text-xs text-muted-foreground">{kbArticles.length} articles</p>
                    </div>
                  </div>
                </div>
                <Accordion type="multiple" defaultValue={categoryTree.length > 0 ? [categoryTree[0].name] : []}>
                  {categoryTree.map(cat => (
                    <AccordionItem key={cat.name} value={cat.name}>
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          {cat.name}
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 ml-1">{cat.articles.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {cat.articles.map((article: any) => (
                            <button
                              key={article.id}
                              onClick={() => handleArticleClick(article)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                selectedArticleId === article.id
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-muted/30'
                              }`}
                            >
                              {article.title}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Article Detail */}
              {selectedArticle ? (
                <motion.div
                  key={selectedArticle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border rounded-xl p-6 lg:p-8"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge variant="outline" className="text-[10px] px-1.5">{meta?.label}</Badge>
                    <Badge variant="secondary" className="text-[10px] px-1.5">{selectedArticle.category}</Badge>
                    {selectedArticle.issue_code && (
                      <span className="font-mono text-[10px] text-muted-foreground">{selectedArticle.issue_code}</span>
                    )}
                  </div>

                  <h1 className="text-xl font-bold text-foreground mb-2 leading-snug">{selectedArticle.title}</h1>
                  {selectedArticle.short_summary && (
                    <p className="text-sm text-muted-foreground mb-6">{selectedArticle.short_summary}</p>
                  )}

                  <div className="space-y-5">
                    {selectedArticle.possible_reasons && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-amber-500 rounded-full" /> Possible Reasons
                        </h3>
                        <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.possible_reasons }} />
                      </div>
                    )}
                    {selectedArticle.what_to_check && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-blue-500 rounded-full" /> What To Check
                        </h3>
                        <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.what_to_check }} />
                      </div>
                    )}
                    {selectedArticle.resolution_steps && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-emerald-500 rounded-full" /> Resolution Steps
                        </h3>
                        <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.resolution_steps }} />
                      </div>
                    )}
                    {(selectedArticle.documents_required ?? []).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" /> Documents Required
                        </h3>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          {selectedArticle.documents_required.map((d: string, i: number) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}
                    {selectedArticle.resolution_timeline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2.5">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Resolution Timeline:</span> {selectedArticle.resolution_timeline}
                      </div>
                    )}
                    {selectedArticle.when_to_raise_ticket && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">When To Raise a Ticket</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">{selectedArticle.when_to_raise_ticket}</p>
                      </div>
                    )}
                    {!selectedArticle.resolution_steps && !selectedArticle.possible_reasons && selectedArticle.body && (
                      <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.body }} />
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-5 border-t border-border flex flex-wrap items-center gap-4">
                    <Link to="/raise-ticket" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      <Send className="h-4 w-4" /> Still need help? Raise a Ticket
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select an article</p>
                  <p className="text-sm mt-1">Choose a category and article from the sidebar to view its content.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Quick Actions */}
      <section className="lg:hidden section-padding bg-section-alt">
        <div className="container-sernet">
          <h2 className="heading-md mb-6 text-center">Need More Help?</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/raise-ticket" className="feature-card text-center">
              <Send className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Raise Ticket</p>
            </Link>
            <Link to="/contact?tab=schedule" className="feature-card text-center">
              <Phone className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Schedule Call</p>
            </Link>
            <Link to="/downloads?tab=documents" className="feature-card text-center">
              <Download className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Forms</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SupportProduct;
