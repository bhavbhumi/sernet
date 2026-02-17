import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Calculator pages
import BrokerageCalculator from "./pages/calculators/BrokerageCalculator";
import MarginCalculator from "./pages/calculators/MarginCalculator";
import SIPCalculator from "./pages/calculators/SIPCalculator";
import LumpsumCalculator from "./pages/calculators/LumpsumCalculator";

// Other pages
import MarketOverview from "./pages/MarketOverview";
import ZConnect from "./pages/ZConnect";
import DownloadsPage from "./pages/DownloadsPage";
import Calculators from "./pages/Calculators";
import Calendars from "./pages/Calendars";
import Services from "./pages/Services";
import Network from "./pages/Network";
import Media from "./pages/Media";
import CSR from "./pages/CSR";
import Tech from "./pages/Tech";
import Videos from "./pages/Videos";
import Complaints from "./pages/Complaints";
import ComplaintStatus from "./pages/ComplaintStatus";
import FundTransfer from "./pages/FundTransfer";
import Philosophy from "./pages/Philosophy";
import OpenAccount from "./pages/OpenAccount";
import TradingQnA from "./pages/TradingQnA";

// New pages
import MarketHolidays from "./pages/MarketHolidays";
import EconomicCalendar from "./pages/EconomicCalendar";
import InvestorCharter from "./pages/InvestorCharter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclosure from "./pages/Disclosure";
import Policies from "./pages/Policies";

// Sernet pages
import Reviews from "./pages/Reviews";
import QuickLinks from "./pages/QuickLinks";
import CreditClaim from "./pages/CreditClaim";
import ScheduleCall from "./pages/ScheduleCall";
import Opinions from "./pages/Opinions";
import UpdatesPage from "./pages/Updates";
import Contact from "./pages/Contact";

// Product landing pages
import ChoiceFinX from "./pages/ChoiceFinX";
import TickFunds from "./pages/TickFunds";
import TushilPage from "./pages/Tushil";
import Findemy from "./pages/Findemy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Calculator pages */}
          <Route path="/calculators/brokerage" element={<BrokerageCalculator />} />
          <Route path="/calculators/margin" element={<MarginCalculator />} />
          <Route path="/calculators/sip" element={<SIPCalculator />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          
          {/* Updates & Resources */}
          <Route path="/market-overview" element={<MarketOverview />} />
          <Route path="/z-connect" element={<ZConnect />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/tradingqna" element={<TradingQnA />} />
          <Route path="/market-holidays" element={<MarketHolidays />} />
          <Route path="/economic-calendar" element={<EconomicCalendar />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calendars" element={<Calendars />} />
          
          {/* Company pages */}
          <Route path="/services" element={<Services />} />
          <Route path="/network" element={<Network />} />
          <Route path="/media" element={<Media />} />
          <Route path="/csr" element={<CSR />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/about/philosophy" element={<Philosophy />} />
          <Route path="/open-account" element={<OpenAccount />} />
          
          {/* Support pages */}
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/status" element={<ComplaintStatus />} />
          <Route path="/fund-transfer" element={<FundTransfer />} />
          
          {/* Legal pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclosure" element={<Disclosure />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/investor-charter" element={<InvestorCharter />} />
          
          {/* Sernet pages */}
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/quick-links" element={<QuickLinks />} />
          <Route path="/credit-claim" element={<CreditClaim />} />
          <Route path="/schedule-call" element={<ScheduleCall />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/opinions" element={<Opinions />} />
          <Route path="/updates" element={<UpdatesPage />} />
          
          {/* Product landing pages */}
          <Route path="/choicefinx" element={<ChoiceFinX />} />
          <Route path="/tickfunds" element={<TickFunds />} />
          <Route path="/tushil" element={<TushilPage />} />
          <Route path="/findemy" element={<Findemy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
