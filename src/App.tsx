import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { ScrollDownFAB } from "./components/shared/ScrollDownFAB";

// Only eagerly load the homepage — everything else is lazy
import Index from "./pages/Index";

// Skeleton fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// --- Lazy imports ---

// Core pages
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const AnalysisDetail = lazy(() => import("./pages/AnalysisDetail"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Support = lazy(() => import("./pages/Support"));
const SupportProduct = lazy(() => import("./pages/SupportProduct"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Calculator pages
const BrokerageCalculator = lazy(() => import("./pages/calculators/BrokerageCalculator"));
const MarginCalculator = lazy(() => import("./pages/calculators/MarginCalculator"));
const SIPCalculator = lazy(() => import("./pages/calculators/SIPCalculator"));
const LumpsumCalculator = lazy(() => import("./pages/calculators/LumpsumCalculator"));

// Other pages
const Insights = lazy(() => import("./pages/Insights"));
const DownloadsPage = lazy(() => import("./pages/DownloadsPage"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Calendars = lazy(() => import("./pages/Calendars"));
const Services = lazy(() => import("./pages/Services"));
const Network = lazy(() => import("./pages/Network"));
const Media = lazy(() => import("./pages/Media"));
const CSR = lazy(() => import("./pages/CSR"));
const Complaints = lazy(() => import("./pages/Complaints"));
const Philosophy = lazy(() => import("./pages/Philosophy"));
const OpenAccount = lazy(() => import("./pages/OpenAccount"));

// New pages
const MarketHolidays = lazy(() => import("./pages/MarketHolidays"));
const EconomicCalendar = lazy(() => import("./pages/EconomicCalendar"));
const InvestorCharter = lazy(() => import("./pages/InvestorCharter"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disclosure = lazy(() => import("./pages/Disclosure"));
const Policies = lazy(() => import("./pages/Policies"));
const Legal = lazy(() => import("./pages/Legal"));

// Sernet pages
const Reviews = lazy(() => import("./pages/Reviews"));
const QuickLinks = lazy(() => import("./pages/QuickLinks"));
const CreditClaim = lazy(() => import("./pages/CreditClaim"));
const ScheduleCall = lazy(() => import("./pages/ScheduleCall"));
const Opinions = lazy(() => import("./pages/Opinions"));
const UpdatesPage = lazy(() => import("./pages/Updates"));
const UpdatesDetail = lazy(() => import("./pages/UpdatesDetail"));
const Contact = lazy(() => import("./pages/Contact"));

// Product landing pages
const ChoiceFinX = lazy(() => import("./pages/ChoiceFinX"));
const TickFunds = lazy(() => import("./pages/TickFunds"));
const TushilPage = lazy(() => import("./pages/Tushil"));
const Awareness = lazy(() => import("./pages/Awareness"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const RaiseTicket = lazy(() => import("./pages/RaiseTicket"));

// Unified login
const Login = lazy(() => import("./pages/Login"));

// Portal pages
const PortalLogin = lazy(() => import("./pages/portal/PortalLogin"));
const PortalSignup = lazy(() => import("./pages/portal/PortalSignup"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PartnerDashboard = lazy(() => import("./pages/portal/PartnerDashboard"));

// Employee portal
const EmployeeDashboard = lazy(() => import("./pages/employee/EmployeeDashboard"));

// Admin pages
const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
// Legacy standalone content admin pages (AdminArticles, AdminAwareness, AdminAnalysis, AdminReports, AdminNews, AdminCirculars) removed — unified into AdminPosts & AdminFeeds
const AdminBulletin = lazy(() => import("./pages/admin/content/AdminBulletin"));
const AdminPosts = lazy(() => import("./pages/admin/content/AdminPosts"));
const AdminFeeds = lazy(() => import("./pages/admin/content/AdminFeeds"));
const AdminPolls = lazy(() => import("./pages/admin/engagement/AdminPolls"));
const AdminSurveys = lazy(() => import("./pages/admin/engagement/AdminSurveys"));
const AdminReviews = lazy(() => import("./pages/admin/engagement/AdminReviews"));
const AdminNewsletter = lazy(() => import("./pages/admin/engagement/AdminNewsletter"));
const AdminNewsletterComposer = lazy(() => import("./pages/admin/engagement/AdminNewsletterComposer"));
const AdminJobOpenings = lazy(() => import("./pages/admin/careers/AdminJobOpenings"));
const AdminApplications = lazy(() => import("./pages/admin/careers/AdminApplications"));
const AdminPress = lazy(() => import("./pages/admin/AdminPress"));
const AdminRSSSettings = lazy(() => import("./pages/admin/settings/AdminRSSSettings"));
const AdminUsers = lazy(() => import("./pages/admin/settings/AdminUsers"));
const AdminAIUsage = lazy(() => import("./pages/admin/settings/AdminAIUsage"));
const AdminAuditLog = lazy(() => import("./pages/admin/settings/AdminAuditLog"));
const AdminMonitor = lazy(() => import("./pages/admin/settings/AdminMonitor"));
const AdminCalculatorLeads = lazy(() => import("./pages/admin/settings/AdminCalculatorLeads"));
const AdminWorkflows = lazy(() => import("./pages/admin/settings/AdminWorkflows"));
// AdminPermissions merged into AdminUsers
const AdminLeads = lazy(() => import("./pages/admin/sales/AdminUnifiedLeads"));
const AdminCRMPipeline = lazy(() => import("./pages/admin/sales/AdminCRMPipeline"));
const AdminPipelineConfig = lazy(() => import("./pages/admin/sales/AdminPipelineConfig"));
const AdminCRMDeals = lazy(() => import("./pages/admin/sales/AdminCRMDeals"));
const AdminCRMContacts = lazy(() => import("./pages/admin/sales/AdminCRMContacts"));
const AdminSitePages = lazy(() => import("./pages/admin/site/AdminSitePages"));
const AdminSiteSettings = lazy(() => import("./pages/admin/site/AdminSiteSettings"));
const AdminSEOAudit = lazy(() => import("./pages/admin/site/AdminSEOAudit"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/site/AdminMediaLibrary"));
const AdminImportArticles = lazy(() => import("./pages/admin/content/AdminImportArticles"));
const AdminMarketHolidays = lazy(() => import("./pages/admin/calendars/AdminMarketHolidays"));
const AdminEconomicEvents = lazy(() => import("./pages/admin/calendars/AdminEconomicEvents"));
const AdminImportEconomicEvents = lazy(() => import("./pages/admin/calendars/AdminImportEconomicEvents"));
const AdminCorporateEvents = lazy(() => import("./pages/admin/calendars/AdminCorporateEvents"));
const AdminLegal = lazy(() => import("./pages/admin/legal/AdminLegal"));
const AdminInvestorCharter = lazy(() => import("./pages/admin/legal/AdminInvestorCharter"));
const AdminTickets = lazy(() => import("./pages/admin/support/AdminTickets"));
const AdminTicketDetail = lazy(() => import("./pages/admin/support/AdminTicketDetail"));
const AdminKnowledgeBase = lazy(() => import("./pages/admin/support/AdminKnowledgeBase"));
const AdminCannedResponses = lazy(() => import("./pages/admin/support/AdminCannedResponses"));
const AdminSupportDocuments = lazy(() => import("./pages/admin/support/AdminSupportDocuments"));
const AdminIssueTypes = lazy(() => import("./pages/admin/support/AdminIssueTypes"));
const AdminEscalationMatrix = lazy(() => import("./pages/admin/support/AdminEscalationMatrix"));
const AdminEmployees = lazy(() => import("./pages/admin/hr/AdminEmployees"));
const AdminLeaveManagement = lazy(() => import("./pages/admin/hr/AdminLeaveManagement"));
const AdminAttendance = lazy(() => import("./pages/admin/hr/AdminAttendance"));
const AdminAttendanceReport = lazy(() => import("./pages/admin/hr/AdminAttendanceReport"));
const AdminSalarySetup = lazy(() => import("./pages/admin/hr/AdminSalarySetup"));
const AdminPayrollRun = lazy(() => import("./pages/admin/hr/AdminPayrollRun"));
const AdminStatutoryDues = lazy(() => import("./pages/admin/hr/AdminStatutoryDues"));
const AdminImportSpine = lazy(() => import("./pages/admin/hr/AdminImportSpine"));
const AdminTeamMembers = lazy(() => import("./pages/admin/careers/AdminTeamMembers"));
const AdminInvoices = lazy(() => import("./pages/admin/accounts/AdminInvoices"));
const AdminPayroll = lazy(() => import("./pages/admin/accounts/AdminPayroll"));
const AdminFirmProfile = lazy(() => import("./pages/admin/accounts/AdminFirmProfile"));
const AdminTaxRates = lazy(() => import("./pages/admin/accounts/AdminTaxRates"));
const AdminBankAccounts = lazy(() => import("./pages/admin/accounts/AdminBankAccounts"));
const AdminPaymentTerms = lazy(() => import("./pages/admin/accounts/AdminPaymentTerms"));
const AdminServiceCatalog = lazy(() => import("./pages/admin/accounts/AdminServiceCatalog"));
const AdminSalaryComponents = lazy(() => import("./pages/admin/accounts/AdminSalaryComponents"));
const AdminPartnerPayouts = lazy(() => import("./pages/admin/accounts/AdminPartnerPayouts"));
const AdminCommissionClaims = lazy(() => import("./pages/admin/accounts/AdminCommissionClaims"));
const AdminAgreements = lazy(() => import("./pages/admin/legal/AdminAgreements"));
const AdminHealth = lazy(() => import("./pages/admin/settings/AdminHealth"));
const AdminMasterData = lazy(() => import("./pages/admin/settings/AdminMasterData"));
const AdminCampaigns = lazy(() => import("./pages/admin/marketing/AdminCampaigns"));
const AdminLeadAttribution = lazy(() => import("./pages/admin/marketing/AdminLeadAttribution"));
const AdminEvents = lazy(() => import("./pages/admin/marketing/AdminEvents"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ScrollDownFAB />
        <Suspense fallback={<PageLoader />}>
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

            {/* Unified Login */}
            <Route path="/login" element={<Login />} />

            {/* Portal — Client & Partner */}
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal/signup" element={<PortalSignup />} />
            <Route path="/portal" element={<PortalDashboard />} />
            <Route path="/portal/partner" element={<PartnerDashboard />} />

            {/* Employee Portal */}
            <Route path="/employee" element={<EmployeeDashboard />} />

            {/* Admin — Auth */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Admin — Marketing (unified) */}
            <Route path="/admin/marketing/content/posts" element={<AdminPosts />} />
            <Route path="/admin/marketing/content/feeds" element={<AdminFeeds />} />
            <Route path="/admin/marketing/content/bulletin" element={<AdminBulletin />} />
            <Route path="/admin/marketing/content/import" element={<AdminImportArticles />} />
            {/* Legacy routes → redirect to unified pages */}
            <Route path="/admin/marketing/content/articles" element={<AdminPosts />} />
            <Route path="/admin/marketing/content/awareness" element={<AdminPosts />} />
            <Route path="/admin/marketing/content/analysis" element={<AdminPosts />} />
            <Route path="/admin/marketing/content/reports" element={<AdminPosts />} />
            <Route path="/admin/marketing/updates/news" element={<AdminFeeds />} />
            <Route path="/admin/marketing/updates/circulars" element={<AdminFeeds />} />
            <Route path="/admin/marketing/engagement/polls" element={<AdminPolls />} />
            <Route path="/admin/marketing/engagement/surveys" element={<AdminSurveys />} />
            <Route path="/admin/marketing/engagement/reviews" element={<AdminReviews />} />
            <Route path="/admin/marketing/engagement/newsletter" element={<AdminNewsletter />} />
            <Route path="/admin/marketing/engagement/composer" element={<AdminNewsletterComposer />} />
            <Route path="/admin/marketing/campaigns/tracker" element={<AdminCampaigns />} />
            <Route path="/admin/marketing/campaigns/attribution" element={<AdminLeadAttribution />} />
            <Route path="/admin/marketing/campaigns/events" element={<AdminEvents />} />
            <Route path="/admin/marketing/press" element={<AdminPress />} />
            <Route path="/admin/marketing/calendars/holidays" element={<AdminMarketHolidays />} />
            <Route path="/admin/marketing/calendars/economic" element={<AdminEconomicEvents />} />
            <Route path="/admin/marketing/calendars/import-economic" element={<AdminImportEconomicEvents />} />
            <Route path="/admin/marketing/calendars/corporate" element={<AdminCorporateEvents />} />
            <Route path="/admin/marketing/site/settings" element={<AdminSiteSettings />} />
            <Route path="/admin/marketing/site/pages" element={<AdminSitePages />} />
            <Route path="/admin/marketing/site/seo" element={<AdminSEOAudit />} />
            <Route path="/admin/marketing/site/media" element={<AdminMediaLibrary />} />

            {/* Admin — Sales */}
            <Route path="/admin/sales/crm/leads" element={<AdminLeads />} />
            <Route path="/admin/sales/leads" element={<AdminLeads />} />
            <Route path="/admin/sales/crm/pipeline" element={<AdminCRMDeals />} />
            <Route path="/admin/sales/crm/pipeline-config" element={<AdminPipelineConfig />} />
            <Route path="/admin/sales/crm/deals" element={<AdminCRMDeals />} />
            <Route path="/admin/sales/crm/contacts" element={<AdminCRMContacts />} />
            <Route path="/admin/sales/calculator-leads" element={<AdminLeads />} />

            {/* Admin — HR */}
            <Route path="/admin/hr/careers/openings" element={<AdminJobOpenings />} />
            <Route path="/admin/hr/careers/applications" element={<AdminApplications />} />
            <Route path="/admin/hr/employees" element={<AdminEmployees />} />
            <Route path="/admin/hr/leave" element={<AdminLeaveManagement />} />
            <Route path="/admin/hr/attendance" element={<AdminAttendance />} />
            <Route path="/admin/hr/attendance/report" element={<AdminAttendanceReport />} />
            <Route path="/admin/hr/salary-setup" element={<AdminSalarySetup />} />
            <Route path="/admin/hr/payroll/run" element={<AdminPayrollRun />} />
            <Route path="/admin/hr/payroll/statutory" element={<AdminStatutoryDues />} />
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
            <Route path="/admin/settings/master-data" element={<AdminMasterData />} />
            <Route path="/admin/settings/users" element={<AdminUsers />} />
            <Route path="/admin/settings/permissions" element={<AdminUsers />} />
            <Route path="/admin/settings/rss" element={<AdminRSSSettings />} />
            <Route path="/admin/settings/ai-usage" element={<AdminAIUsage />} />
            <Route path="/admin/settings/audit-log" element={<AdminAuditLog />} />
            <Route path="/admin/settings/workflows" element={<AdminWorkflows />} />
            <Route path="/admin/settings/health" element={<AdminHealth />} />
            <Route path="/admin/settings/monitor" element={<AdminMonitor />} />

            {/* Sitemap */}
            <Route path="/sitemap" element={<Sitemap />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
