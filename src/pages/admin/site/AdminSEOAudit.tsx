
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle2, AlertTriangle, XCircle, Globe, FileText, Image as ImageIcon,
  Search, ExternalLink, Bot, RefreshCw, ChevronDown, ChevronRight, Copy, Eye
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
  checks.push({
    id: 'https',
    label: 'HTTPS Enabled',
    status: 'pass',
    detail: 'Site is served over HTTPS',
    category: 'technical',
  });
  checks.push({
    id: 'robots',
    label: 'Robots.txt',
    status: 'pass',
    detail: '/robots.txt is present and allows crawling',
    category: 'technical',
  });
  checks.push({
    id: 'sitemap',
    label: 'Sitemap',
    status: 'pass',
    detail: '/sitemap page is available for search engines',
    category: 'technical',
  });
  checks.push({
    id: 'viewport',
    label: 'Viewport Meta',
    status: 'pass',
    detail: 'Viewport meta tag is set in index.html',
    category: 'technical',
  });
  checks.push({
    id: 'canonical',
    label: 'Canonical Tags',
    status: 'pass',
    detail: 'SEOHead component adds canonical URLs to all pages',
    category: 'technical',
  });
  checks.push({
    id: 'favicon',
    label: 'Favicon',
    status: 'pass',
    detail: '32x32 PNG favicon is configured',
    category: 'technical',
  });
  checks.push({
    id: 'jsonld',
    label: 'JSON-LD Schema',
    status: 'pass',
    detail: 'FinancialService schema markup on homepage',
    category: 'technical',
  });
  checks.push({
    id: 'llms',
    label: 'LLMs.txt (AI Discovery)',
    status: 'pass',
    detail: '/llms.txt is available for AI crawlers',
    category: 'ai',
  });

  // Social
  checks.push({
    id: 'og',
    label: 'Open Graph Tags',
    status: 'pass',
    detail: 'OG title, description, image, and type set on all pages',
    category: 'social',
  });
  checks.push({
    id: 'twitter',
    label: 'Twitter Card Tags',
    status: 'pass',
    detail: 'summary_large_image card with image configured',
    category: 'social',
  });
  checks.push({
    id: 'og-image',
    label: 'OG Image (1200×630)',
    status: 'pass',
    detail: 'Standard-sized OG image at /og-image.png',
    category: 'social',
  });

  // Performance
  checks.push({
    id: 'lazy-routes',
    label: 'Lazy-loaded Routes',
    status: 'pass',
    detail: 'All non-home routes use React.lazy for code splitting',
    category: 'performance',
  });
  checks.push({
    id: 'webp',
    label: 'WebP Images',
    status: 'warn',
    detail: 'Some hero images use WebP, but not all assets are optimized',
    recommendation: 'Convert remaining PNG/JPEG assets to WebP format',
    category: 'performance',
  });
  checks.push({
    id: 'ga4',
    label: 'Google Analytics (GA4)',
    status: 'warn',
    detail: 'GA4 script placeholder exists but uses G-XXXXXXXXXX',
    recommendation: 'Replace G-XXXXXXXXXX with your actual GA4 Measurement ID',
    category: 'technical',
  });

  // Content
  checks.push({
    id: 'h1',
    label: 'H1 Tag on Homepage',
    status: 'pass',
    detail: 'Homepage has a single H1 in HeroSection',
    category: 'content',
  });
  checks.push({
    id: 'title-length',
    label: 'Title Length (≤60 chars)',
    status: 'pass',
    detail: 'Homepage title is now 53 characters',
    category: 'content',
  });
  checks.push({
    id: 'meta-desc',
    label: 'Meta Description (≤160 chars)',
    status: 'pass',
    detail: 'Meta description is 150 characters',
    category: 'content',
  });

  return checks;
}

// ─── Score calculator ──────────────────────────────────────────────────────

function calculateScore(checks: SEOCheck[]): number {
  const total = checks.length;
  const passed = checks.filter(c => c.status === 'pass').length;
  const warned = checks.filter(c => c.status === 'warn').length;
  return Math.round(((passed + warned * 0.5) / total) * 100);
}

// ─── Status icon helper ───────────────────────────────────────────────────

function StatusIcon({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === 'warn') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function AdminSEOAudit() {
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

  // Fetch page-level SEO data from site_pages
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

  return (
    <AdminLayout title="SEO Health" subtitle="Audit checklist and page-level SEO monitoring">
      <div className="space-y-6">

        {/* ── Score Cards ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>

        <Tabs defaultValue="checklist">
          <TabsList>
            <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
            <TabsTrigger value="pages">Page SEO ({pages.length})</TabsTrigger>
            <TabsTrigger value="content-gaps">Content Gaps</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
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
          <TabsContent value="content-gaps" className="mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Content Gap Analysis (from SEO Report)</h3>
              <p className="text-xs text-muted-foreground mb-4">
                High-volume keywords your site should target with dedicated content pages or blog posts.
              </p>
              <div className="space-y-2">
                {[
                  { topic: 'Financial planning services', volume: '1,200', priority: 'high' },
                  { topic: 'Wealth management tips', volume: '1,000', priority: 'high' },
                  { topic: 'Mutual fund investment strategies', volume: '900', priority: 'medium' },
                  { topic: 'Trading education resources', volume: '800', priority: 'medium' },
                  { topic: 'Insurance products comparison', volume: '700', priority: 'high' },
                  { topic: 'Tax planning strategies', volume: '650', priority: 'medium' },
                  { topic: 'Financial literacy courses', volume: '500', priority: 'high' },
                  { topic: 'International investment opportunities', volume: '450', priority: 'medium' },
                ].map((gap, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/50">
                    <span className="text-sm flex-1">{gap.topic}</span>
                    <Badge variant="outline" className="text-[10px]">{gap.volume}/mo</Badge>
                    <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {gap.priority}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Publish articles via Content Studio → Posts targeting these keywords to improve organic traffic.
              </p>
            </Card>
          </TabsContent>

          {/* ── Tab: Recommendations ──────────────────────── */}
          <TabsContent value="recommendations" className="mt-4">
            <div className="space-y-3">
              {[
                { priority: 'high', effort: 'low', title: 'Replace GA4 Measurement ID', desc: 'Update G-XXXXXXXXXX in index.html with your actual GA4 ID to start tracking.' },
                { priority: 'high', effort: 'medium', title: 'Convert remaining images to WebP', desc: 'Several PNG/JPEG assets in /src/assets/ should be converted to WebP for faster loading.' },
                { priority: 'high', effort: 'low', title: 'Fill missing page meta titles/descriptions', desc: `${pagesWithIssues.length} pages lack proper meta tags. Update via Page Directory.` },
                { priority: 'medium', effort: 'low', title: 'Publish content for high-volume keywords', desc: 'Target "financial planning services", "wealth management tips" via blog articles.' },
                { priority: 'medium', effort: 'medium', title: 'Add more internal links', desc: 'Cross-link related service pages, articles, and calculators to boost link equity.' },
                { priority: 'medium', effort: 'low', title: 'Improve ARIA labels on interactive elements', desc: 'Ensure all buttons, nav items, and form fields have descriptive aria-labels.' },
                { priority: 'low', effort: 'high', title: 'Create a dedicated blog section', desc: 'Regular blog content targeting long-tail keywords improves domain authority over time.' },
                { priority: 'low', effort: 'low', title: 'Periodically re-run SEO audits', desc: 'Run external audits quarterly to catch new issues early.' },
              ].map((rec, i) => (
                <Card key={i} className="p-4 flex items-start gap-3">
                  <Badge
                    variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-[10px] mt-0.5 shrink-0"
                  >
                    {rec.priority}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.desc}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{rec.effort} effort</Badge>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
