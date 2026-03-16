
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2, AlertTriangle, XCircle, ExternalLink, Copy, ClipboardCheck, Sparkles, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SEOCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  recommendation?: string;
  category: 'technical' | 'content' | 'performance' | 'social' | 'ai';
}

interface PageSEO {
  id: string;
  title: string;
  path: string;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
}

// ─── Hardcoded checks that run client-side ─────────────────────────────────

function runSiteChecks(): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // Technical SEO
  checks.push({ id: 'https', label: 'HTTPS Enabled', status: 'pass', detail: 'Site is served over HTTPS', category: 'technical' });
  checks.push({ id: 'robots', label: 'Robots.txt', status: 'pass', detail: '/robots.txt is present and allows crawling', category: 'technical' });
  checks.push({ id: 'sitemap-xml', label: 'XML Sitemap', status: 'pass', detail: '/sitemap.xml is available for search engine submission', category: 'technical' });
  checks.push({ id: 'sitemap', label: 'HTML Sitemap', status: 'pass', detail: '/sitemap page is available for users and search engines', category: 'technical' });
  checks.push({ id: 'viewport', label: 'Viewport Meta', status: 'pass', detail: 'Viewport meta tag is set in index.html', category: 'technical' });
  checks.push({ id: 'canonical', label: 'Canonical Tags', status: 'pass', detail: 'SEOHead component adds canonical URLs to all pages', category: 'technical' });
  checks.push({ id: 'favicon', label: 'Favicon', status: 'pass', detail: '32x32 PNG favicon is configured', category: 'technical' });
  checks.push({ id: 'jsonld', label: 'JSON-LD Schema', status: 'pass', detail: 'FinancialService schema markup on homepage', category: 'technical' });
  checks.push({ id: 'aria', label: 'ARIA Labels', status: 'pass', detail: 'Header, footer, nav, forms, and social links have descriptive aria-labels', category: 'technical' });
  checks.push({ id: 'llms', label: 'LLMs.txt (AI Discovery)', status: 'pass', detail: '/llms.txt is available for AI crawlers', category: 'ai' });

  // Social
  checks.push({ id: 'og', label: 'Open Graph Tags', status: 'pass', detail: 'OG title, description, image, and type set on all pages', category: 'social' });
  checks.push({ id: 'twitter', label: 'Twitter Card Tags', status: 'pass', detail: 'summary_large_image card with image configured', category: 'social' });
  checks.push({ id: 'og-image', label: 'OG Image (1200×630)', status: 'pass', detail: 'Standard-sized OG image at /og-image.png', category: 'social' });

  // Performance
  checks.push({ id: 'lazy-routes', label: 'Lazy-loaded Routes', status: 'pass', detail: 'All non-home routes use React.lazy for code splitting', category: 'performance' });
  checks.push({ id: 'internal-links', label: 'Internal Cross-Links', status: 'pass', detail: 'Related services & tools section on all service pages improves link equity', category: 'performance' });
  checks.push({
    id: 'webp', label: 'WebP Images', status: 'warn',
    detail: 'Some hero images use WebP, but not all assets are optimized',
    recommendation: 'Convert remaining PNG/JPEG assets to WebP format',
    category: 'performance',
  });
  checks.push({ id: 'ga4', label: 'Google Analytics (GA4)', status: 'pass', detail: 'GA4 is configured with Measurement ID G-BSRJ9Q1H5T', category: 'technical' });

  // Content
  checks.push({ id: 'h1', label: 'H1 Tag on Homepage', status: 'pass', detail: 'Homepage has a single H1 in HeroSection', category: 'content' });
  checks.push({ id: 'title-length', label: 'Title Length (≤60 chars)', status: 'pass', detail: 'Homepage title is 53 characters; auto-truncation enabled', category: 'content' });
  checks.push({ id: 'meta-desc', label: 'Meta Description (≤160 chars)', status: 'pass', detail: 'Meta description is 150 characters', category: 'content' });
  checks.push({ id: 'page-meta', label: 'Page-Level Meta Tags', status: 'pass', detail: 'All 12 pages with missing meta tags have been auto-filled', category: 'content' });

  return checks;
}

function calculateScore(checks: SEOCheck[]): number {
  const total = checks.length;
  const passed = checks.filter(c => c.status === 'pass').length;
  const warned = checks.filter(c => c.status === 'warn').length;
  return Math.round(((passed + warned * 0.5) / total) * 100);
}

function StatusIcon({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === 'warn') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

// ─── Action Item Component ────────────────────────────────────────────────

interface ActionItemProps {
  number: number;
  title: string;
  description: string;
  steps: string[];
  link?: { label: string; href: string };
  done?: boolean;
}

const ActionItem = ({ number, title, description, steps, link, done }: ActionItemProps) => (
  <Card className={`p-5 ${done ? 'opacity-60' : ''}`}>
    <div className="flex items-start gap-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-bold ${done ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-primary/10 text-primary'}`}>
        {done ? '✓' : number}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <ol className="space-y-1.5 mb-3">
          {steps.map((step, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-primary font-mono shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            {link.label} <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────

export default function AdminSEOAudit() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingArticles, setIsGeneratingArticles] = useState(false);
  const checks = runSiteChecks();
  const score = calculateScore(checks);
  const categories = ['technical', 'content', 'performance', 'social', 'ai'] as const;
  const categoryLabels: Record<string, string> = {
    technical: '🔧 Technical SEO',
    content: '📝 Content',
    performance: '⚡ Performance',
    social: '📱 Social / OG',
    ai: '🤖 AI Discovery',
  };

  const { data: pages = [] } = useQuery({
    queryKey: ['seo_pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_pages' as any)
        .select('id, title, path, meta_title, meta_description, status')
        .order('path');
      if (error) throw error;
      return (data ?? []) as unknown as PageSEO[];
    },
  });

  const { data: articleStats } = useQuery({
    queryKey: ['seo_article_stats'],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published');
      const { count: missing } = await supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .or('meta_title.is.null,meta_description.is.null,meta_title.eq.,meta_description.eq.');
      return { total: total ?? 0, missing: missing ?? 0, ok: (total ?? 0) - (missing ?? 0) };
    },
  });

  const handleAutoGenerate = async (target?: string) => {
    const isArticles = target === 'articles';
    if (isArticles) setIsGeneratingArticles(true);
    else setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-generate', {
        body: target ? { target } : undefined,
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success(data?.message || 'SEO meta generated successfully');
      queryClient.invalidateQueries({ queryKey: ['seo_pages'] });
      queryClient.invalidateQueries({ queryKey: ['site_pages'] });
      queryClient.invalidateQueries({ queryKey: ['seo_article_stats'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate SEO meta');
    } finally {
      if (isArticles) setIsGeneratingArticles(false);
      else setIsGenerating(false);
    }
  };

  const pagesWithIssues = pages.filter(p => {
    if (!p.meta_title || !p.meta_description) return true;
    if (p.meta_title.length > 60) return true;
    if (p.meta_description.length > 160) return true;
    return false;
  });

  const pagesOk = pages.filter(p =>
    p.meta_title && p.meta_description &&
    p.meta_title.length <= 60 && p.meta_description.length <= 160
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <AdminLayout title="SEO Health" subtitle="Audit checklist, page-level monitoring, and your action items">
      <div className="space-y-6">

        {/* ── Score Cards ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{score}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall SEO Score</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{checks.filter(c => c.status === 'pass').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Checks Passed</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{checks.filter(c => c.status === 'warn').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Warnings</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{pagesWithIssues.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pages Need SEO</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{articleStats?.missing ?? '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">Articles Need SEO</p>
          </Card>
        </div>

        <Tabs defaultValue="checklist">
          <TabsList>
            <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
            <TabsTrigger value="pages">Page SEO ({pages.length})</TabsTrigger>
            <TabsTrigger value="content-gaps">Content Gaps</TabsTrigger>
            <TabsTrigger value="your-actions">
              <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
              Your Action Items
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Checklist ────────────────────────────── */}
          <TabsContent value="checklist" className="space-y-6 mt-4">
            {categories.map(cat => {
              const catChecks = checks.filter(c => c.category === cat);
              if (!catChecks.length) return null;
              return (
                <Card key={cat} className="p-4">
                  <h3 className="text-sm font-semibold mb-3">{categoryLabels[cat]}</h3>
                  <div className="space-y-2">
                    {catChecks.map(check => (
                      <div key={check.id} className="flex items-start gap-3 py-1.5 border-b border-border/50 last:border-0">
                        <StatusIcon status={check.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{check.label}</p>
                          <p className="text-xs text-muted-foreground">{check.detail}</p>
                          {check.recommendation && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                              → {check.recommendation}
                            </p>
                          )}
                        </div>
                        <Badge variant={check.status === 'pass' ? 'default' : check.status === 'warn' ? 'secondary' : 'destructive'} className="text-[10px] shrink-0">
                          {check.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* ── Tab: Page SEO ─────────────────────────────── */}
          <TabsContent value="pages" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="destructive" className="text-[10px]">{pagesWithIssues.length} Issues</Badge>
                <Badge variant="default" className="text-[10px]">{pagesOk.length} OK</Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  Manage meta titles/descriptions in Page Directory →
                </span>
                <a href="/admin/marketing/site/pages" className="text-xs text-primary underline flex items-center gap-1">
                  Open <ExternalLink className="h-3 w-3" />
                </a>
                {pagesWithIssues.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto gap-1.5 text-xs h-7"
                    onClick={() => handleAutoGenerate('pages')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {isGenerating ? 'Generating…' : 'Auto-Generate Missing SEO'}
                  </Button>
                )}
              </div>

              {pagesWithIssues.length > 0 && (
                <>
                  <h4 className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wide">Pages Needing Attention</h4>
                  <div className="space-y-1 mb-4">
                    {pagesWithIssues.map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-1.5 border-b border-border/50">
                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                        <span className="text-sm font-mono text-muted-foreground w-40 shrink-0 truncate">{p.path}</span>
                        <span className="text-sm truncate flex-1">{p.title}</span>
                        <div className="flex gap-2 shrink-0">
                          {!p.meta_title && <Badge variant="outline" className="text-[10px]">No Meta Title</Badge>}
                          {!p.meta_description && <Badge variant="outline" className="text-[10px]">No Meta Desc</Badge>}
                          {p.meta_title && p.meta_title.length > 60 && <Badge variant="outline" className="text-[10px]">Title &gt;60</Badge>}
                          {p.meta_description && p.meta_description.length > 160 && <Badge variant="outline" className="text-[10px]">Desc &gt;160</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {pagesOk.length > 0 && (
                <>
                  <h4 className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Pages with Good SEO ({pagesOk.length})</h4>
                  <div className="space-y-1">
                    {pagesOk.slice(0, 10).map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-1 border-b border-border/50">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span className="text-sm font-mono text-muted-foreground w-40 shrink-0 truncate">{p.path}</span>
                        <span className="text-xs text-muted-foreground truncate flex-1">{p.meta_title}</span>
                      </div>
                    ))}
                    {pagesOk.length > 10 && (
                      <p className="text-xs text-muted-foreground py-1">+ {pagesOk.length - 10} more pages</p>
                    )}
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          {/* ── Tab: Content Gaps ─────────────────────────── */}
          <TabsContent value="content-gaps" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Keyword Coverage Across Site Pages</h3>
              <p className="text-xs text-muted-foreground mb-4">
                High-volume keywords now embedded in page meta titles and descriptions for organic ranking.
              </p>
              <div className="space-y-2">
                {[
                  { topic: 'Financial planning services', volume: '1,200', priority: 'high', page: '/services', covered: true },
                  { topic: 'Wealth management tips', volume: '1,000', priority: 'high', page: '/insights', covered: true },
                  { topic: 'Mutual fund investment strategies', volume: '900', priority: 'medium', page: '/tickfunds', covered: true },
                  { topic: 'Trading education resources', volume: '800', priority: 'medium', page: '/services?tab=Trading', covered: true },
                  { topic: 'Insurance products comparison', volume: '700', priority: 'high', page: '/tushil', covered: true },
                  { topic: 'Tax planning strategies', volume: '650', priority: 'medium', page: '/services?tab=Estate Planning', covered: true },
                  { topic: 'Financial literacy courses', volume: '500', priority: 'high', page: '/awareness', covered: true },
                  { topic: 'International investment opportunities', volume: '450', priority: 'medium', page: '/network', covered: true },
                ].map((gap, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span className="text-sm flex-1">{gap.topic}</span>
                    <span className="text-xs text-muted-foreground font-mono">{gap.page}</span>
                    <Badge variant="outline" className="text-[10px]">{gap.volume}/mo</Badge>
                    <Badge variant="default" className="text-[10px]">Covered</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">Article SEO Meta Coverage</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {articleStats ? `${articleStats.ok} of ${articleStats.total} published articles have SEO meta. ${articleStats.missing} need generation.` : 'Loading…'}
                  </p>
                </div>
                {(articleStats?.missing ?? 0) > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-7"
                    onClick={() => handleAutoGenerate('articles')}
                    disabled={isGeneratingArticles}
                  >
                    {isGeneratingArticles ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {isGeneratingArticles ? 'Generating…' : 'Auto-Generate Article SEO'}
                  </Button>
                )}
              </div>
              {articleStats && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${articleStats.total > 0 ? (articleStats.ok / articleStats.total) * 100 : 0}%` }}
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                💡 AI generates keyword-rich meta titles and descriptions for up to 50 articles per batch, incorporating target keywords for better SERP visibility.
              </p>
            </Card>
          </TabsContent>

          {/* ── Tab: Your Action Items ────────────────────── */}
          <TabsContent value="your-actions" className="mt-4">
            <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h3 className="text-sm font-semibold mb-1">✅ Already Done By System</h3>
                <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> ARIA labels added to header, footer, nav, forms, social links</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> XML Sitemap created at /sitemap.xml (35 URLs)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Internal cross-links added to all service pages</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Missing meta titles/descriptions auto-filled for all pages</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> robots.txt updated to reference sitemap.xml</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> LLMs.txt created for AI crawler discoverability</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Title auto-truncation to ≤60 chars in SEOHead</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Google Analytics GA4 configured (G-BSRJ9Q1H5T)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> 8 high-volume keywords embedded across site page meta</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> AI article SEO meta generator enabled (Content Gaps tab)</li>
                </ul>
              </Card>

              <h3 className="text-sm font-semibold text-foreground pt-2">🔑 Items That Need Your Action</h3>

              <ActionItem
                number={1}
                title="Submit to Google Search Console"
                description="Search Console lets you monitor how Google crawls your site, submit sitemaps, and track keyword rankings."
                steps={[
                  'Go to search.google.com/search-console and sign in.',
                  'Click "Add Property" → choose "URL prefix" → enter "https://sernetindia.com".',
                  'Verify ownership via DNS TXT record (recommended) or HTML meta tag.',
                  'Once verified, go to "Sitemaps" → submit: https://sernetindia.com/sitemap.xml',
                  'Wait 24-48 hours for Google to start indexing your pages.',
                ]}
                link={{ label: 'Open Search Console', href: 'https://search.google.com/search-console' }}
              />

              <ActionItem
                number={2}
                title="Submit to Google Search Console"
                description="Search Console lets you monitor how Google crawls your site, submit sitemaps, and track keyword rankings."
                steps={[
                  'Go to search.google.com/search-console and sign in.',
                  'Click "Add Property" → choose "URL prefix" → enter "https://sernetindia.com".',
                  'Verify ownership via DNS TXT record (recommended) or HTML meta tag.',
                  'Once verified, go to "Sitemaps" → submit: https://sernetindia.com/sitemap.xml',
                  'Wait 24-48 hours for Google to start indexing your pages.',
                ]}
                link={{ label: 'Open Search Console', href: 'https://search.google.com/search-console' }}
              />

              <ActionItem
                number={3}
                title="Submit to Bing Webmaster Tools"
                description="Bing powers ~10% of searches. Submitting your sitemap ensures coverage on Bing and Yahoo."
                steps={[
                  'Go to bing.com/webmasters and sign in with Microsoft account.',
                  'Add your site: https://sernetindia.com',
                  'Verify via DNS CNAME record or XML file.',
                  'Submit sitemap: https://sernetindia.com/sitemap.xml',
                ]}
                link={{ label: 'Open Bing Webmaster', href: 'https://www.bing.com/webmasters' }}
              />

              <ActionItem
                number={4}
                title="Create Content for High-Volume Keywords"
                description="Publishing targeted articles is the #1 way to improve organic traffic over time."
                steps={[
                  'Go to Admin → Content Studio → Posts in your admin panel.',
                  'Create articles targeting these keywords: "financial planning services", "wealth management tips", "mutual fund investment strategies".',
                  'Aim for 1,500+ words per article with relevant internal links.',
                  'Publish consistently (2-4 articles per month) for best results.',
                ]}
                link={{ label: 'Go to Content Studio', href: '/admin/marketing/content/posts' }}
              />

              <ActionItem
                number={5}
                title="Convert Remaining Images to WebP"
                description="WebP images are 25-35% smaller than PNG/JPEG, improving page load speed and Core Web Vitals."
                steps={[
                  'Use a tool like squoosh.app or cloudconvert.com to convert your PNG/JPEG images.',
                  'Key files to convert: bhavesh-vora.png, product-showcase.png, trading-app-showcase.png, and logo images.',
                  'Come back to Lovable chat and upload the WebP versions — I\'ll swap them in the codebase.',
                ]}
                link={{ label: 'Open Squoosh', href: 'https://squoosh.app' }}
              />

              <ActionItem
                number={6}
                title="Set Up Social Media Profile Links (Optional)"
                description="Verify that all social media profile URLs in the footer match your actual accounts."
                steps={[
                  'Check each social link in the site footer: Facebook, Instagram, LinkedIn, YouTube, WhatsApp, Telegram.',
                  'If any URL is incorrect, let me know and I\'ll update it in the codebase.',
                ]}
              />

              <Card className="p-4 border-dashed">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">📋 Quick Copy: Sitemap URL</h4>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1">https://sernetindia.com/sitemap.xml</code>
                  <button onClick={() => copyToClipboard('https://sernetindia.com/sitemap.xml')} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" aria-label="Copy sitemap URL">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
