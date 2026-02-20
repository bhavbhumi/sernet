import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Info, Download, Search } from 'lucide-react';
import { format } from 'date-fns';

const fallbackHolidays = [
  { holiday_date: '2025-01-26', holiday_name: 'Republic Day', day_of_week: 'Sunday', markets: 'NSE, BSE, MCX' },
  { holiday_date: '2025-03-14', holiday_name: 'Holi', day_of_week: 'Friday', markets: 'NSE, BSE' },
  { holiday_date: '2025-04-14', holiday_name: 'Dr. Ambedkar Jayanti', day_of_week: 'Monday', markets: 'NSE, BSE' },
  { holiday_date: '2025-04-18', holiday_name: 'Good Friday', day_of_week: 'Friday', markets: 'NSE, BSE, MCX' },
  { holiday_date: '2025-08-15', holiday_name: 'Independence Day', day_of_week: 'Friday', markets: 'NSE, BSE, MCX' },
  { holiday_date: '2025-10-02', holiday_name: 'Mahatma Gandhi Jayanti', day_of_week: 'Thursday', markets: 'NSE, BSE, MCX' },
  { holiday_date: '2025-10-02', holiday_name: 'Dussehra', day_of_week: 'Thursday', markets: 'NSE, BSE' },
  { holiday_date: '2025-10-21', holiday_name: 'Diwali (Laxmi Pujan)', day_of_week: 'Tuesday', markets: 'NSE, BSE' },
  { holiday_date: '2025-11-05', holiday_name: 'Guru Nanak Jayanti', day_of_week: 'Wednesday', markets: 'NSE, BSE' },
  { holiday_date: '2025-12-25', holiday_name: 'Christmas', day_of_week: 'Thursday', markets: 'NSE, BSE, MCX' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

const MarketHolidaysContent = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [search, setSearch] = useState('');

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
      return data ?? [];
    },
  });

  const displayData = holidays.length > 0 ? holidays : (selectedYear === currentYear ? fallbackHolidays : []);

  const filtered = useMemo(() => {
    if (!search) return displayData;
    const q = search.toLowerCase();
    return displayData.filter(h =>
      h.holiday_name.toLowerCase().includes(q) ||
      h.markets.toLowerCase().includes(q)
    );
  }, [displayData, search]);

  const handleExport = () => {
    const csv = ['Date,Day,Holiday,Markets']
      .concat(filtered.map(h => `${h.holiday_date},${h.day_of_week || ''},${h.holiday_name},${h.markets}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-holidays-${selectedYear}.csv`;
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
          <div className="flex gap-2 flex-wrap">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedYear === y ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}
              >
                {y}
              </button>
            ))}
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
              <h2 className="font-semibold text-foreground">{selectedYear} Market Holidays</h2>
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
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Markets Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((holiday, index) => (
                      <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">
                          {format(new Date(holiday.holiday_date + 'T00:00:00'), 'MMMM d, yyyy')}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{holiday.day_of_week || format(new Date(holiday.holiday_date + 'T00:00:00'), 'EEEE')}</td>
                        <td className="py-4 px-6 text-foreground font-medium">{holiday.holiday_name}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{holiday.markets}</span>
                        </td>
                      </tr>
                    ))}
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
              <li>• Settlement holidays may differ from trading holidays. MCX has separate holiday schedules.</li>
              <li>• Holidays falling on Saturday or Sunday are not included as they are already non-trading days.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHolidaysContent;
