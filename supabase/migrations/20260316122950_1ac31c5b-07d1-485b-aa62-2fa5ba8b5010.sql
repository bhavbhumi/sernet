-- Fix /services: title ≤60 chars, desc ≤160 chars
UPDATE site_pages SET 
  meta_title = 'Financial Advisory Services – Trading & Investment',
  meta_description = 'SERNET financial advisory services: online trading platforms, mutual fund investment strategies, insurance solutions for families, estate planning & more.'
WHERE path = '/services' AND tab_name = 'Services';

-- Enrich / (home) with new keywords
UPDATE site_pages SET 
  meta_description = 'Trusted wealth management services by SERNET. Financial service providers across 54 cities, 18 countries. Online trading, mutual funds & retirement planning.'
WHERE path = '/' AND tab_name = 'Home';

-- Enrich /about with long-tail keywords
UPDATE site_pages SET 
  meta_title = 'About SERNET – Next Generation Financial Services',
  meta_description = 'Discover SERNET''s 35+ year journey as trusted financial service providers. Comprehensive financial planning, wealth management for individuals & families.'
WHERE path = '/about' AND tab_name = 'Company';

-- Enrich /network with cross-border keywords
UPDATE site_pages SET 
  meta_title = 'SERNET Network – Financial Services Across 54 Cities',
  meta_description = 'Cross-border financial services and investment opportunities in India. Next generation financial service network spanning 18 countries and 54 cities.'
WHERE path = '/network' AND tab_name = 'Network';

-- Enrich /tickfunds
UPDATE site_pages SET 
  meta_title = 'TickFunds – Mutual Fund Investment & Retirement Plans',
  meta_description = 'Mutual fund investment strategies and retirement planning services. Goal-based wealth management for individuals with SIP calculators & expert guidance.'
WHERE path = '/tickfunds' AND tab_name = 'TickFunds';

-- Enrich /tushil
UPDATE site_pages SET 
  meta_title = 'Tushil – Insurance Solutions for Families & More',
  meta_description = 'Compare insurance solutions for families across life, health, motor & general categories. Trusted wealth management services with claim support.'
WHERE path = '/tushil' AND tab_name = 'Tushil';

-- Enrich /choicefinx
UPDATE site_pages SET 
  meta_title = 'ChoiceFinX – Online Trading Platform by SERNET',
  meta_description = 'Online trading platforms for stocks, F&O, commodities & currency. Zero brokerage delivery trading with financial literacy programs and investor education.'
WHERE path = '/choicefinx' AND tab_name = 'ChoiceFinX';

-- Enrich /calculators
UPDATE site_pages SET 
  meta_description = 'Free financial calculators for retirement planning services, SIP goals, brokerage & margin. Comprehensive financial planning tools by SERNET.'
WHERE path = '/calculators' AND tab_name = 'Calculators';