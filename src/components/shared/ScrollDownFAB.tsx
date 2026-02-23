import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollDownFAB() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Hide when scrolled past 30% or near bottom
      setVisible(scrolled < docHeight * 0.3 && docHeight > 400);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary/80 text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary transition-colors backdrop-blur-sm"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
