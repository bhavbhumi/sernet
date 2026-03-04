import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Globe, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '@/i18n';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SearchCommandPalette } from '@/components/shared/SearchCommandPalette';

import sernetLogo from '@/assets/sernet-logo.png';

const navLinks = [
  { nameKey: 'nav.about', href: '/about' },
  { nameKey: 'nav.services', href: '/services' },
  { nameKey: 'nav.network', href: '/network' },
  { nameKey: 'nav.insights', href: '/insights' },
  { nameKey: 'nav.contact', href: '/contact' },
];

const menuSections = [
  {
    titleKey: 'menu.signupLogin',
    links: [
      { name: 'Client & Partner Portal', href: '/portal/login', external: false },
      { name: 'Tick Funds', href: '/tickfunds', external: false },
      { name: 'Tushil', href: '/tushil', external: false },
      
      { name: 'Choice FinX', href: '/choicefinx', external: false },
    ],
  },
  {
    titleKey: 'menu.resources',
    links: [
      { nameKey: 'menu.calculators', href: '/calculators', external: false },
      { nameKey: 'menu.calendars', href: '/calendars', external: false },
      { nameKey: 'menu.downloads', href: '/downloads', external: false },
    ],
  },
  {
    titleKey: 'menu.updates',
    links: [
      { nameKey: 'menu.news', href: '/updates', external: false },
      { nameKey: 'menu.circulars', href: '/updates', external: false },
    ],
  },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const currentLang = languageOptions.find(l => l.code === i18n.language) || languageOptions[0];

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopLangRef.current && !desktopLangRef.current.contains(e.target as Node) &&
        mobileLangRef.current && !mobileLangRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="container-sernet flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={sernetLogo}
            alt="Sernet"
            className="h-[25px] w-auto dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[15px] xl:text-[17px] whitespace-nowrap transition-colors hover:text-primary active:text-primary ${
                location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {t(link.nameKey)}
            </Link>
          ))}

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Search (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden xl:inline text-[10px] font-mono opacity-60 ml-1">⌘K</kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Dropdown */}
          <div ref={desktopLangRef} className="relative">
            <button
              type="button"
              className="flex items-center gap-1 text-[15px] text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">{currentLang.nativeLabel}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-background border border-border rounded-md shadow-lg z-50 py-1">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${
                      i18n.language === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-muted-foreground/60 ml-2 text-[12px]">{lang.label}</span>
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

        {/* Mobile/Tablet: search + theme + language + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <div ref={mobileLangRef} className="relative">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-5 w-5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-background border border-border rounded-md shadow-lg z-50 py-1">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${
                      i18n.language === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-muted-foreground/60 ml-2 text-[12px]">{lang.label}</span>
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
              {/* Mobile/Tablet nav links */}
              <div className="lg:hidden border-b border-border pb-4 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block py-2 text-[16px] font-medium transition-colors hover:text-primary active:text-primary ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(link.nameKey)}
                  </Link>
                ))}
              </div>

              {/* Menu sections in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                {menuSections.map((section, index) => (
                  <div key={section.titleKey} className={index === 0 ? 'bg-muted/50 rounded-lg p-3 -m-3' : ''}>
                    <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      {t(section.titleKey)}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name || link.nameKey}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[15px] text-muted-foreground hover:text-primary active:text-primary transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.name || t(link.nameKey!)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              to={link.href}
                              className="text-[15px] text-muted-foreground hover:text-primary active:text-primary transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.name || t(link.nameKey!)}
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

      {/* Search Command Palette */}
      <SearchCommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
