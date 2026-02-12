import { Layout } from '@/components/layout/Layout';
import { Calendar, Clock, Info } from 'lucide-react';

const MarketHolidays = () => {
  const holidays2024 = [
    { date: 'January 26, 2024', day: 'Friday', holiday: 'Republic Day', markets: 'NSE, BSE, MCX' },
    { date: 'March 8, 2024', day: 'Friday', holiday: 'Maha Shivaratri', markets: 'NSE, BSE' },
    { date: 'March 25, 2024', day: 'Monday', holiday: 'Holi', markets: 'NSE, BSE, MCX' },
    { date: 'March 29, 2024', day: 'Friday', holiday: 'Good Friday', markets: 'NSE, BSE, MCX' },
    { date: 'April 11, 2024', day: 'Thursday', holiday: 'Id-Ul-Fitr (Ramadan)', markets: 'NSE, BSE' },
    { date: 'April 14, 2024', day: 'Sunday', holiday: 'Dr. Ambedkar Jayanti', markets: 'NSE, BSE' },
    { date: 'April 17, 2024', day: 'Wednesday', holiday: 'Ram Navami', markets: 'NSE, BSE' },
    { date: 'April 21, 2024', day: 'Sunday', holiday: 'Mahavir Jayanti', markets: 'NSE, BSE' },
    { date: 'May 1, 2024', day: 'Wednesday', holiday: 'Maharashtra Day', markets: 'NSE, BSE' },
    { date: 'May 23, 2024', day: 'Thursday', holiday: 'Buddha Purnima', markets: 'NSE, BSE' },
    { date: 'June 17, 2024', day: 'Monday', holiday: 'Bakri Id', markets: 'NSE, BSE' },
    { date: 'July 17, 2024', day: 'Wednesday', holiday: 'Muharram', markets: 'NSE, BSE' },
    { date: 'August 15, 2024', day: 'Thursday', holiday: 'Independence Day', markets: 'NSE, BSE, MCX' },
    { date: 'October 2, 2024', day: 'Wednesday', holiday: 'Mahatma Gandhi Jayanti', markets: 'NSE, BSE, MCX' },
    { date: 'October 12, 2024', day: 'Saturday', holiday: 'Dussehra', markets: 'NSE, BSE' },
    { date: 'November 1, 2024', day: 'Friday', holiday: 'Diwali (Laxmi Pujan)', markets: 'NSE, BSE' },
    { date: 'November 15, 2024', day: 'Friday', holiday: 'Guru Nanak Jayanti', markets: 'NSE, BSE' },
    { date: 'December 25, 2024', day: 'Wednesday', holiday: 'Christmas', markets: 'NSE, BSE, MCX' },
  ];

  return (
    <Layout>
      <div className="container-zerodha section-padding">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="heading-xl text-foreground mb-4">
            Stock Market Holidays
          </h1>
          <p className="text-body">
            Complete list of trading holidays for NSE, BSE, and MCX exchanges in India
          </p>
        </div>

        {/* Year Selector */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
              2024
            </button>
            <button className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              2025
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Trading Hours</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              NSE & BSE: 9:15 AM - 3:30 PM IST<br />
              MCX: 9:00 AM - 11:30 PM IST
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Weekly Off</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Markets are closed on all Saturdays and Sundays
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Special Sessions</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Muhurat trading session on Diwali evening
            </p>
          </div>
        </div>

        {/* Holiday Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
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
                  {holidays2024.map((holiday, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-foreground">{holiday.date}</td>
                      <td className="py-4 px-6 text-muted-foreground">{holiday.day}</td>
                      <td className="py-4 px-6 text-foreground font-medium">{holiday.holiday}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {holiday.markets}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• The holiday list is subject to change. Please check the official exchange websites for the latest updates.</li>
              <li>• On days with special trading sessions (like Muhurat trading), timings may differ from regular trading hours.</li>
              <li>• Settlement holidays may differ from trading holidays. Check with your broker for settlement schedules.</li>
              <li>• MCX trading hours may vary during daylight saving time changes in the US.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketHolidays;
