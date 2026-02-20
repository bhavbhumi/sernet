import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BarChart2, Bell, Newspaper, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, SearchResult } from '@/hooks/useSearch';

const TYPE_ICON: Record<string, React.ReactNode> = {
  article: <FileText className="h-3.5 w-3.5" />,
  analysis: <BarChart2 className="h-3.5 w-3.5" />,
  circular: <AlertCircle className="h-3.5 w-3.5" />,
  news: <Newspaper className="h-3.5 w-3.5" />,
  bulletin: <Bell className="h-3.5 w-3.5" />,
};

const TYPE_COLOR: Record<string, string> = {
  article: 'text-blue-500 bg-blue-500/10',
  analysis: 'text-emerald-500 bg-emerald-500/10',
  circular: 'text-orange-500 bg-orange-500/10',
  news: 'text-purple-500 bg-purple-500/10',
  bulletin: 'text-red-500 bg-red-500/10',
};

const TYPE_ORDER = ['article', 'analysis', 'news', 'circular', 'bulletin'];

interface SearchCommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const SearchCommandPalette = ({ open, onClose }: SearchCommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { results, grouped, loading, TYPE_LABEL, TYPE_ROUTE } = useSearch(query);

  // Flat ordered list for keyboard navigation
  const flatResults: SearchResult[] = TYPE_ORDER.flatMap(type => grouped[type] || []);

  const handleSelect = useCallback((item: SearchResult) => {
    const route = TYPE_ROUTE[item.content_type](item.id, item.url);
    if (item.content_type === 'circular' || item.content_type === 'news') {
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(route);
      }
    } else {
      navigate(route);
    }
    onClose();
    setQuery('');
  }, [navigate, onClose, TYPE_ROUTE]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[activeIndex]) handleSelect(flatResults[activeIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const hasResults = flatResults.length > 0;
  const showEmpty = query.length >= 2 && !loading && !hasResults;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                {loading
                  ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
                  : <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                }
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles, analysis, circulars, news…"
                  className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground border border-border rounded font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length < 2 && (
                  <div className="px-4 py-8 text-center text-[14px] text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Type at least 2 characters to search across all content
                  </div>
                )}

                {showEmpty && (
                  <div className="px-4 py-8 text-center text-[14px] text-muted-foreground">
                    No results found for <span className="font-medium text-foreground">"{query}"</span>
                  </div>
                )}

                {hasResults && (
                  <div className="py-2">
                    {TYPE_ORDER.filter(type => grouped[type]?.length).map(type => {
                      const items = grouped[type];
                      return (
                        <div key={type}>
                          {/* Section header */}
                          <div className="px-4 py-1.5 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${TYPE_COLOR[type]}`}>
                              {TYPE_ICON[type]}
                              {TYPE_LABEL[type]}s
                            </span>
                          </div>

                          {/* Items */}
                          {items.map((item) => {
                            const flatIdx = flatResults.indexOf(item);
                            const isActive = flatIdx === activeIndex;
                            return (
                              <button
                                key={item.id}
                                className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                                  isActive ? 'bg-muted' : 'hover:bg-muted/50'
                                }`}
                                onMouseEnter={() => setActiveIndex(flatIdx)}
                                onClick={() => handleSelect(item)}
                              >
                                <span className={`mt-0.5 shrink-0 inline-flex items-center justify-center h-5 w-5 rounded ${TYPE_COLOR[type]}`}>
                                  {TYPE_ICON[type]}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[14px] font-medium text-foreground truncate">
                                    {item.title}
                                  </div>
                                  {item.excerpt && (
                                    <div className="text-[12px] text-muted-foreground line-clamp-1 mt-0.5">
                                      {item.excerpt}
                                    </div>
                                  )}
                                </div>
                                {item.category && (
                                  <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5">
                                    {item.category}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {hasResults && (
                <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1">↵</kbd> open</span>
                  <span className="ml-auto">{flatResults.length} result{flatResults.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
