import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { motion } from 'framer-motion';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Search, BookOpen, Send, ChevronRight, Clock, FileText, Phone,
  Download, TrendingUp, Shield, BarChart3, Landmark, AlertTriangle,
  Users, CheckCircle2, Eye, ListChecks
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
        .select('id, title, slug, category, product, issue_code, short_summary, possible_reasons, what_to_check, resolution_steps, documents_required, resolution_timeline, when_to_raise_ticket, question_variants, body, priority, owner_team, suggested_article_group')
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

  // Auto-expand first category (but don't auto-select article — show overview instead)
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  useEffect(() => {
    if (categoryTree.length > 0 && openCategories.length === 0 && !selectedArticleId) {
      setOpenCategories([categoryTree[0].name]);
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

  // Suggested articles: same group OR same category, excluding current
  const suggestedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    const group = selectedArticle.suggested_article_group;
    return kbArticles
      .filter((a: any) => a.id !== selectedArticle.id && (
        (group && a.suggested_article_group === group) ||
        a.category === selectedArticle.category
      ))
      .slice(0, 5);
  }, [selectedArticle, kbArticles]);

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
          <div className={`grid grid-cols-1 ${selectedArticle ? 'lg:grid-cols-[280px_1fr_300px]' : 'lg:grid-cols-[280px_1fr]'} gap-6 items-start`}>

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

                {/* Suggested Articles */}
                {selectedArticle && suggestedArticles.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                      <BookOpen className="h-3.5 w-3.5 text-primary" /> Related Articles
                    </h3>
                    <div className="space-y-1">
                      {suggestedArticles.map((article: any) => (
                        <button
                          key={article.id}
                          onClick={() => handleArticleClick(article)}
                          className="w-full text-left px-2.5 py-2 rounded-md text-[12px] leading-snug text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    {selectedArticle.priority && (
                      <Badge variant={selectedArticle.priority === 'high' || selectedArticle.priority === 'critical' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 capitalize">
                        {selectedArticle.priority} Priority
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-xl font-bold text-foreground mb-2 leading-snug">{selectedArticle.title}</h1>
                  {selectedArticle.short_summary && (
                    <p className="text-sm text-muted-foreground mb-6">{selectedArticle.short_summary}</p>
                  )}

                  {/* Body / Detailed Guide */}
                  {selectedArticle.body && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full" /> Detailed Guide
                      </h3>
                      <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.body }} />
                    </div>
                  )}

                   {/* Resolution Steps — always in middle column */}
                  {selectedArticle.resolution_steps && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full" /> Resolution Steps
                      </h3>
                      <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.resolution_steps }} />
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-8 pt-5 border-t border-border flex flex-wrap items-center gap-4">
                    <Link to="/raise-ticket" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      <Send className="h-4 w-4" /> Still need help? Raise a Ticket
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Product Overview Header */}
                  <div className={`${meta?.bgClass} rounded-xl p-6 border border-border`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center">
                        <Icon className={`h-7 w-7 ${meta?.colorClass}`} />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">{meta?.label} Knowledge Base</h1>
                        <p className="text-sm text-muted-foreground">{meta?.description} — {kbArticles.length} articles across {categoryTree.length} categories</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Browse self-help articles organised by issue category. Select any article from the sidebar, or click a category below to explore.
                    </p>
                  </div>

                  {/* Classification Tree */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded-full" /> Issue Categories
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryTree.map(cat => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setOpenCategories([cat.name]);
                            if (cat.articles.length > 0) {
                              handleArticleClick(cat.articles[0]);
                            }
                          }}
                          className="text-left p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">{cat.articles.length}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                            {cat.articles.slice(0, 3).map((a: any) => a.title).join(' · ')}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link to="/raise-ticket" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all">
                      <Send className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Raise a Ticket</p>
                        <p className="text-[11px] text-muted-foreground">Can't find what you need?</p>
                      </div>
                    </Link>
                    <Link to="/contact?tab=schedule" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all">
                      <Phone className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Schedule a Call</p>
                        <p className="text-[11px] text-muted-foreground">Talk to our support team</p>
                      </div>
                    </Link>
                    <Link to="/downloads?tab=documents" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all">
                      <Download className="h-5 w-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Download Forms</p>
                        <p className="text-[11px] text-muted-foreground">Application & KYC forms</p>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </main>

            {/* Right Sidebar — only when article selected */}
            {selectedArticle && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">

                  {/* Widget 1: Resolution Timeline, Documents, Owner */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <Tabs defaultValue="timeline" className="w-full">
                      <TabsList className="w-full rounded-none border-b border-border bg-muted/30 h-auto p-0">
                        <TabsTrigger value="timeline" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <Clock className="h-3 w-3 mr-1" /> Timeline
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <FileText className="h-3 w-3 mr-1" /> Docs
                        </TabsTrigger>
                        <TabsTrigger value="owner" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <Users className="h-3 w-3 mr-1" /> Owner
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="timeline" className="p-4 mt-0">
                        {selectedArticle.resolution_timeline ? (
                          <div className="flex items-start gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{selectedArticle.resolution_timeline}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No timeline specified</p>
                        )}
                      </TabsContent>
                      <TabsContent value="docs" className="p-4 mt-0">
                        {(selectedArticle.documents_required ?? []).length > 0 ? (
                          <ul className="text-sm text-muted-foreground space-y-1.5">
                            {selectedArticle.documents_required.map((d: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                <span className="text-[13px]">{d}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No documents required</p>
                        )}
                      </TabsContent>
                      <TabsContent value="owner" className="p-4 mt-0">
                        {selectedArticle.owner_team ? (
                          <div className="flex items-start gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{selectedArticle.owner_team}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Not assigned</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Widget 2: Possible Reasons, What to Check, Resolution */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <Tabs defaultValue="reasons" className="w-full">
                      <TabsList className="w-full rounded-none border-b border-border bg-muted/30 h-auto p-0">
                        <TabsTrigger value="reasons" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Reasons
                        </TabsTrigger>
                        <TabsTrigger value="check" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <Eye className="h-3 w-3 mr-1" /> Check
                        </TabsTrigger>
                        <TabsTrigger value="resolution" className="flex-1 text-[11px] py-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Steps
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="reasons" className="p-4 mt-0">
                        {selectedArticle.possible_reasons ? (
                          <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.possible_reasons }} />
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No reasons documented</p>
                        )}
                      </TabsContent>
                      <TabsContent value="check" className="p-4 mt-0">
                        {selectedArticle.what_to_check ? (
                          <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.what_to_check }} />
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No checks documented</p>
                        )}
                      </TabsContent>
                      <TabsContent value="resolution" className="p-4 mt-0">
                        {selectedArticle.resolution_steps ? (
                          <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedArticle.resolution_steps }} />
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No resolution steps</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Widget 3: When to raise a ticket */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> When To Raise a Ticket
                    </h3>
                    {selectedArticle.when_to_raise_ticket ? (
                      <p className="text-[13px] text-amber-700 dark:text-amber-400 leading-relaxed">{selectedArticle.when_to_raise_ticket}</p>
                    ) : (
                      <p className="text-xs text-amber-600/60 dark:text-amber-500/60 italic">Raise a ticket if the issue persists after following the resolution steps.</p>
                    )}
                    <Link to="/raise-ticket" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 hover:underline">
                      <Send className="h-3 w-3" /> Raise a Ticket →
                    </Link>
                  </div>

                </div>
              </aside>
            )}
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
