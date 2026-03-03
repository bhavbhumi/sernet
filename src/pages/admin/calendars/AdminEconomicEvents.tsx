import { useState } from 'react';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import type { FieldDef } from '@/components/admin/GenericCMSPage';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Loader2, CheckCircle2, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const fields: FieldDef[] = [
  { key: 'event_date', label: 'Event Date', type: 'date', required: true, tip: 'Scheduled date for this economic release.' },
  { key: 'event_time', label: 'Event Time (IST)', type: 'text', placeholder: '17:30', tip: 'Time in 24-hour IST format, e.g. 17:30.' },
  { key: 'event_name', label: 'Event Name', type: 'text', required: true, placeholder: 'e.g. RBI Monetary Policy Decision', tip: 'Official name of the economic event.' },
  { key: 'country', label: 'Country', type: 'select', options: ['India', 'USA', 'Europe', 'China', 'Japan', 'UK', 'Global'], required: true },
  { key: 'impact', label: 'Impact Level', type: 'select', options: ['high', 'medium', 'low'], required: true, tip: 'Expected market impact of this event.' },
  { key: 'category', label: 'Category', type: 'select', options: ['Interest Rates', 'Inflation Data', 'GDP & Growth', 'Trade Data', 'Employment', 'Manufacturing', 'General'], tip: 'Type of economic data.' },
  { key: 'previous_value', label: 'Previous Value', type: 'text', placeholder: '6.50%', tip: 'Last known reading of this indicator.' },
  { key: 'forecast_value', label: 'Forecast', type: 'text', placeholder: '6.50%', tip: 'Analyst consensus forecast.' },
  { key: 'actual_value', label: 'Actual Value', type: 'text', placeholder: 'Fill after release', tip: 'Actual result after the event (fill post-release).' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of this event...', tip: 'Optional context about the event.' },
  { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'], required: true },
];

const emptyForm = {
  event_date: '',
  event_time: '',
  event_name: '',
  country: 'India',
  impact: 'medium',
  category: 'General',
  previous_value: '',
  forecast_value: '',
  actual_value: '',
  description: '',
  status: 'published',
};

const tableColumns = [
  { key: 'event_date', label: 'Date' },
  { key: 'event_time', label: 'Time' },
  { key: 'event_name', label: 'Event' },
  { key: 'country', label: 'Country' },
  { key: 'impact', label: 'Impact' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
];

function SyncActualsButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ fetched: number; updated: number; log: string[] } | null>(null);
  const [open, setOpen] = useState(false);

  const runSync = async () => {
    setSyncing(true);
    setResult(null);
    setOpen(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-economic-actuals', {});
      if (error) throw error;
      setResult(data);
    } catch (err) {
      setResult({ fetched: 0, updated: 0, log: [`❌ Error: ${String(err)}`] });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2" onClick={runSync} disabled={syncing}>
        {syncing
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing Actuals...</>
          : <><Zap className="h-3.5 w-3.5" /> Sync Actuals Now</>}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sync Actuals Result</DialogTitle>
            <DialogDescription>
              {syncing ? 'Fetching released values from Trading Economics...' : (
                result ? `Fetched ${result.fetched} events · Updated ${result.updated} actuals` : ''
              )}
            </DialogDescription>
          </DialogHeader>
          {syncing && (
            <div className="flex items-center gap-3 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Checking all countries for released actuals...</span>
            </div>
          )}
          {result && !syncing && (
            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{result.updated} actuals updated</span>
                </div>
                <div className="text-muted-foreground">{result.fetched} events fetched</div>
              </div>
              <div className="bg-muted/40 rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs space-y-0.5">
                {(result.log || []).map((line, i) => (
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const AdminEconomicEvents = () => {
  const navigate = useNavigate();

  return (
    <GenericCMSPage
      title="Economic Events"
      subtitle="Manage economic calendar events, data releases, and policy meetings."
      tableName="economic_events"
      fields={fields}
      emptyForm={emptyForm}
      tableColumns={tableColumns}
      hasStatus
      categoryField="impact"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/admin/marketing/calendars/import-economic')}
          >
            <Link className="h-3.5 w-3.5" /> Import CSV
          </Button>
          <SyncActualsButton />
        </div>
      }
    />
  );
};

export default AdminEconomicEvents;
