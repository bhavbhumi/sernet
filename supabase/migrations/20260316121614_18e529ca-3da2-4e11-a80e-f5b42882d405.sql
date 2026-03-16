-- Keyword: "financial planning services" (1,200/mo) → /services
UPDATE site_pages SET 
  meta_title = 'Financial Planning Services – Trading, Investment & Insurance',
  meta_description = 'Explore SERNET''s financial planning services: zero-brokerage trading, mutual fund investment strategies, insurance products comparison, estate planning and credit counselling.'
WHERE path = '/services';

-- Keyword: "wealth management tips" (1,000/mo) → /insights
UPDATE site_pages SET 
  meta_title = 'Wealth Management Tips & Market Insights | SERNET',
  meta_description = 'Expert wealth management tips, mutual fund investment strategies, market analysis, and financial literacy resources from SERNET''s research desk.'
WHERE path = '/insights';

-- Keyword: "mutual fund investment strategies" (900/mo) → /tickfunds
UPDATE site_pages SET 
  meta_title = 'TickFunds – Mutual Fund Investment Strategies | SERNET',
  meta_description = 'Discover mutual fund investment strategies with TickFunds by SERNET. Goal-based planning, SIP calculators, and expert-curated fund recommendations.'
WHERE path = '/tickfunds';

-- Keyword: "trading education resources" (800/mo) → /services?tab=Trading
UPDATE site_pages SET 
  meta_title = 'Online Trading Education & Resources | SERNET',
  meta_description = 'Access trading education resources: equity, F&O, commodities and currency trading with zero-brokerage delivery on ChoiceFinX platform.'
WHERE path = '/services' AND tab_name = 'Trading';

-- Keyword: "insurance products comparison" (700/mo) → /tushil
UPDATE site_pages SET 
  meta_title = 'Insurance Products Comparison & Advisory | Tushil',
  meta_description = 'Compare insurance products across life, health, motor and general categories. Tushil by SERNET offers unbiased advisory and claim support.'
WHERE path = '/tushil';

-- Keyword: "tax planning strategies" (650/mo) → /services?tab=Estate Planning
UPDATE site_pages SET 
  meta_title = 'Estate & Tax Planning Strategies | SERNET',
  meta_description = 'Expert estate and tax planning strategies including wills, trusts, succession planning, and wealth transfer advisory from SERNET professionals.'
WHERE path = '/services' AND tab_name = 'Estate Planning';

-- Keyword: "financial literacy courses" (500/mo) → /awareness
UPDATE site_pages SET 
  meta_title = 'Financial Literacy Courses & Investor Education',
  meta_description = 'Free financial literacy courses and investor awareness resources from SERNET. Learn about mutual funds, trading basics, tax planning and personal finance.'
WHERE path = '/awareness';

-- Keyword: "international investment opportunities" (450/mo) → /network
UPDATE site_pages SET 
  meta_title = 'Global Network & International Investment Opportunities',
  meta_description = 'Explore international investment opportunities through SERNET''s network of clients, partners and principals across 18 countries and 54 cities.'
WHERE path = '/network';

-- Also enrich Home page meta with core keywords
UPDATE site_pages SET 
  meta_description = 'SERNET Financial Services – 35+ years of wealth management. Financial planning services, zero-brokerage trading, mutual fund strategies & insurance advisory.'
WHERE path = '/';