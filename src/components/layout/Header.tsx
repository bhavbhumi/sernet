import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import sernetLogo from '@/assets/sernet-logo.png';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Network', href: '/network' },
  { name: 'Insights', href: '/z-connect' },
  { name: 'Contact', href: '/contact' },
];

const languages = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Punjabi'];

const menuSections = [
  {
    title: 'Signup / Login',
    links: [
      { name: 'Tick Funds', href: '/services', external: false },
      { name: 'Tushil', href: '/services', external: false },
      { name: 'Findemy', href: '/services', external: false },
      { name: 'Choice FinX', href: '/services', external: false },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Calculators', href: '/calculators', external: false },
      { name: 'Calendars', href: '/calendars', external: false },
      { name: 'Downloads', href: '/downloads', external: false },
    ],
  },
  {
    title: 'Updates',
    links: [
      { name: 'News', href: '/updates', external: false },
      { name: 'Circulars', href: '/updates', external: false },
    ],
  },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const langRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="container-zerodha flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={sernetLogo}
            alt="Sernet"
            className="h-[25px] w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-[16px] text-muted-foreground transition-colors hover:text-primary active:text-primary visited:text-muted-foreground ${
                location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Language Dropdown */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              className="flex items-center gap-1 text-[14px] text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">{selectedLang}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-background border border-border rounded-md shadow-lg z-50 py-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`block w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${
                      selectedLang === lang ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Hamburger menu button */}
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-primary active:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile: language + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <div ref={langRef} className="relative">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-5 w-5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-background border border-border rounded-md shadow-lg z-50 py-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`block w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${
                      selectedLang === lang ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-primary active:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
                    className={`block py-2 text-[16px] font-medium transition-colors hover:text-primary active:text-primary visited:text-muted-foreground ${
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
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
                              className="flex items-center gap-1 text-[15px] text-muted-foreground hover:text-primary active:text-primary visited:text-muted-foreground transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              to={link.href}
                              className="text-[15px] text-muted-foreground hover:text-primary active:text-primary visited:text-muted-foreground transition-colors"
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
