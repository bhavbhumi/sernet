import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Signup', href: '/signup' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Support', href: '/support' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="container-zerodha flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">ZERODHA</span>
          </div>
        </Link>

        {/* Desktop Navigation - shown on md and above */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Hamburger menu button - always visible on right side of nav links */}
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu button - only visible on mobile */}
        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-16 w-full md:w-80 bg-background border border-border shadow-lg z-50"
          >
            <div className="py-4">
              {/* Mobile nav links - only shown on mobile */}
              <div className="md:hidden border-b border-border pb-4 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Additional menu items for hamburger dropdown */}
              <div className="space-y-1">
                <a
                  href="https://kite.zerodha.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kite
                </a>
                <a
                  href="https://console.zerodha.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Console
                </a>
                <a
                  href="https://coin.zerodha.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Coin
                </a>
                <a
                  href="https://varsity.zerodha.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Varsity
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay to close menu when clicking outside */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};
