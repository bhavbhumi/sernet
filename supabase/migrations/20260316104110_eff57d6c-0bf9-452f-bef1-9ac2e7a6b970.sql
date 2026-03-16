UPDATE site_pages SET 
  meta_title = CASE path
    WHEN '/about?tab=Careers' THEN 'Careers at SERNET Financial'
    WHEN '/about?tab=Press' THEN 'Press & Media Coverage'
    WHEN '/about?tab=Recognition' THEN 'Awards & Recognition'
    WHEN '/about?tab=Reviews' THEN 'Client Reviews & Testimonials'
    WHEN '/z-connect' THEN 'Z-Connect Knowledge Hub'
    WHEN '/tradingqna' THEN 'Trading Q&A Forum'
    WHEN '/market-holidays' THEN 'Stock Market Holidays 2025'
    WHEN '/economic-calendar' THEN 'Economic Events Calendar'
    WHEN '/reviews' THEN 'SERNET Client Reviews'
    WHEN '/schedule-call' THEN 'Schedule a Free Consultation'
    WHEN '/complaints/status' THEN 'Track Complaint Status'
    WHEN '/about/philosophy' THEN 'Our Investment Philosophy'
    ELSE title
  END,
  meta_description = CASE path
    WHEN '/about?tab=Careers' THEN 'Join the SERNET team. Explore career opportunities in wealth management, trading, and financial services across India.'
    WHEN '/about?tab=Press' THEN 'Latest press releases, media coverage, and news about SERNET Financial Services.'
    WHEN '/about?tab=Recognition' THEN 'Awards and industry recognition earned by SERNET Financial Services over 35+ years.'
    WHEN '/about?tab=Reviews' THEN 'Read what clients say about SERNET. Genuine reviews from investors, traders, and partners.'
    WHEN '/z-connect' THEN 'Access Z-Connect, your knowledge hub for financial literacy, market insights, and investor education.'
    WHEN '/tradingqna' THEN 'Get answers to your trading and investment questions from the SERNET community and experts.'
    WHEN '/market-holidays' THEN 'Complete list of NSE & BSE market holidays for 2025. Plan your trades around stock exchange closures.'
    WHEN '/economic-calendar' THEN 'Track upcoming economic events, RBI policy dates, GDP releases, and global indicators that impact Indian markets.'
    WHEN '/reviews' THEN 'Honest client reviews and ratings for SERNET Financial Services. See why investors trust us.'
    WHEN '/schedule-call' THEN 'Book a free consultation with a SERNET financial advisor. Get personalised guidance on investments, insurance, and more.'
    WHEN '/complaints/status' THEN 'Track the status of your complaint filed with SERNET Financial Services.'
    WHEN '/about/philosophy' THEN 'Discover SERNET''s investment philosophy — client-first approach, long-term thinking, and transparent financial guidance.'
    ELSE meta_description
  END
WHERE (meta_title IS NULL OR meta_description IS NULL OR meta_title = '' OR meta_description = '')
  AND path IN ('/about?tab=Careers','/about?tab=Press','/about?tab=Recognition','/about?tab=Reviews','/z-connect','/tradingqna','/market-holidays','/economic-calendar','/reviews','/schedule-call','/complaints/status','/about/philosophy');