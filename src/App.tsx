import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Product pages
import Kite from "./pages/products/Kite";
import Console from "./pages/products/Console";
import Coin from "./pages/products/Coin";
import KiteConnect from "./pages/products/KiteConnect";
import Varsity from "./pages/products/Varsity";
import Streak from "./pages/products/Streak";
import Smallcase from "./pages/products/Smallcase";
import GoldenPi from "./pages/products/GoldenPi";
import Sensibull from "./pages/products/Sensibull";

// Calculator pages
import BrokerageCalculator from "./pages/calculators/BrokerageCalculator";
import MarginCalculator from "./pages/calculators/MarginCalculator";
import SIPCalculator from "./pages/calculators/SIPCalculator";
import LumpsumCalculator from "./pages/calculators/LumpsumCalculator";

// Other pages
import MarketOverview from "./pages/MarketOverview";
import ZConnect from "./pages/ZConnect";
import Downloads from "./pages/Downloads";
import Referral from "./pages/Referral";
import ClientReferral from "./pages/ClientReferral";
import PartnerReferral from "./pages/PartnerReferral";
import Services from "./pages/Services";
import Network from "./pages/Network";
import Careers from "./pages/Careers";
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

// Additional Sernet pages
import Recognitions from "./pages/Recognitions";
import Reviews from "./pages/Reviews";
import Clients from "./pages/Clients";
import Partners from "./pages/Partners";
import QuickLinks from "./pages/QuickLinks";
import CreditClaim from "./pages/CreditClaim";
import ScheduleCall from "./pages/ScheduleCall";

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
          <Route path="/products" element={<Products />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Product pages */}
          <Route path="/products/kite" element={<Kite />} />
          <Route path="/products/console" element={<Console />} />
          <Route path="/products/coin" element={<Coin />} />
          <Route path="/products/kite-connect" element={<KiteConnect />} />
          <Route path="/products/varsity" element={<Varsity />} />
          <Route path="/products/streak" element={<Streak />} />
          <Route path="/products/smallcase" element={<Smallcase />} />
          <Route path="/products/goldenpi" element={<GoldenPi />} />
          <Route path="/products/sensibull" element={<Sensibull />} />
          
          {/* Calculator pages */}
          <Route path="/calculators/brokerage" element={<BrokerageCalculator />} />
          <Route path="/calculators/margin" element={<MarginCalculator />} />
          <Route path="/calculators/sip" element={<SIPCalculator />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          
          {/* Updates & Resources */}
          <Route path="/market-overview" element={<MarketOverview />} />
          <Route path="/z-connect" element={<ZConnect />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/tradingqna" element={<TradingQnA />} />
          <Route path="/market-holidays" element={<MarketHolidays />} />
          <Route path="/economic-calendar" element={<EconomicCalendar />} />
          
          {/* Company pages */}
          <Route path="/referral" element={<Referral />} />
          <Route path="/referral/client" element={<ClientReferral />} />
          <Route path="/referral/partner" element={<PartnerReferral />} />
          <Route path="/services" element={<Services />} />
          <Route path="/network" element={<Network />} />
          <Route path="/careers" element={<Careers />} />
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
          
          {/* Additional Sernet pages */}
          <Route path="/recognitions" element={<Recognitions />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/quick-links" element={<QuickLinks />} />
          <Route path="/credit-claim" element={<CreditClaim />} />
          <Route path="/schedule-call" element={<ScheduleCall />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
