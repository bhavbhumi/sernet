import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollDownFAB() {
  const [mode, setMode] = useState<'down' | 'up' | 'hidden'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight < 400) {
        setMode('hidden');
        return;
      }
      const ratio = scrolled / docHeight;
      if (ratio < 0.15) {
        setMode('down');
      } else if (ratio > 0.3) {
        setMode('up');
      } else {
        setMode('hidden');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (mode === 'down') {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {mode !== 'hidden' && (
        <motion.button
          key={mode}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary/80 text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary transition-colors backdrop-blur-sm"
          aria-label={mode === 'down' ? 'Scroll down' : 'Scroll to top'}
        >
          {mode === 'down' ? (
            <ChevronDown className="h-5 w-5 animate-bounce" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
