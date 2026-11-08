import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * One-time festive gold sparkle overlay for the homepage.
 * Plays once on load, fades after a few seconds or on first scroll,
 * and is skipped entirely for visitors who prefer reduced motion.
 */
const SPARKLE_COUNT = 18;

export const DiwaliGlow = () => {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        left: (i * 53 + 11) % 100,
        top: (i * 37 + 7) % 90,
        size: 5 + ((i * 13) % 9),
        delay: (i % 6) * 0.18,
        duration: 1.6 + ((i * 7) % 10) / 10,
      })),
    [],
  );

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(false), 3200);
    const dismiss = () => setVisible(false);
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', dismiss);
    };
  }, [reducedMotion]);

  if (!visible || reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="diwali-glow-wash absolute inset-0" />
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="diwali-sparkle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0.6, 0], scale: [0.3, 1, 0.9, 0.2], y: [0, -14, -26] }}
          transition={{ duration: s.duration, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};
