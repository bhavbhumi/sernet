import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import AnalysisDetail from "./pages/AnalysisDetail";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { ScrollDownFAB } from "./components/shared/ScrollDownFAB";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import SupportProduct from "./pages/SupportProduct";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Calculator pages
import BrokerageCalculator from "./pages/calculators/BrokerageCalculator";
import MarginCalculator from "./pages/calculators/MarginCalculator";
import SIPCalculator from "./pages/calculators/SIPCalculator";
import LumpsumCalculator from "./pages/calculators/LumpsumCalculator";

// Other pages
import Insights from "./pages/Insights";
import DownloadsPage from "./pages/DownloadsPage";
import Calculators from "./pages/Calculators";
import Calendars from "./pages/Calendars";
import Services from "./pages/Services";
import Network from "./pages/Network";
import Media from "./pages/Media";
import CSR from "./pages/CSR";
import Complaints from "./pages/Complaints";
import Philosophy from "./pages/Philosophy";
import OpenAccount from "./pages/OpenAccount";

// New pages
import MarketHolidays from "./pages/MarketHolidays";
import EconomicCalendar from "./pages/EconomicCalendar";
import InvestorCharter from "./pages/InvestorCharter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclosure from "./pages/Disclosure";
import Policies from "./pages/Policies";
import Legal from "./pages/Legal";

// Sernet pages
import Reviews from "./pages/Reviews";
import QuickLinks from "./pages/QuickLinks";
import CreditClaim from "./pages/CreditClaim";
import ScheduleCall from "./pages/ScheduleCall";
import Opinions from "./pages/Opinions";
import UpdatesPage from "./pages/Updates";
import UpdatesDetail from "./pages/UpdatesDetail";
import Contact from "./pages/Contact";

// Product landing pages
import ChoiceFinX from "./pages/ChoiceFinX";
import TickFunds from "./pages/TickFunds";
import TushilPage from "./pages/Tushil";
import Awareness from "./pages/Awareness";

// Admin pages
import AdminSetup from "./pages/admin/AdminSetup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/content/AdminArticles";
import AdminAwareness from "./pages/admin/content/AdminAwareness";
import AdminAnalysis from "./pages/admin/content/AdminAnalysis";
import AdminReports from "./pages/admin/content/AdminReports";
import AdminBulletin from "./pages/admin/content/AdminBulletin";
import AdminNews from "./pages/admin/updates/AdminNews";
import AdminCirculars from "./pages/admin/updates/AdminCirculars";
import AdminPolls from "./pages/admin/engagement/AdminPolls";
import AdminSurveys from "./pages/admin/engagement/AdminSurveys";
import AdminReviews from "./pages/admin/engagement/AdminReviews";
import AdminNewsletter from "./pages/admin/engagement/AdminNewsletter";
import AdminNewsletterComposer from "./pages/admin/engagement/AdminNewsletterComposer";
import AdminJobOpenings from "./pages/admin/careers/AdminJobOpenings";
import AdminApplications from "./pages/admin/careers/AdminApplications";

import AdminPress from "./pages/admin/AdminPress";
import AdminRSSSettings from "./pages/admin/settings/AdminRSSSettings";
import AdminUsers from "./pages/admin/settings/AdminUsers";
import AdminAIUsage from "./pages/admin/settings/AdminAIUsage";
import AdminAuditLog from "./pages/admin/settings/AdminAuditLog";
import AdminCalculatorLeads from "./pages/admin/settings/AdminCalculatorLeads";
import AdminWorkflows from "./pages/admin/settings/AdminWorkflows";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminCRMPipeline from "./pages/admin/sales/AdminCRMPipeline";
import AdminPipelineConfig from "./pages/admin/sales/AdminPipelineConfig";
import AdminCRMDeals from "./pages/admin/sales/AdminCRMDeals";
import AdminCRMContacts from "./pages/admin/sales/AdminCRMContacts";
import AdminCRMActivities from "./pages/admin/sales/AdminCRMActivities";

import AdminSitePages from "./pages/admin/site/AdminSitePages";
import AdminSiteSettings from "./pages/admin/site/AdminSiteSettings";
import AdminMediaLibrary from "./pages/admin/site/AdminMediaLibrary";
import AdminImportArticles from "./pages/admin/content/AdminImportArticles";
import AdminMarketHolidays from "./pages/admin/calendars/AdminMarketHolidays";
import AdminEconomicEvents from "./pages/admin/calendars/AdminEconomicEvents";
import AdminImportEconomicEvents from "./pages/admin/calendars/AdminImportEconomicEvents";
import AdminCorporateEvents from "./pages/admin/calendars/AdminCorporateEvents";
import AdminLegal from "./pages/admin/legal/AdminLegal";
import AdminInvestorCharter from "./pages/admin/legal/AdminInvestorCharter";
import AdminTickets from "./pages/admin/support/AdminTickets";
import AdminTicketDetail from "./pages/admin/support/AdminTicketDetail";
import AdminKnowledgeBase from "./pages/admin/support/AdminKnowledgeBase";
import AdminCannedResponses from "./pages/admin/support/AdminCannedResponses";
import AdminSupportDocuments from "./pages/admin/support/AdminSupportDocuments";
import AdminIssueTypes from "./pages/admin/support/AdminIssueTypes";
import AdminEscalationMatrix from "./pages/admin/support/AdminEscalationMatrix";
import AdminEmployees from "./pages/admin/hr/AdminEmployees";
import AdminLeaveManagement from "./pages/admin/hr/AdminLeaveManagement";
import AdminAttendance from "./pages/admin/hr/AdminAttendance";
import AdminTeamMembers from "./pages/admin/careers/AdminTeamMembers";
import AdminInvoices from "./pages/admin/accounts/AdminInvoices";
import AdminPayroll from "./pages/admin/accounts/AdminPayroll";
import AdminFirmProfile from "./pages/admin/accounts/AdminFirmProfile";
import AdminTaxRates from "./pages/admin/accounts/AdminTaxRates";
import AdminBankAccounts from "./pages/admin/accounts/AdminBankAccounts";
import AdminPaymentTerms from "./pages/admin/accounts/AdminPaymentTerms";
import AdminServiceCatalog from "./pages/admin/accounts/AdminServiceCatalog";
import AdminSalaryComponents from "./pages/admin/accounts/AdminSalaryComponents";
import AdminPartnerPayouts from "./pages/admin/accounts/AdminPartnerPayouts";
import AdminCommissionClaims from "./pages/admin/accounts/AdminCommissionClaims";
import AdminAgreements from "./pages/admin/legal/AdminAgreements";
import Sitemap from "./pages/Sitemap";
import RaiseTicket from "./pages/RaiseTicket";

// Portal pages
import PortalLogin from "./pages/portal/PortalLogin";
import PortalSignup from "./pages/portal/PortalSignup";
import PortalDashboard from "./pages/portal/PortalDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ScrollDownFAB />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/:productSlug" element={<SupportProduct />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Calculator pages */}
          <Route path="/calculators/brokerage" element={<BrokerageCalculator />} />
          <Route path="/calculators/margin" element={<MarginCalculator />} />
          <Route path="/calculators/sip" element={<SIPCalculator />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          
          {/* Resources */}
          <Route path="/insights" element={<Insights />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/market-holidays" element={<MarketHolidays />} />
          <Route path="/economic-calendar" element={<EconomicCalendar />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calendars" element={<Calendars />} />
          
          {/* Company pages */}
          <Route path="/services" element={<Services />} />
          <Route path="/network" element={<Network />} />
          <Route path="/media" element={<Media />} />
          <Route path="/csr" element={<CSR />} />
          <Route path="/about/philosophy" element={<Philosophy />} />
          <Route path="/open-account" element={<OpenAccount />} />
          
          {/* Support pages */}
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/raise-ticket" element={<RaiseTicket />} />
          
          {/* Legal pages */}
          <Route path="/legal" element={<Legal />} />
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
          <Route path="/updates/:mode/:id" element={<UpdatesDetail />} />
          
          {/* Product landing pages */}
          <Route path="/choicefinx" element={<ChoiceFinX />} />
          <Route path="/tickfunds" element={<TickFunds />} />
          <Route path="/tushil" element={<TushilPage />} />
          <Route path="/awareness" element={<Awareness />} />

          {/* Article & Analysis detail */}
          <Route path="/insights/articles/:id" element={<ArticleDetail />} />
          <Route path="/insights/analysis/:id" element={<AnalysisDetail />} />

          {/* Admin — Auth */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Admin — Marketing */}
          <Route path="/admin/marketing/content/articles" element={<AdminArticles />} />
          <Route path="/admin/marketing/content/awareness" element={<AdminAwareness />} />
          <Route path="/admin/marketing/content/analysis" element={<AdminAnalysis />} />
          <Route path="/admin/marketing/content/reports" element={<AdminReports />} />
          <Route path="/admin/marketing/content/bulletin" element={<AdminBulletin />} />
          <Route path="/admin/marketing/content/import" element={<AdminImportArticles />} />
          <Route path="/admin/marketing/updates/news" element={<AdminNews />} />
          <Route path="/admin/marketing/updates/circulars" element={<AdminCirculars />} />
          <Route path="/admin/marketing/engagement/polls" element={<AdminPolls />} />
          <Route path="/admin/marketing/engagement/surveys" element={<AdminSurveys />} />
          <Route path="/admin/marketing/engagement/reviews" element={<AdminReviews />} />
          <Route path="/admin/marketing/engagement/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/marketing/engagement/composer" element={<AdminNewsletterComposer />} />
          <Route path="/admin/marketing/press" element={<AdminPress />} />
          <Route path="/admin/marketing/calendars/holidays" element={<AdminMarketHolidays />} />
          <Route path="/admin/marketing/calendars/economic" element={<AdminEconomicEvents />} />
          <Route path="/admin/marketing/calendars/import-economic" element={<AdminImportEconomicEvents />} />
          <Route path="/admin/marketing/calendars/corporate" element={<AdminCorporateEvents />} />
          <Route path="/admin/marketing/site/settings" element={<AdminSiteSettings />} />
          <Route path="/admin/marketing/site/pages" element={<AdminSitePages />} />
          <Route path="/admin/marketing/site/media" element={<AdminMediaLibrary />} />

          {/* Admin — Sales */}
          <Route path="/admin/sales/crm/pipeline" element={<AdminCRMPipeline />} />
          <Route path="/admin/sales/crm/pipeline-config" element={<AdminPipelineConfig />} />
          <Route path="/admin/sales/crm/deals" element={<AdminCRMDeals />} />
          <Route path="/admin/sales/crm/contacts" element={<AdminCRMContacts />} />
          <Route path="/admin/sales/crm/activities" element={<AdminCRMActivities />} />
          
          <Route path="/admin/sales/leads" element={<AdminLeads />} />
          <Route path="/admin/sales/calculator-leads" element={<AdminCalculatorLeads />} />

          {/* Admin — HR */}
          <Route path="/admin/hr/careers/openings" element={<AdminJobOpenings />} />
          <Route path="/admin/hr/careers/applications" element={<AdminApplications />} />
          <Route path="/admin/hr/employees" element={<AdminEmployees />} />
          <Route path="/admin/hr/leave" element={<AdminLeaveManagement />} />
          <Route path="/admin/hr/attendance" element={<AdminAttendance />} />
          <Route path="/admin/hr/careers/team" element={<AdminTeamMembers />} />

          {/* Admin — Accounts */}
          <Route path="/admin/accounts/firm-profile" element={<AdminFirmProfile />} />
          <Route path="/admin/accounts/tax-rates" element={<AdminTaxRates />} />
          <Route path="/admin/accounts/bank-accounts" element={<AdminBankAccounts />} />
          <Route path="/admin/accounts/payment-terms" element={<AdminPaymentTerms />} />
          <Route path="/admin/accounts/service-catalog" element={<AdminServiceCatalog />} />
          <Route path="/admin/accounts/salary-components" element={<AdminSalaryComponents />} />
          <Route path="/admin/accounts/invoices" element={<AdminInvoices />} />
          <Route path="/admin/accounts/payroll" element={<AdminPayroll />} />
          <Route path="/admin/accounts/partner-payouts" element={<AdminPartnerPayouts />} />
          <Route path="/admin/accounts/commission-claims" element={<AdminCommissionClaims />} />

          {/* Admin — Legal & Compliance */}
          <Route path="/admin/legal/pages" element={<AdminLegal />} />
          <Route path="/admin/legal/investor-charter" element={<AdminInvestorCharter />} />
          <Route path="/admin/legal/agreements" element={<AdminAgreements />} />

          {/* Admin — Support */}
          <Route path="/admin/support/tickets" element={<AdminTickets />} />
          <Route path="/admin/support/tickets/:id" element={<AdminTicketDetail />} />
          <Route path="/admin/support/issue-types" element={<AdminIssueTypes />} />
          <Route path="/admin/support/escalation" element={<AdminEscalationMatrix />} />
          <Route path="/admin/support/knowledge-base" element={<AdminKnowledgeBase />} />
          <Route path="/admin/support/canned-responses" element={<AdminCannedResponses />} />
          <Route path="/admin/support/documents" element={<AdminSupportDocuments />} />

          {/* Admin — System Settings */}
          <Route path="/admin/settings/users" element={<AdminUsers />} />
          <Route path="/admin/settings/rss" element={<AdminRSSSettings />} />
          <Route path="/admin/settings/ai-usage" element={<AdminAIUsage />} />
          <Route path="/admin/settings/audit-log" element={<AdminAuditLog />} />
          <Route path="/admin/settings/workflows" element={<AdminWorkflows />} />

          {/* Sitemap */}
          <Route path="/sitemap" element={<Sitemap />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
