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
import Careers from "./pages/Careers";
import Media from "./pages/Media";
import CSR from "./pages/CSR";
import Tech from "./pages/Tech";
import Videos from "./pages/Videos";
import Complaints from "./pages/Complaints";
import ComplaintStatus from "./pages/ComplaintStatus";
import FundTransfer from "./pages/FundTransfer";

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
          
          {/* Company pages */}
          <Route path="/referral" element={<Referral />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/media" element={<Media />} />
          <Route path="/csr" element={<CSR />} />
          <Route path="/tech" element={<Tech />} />
          
          {/* Support pages */}
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/status" element={<ComplaintStatus />} />
          <Route path="/fund-transfer" element={<FundTransfer />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
