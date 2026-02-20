import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Globe, Bell, Search, Download } from 'lucide-react';
import { format } from 'date-fns';

const fallbackEvents = [
  { event_date: '2025-02-06', event_time: '17:30', event_name: 'RBI Monetary Policy Decision', country: 'India', impact: 'high', category: 'Interest Rates', previous_value: '6.50%', forecast_value: '6.25%', actual_value: '' },
  { event_date: '2025-02-12', event_time: '17:30', event_name: 'CPI Inflation Rate YoY', country: 'India', impact: 'high', category: 'Inflation Data', previous_value: '5.22%', forecast_value: '4.80%', actual_value: '' },
  { event_date: '2025-02-14', event_time: '12:00', event_name: 'WPI Inflation YoY', country: 'India', impact: 'medium', category: 'Inflation Data', previous_value: '2.37%', forecast_value: '2.10%', actual_value: '' },
  { event_date: '2025-02-19', event_time: '20:00', event_name: 'FOMC Meeting Minutes', country: 'USA', impact: 'high', category: 'Interest Rates', previous_value: '-', forecast_value: '-', actual_value: '' },
  { event_date: '2025-02-28', event_time: '18:30', event_name: 'GDP Growth Rate Q3', country: 'India', impact: 'high', category: 'GDP & Growth', previous_value: '5.4%', forecast_value: '6.0%', actual_value: '' },
  { event_date: '2025-03-06', event_time: '12:00', event_name: 'Manufacturing PMI', country: 'India', impact: 'medium', category: 'Manufacturing', previous_value: '57.7', forecast_value: '57.0', actual_value: '' },
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const categories = ['All', 'Interest Rates', 'Inflation Data', 'GDP & Growth', 'Trade Data', 'Employment', 'Manufacturing', 'General'];
const impacts = ['All', 'high', 'medium', 'low'];
const countries = ['All', 'India', 'USA', 'Europe', 'China', 'Japan', 'UK'];

const EconomicCalendarContent = () => {
  const [search, setSearch] = useState('');
  const [impactFilter, setImpactFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['economic_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const displayData = events.length > 0 ? events : fallbackEvents;

  const filtered = useMemo(() => {
    return displayData.filter(e => {
      if (impactFilter !== 'All' && e.impact !== impactFilter) return false;
      if (countryFilter !== 'All' && e.country !== countryFilter) return false;
      if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!e.event_name.toLowerCase().includes(q) && !e.country.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [displayData, impactFilter, countryFilter, categoryFilter, search]);

  const handleExport = () => {
    const csv = ['Date,Time,Event,Country,Impact,Category,Previous,Forecast,Actual']
      .concat(filtered.map(e => `${e.event_date},${e.event_time || ''},${e.event_name},${e.country},${e.impact},${e.category},${e.previous_value || ''},${e.forecast_value || ''},${e.actual_value || ''}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `economic-calendar.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="section-padding">
      <div className="container-zerodha">
        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={countryFilter}
                onChange={e => setCountryFilter(e.target.value)}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
              >
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                value={impactFilter}
                onChange={e => setImpactFilter(e.target.value)}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm capitalize"
              >
                {impacts.map(i => <option key={i} className="capitalize">{i}</option>)}
              </select>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-44"
                />
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/50 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Economic Events</h2>
              <span className="text-xs text-muted-foreground">{filtered.length} events</span>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-10 text-center text-muted-foreground text-sm">Loading events...</div>
              ) : filtered.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">No events match your filters.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Date & Time</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Event</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Country</th>
                      <th className="text-center py-4 px-6 font-semibold text-foreground">Impact</th>
                      <th className="text-right py-4 px-6 font-semibold text-foreground">Previous</th>
                      <th className="text-right py-4 px-6 font-semibold text-foreground">Forecast</th>
                      <th className="text-right py-4 px-6 font-semibold text-foreground">Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((event, index) => (
                      <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-foreground font-medium">{format(new Date(event.event_date + 'T00:00:00'), 'MMM d, yyyy')}</div>
                          {event.event_time && <div className="text-sm text-muted-foreground">{event.event_time} IST</div>}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-foreground font-medium">{event.event_name}</div>
                          {event.category && <div className="text-xs text-muted-foreground mt-0.5">{event.category}</div>}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{event.country}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getImpactColor(event.impact)}`}>{event.impact}</span>
                        </td>
                        <td className="py-4 px-6 text-right text-muted-foreground">{event.previous_value || '–'}</td>
                        <td className="py-4 px-6 text-right text-foreground font-medium">{event.forecast_value || '–'}</td>
                        <td className="py-4 px-6 text-right">
                          {event.actual_value
                            ? <span className="text-primary font-semibold">{event.actual_value}</span>
                            : <span className="text-muted-foreground">–</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-muted/30 border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Understanding Impact Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3"><span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shrink-0">High</span><p className="text-sm text-muted-foreground">Major market-moving events like RBI policy, GDP data</p></div>
              <div className="flex items-start gap-3"><span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 shrink-0">Medium</span><p className="text-sm text-muted-foreground">Important data like PMI, trade balance</p></div>
              <div className="flex items-start gap-3"><span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">Low</span><p className="text-sm text-muted-foreground">Routine data releases with limited immediate impact</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicCalendarContent;
