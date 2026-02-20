import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  Upload, CheckCircle2, XCircle, Loader2, RefreshCw, FileSpreadsheet,
  Info, AlertTriangle, Globe, Zap, Calendar
} from 'lucide-react';

// ─── CSV column mapping for both sources ─────────────────────────────────────

// investing.com CSV columns (typical export):
// Date | Time | Currency | Importance | Event | Actual | Forecast | Previous
//
// tradingeconomics.com CSV columns (typical export):
// Date | Country | Category | Event | Actual | Previous | Forecast | TEForecast | Unit | URL

type ParsedEvent = {
  event_date: string;
  event_time: string | null;
  event_name: string;
  country: string;
  impact: string;
  category: string;
  actual_value: string | null;
  forecast_value: string | null;
  previous_value: string | null;
  status: string;
};

function normaliseCountry(raw: string): string {
  const map: Record<string, string> = {
    IN: 'India', IND: 'India', INDIA: 'India',
    US: 'USA', USA: 'USA', UNITED_STATES: 'USA', 'UNITED STATES': 'USA',
    EU: 'Europe', EUR: 'Europe', EURO_AREA: 'Europe', 'EURO AREA': 'Europe', EUROZONE: 'Europe',
    GB: 'UK', GBR: 'UK', UK: 'UK', 'UNITED KINGDOM': 'UK',
    CN: 'China', CHN: 'China', CHINA: 'China',
    JP: 'Japan', JPN: 'Japan', JAPAN: 'Japan',
    GLOBAL: 'Global',
  };
  return map[raw.toUpperCase().replace(/[\s-]/g, '_')] || raw;
}

function normaliseImpact(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes('high') || r === '3' || r === '***') return 'high';
  if (r.includes('medium') || r.includes('med') || r === '2' || r === '**') return 'medium';
  return 'low';
}

function normaliseCategory(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes('rate') || r.includes('interest')) return 'Interest Rates';
  if (r.includes('inflation') || r.includes('cpi') || r.includes('ppi') || r.includes('price')) return 'Inflation Data';
  if (r.includes('gdp') || r.includes('growth')) return 'GDP & Growth';
  if (r.includes('trade') || r.includes('export') || r.includes('import') || r.includes('balance')) return 'Trade Data';
  if (r.includes('employ') || r.includes('job') || r.includes('unemp') || r.includes('nfp') || r.includes('payroll')) return 'Employment';
  if (r.includes('manufactur') || r.includes('pmi') || r.includes('industrial')) return 'Manufacturing';
  return 'General';
}

// Parse investing.com CSV format
function parseInvestingCsv(text: string): ParsedEvent[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  // Skip header
  return lines.slice(1).map(line => {
    // investing.com uses semicolons or commas — handle both
    const sep = line.includes(';') ? ';' : ',';
    const cols = line.split(sep).map(c => c.replace(/^"|"$/g, '').trim());
    // Date | Time | Currency | Importance | Event | Actual | Forecast | Previous
    const [date, time, currency, importance, event, actual, forecast, previous] = cols;
    if (!date || !event) return null;
    // Convert date from DD/MM/YYYY or MM/DD/YYYY to YYYY-MM-DD
    let isoDate = date;
    const parts = date.split('/');
    if (parts.length === 3) {
      // investing.com typically MM/DD/YYYY
      isoDate = `${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`;
    }
    return {
      event_date: isoDate,
      event_time: time?.trim() || null,
      event_name: event,
      country: normaliseCountry(currency || 'Global'),
      impact: normaliseImpact(importance || ''),
      category: normaliseCategory(event),
      actual_value: actual?.trim() || null,
      forecast_value: forecast?.trim() || null,
      previous_value: previous?.trim() || null,
      status: 'published',
    } as ParsedEvent;
  }).filter(Boolean) as ParsedEvent[];
}

// Parse tradingeconomics.com CSV format
function parseTradingEconCsv(text: string): ParsedEvent[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  const idx = (name: string) => header.findIndex(h => h.includes(name));
  const dateIdx = idx('date');
  const countryIdx = idx('country');
  const categoryIdx = idx('category');
  const eventIdx = idx('event');
  const actualIdx = idx('actual');
  const prevIdx = idx('previous');
  const forecastIdx = idx('forecast');
  const impactIdx = idx('importance');

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
    const date = cols[dateIdx >= 0 ? dateIdx : 0];
    const event = cols[eventIdx >= 0 ? eventIdx : 3];
    if (!date || !event) return null;
    // tradingeconomics: YYYY-MM-DD HH:MM:SS or YYYY-MM-DD
    const [datePart, timePart] = date.split(' ');
    return {
      event_date: datePart,
      event_time: timePart?.substring(0, 5) || null,
      event_name: event,
      country: normaliseCountry(countryIdx >= 0 ? cols[countryIdx] : 'Global'),
      impact: impactIdx >= 0 ? normaliseImpact(cols[impactIdx]) : 'medium',
      category: categoryIdx >= 0 ? normaliseCategory(cols[categoryIdx]) : normaliseCategory(event),
      actual_value: actualIdx >= 0 ? (cols[actualIdx] || null) : null,
      forecast_value: forecastIdx >= 0 ? (cols[forecastIdx] || null) : null,
      previous_value: prevIdx >= 0 ? (cols[prevIdx] || null) : null,
      status: 'published',
    } as ParsedEvent;
  }).filter(Boolean) as ParsedEvent[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminImportEconomicEvents() {
  const [source, setSource] = useState<'investing' | 'tradingeconomics'>('investing');
  const [phase, setPhase] = useState<'idle' | 'parsing' | 'importing' | 'done'>('idle');
  const [parsed, setParsed] = useState<ParsedEvent[]>([]);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({ inserted: 0, updated: 0, errors: 0 });
  const [log, setLog] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 500));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhase('parsing');
    setLog([]);
    setParsed([]);
    setSummary({ inserted: 0, updated: 0, errors: 0 });

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const events = source === 'investing' ? parseInvestingCsv(text) : parseTradingEconCsv(text);
        setParsed(events);
        addLog(`✅ Parsed ${events.length} events from ${file.name}`);
        const countries = [...new Set(events.map(e => e.country))];
        addLog(`🌍 Countries detected: ${countries.join(', ')}`);
        const years = [...new Set(events.map(e => e.event_date?.slice(0, 4)))].filter(Boolean);
        addLog(`📅 Years: ${years.join(', ')}`);
        setPhase('idle');
      } catch (err) {
        addLog(`❌ Parse error: ${String(err)}`);
        setPhase('idle');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const runImport = async () => {
    if (!parsed.length) return;
    setPhase('importing');
    setProgress(0);
    let inserted = 0, updated = 0, errors = 0;
    const BATCH = 20;

    for (let i = 0; i < parsed.length; i += BATCH) {
      const batch = parsed.slice(i, i + BATCH);
      try {
        // Upsert on (event_date, event_name, country) composite
        const { data, error } = await supabase
          .from('economic_events')
          .upsert(
            batch.map(ev => ({
              event_date: ev.event_date,
              event_time: ev.event_time,
              event_name: ev.event_name,
              country: ev.country,
              impact: ev.impact,
              category: ev.category,
              actual_value: ev.actual_value,
              forecast_value: ev.forecast_value,
              previous_value: ev.previous_value,
              status: ev.status,
            })),
            { onConflict: 'event_date,event_name,country', ignoreDuplicates: false }
          );
        if (error) {
          errors += batch.length;
          addLog(`❌ Batch ${Math.ceil((i + 1) / BATCH)}: ${error.message}`);
        } else {
          inserted += batch.length;
          addLog(`✅ Batch ${Math.ceil((i + 1) / BATCH)}: ${batch.length} rows upserted`);
        }
      } catch (err) {
        errors += batch.length;
        addLog(`💥 Batch error: ${String(err)}`);
      }
      setProgress(Math.round(((i + batch.length) / parsed.length) * 100));
      setSummary({ inserted, updated, errors });
      await new Promise(r => setTimeout(r, 100));
    }

    addLog(`🎉 Done! ${inserted} upserted, ${errors} errors`);
    setPhase('done');
  };

  const isRunning = phase === 'parsing' || phase === 'importing';

  return (
    <AdminLayout title="Import Economic Events" subtitle="Bulk import economic calendar data from CSV exports">
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Instructions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium text-foreground">How to get the CSV files</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mb-1">
                      <Globe className="h-3.5 w-3.5" /> investing.com
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-xs">
                      <li>Go to <code className="bg-muted px-1 rounded">investing.com/economic-calendar</code></li>
                      <li>Set date range (e.g. 2026 full year)</li>
                      <li>Filter countries: India, USA, Europe, UK, China, Japan</li>
                      <li>Click <strong>Download CSV</strong> button (top right)</li>
                      <li>Select <strong>investing.com</strong> source above</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mb-1">
                      <Zap className="h-3.5 w-3.5" /> tradingeconomics.com
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-xs">
                      <li>Go to <code className="bg-muted px-1 rounded">tradingeconomics.com/calendar</code></li>
                      <li>Filter by country and date range</li>
                      <li>Click the <strong>Excel/CSV</strong> export icon</li>
                      <li>Select <strong>tradingeconomics</strong> source above</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source selector + file upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 1 — Select CSV Source & Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={source} onValueChange={(v) => setSource(v as 'investing' | 'tradingeconomics')}>
              <TabsList>
                <TabsTrigger value="investing" className="gap-2">
                  <Globe className="h-3.5 w-3.5" /> investing.com
                </TabsTrigger>
                <TabsTrigger value="tradingeconomics" className="gap-2">
                  <Zap className="h-3.5 w-3.5" /> tradingeconomics.com
                </TabsTrigger>
              </TabsList>
              <TabsContent value="investing">
                <p className="text-xs text-muted-foreground mt-2">
                  Expected columns: <code className="bg-muted px-1 rounded">Date, Time, Currency, Importance, Event, Actual, Forecast, Previous</code>
                </p>
              </TabsContent>
              <TabsContent value="tradingeconomics">
                <p className="text-xs text-muted-foreground mt-2">
                  Expected columns: <code className="bg-muted px-1 rounded">Date, Country, Category, Event, Actual, Previous, Forecast, Unit</code>
                </p>
              </TabsContent>
            </Tabs>

            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Click to upload CSV file</p>
              <p className="text-sm text-muted-foreground mt-1">Supports .csv files exported from {source === 'investing' ? 'investing.com' : 'tradingeconomics.com'}</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFile}
                disabled={isRunning}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {parsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Step 2 — Preview & Import</span>
                <Badge variant="secondary">{parsed.length} events parsed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Events', value: parsed.length },
                  { label: 'Countries', value: [...new Set(parsed.map(e => e.country))].length },
                  { label: 'High Impact', value: parsed.filter(e => e.impact === 'high').length },
                  { label: 'With Actuals', value: parsed.filter(e => e.actual_value).length },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Country breakdown */}
              <div className="flex flex-wrap gap-2">
                {[...new Set(parsed.map(e => e.country))].map(c => (
                  <Badge key={c} variant="outline" className="text-xs">
                    {c}: {parsed.filter(e => e.country === c).length}
                  </Badge>
                ))}
              </div>

              {/* Sample table */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Date', 'Time', 'Country', 'Event', 'Impact', 'Forecast', 'Actual'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, 8).map((ev, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-3 py-1.5">{ev.event_date}</td>
                        <td className="px-3 py-1.5">{ev.event_time || '—'}</td>
                        <td className="px-3 py-1.5">{ev.country}</td>
                        <td className="px-3 py-1.5 max-w-[200px] truncate">{ev.event_name}</td>
                        <td className="px-3 py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            ev.impact === 'high' ? 'bg-destructive/10 text-destructive'
                            : ev.impact === 'medium' ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                          }`}>{ev.impact}</span>
                        </td>
                        <td className="px-3 py-1.5">{ev.forecast_value || '—'}</td>
                        <td className="px-3 py-1.5">{ev.actual_value || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.length > 8 && (
                  <p className="text-xs text-muted-foreground p-3 border-t border-border/50">
                    … and {parsed.length - 8} more events
                  </p>
                )}
              </div>

              {/* Import progress */}
              {phase === 'importing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Importing to database...</span>
                    <Badge variant="secondary">{progress}%</Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Summary stats */}
              {(phase === 'importing' || phase === 'done') && (
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {summary.inserted} upserted
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-destructive">
                    <XCircle className="h-4 w-4" /> {summary.errors} errors
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={runImport}
                  disabled={isRunning || phase === 'done'}
                  size="lg"
                  className="gap-2"
                >
                  {phase === 'importing'
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing {progress}%...</>
                    : phase === 'done'
                    ? <><CheckCircle2 className="h-4 w-4" /> Imported Successfully</>
                    : <><Upload className="h-4 w-4" /> Import {parsed.length} Events to Database</>}
                </Button>
                {phase === 'done' && (
                  <Button variant="outline" onClick={() => { setParsed([]); setPhase('idle'); setLog([]); }} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Import Another File
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log */}
        {log.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 rounded-lg p-3 h-60 overflow-y-auto font-mono text-xs space-y-0.5">
                {log.map((line, i) => (
                  <div key={i} className={
                    line.startsWith('❌') || line.startsWith('💥') ? 'text-destructive'
                    : line.startsWith('✅') ? 'text-primary'
                    : line.startsWith('🎉') ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                  }>
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-Actuals info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Auto-Actuals Sync is Active</p>
                <p className="text-muted-foreground mt-1">
                  A nightly background job runs at <strong>6:00 AM IST</strong> to fetch released actual values from
                  public sources and update any events where the <code className="bg-muted px-1 rounded">actual_value</code> is
                  still empty. You can also trigger an immediate sync from the{' '}
                  <strong>Economic Events</strong> admin page using the <strong>Sync Actuals</strong> button.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format reference */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected CSV Format Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium mb-1">investing.com</p>
                <pre className="bg-muted rounded p-2 text-muted-foreground overflow-x-auto">{`"Date","Time","Currency","Importance","Event","Actual","Forecast","Previous"
"01/07/2026","10:30","INR","3","RBI Rate Decision","6.25%","6.25%","6.25%"
"01/08/2026","15:30","USD","3","FOMC Minutes","","",""`}</pre>
              </div>
              <div>
                <p className="font-medium mb-1">tradingeconomics.com</p>
                <pre className="bg-muted rounded p-2 text-muted-foreground overflow-x-auto">{`"Date","Country","Category","Event","Actual","Previous","Forecast"
"2026-01-07 10:30:00","India","Interest Rate","RBI Rate Decision","6.25%","6.25%","6.25%"
"2026-01-08 15:30:00","United States","Fed","FOMC Minutes","","",""`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
}
