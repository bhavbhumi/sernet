import { Flame } from 'lucide-react';

/**
 * Slim festive greeting strip shown at the top of the homepage
 * during Diwali week. Retire by removing <DiwaliBanner /> from Index.
 */
export const DiwaliBanner = () => {
  return (
    <div className="diwali-banner" role="note">
      <div className="container-sernet flex items-center justify-center gap-2 px-4 py-2 text-center">
        <Flame className="h-3.5 w-3.5 shrink-0 text-sernet-yellow" aria-hidden="true" />
        <p className="text-xs sm:text-sm font-medium tracking-wide">
          Shubh Deepavali — wishing you and your family light, health and prosperity, from the SERNET family.
        </p>
        <Flame className="h-3.5 w-3.5 shrink-0 text-sernet-yellow" aria-hidden="true" />
      </div>
    </div>
  );
};
