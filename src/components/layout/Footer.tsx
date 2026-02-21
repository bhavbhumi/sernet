import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import sernetLogo from '@/assets/sernet-logo.png';

const footerLinks = {
  company: [
    { nameKey: 'about.tabs.company', href: '/about?tab=Company' },
    { nameKey: 'footer.careers', href: '/about?tab=Careers' },
    { nameKey: 'footer.press', href: '/about?tab=Press' },
    { nameKey: 'footer.recognition', href: '/about?tab=Recognition' },
    { nameKey: 'footer.reviews', href: '/about?tab=Reviews' },
  ],
  explore: [
    { nameKey: 'common.knowMore', label: 'Tick Funds', href: '/tickfunds' },
    { nameKey: 'common.knowMore', label: 'Tushil', href: '/tushil' },
    { nameKey: 'common.knowMore', label: 'Choice FinX', href: '/choicefinx' },
    { nameKey: 'common.knowMore', label: 'Findemy', href: '/findemy' },
    { nameKey: 'nav.insights', href: '/insights' },
  ],
  support: [
    { nameKey: 'footer.contactUs', href: '/contact' },
    { nameKey: 'footer.helpDesk', href: '/support' },
    { nameKey: 'footer.opinions', href: '/opinions' },
    { nameKey: 'footer.quickLinks', href: '/quick-links' },
    { nameKey: 'footer.investorCharter', href: '/investor-charter' },
  ],
};

const socialLinks = [
  { name: 'X', href: 'https://twitter.com/sernetindia', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )},
  { name: 'Instagram', href: 'https://instagram.com/sernetindia', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  )},
  { name: 'LinkedIn', href: 'https://linkedin.com/company/sernetindia', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )},
  { name: 'YouTube', href: 'https://youtube.com/@sernetindia', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
    </svg>
  )},
  { name: 'WhatsApp', href: 'https://wa.me/919206767670', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )},
  { name: 'Telegram', href: 'https://t.me/sernetindia', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )},
];

const legalLinks: { nameKey?: string; label?: string; href: string }[] = [
  { nameKey: 'footer.terms', href: '/terms' },
  { nameKey: 'footer.privacy', href: '/privacy' },
  { nameKey: 'footer.policies', href: '/policies' },
  { nameKey: 'footer.disclosures', href: '/disclosure' },
  { label: 'Sitemap', href: '/sitemap' },
];

const FooterDisclosure = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="mt-8 pt-6 border-t border-border">
      {/* First paragraph always visible */}
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">Compliance Officer:</span> Mr Gaurav V Shah | <a href="mailto:compliance@sernetindia.com" className="text-primary hover:underline">compliance@sernetindia.com</a>. For any complaints, please write to <a href="mailto:complaint@sernetindia.com" className="text-primary hover:underline">complaint@sernetindia.com</a>. Please ensure you carefully read the <Link to="/disclosure" className="text-primary hover:underline">Mandatory Documents</Link> as prescribed by SEBI.
      </p>
      
      {/* Collapsible rest */}
      <div className={`space-y-3 mt-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100'}`}>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Financial Products and Services are provided by SERNET, it's Group Companies and third party service partners as mentioned <Link to="/network" className="text-primary hover:underline">here</Link>.
        </p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          We do not guarantee returns on any financial products or services what so ever. The tax treatment of these financial products is subject to individual circumstances and may change in the future.
        </p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Issued in the interest of investors:</span> Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day | KYC is one time exercise while dealing in securities markets – once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary | Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account | As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of SERNET and offering such services, please create a ticket <Link to="/support" className="text-primary hover:underline">here</Link>.
        </p>
      </div>
      
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="md:hidden flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
      >
        {expanded ? 'Show less' : 'Read full disclaimer'}
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container-zerodha py-8 md:py-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={sernetLogo}
                alt="Sernet"
                className="h-[25px] w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            
            {/* Registration Info */}
            <div className="text-[13px] text-muted-foreground mb-4 space-y-1">
              <p>CIN: U67190MH2004PTC144955</p>
              <p>AMFI MFD: ARN 35275</p>
            </div>

            {/* Google Map Embed */}
            <div className="mb-4">
              <a 
                href="https://maps.app.goo.gl/Go7HnWZV1trFUUFs8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-md border border-border hover:border-primary transition-colors"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9969099475193!2d72.8352!3d19.0442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c94b0af1c741%3A0xf7eb06b839a1bb3c!2sSERNET%20Financial%20Services%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="120"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SERNET Office Location"
                  className="pointer-events-none"
                />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-[13px] mb-4">
              <a 
                href="tel:+919206767670" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91 920 6767 670</span>
              </a>
              <a 
                href="mailto:contact@sernetindia.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@sernetindia.com</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="grid grid-cols-6 gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-[15px] font-medium text-foreground mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[14px] text-muted-foreground hover:text-primary active:text-primary visited:text-muted-foreground transition-colors"
                  >
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-[15px] font-medium text-foreground mb-4">{t('footer.explore')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[14px] text-muted-foreground hover:text-primary active:text-primary visited:text-muted-foreground transition-colors"
                  >
                    {link.label || t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-[15px] font-medium text-foreground mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[14px] text-muted-foreground hover:text-primary active:text-primary visited:text-muted-foreground transition-colors"
                  >
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclosure Section - collapsible on mobile */}
        <FooterDisclosure />
      </div>

      {/* Marquee Ribbon */}
      <div className="bg-primary/10 border-y border-primary/20 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-[13px] text-primary mx-8">
            Investments in Securities Market, Mutual Fund, PMS, AIF are subject to market and other risks, read all related documents carefully before investing. &nbsp;|&nbsp; There is no assurance of returns, and past performance is not indicative of future performance. &nbsp;|&nbsp; Investments in Company Fixed Deposits are subject to Credit Risk, Interest Rate Risk, and Liquidity Risk. &nbsp;|&nbsp; Digital Gold and Silver Investments are subject to Price Volatility and Market Risk. &nbsp;|&nbsp; Insurance is a subject matter of solicitation. Please read details on risk factors, terms, conditions, exclusions and sales brochure carefully before concluding a sale. &nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-[13px] text-primary mx-8">
            Investments in Securities Market, Mutual Fund, PMS, AIF are subject to market and other risks, read all related documents carefully before investing. &nbsp;|&nbsp; There is no assurance of returns, and past performance is not indicative of future performance. &nbsp;|&nbsp; Investments in Company Fixed Deposits are subject to Credit Risk, Interest Rate Risk, and Liquidity Risk. &nbsp;|&nbsp; Digital Gold and Silver Investments are subject to Price Volatility and Market Risk. &nbsp;|&nbsp; Insurance is a subject matter of solicitation. Please read details on risk factors, terms, conditions, exclusions and sales brochure carefully before concluding a sale. &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-muted/50 border-t border-border">
        <div className="container-zerodha py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px]">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-muted-foreground">
              <span>© {t('footer.madeWith')}, 2025</span>
            </div>
            <div className="flex items-center gap-4">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label ?? t(link.nameKey!)}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="text-muted-foreground/50">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
