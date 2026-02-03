import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Signup', href: '/signup' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Support', href: '/support' },
];

const menuSections = [
  {
    title: 'Signup/Login',
    links: [
      { name: 'Signup', href: '/signup', external: false },
      { name: 'Login to Kite', href: 'https://kite.zerodha.com', external: true },
      { name: 'Login to Console', href: 'https://console.zerodha.com', external: true },
    ],
  },
  {
    title: 'Products',
    links: [
      { name: 'Kite', href: '/products/kite', external: false },
      { name: 'Console', href: '/products/console', external: false },
      { name: 'Coin', href: '/products/coin', external: false },
      { name: 'Kite Connect', href: '/products/kite-connect', external: false },
      { name: 'Varsity', href: '/products/varsity', external: false },
      { name: 'Streak', href: '/products/streak', external: false },
      { name: 'Smallcase', href: '/products/smallcase', external: false },
      { name: 'Sensibull', href: '/products/sensibull', external: false },
      { name: 'GoldenPi', href: '/products/goldenpi', external: false },
      { name: 'TradingQ&A', href: '/tradingqna', external: false },
    ],
  },
  {
    title: 'Utilities',
    links: [
      { name: 'Brokerage calculator', href: '/calculators/brokerage', external: false },
      { name: 'Margin calculator', href: '/calculators/margin', external: false },
      { name: 'SIP calculator', href: '/calculators/sip', external: false },
      { name: 'Lumpsum calculator', href: '/calculators/lumpsum', external: false },
    ],
  },
  {
    title: 'Updates',
    links: [
      { name: 'Market overview', href: '/market-overview', external: false },
      { name: 'Z-Connect blog', href: '/z-connect', external: false },
      { name: 'List of charges', href: '/pricing', external: false },
      { name: 'Downloads', href: '/downloads', external: false },
      { name: 'Videos', href: '/videos', external: false },
    ],
  },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="container-zerodha flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="https://zerodha.com/static/images/logo.svg" 
            alt="Zerodha" 
            className="h-5"
          />
        </Link>

        {/* Desktop Navigation - shown on md and above */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? 'text-primary'
                  : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Hamburger menu button */}
          <button
            type="button"
            className="p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-16 w-full md:w-auto md:right-4 bg-background border border-border shadow-lg z-50"
          >
            <div className="p-6">
              {/* Mobile nav links */}
              <div className="md:hidden border-b border-border pb-4 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Menu sections in grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              to={link.href}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};
