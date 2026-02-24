import { Layout } from '@/components/layout/Layout';
import { Calendar, TrendingUp, Globe, Bell } from 'lucide-react';

const EconomicCalendar = () => {
  const upcomingEvents = [
    { date: 'Feb 5, 2024', time: '17:30', event: 'RBI Monetary Policy Decision', country: 'India', impact: 'high', previous: '6.50%', forecast: '6.50%' },
    { date: 'Feb 6, 2024', time: '12:00', event: 'Manufacturing PMI', country: 'India', impact: 'medium', previous: '54.9', forecast: '55.2' },
    { date: 'Feb 7, 2024', time: '17:00', event: 'Foreign Exchange Reserves', country: 'India', impact: 'low', previous: '$617.3B', forecast: '$618.0B' },
    { date: 'Feb 12, 2024', time: '17:30', event: 'CPI Inflation Rate YoY', country: 'India', impact: 'high', previous: '5.69%', forecast: '5.10%' },
    { date: 'Feb 14, 2024', time: '12:00', event: 'WPI Inflation YoY', country: 'India', impact: 'medium', previous: '0.73%', forecast: '0.50%' },
    { date: 'Feb 15, 2024', time: '17:30', event: 'Trade Balance', country: 'India', impact: 'medium', previous: '-$19.8B', forecast: '-$18.5B' },
    { date: 'Feb 20, 2024', time: '20:00', event: 'FOMC Meeting Minutes', country: 'USA', impact: 'high', previous: '-', forecast: '-' },
    { date: 'Feb 23, 2024', time: '18:30', event: 'GDP Growth Rate QoQ', country: 'India', impact: 'high', previous: '7.6%', forecast: '6.8%' },
    { date: 'Feb 28, 2024', time: '12:00', event: 'Infrastructure Output YoY', country: 'India', impact: 'low', previous: '7.8%', forecast: '8.0%' },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const categories = [
    { name: 'Interest Rates', icon: TrendingUp, description: 'RBI policy decisions, repo rate changes' },
    { name: 'Inflation Data', icon: TrendingUp, description: 'CPI, WPI, and price indices' },
    { name: 'GDP & Growth', icon: TrendingUp, description: 'Economic growth indicators' },
    { name: 'Trade Data', icon: Globe, description: 'Imports, exports, trade balance' },
  ];

  return (
    <Layout>
      <div className="container-sernet section-padding">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="heading-xl text-foreground mb-4">
            Economic Calendar
          </h1>
          <p className="text-body">
            Stay updated with important economic events and data releases that impact the markets
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <select className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
              <option>All Countries</option>
              <option>India</option>
              <option>USA</option>
              <option>Europe</option>
              <option>China</option>
            </select>
            <select className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
              <option>All Impact Levels</option>
              <option>High Impact</option>
              <option>Medium Impact</option>
              <option>Low Impact</option>
            </select>
            <select className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
              <option>This Week</option>
              <option>This Month</option>
              <option>Next Week</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-muted/30 p-4 rounded-lg border border-border text-center hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <category.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Upcoming Events</h2>
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Bell className="w-4 h-4" />
                Set Alerts
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Event</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Country</th>
                    <th className="text-center py-4 px-6 font-semibold text-foreground">Impact</th>
                    <th className="text-right py-4 px-6 font-semibold text-foreground">Previous</th>
                    <th className="text-right py-4 px-6 font-semibold text-foreground">Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="text-foreground font-medium">{event.date}</div>
                        <div className="text-sm text-muted-foreground">{event.time} IST</div>
                      </td>
                      <td className="py-4 px-6 text-foreground font-medium">{event.event}</td>
                      <td className="py-4 px-6 text-muted-foreground">{event.country}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getImpactColor(event.impact)}`}>
                          {event.impact}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground">{event.previous}</td>
                      <td className="py-4 px-6 text-right text-foreground font-medium">{event.forecast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-muted/30 border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Understanding Impact Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  High
                </span>
                <p className="text-sm text-muted-foreground">
                  Major market-moving events like RBI policy, GDP data, or Fed decisions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Medium
                </span>
                <p className="text-sm text-muted-foreground">
                  Important data like PMI, trade balance, or industrial production
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Low
                </span>
                <p className="text-sm text-muted-foreground">
                  Routine data releases with limited immediate market impact
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="heading-lg mb-4">
            Never miss an important event
          </h2>
          <p className="text-muted-foreground mb-6">
            Set up alerts and get notified before major economic events that could impact your portfolio
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Enable Event Alerts
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EconomicCalendar;
