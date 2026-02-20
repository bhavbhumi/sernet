import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Info, Download, Search } from 'lucide-react';
import { format, isAfter, isSameDay, parseISO } from 'date-fns';

type HolidayRow = {
  id: string;
  holiday_date: string;
  holiday_name: string;
  holiday_type: string[] | string; // DB now returns string[]
  day_of_week: string | null;
  markets: string;
  notes: string | null;
  status: string;
  year: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

const fallbackHolidays: HolidayRow[] = [
  { id: '1', holiday_date: '2025-01-26', holiday_name: 'Republic Day', day_of_week: 'Sunday', markets: 'NSE, BSE, MCX', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '2', holiday_date: '2025-03-14', holiday_name: 'Holi', day_of_week: 'Friday', markets: 'NSE, BSE', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '3', holiday_date: '2025-04-14', holiday_name: 'Dr. Ambedkar Jayanti', day_of_week: 'Monday', markets: 'NSE, BSE', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '4', holiday_date: '2025-04-18', holiday_name: 'Good Friday', day_of_week: 'Friday', markets: 'NSE, BSE, MCX', notes: null, holiday_type: ['Market', 'Settlement'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '5', holiday_date: '2025-08-15', holiday_name: 'Independence Day', day_of_week: 'Friday', markets: 'NSE, BSE, MCX', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '6', holiday_date: '2025-10-02', holiday_name: 'Mahatma Gandhi Jayanti', day_of_week: 'Thursday', markets: 'NSE, BSE, MCX', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '7', holiday_date: '2025-10-21', holiday_name: 'Diwali (Laxmi Pujan)', day_of_week: 'Tuesday', markets: 'NSE, BSE', notes: 'Muhurat trading session in evening', holiday_type: ['Market', 'Settlement'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '8', holiday_date: '2025-11-05', holiday_name: 'Guru Nanak Jayanti', day_of_week: 'Wednesday', markets: 'NSE, BSE', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
  { id: '9', holiday_date: '2025-12-25', holiday_name: 'Christmas', day_of_week: 'Thursday', markets: 'NSE, BSE, MCX', notes: null, holiday_type: ['Market'], status: 'published', year: 2025, created_at: '', updated_at: '', created_by: null },
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

// Normalize holiday_type to always be an array
const getTypes = (h: HolidayRow): string[] => {
  if (Array.isArray(h.holiday_type)) return h.holiday_type;
  if (typeof h.holiday_type === 'string' && h.holiday_type) return [h.holiday_type];
  return ['Market'];
};

const TYPE_STYLES: Record<string, string> = {
  Market: 'bg-primary/10 text-primary border border-primary/20',
  Settlement: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
};

const MarketHolidaysContent = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['market_holidays', selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_holidays')
        .select('*')
        .eq('year', selectedYear)
        .eq('status', 'published')
        .order('holiday_date', { ascending: true });
      if (error) throw error;
      return (data ?? []) as HolidayRow[];
    },
  });

  const displayData: HolidayRow[] = holidays.length > 0 ? holidays : (selectedYear === currentYear ? fallbackHolidays : []);

  // Find the next upcoming holiday (today or future)
  const nextHolidayIndex = useMemo(() => {
    if (selectedYear !== currentYear) return -1;
    return displayData.findIndex(h => {
      const d = parseISO(h.holiday_date);
      return isSameDay(d, today) || isAfter(d, today);
    });
  }, [displayData, selectedYear]);

  const filtered = useMemo(() => {
    let data = displayData;
    if (typeFilter !== 'All') data = data.filter(h => getTypes(h).includes(typeFilter));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(h =>
        h.holiday_name.toLowerCase().includes(q) ||
        h.markets.toLowerCase().includes(q)
      );
    }
    return data;
  }, [displayData, search, typeFilter]);

  const handleExport = () => {
    const csv = ['Date,Day,Holiday,Type,Markets,Notes']
      .concat(filtered.map(h => `${h.holiday_date},${h.day_of_week || ''},${h.holiday_name},"${getTypes(h).join(' & ')}",${h.markets},${h.notes || ''}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holiday-events-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="section-padding">
      <div className="container-zerodha">
        {/* Info Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-foreground">Trading Hours</h3>
            </div>
            <p className="text-sm text-muted-foreground">NSE & BSE: 9:15 AM – 3:30 PM IST<br />MCX: 9:00 AM – 11:30 PM IST</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-foreground">Weekly Off</h3>
            </div>
            <p className="text-sm text-muted-foreground">Markets are closed on all Saturdays and Sundays</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Info className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-foreground">Special Sessions</h3>
            </div>
            <p className="text-sm text-muted-foreground">Muhurat trading session on Diwali evening</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedYear === y ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}
              >
                {y}
              </button>
            ))}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm"
            >
              <option value="All">All Types</option>
              <option value="Market">Market</option>
              <option value="Settlement">Settlement</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search holidays..."
                className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        {/* Holiday Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{selectedYear} Holiday Events</h2>
              <span className="text-xs text-muted-foreground">{filtered.length} holidays</span>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-10 text-center text-muted-foreground text-sm">Loading holidays...</div>
              ) : filtered.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">No holidays found.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Day</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Holiday</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Markets Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((holiday, index) => {
                      const originalIndex = displayData.indexOf(holiday);
                      const isNext = originalIndex === nextHolidayIndex;
                      const isPast = !isNext && parseISO(holiday.holiday_date) < today;
                      const types = getTypes(holiday);
                      return (
                        <tr
                          key={index}
                          className={`border-t border-border transition-colors ${isNext ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : isPast ? 'opacity-60 hover:opacity-80' : 'hover:bg-muted/30'}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {isNext && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full uppercase tracking-wide">
                                  Next
                                </span>
                              )}
                              <div>
                                <p className="text-foreground font-medium">{format(parseISO(holiday.holiday_date), 'MMMM d, yyyy')}</p>
                                {holiday.notes && (
                                  <p className="text-xs text-muted-foreground mt-0.5 italic">{holiday.notes}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">{holiday.day_of_week || format(parseISO(holiday.holiday_date), 'EEEE')}</td>
                          <td className="py-4 px-6 text-foreground font-medium">{holiday.holiday_name}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1">
                              {types.map(t => (
                                <span key={t} className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${TYPE_STYLES[t] ?? 'bg-muted text-muted-foreground'}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">{holiday.markets}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Holiday data sourced from NSE/BSE official calendars via Zerodha MarketIntel.</li>
              <li>• The holiday list is subject to change. Please check the official exchange websites for the latest updates.</li>
              <li>• On days with special trading sessions (like Muhurat trading), timings may differ from regular trading hours.</li>
              <li>• <strong className="text-foreground">Market</strong> = trading closed. <strong className="text-foreground">Settlement</strong> = settlement/clearing closed (trading may occur). Some holidays are both.</li>
              <li>• MCX has separate holiday schedules. Holidays falling on Saturday or Sunday are not included.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHolidaysContent;
