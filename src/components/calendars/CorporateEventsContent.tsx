import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Calendar, TrendingUp, Users, FileText, DollarSign, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';

type EventType = 'board' | 'dividend' | 'agm' | 'bonus' | 'split' | 'buyback' | 'rights' | 'other';

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: typeof Building2 }> = {
  board: { label: 'Board Meeting', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Users },
  dividend: { label: 'Dividend', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: DollarSign },
  agm: { label: 'AGM', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Building2 },
  bonus: { label: 'Bonus Issue', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: TrendingUp },
  split: { label: 'Stock Split', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: FileText },
  buyback: { label: 'Buyback', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: DollarSign },
  rights: { label: 'Rights Issue', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: FileText },
  other: { label: 'Other', color: 'bg-muted text-muted-foreground', icon: Calendar },
};

const fallbackEvents = [
  { event_date: '2025-02-10', company_name: 'Reliance Industries', ticker: 'RELIANCE', event_type: 'board', event_details: 'Q3 FY25 results declaration', amount: '' },
  { event_date: '2025-02-12', company_name: 'TCS', ticker: 'TCS', event_type: 'dividend', event_details: 'Interim dividend, Ex-date', amount: '₹10 per share' },
  { event_date: '2025-02-14', company_name: 'HDFC Bank', ticker: 'HDFCBANK', event_type: 'agm', event_details: 'Annual General Meeting for FY2024-25', amount: '' },
  { event_date: '2025-02-18', company_name: 'Bajaj Finance', ticker: 'BAJFINANCE', event_type: 'board', event_details: 'Fund raising proposals consideration', amount: '' },
  { event_date: '2025-02-20', company_name: 'ITC Ltd', ticker: 'ITC', event_type: 'split', event_details: 'Stock split from ₹10 to ₹1 face value', amount: '10:1' },
  { event_date: '2025-02-22', company_name: 'Wipro', ticker: 'WIPRO', event_type: 'buyback', event_details: 'Share buyback via tender offer', amount: '₹305 per share' },
  { event_date: '2025-02-25', company_name: 'Maruti Suzuki', ticker: 'MARUTI', event_type: 'board', event_details: 'Q3 results and interim dividend', amount: '' },
];

const allTypes: EventType[] = ['board', 'dividend', 'agm', 'bonus', 'split', 'buyback', 'rights', 'other'];

const CorporateEventsContent = () => {
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['corporate_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_events')
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
      if (activeFilters.length > 0 && !activeFilters.includes(e.event_type as EventType)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!e.company_name.toLowerCase().includes(q) && !(e.ticker || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [displayData, activeFilters, search]);

  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleExport = () => {
    const csv = ['Date,Company,Ticker,Event Type,Details,Amount']
      .concat(filtered.map(e => `${e.event_date},${e.company_name},${e.ticker || ''},${e.event_type},${e.event_details || ''},${e.amount || ''}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corporate-events.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calendar view helpers
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0=Sun

  const getEventsForDay = (day: Date) =>
    filtered.filter(e => isSameDay(parseISO(e.event_date), day));

  return (
    <div className="section-padding">
      <div className="container-zerodha">
        {/* Event Type Legend / Filters */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center mb-8">
          {allTypes.map((type) => {
            const config = eventTypeConfig[type];
            const isActive = activeFilters.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive ? `${config.color} border-transparent ring-2 ring-offset-1 ring-current` : `border-border text-muted-foreground hover:opacity-80`
                }`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            );
          })}
          {activeFilters.length > 0 && (
            <button onClick={() => setActiveFilters([])} className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-full hover:text-foreground">Clear</button>
          )}
        </div>

        {/* Search, Export, View Toggle */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company or ticker..."
              className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-56"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${viewMode === 'table' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${viewMode === 'calendar' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              Calendar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Month Nav */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <button onClick={() => setCalendarMonth(m => subMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="font-semibold text-foreground">{format(calendarMonth, 'MMMM yyyy')}</h3>
                <button onClick={() => setCalendarMonth(m => addMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: startPadding }).map((_, i) => (
                  <div key={`pad-${i}`} className="min-h-[80px] border-r border-b border-border bg-muted/20" />
                ))}
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div key={day.toISOString()} className="min-h-[80px] border-r border-b border-border p-1.5 hover:bg-muted/20 transition-colors">
                      <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev, i) => {
                          const cfg = eventTypeConfig[ev.event_type as EventType] || eventTypeConfig.other;
                          return (
                            <div key={i} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${cfg.color}`}>
                              {ev.company_name}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Corporate Events
                </h2>
                <span className="text-xs text-muted-foreground">{filtered.length} events</span>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-10 text-center text-muted-foreground text-sm">Loading events...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground text-sm">No events found.</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                        <th className="text-left py-4 px-6 font-semibold text-foreground">Company</th>
                        <th className="text-left py-4 px-6 font-semibold text-foreground">Event</th>
                        <th className="text-left py-4 px-6 font-semibold text-foreground">Details</th>
                        <th className="text-left py-4 px-6 font-semibold text-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((event, index) => {
                        const config = eventTypeConfig[event.event_type as EventType] || eventTypeConfig.other;
                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-t border-border hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-4 px-6 text-foreground font-medium whitespace-nowrap">
                              {format(parseISO(event.event_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-foreground font-medium">{event.company_name}</div>
                              {event.ticker && <div className="text-xs text-muted-foreground">{event.ticker}</div>}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
                                <config.icon className="w-3 h-3" />
                                {config.label}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-muted-foreground max-w-xs">{event.event_details}</td>
                            <td className="py-4 px-6 text-sm text-foreground font-medium">{event.amount || '–'}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">About Corporate Events</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Board Meetings</strong> — Companies announce quarterly results, dividends, and key strategic decisions.</li>
              <li>• <strong>Dividends</strong> — Cash or stock distributions to shareholders. Track ex-dates and record dates.</li>
              <li>• <strong>Bonus & Splits</strong> — Changes in share structure that affect your holdings and cost basis.</li>
              <li>• <strong>Buybacks & Rights Issues</strong> — Opportunities to tender shares or subscribe to new offerings at set prices.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateEventsContent;
