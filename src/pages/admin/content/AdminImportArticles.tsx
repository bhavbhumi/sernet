import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Download, CheckCircle2, XCircle, SkipForward, Loader2, RefreshCw, List } from 'lucide-react';

export default function AdminImportArticles() {
  const [phase, setPhase] = useState<'idle' | 'listing' | 'scraping' | 'done'>('idle');
  const [urls, setUrls] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [summary, setSummary] = useState({ inserted: 0, updated: 0, skipped: 0, errors: 0 });
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 300));

  const runImport = async () => {
    setPhase('listing');
    setUrls([]);
    setCurrent(0);
    setLog([]);
    setSummary({ inserted: 0, updated: 0, skipped: 0, errors: 0 });

    addLog('🔍 Fetching article list from sernetindia.com/blog-dynamic/...');

    // Phase 1: Get all URLs
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

    // Phase 2: Scrape each article in batches of 5
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
            addLog(`✅ NEW: ${url.split('/').slice(-2, -1)[0]}`);
          } else if (data.action === 'updated') {
            updated++;
            addLog(`🔄 UPDATED: ${url.split('/').slice(-2, -1)[0]}`);
          } else {
            skipped++;
          }
        } catch (err) {
          errors++;
          addLog(`💥 ${url}: ${String(err)}`);
        }
      }));

      setSummary({ inserted, updated, skipped, errors });

      // Brief pause between batches to avoid rate limiting
      if (i + BATCH < allUrls.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    addLog(`🎉 Done! ${inserted} new, ${updated} updated, ${skipped} skipped, ${errors} errors`);
    setPhase('done');
  };

  const progress = urls.length > 0 ? Math.round((current / urls.length) * 100) : 0;
  const isRunning = phase === 'listing' || phase === 'scraping';

  return (
    <AdminLayout title="Import Articles" subtitle="Sync all articles from sernetindia.com blog">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Scrapes every article from <code className="bg-muted px-1.5 py-0.5 rounded text-xs">sernetindia.com/blog-dynamic/</code> — fetching full body content, thumbnails, categories, and publish dates for all 750+ articles.
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

        {isRunning && (
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

        <div className="flex gap-3 mb-6">
          <Button onClick={runImport} disabled={isRunning} size="lg" className="gap-2">
            {phase === 'listing' ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching list...</>
              : phase === 'scraping' ? <><Loader2 className="h-4 w-4 animate-spin" /> Scraping {current}/{urls.length}...</>
              : phase === 'done' ? <><RefreshCw className="h-4 w-4" /> Re-run Import</>
              : <><Download className="h-4 w-4" /> Start Full Import</>}
          </Button>
          {phase === 'done' && (
            <Badge variant="outline" className="px-4 flex items-center gap-1 border-green-300 text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Import Complete
            </Badge>
          )}
        </div>

        {log.length > 0 && (
          <Card>
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

        <Card className="mt-6">
          <CardContent className="pt-4">
            <h3 className="font-medium text-sm mb-2">How this works</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Phase 1:</strong> Scrapes <code className="bg-muted px-1 rounded">blog-dynamic/</code> listing to collect all article URLs</li>
              <li>• <strong>Phase 2:</strong> Scrapes each article page individually in batches of 5</li>
              <li>• Extracts: title, thumbnail (og:image), date, excerpt (meta description), and full body text</li>
              <li>• Existing articles are updated if their body content is missing</li>
              <li>• New articles (2019 onwards) are created with correct dates and categories</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
