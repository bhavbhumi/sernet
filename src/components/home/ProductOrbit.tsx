import { motion } from 'framer-motion';
import sernetIcon from '@/assets/sernet-icon.png';
import tickFundsLogo from '@/assets/tickfunds-logo.png';
import tushilLogo from '@/assets/tushil-logo.png';
import choiceFinxLogo from '@/assets/choicefinx-logo.jpeg';
import findemyShowcase from '@/assets/findemy-showcase.png';

interface OrbitLogoProps {
  src: string;
  alt: string;
  size?: number;
  bgWhite?: boolean;
}

const OrbitLogo = ({ src, alt, size = 48, bgWhite = true }: OrbitLogoProps) => (
  <div
    className="rounded-xl shadow-lg flex items-center justify-center overflow-hidden border border-border"
    style={{
      width: size,
      height: size,
      background: bgWhite ? 'hsl(var(--background))' : undefined,
      flexShrink: 0,
    }}
  >
    <img src={src} alt={alt} className="w-full h-full object-contain p-1" />
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
  return (
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        marginTop: -(size ?? 48) / 2,
        marginLeft: -(size ?? 48) / 2,
      }}
      animate={{
        rotate: reverse ? [angle, angle - 360] : [angle, angle + 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Move outward from center, then counter-rotate so logo stays upright */}
      <motion.div
        style={{ x: radius, y: 0 }}
        animate={{
          rotate: reverse ? [0, 360] : [0, -360],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <OrbitLogo src={src} alt={alt} size={size ?? 48} />
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
        src={findemyShowcase}
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
