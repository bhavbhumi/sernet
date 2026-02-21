import { motion } from 'framer-motion';
import sernetIcon from '@/assets/sernet-icon.png';
import tickFundsLogo from '@/assets/tickfunds-logo.png';
import tushilLogo from '@/assets/tushil-logo.png';
import choiceFinxLogo from '@/assets/choicefinx-showcase.png';
import findemyLogo from '@/assets/findemy-logo.png';

interface OrbitLogoProps {
  src: string;
  alt: string;
  size?: number;
}

const OrbitLogo = ({ src, alt, size = 48 }: OrbitLogoProps) => (
  <div
    className="rounded-xl shadow-md flex items-center justify-center overflow-hidden border border-border/40 bg-card dark:bg-white"
    style={{ width: size, height: size, flexShrink: 0 }}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain p-1.5 [mix-blend-mode:multiply]"
    />
  </div>
);

// Positions a logo on a circular orbit path
// angle in degrees, radius in px from center
const OrbitItem = ({
  src,
  alt,
  radius,
  angle,
  duration,
  size,
  reverse = false,
}: {
  src: string;
  alt: string;
  radius: number;
  angle: number; // initial angle offset in degrees
  duration: number;
  size?: number;
  reverse?: boolean;
}) => {
  const s = size ?? 48;
  // Convert initial angle to radians to compute starting x/y position
  const rad = (angle * Math.PI) / 180;
  const startX = Math.cos(rad) * radius;
  const startY = Math.sin(rad) * radius;

  return (
    // Wrapper sits at centre; we use CSS transform to place the logo along the orbit
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        width: s,
        height: s,
        marginTop: -s / 2,
        marginLeft: -s / 2,
        // translate to starting position, then rotate around centre
        transformOrigin: `${-startX}px ${-startY}px`,
        x: startX,
        y: startY,
      }}
      animate={{
        rotate: reverse ? [0, -360] : [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Counter-rotate the logo so it always faces upright */}
      <motion.div
        animate={{
          rotate: reverse ? [0, 360] : [0, -360],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ width: s, height: s }}
      >
        <OrbitLogo src={src} alt={alt} size={s} />
      </motion.div>
    </motion.div>
  );
};

export const ProductOrbit = () => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>

      {/* Outer orbit ring — dashed */}
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: 320,
          height: 320,
          borderColor: 'hsl(var(--primary) / 0.25)',
        }}
      />

      {/* Inner orbit ring — dashed */}
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: 200,
          height: 200,
          borderColor: 'hsl(var(--primary) / 0.18)',
        }}
      />

      {/* Subtle glow behind center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 110,
          height: 110,
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Center — SERNET icon */}
      <div
        className="absolute rounded-2xl shadow-xl border border-border flex items-center justify-center overflow-hidden z-10"
        style={{
          width: 72,
          height: 72,
          background: 'hsl(var(--background))',
        }}
      >
        <img src={sernetIcon} alt="SERNET" className="w-12 h-12 object-contain" />
      </div>

      {/* Inner orbit: TickFunds (top) & Tushil (bottom) */}
      <OrbitItem
        src={tickFundsLogo}
        alt="Tick Funds"
        radius={100}
        angle={0}
        duration={18}
        size={52}
      />
      <OrbitItem
        src={tushilLogo}
        alt="Tushil"
        radius={100}
        angle={180}
        duration={18}
        size={52}
      />

      {/* Outer orbit: ChoiceFinX & Findemy — reverse direction for variety */}
      <OrbitItem
        src={choiceFinxLogo}
        alt="ChoiceFinX"
        radius={160}
        angle={60}
        duration={26}
        size={56}
        reverse
      />
      <OrbitItem
        src={findemyLogo}
        alt="Findemy"
        radius={160}
        angle={240}
        duration={26}
        size={56}
        reverse
      />

      {/* Decorative dots on outer ring */}
      {[0, 90, 180, 270].map((deg) => (
        <motion.div
          key={deg}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'hsl(var(--primary) / 0.4)',
            top: '50%',
            left: '50%',
            marginTop: -3,
            marginLeft: -3,
          }}
          animate={{ rotate: [deg, deg + 360] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{ transform: `translateX(160px)` }} className="w-1.5 h-1.5 rounded-full bg-primary opacity-40" />
        </motion.div>
      ))}
    </div>
  );
};
