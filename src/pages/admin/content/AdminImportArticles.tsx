import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Download, CheckCircle2, XCircle, Loader2, RefreshCw, List, BarChart3 } from 'lucide-react';

export default function AdminImportArticles() {
  const [phase, setPhase] = useState<'idle' | 'listing' | 'scraping' | 'done'>('idle');
  const [urls, setUrls] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [summary, setSummary] = useState({ inserted: 0, updated: 0, skipped: 0, errors: 0 });
  const [log, setLog] = useState<string[]>([]);
  const [rescrapePhase, setRescrapePhase] = useState<'idle' | 'listing' | 'scraping' | 'done'>('idle');
  const [rescrapeCurrent, setRescrapeCurrent] = useState(0);
  const [rescrapeTotal, setRescrapeTotal] = useState(0);
  const [rescrapeSummary, setRescrapeSummary] = useState({ updated: 0, errors: 0, noChanges: 0 });

  // Analysis state
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'matching' | 'scraping' | 'done'>('idle');
  const [analysisCurrent, setAnalysisCurrent] = useState(0);
  const [analysisTotal, setAnalysisTotal] = useState(0);
  const [analysisSummary, setAnalysisSummary] = useState({ updated: 0, errors: 0, noData: 0 });

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 500));

  const anyRunning = phase === 'listing' || phase === 'scraping' || rescrapePhase === 'listing' || rescrapePhase === 'scraping' || analysisPhase === 'matching' || analysisPhase === 'scraping';

  const runImport = async () => {
    setPhase('listing');
    setUrls([]);
    setCurrent(0);
    setLog([]);
    setSummary({ inserted: 0, updated: 0, skipped: 0, errors: 0 });

    addLog('🔍 Fetching article list from sernetindia.com/blog-dynamic/...');

    let allUrls: string[] = [];
    try {
      const { data, error } = await supabase.functions.invoke('wp-import', {
        body: { action: 'list' },
      });
      if (error || !data?.success) {
        addLog(`❌ Failed to fetch list: ${error?.message || data?.error}`);
        setPhase('idle');
        return;
      }
      allUrls = data.urls || [];
      setUrls(allUrls);
      addLog(`✅ Found ${allUrls.length} article URLs. Starting scrape...`);
    } catch (err) {
      addLog(`💥 Fatal: ${String(err)}`);
      setPhase('idle');
      return;
    }

    setPhase('scraping');
    let inserted = 0, updated = 0, skipped = 0, errors = 0;
    const BATCH = 5;

    for (let i = 0; i < allUrls.length; i += BATCH) {
      const batch = allUrls.slice(i, i + BATCH);
      setCurrent(i + batch.length);

      await Promise.all(batch.map(async (url) => {
        try {
          const { data, error } = await supabase.functions.invoke('wp-import', {
            body: { action: 'scrape_one', article_url: url },
          });
          if (error || !data?.success) {
            errors++;
            addLog(`❌ ${url.split('/').slice(-2, -1)[0]}: ${error?.message || data?.error}`);
          } else if (data.action === 'inserted') {
            inserted++;
            addLog(`✅ NEW: ${data.title || url.split('/').slice(-2, -1)[0]}`);
          } else if (data.action === 'updated') {
            updated++;
            addLog(`🔄 UPDATED: ${data.title || url.split('/').slice(-2, -1)[0]}`);
          } else {
            skipped++;
          }
        } catch (err) {
          errors++;
          addLog(`💥 ${url}: ${String(err)}`);
        }
      }));

      setSummary({ inserted, updated, skipped, errors });
      if (i + BATCH < allUrls.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    addLog(`🎉 Done! ${inserted} new, ${updated} updated, ${skipped} skipped, ${errors} errors`);
    setPhase('done');
  };

  const runRescrape = async () => {
    setRescrapePhase('listing');
    setRescrapeCurrent(0);
    setRescrapeSummary({ updated: 0, errors: 0, noChanges: 0 });

    addLog('🔄 Fetching existing articles for re-scrape...');

    let allUrls: string[] = [];
    try {
      const { data, error } = await supabase.functions.invoke('wp-import', {
        body: { action: 'list_existing' },
      });
      if (error || !data?.success) {
        addLog(`❌ Failed to fetch existing list: ${error?.message || data?.error}`);
        setRescrapePhase('idle');
        return;
      }
      allUrls = data.urls || [];
      setRescrapeTotal(allUrls.length);
      addLog(`✅ Found ${allUrls.length} existing articles. Re-scraping...`);
    } catch (err) {
      addLog(`💥 Fatal: ${String(err)}`);
      setRescrapePhase('idle');
      return;
    }

    setRescrapePhase('scraping');
    let updated = 0, errors = 0, noChanges = 0;
    const BATCH = 3;

    for (let i = 0; i < allUrls.length; i += BATCH) {
      const batch = allUrls.slice(i, i + BATCH);
      setRescrapeCurrent(i + batch.length);

      await Promise.all(batch.map(async (url) => {
        try {
          const { data, error } = await supabase.functions.invoke('wp-import', {
            body: { action: 'rescrape_one', article_url: url },
          });
          if (error || !data?.success) {
            errors++;
            addLog(`❌ ${url.split('/').slice(-2, -1)[0]}: ${error?.message || data?.error}`);
          } else if (data.action === 'rescrape_updated') {
            updated++;
            addLog(`✅ RESCRAPE: ${data.title || url.split('/').slice(-2, -1)[0]}`);
          } else {
            noChanges++;
          }
        } catch (err) {
          errors++;
          addLog(`💥 ${url}: ${String(err)}`);
        }
      }));

      setRescrapeSummary({ updated, errors, noChanges });
      if (i + BATCH < allUrls.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    addLog(`🎉 Re-scrape done! ${updated} updated, ${noChanges} unchanged, ${errors} errors`);
    setRescrapePhase('done');
  };

  const runAnalysisRescrape = async () => {
    setAnalysisPhase('matching');
    setAnalysisCurrent(0);
    setAnalysisSummary({ updated: 0, errors: 0, noData: 0 });

    addLog('📊 Matching analyses to WordPress URLs by title...');

    let items: { id: string; title: string; url: string }[] = [];
    try {
      const { data, error } = await supabase.functions.invoke('wp-import', {
        body: { action: 'match_analyses' },
      });
      if (error || !data?.success) {
        addLog(`❌ Failed to match analyses: ${error?.message || data?.error}`);
        setAnalysisPhase('idle');
        return;
      }
      items = data.items || [];
      setAnalysisTotal(items.length);
      addLog(`✅ Found ${items.length} analyses without source_url. Scraping from WP...`);
    } catch (err) {
      addLog(`💥 Fatal: ${String(err)}`);
      setAnalysisPhase('idle');
      return;
    }

    setAnalysisPhase('scraping');
    let updated = 0, errors = 0, noData = 0;
    const BATCH = 3;

    for (let i = 0; i < items.length; i += BATCH) {
      const batch = items.slice(i, i + BATCH);
      setAnalysisCurrent(i + batch.length);

      await Promise.all(batch.map(async (item) => {
        try {
          const { data, error } = await supabase.functions.invoke('wp-import', {
            body: { action: 'rescrape_analysis', article_url: item.url, analysis_id: item.id },
          });
          if (error || !data?.success) {
            errors++;
            addLog(`❌ ${item.title}: ${error?.message || data?.error}`);
          } else if (data.action === 'rescrape_updated') {
            updated++;
            addLog(`✅ ANALYSIS: ${data.title || item.title}`);
          } else {
            noData++;
            addLog(`⚠️ NO DATA: ${item.title} → ${item.url}`);
          }
        } catch (err) {
          errors++;
          addLog(`💥 ${item.title}: ${String(err)}`);
        }
      }));

      setAnalysisSummary({ updated, errors, noData });
      if (i + BATCH < items.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    addLog(`🎉 Analysis re-scrape done! ${updated} updated, ${noData} no data, ${errors} errors`);
    setAnalysisPhase('done');
  };

  const progress = urls.length > 0 ? Math.round((current / urls.length) * 100) : 0;
  const rescrapeProgress = rescrapeTotal > 0 ? Math.round((rescrapeCurrent / rescrapeTotal) * 100) : 0;
  const analysisProgress = analysisTotal > 0 ? Math.round((analysisCurrent / analysisTotal) * 100) : 0;

  return (
    <AdminLayout title="Import Content" subtitle="Sync articles & analyses from sernetindia.com blog">
      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Articles</TabsTrigger>
            <TabsTrigger value="analyses" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analyses</TabsTrigger>
          </TabsList>

          {/* ── ARTICLES TAB ── */}
          <TabsContent value="articles">
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">
                Scrapes articles from <code className="bg-muted px-1.5 py-0.5 rounded text-xs">sernetindia.com/blog-dynamic/</code>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Found', value: urls.length, icon: List, color: 'text-primary' },
                { label: 'New Articles', value: summary.inserted, icon: CheckCircle2, color: 'text-green-600' },
                { label: 'Updated', value: summary.updated, icon: RefreshCw, color: 'text-blue-600' },
                { label: 'Errors', value: summary.errors, icon: XCircle, color: 'text-destructive' },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(phase === 'listing' || phase === 'scraping') && (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {phase === 'listing' ? 'Fetching article list...' : `Scraping article ${current} of ${urls.length}`}
                    </span>
                    <Badge variant="secondary">{phase === 'listing' ? '...' : `${progress}%`}</Badge>
                  </div>
                  <Progress value={phase === 'listing' ? undefined : progress} className="h-2" />
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <Button onClick={runImport} disabled={anyRunning} size="lg" className="gap-2">
                {phase === 'listing' ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching list...</>
                  : phase === 'scraping' ? <><Loader2 className="h-4 w-4 animate-spin" /> Scraping {current}/{urls.length}...</>
                  : phase === 'done' ? <><RefreshCw className="h-4 w-4" /> Re-run Import</>
                  : <><Download className="h-4 w-4" /> Start Full Import</>}
              </Button>
              <Button onClick={runRescrape} disabled={anyRunning} size="lg" variant="secondary" className="gap-2">
                {rescrapePhase === 'listing' ? <><Loader2 className="h-4 w-4 animate-spin" /> Listing...</>
                  : rescrapePhase === 'scraping' ? <><Loader2 className="h-4 w-4 animate-spin" /> Re-scraping {rescrapeCurrent}/{rescrapeTotal}...</>
                  : <><RefreshCw className="h-4 w-4" /> Re-scrape All</>}
              </Button>
              {phase === 'done' && <Badge variant="outline" className="px-4 flex items-center gap-1 border-primary/30 text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Import Complete</Badge>}
              {rescrapePhase === 'done' && <Badge variant="outline" className="px-4 flex items-center gap-1 border-primary/30 text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Re-scrape Complete — {rescrapeSummary.updated} updated</Badge>}
            </div>

            {(rescrapePhase === 'listing' || rescrapePhase === 'scraping') && (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {rescrapePhase === 'listing' ? 'Fetching existing articles...' : `Re-scraping ${rescrapeCurrent} of ${rescrapeTotal}`}
                    </span>
                    <Badge variant="secondary">{rescrapePhase === 'listing' ? '...' : `${rescrapeProgress}%`}</Badge>
                  </div>
                  <Progress value={rescrapePhase === 'listing' ? undefined : rescrapeProgress} className="h-2" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── ANALYSES TAB ── */}
          <TabsContent value="analyses">
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">
                Matches analyses to WordPress blog URLs by title, then re-scrapes with the improved parser to fix titles, images, and body content.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Updated', value: analysisSummary.updated, icon: CheckCircle2, color: 'text-green-600' },
                { label: 'No WP Data', value: analysisSummary.noData, icon: List, color: 'text-amber-600' },
                { label: 'Errors', value: analysisSummary.errors, icon: XCircle, color: 'text-destructive' },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(analysisPhase === 'matching' || analysisPhase === 'scraping') && (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {analysisPhase === 'matching' ? 'Matching analyses to WP URLs...' : `Scraping ${analysisCurrent} of ${analysisTotal}`}
                    </span>
                    <Badge variant="secondary">{analysisPhase === 'matching' ? '...' : `${analysisProgress}%`}</Badge>
                  </div>
                  <Progress value={analysisPhase === 'matching' ? undefined : analysisProgress} className="h-2" />
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <Button onClick={runAnalysisRescrape} disabled={anyRunning} size="lg" className="gap-2">
                {analysisPhase === 'matching' ? <><Loader2 className="h-4 w-4 animate-spin" /> Matching...</>
                  : analysisPhase === 'scraping' ? <><Loader2 className="h-4 w-4 animate-spin" /> Scraping {analysisCurrent}/{analysisTotal}...</>
                  : analysisPhase === 'done' ? <><RefreshCw className="h-4 w-4" /> Re-run Analysis Scrape</>
                  : <><BarChart3 className="h-4 w-4" /> Fix All Analyses (Title + Image + Body)</>}
              </Button>
              {analysisPhase === 'done' && (
                <Badge variant="outline" className="px-4 flex items-center gap-1 border-primary/30 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Analysis Scrape Complete — {analysisSummary.updated} fixed
                </Badge>
              )}
            </div>

            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium text-sm mb-2">How this works</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Finds all analyses without a <code className="bg-muted px-1 rounded">source_url</code> (not yet linked to WP)</li>
                  <li>• Converts their slug-like titles (e.g. "Rbi Policy 4") to WP blog URLs</li>
                  <li>• Scrapes each matched URL for: proper title, featured image, excerpt, cleaned body</li>
                  <li>• Removes TOC blocks, converts HTML tables to Markdown, promotes H3→H2</li>
                  <li>• Items where no WP page is found are marked — these may need manual editing</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Shared Log */}
        {log.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Import Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 rounded-lg p-3 h-80 overflow-y-auto font-mono text-xs space-y-0.5">
                {log.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith('❌') || line.startsWith('💥') ? 'text-destructive'
                      : line.startsWith('✅') ? 'text-green-700 dark:text-green-400'
                      : line.startsWith('🔄') ? 'text-primary'
                      : line.startsWith('🎉') ? 'text-primary font-semibold'
                      : line.startsWith('⚠️') ? 'text-amber-600 dark:text-amber-400'
                      : line.startsWith('📊') ? 'text-primary'
                      : 'text-muted-foreground'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}