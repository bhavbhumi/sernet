import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, Shield, Users, Landmark, ArrowUpRight } from 'lucide-react';

/* ─── Mini animated sparkline ─── */
const generatePath = (points: number[], w: number, h: number) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - ((v - min) / range) * h * 0.8 - h * 0.1);
  return xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
};

const Sparkline = ({ values, color }: { values: number[]; color: string }) => {
  const w = 100;
  const h = 36;
  const d = generatePath(values, w, h);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id={`fill-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#fill-${color.replace(/[^a-z]/gi, '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ─── Animated counter ─── */
const Counter = ({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) => {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const duration = 2000;

  useAnimationFrame((time) => {
    if (startRef.current === null) startRef.current = time;
    const progress = Math.min((time - startRef.current) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setVal(Math.round(eased * target));
  });

  return (
    <span>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
};

/* ─── Floating metric card ─── */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  sparkValues: number[];
  accentColor: string;
  delay?: number;
  className?: string;
  floatY?: number;
}

const MetricCard = ({ icon, label, value, delta, positive = true, sparkValues, accentColor, delay = 0, className = '', floatY = 10 }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xl px-4 pt-3.5 pb-2 ${className}`}
    style={{ minWidth: 148 }}
  >
    <motion.div
      animate={{ y: [0, -floatY, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="rounded-lg p-1.5" style={{ background: `${accentColor}22` }}>
          <div style={{ color: accentColor }} className="w-3.5 h-3.5">{icon}</div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between gap-3 mb-1">
        <span className="text-base font-bold text-foreground">{value}</span>
        <span
          className="flex items-center gap-0.5 text-xs font-semibold"
          style={{ color: positive ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}
        >
          <ArrowUpRight className="w-3 h-3" style={{ transform: positive ? '' : 'rotate(90deg)' }} />
          {delta}
        </span>
      </div>
      <Sparkline values={sparkValues} color={accentColor} />
    </motion.div>
  </motion.div>
);

/* ─── Central glowing orb ─── */
const CentralOrb = () => (
  <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
    {/* Outermost pulse */}
    <motion.div
      className="absolute rounded-full"
      style={{ width: 160, height: 160, background: 'hsl(var(--primary) / 0.07)' }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Mid pulse */}
    <motion.div
      className="absolute rounded-full"
      style={{ width: 116, height: 116, background: 'hsl(var(--primary) / 0.12)' }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
    {/* Inner solid */}
    <div
      className="absolute rounded-full flex items-center justify-center shadow-2xl border border-border"
      style={{
        width: 78,
        height: 78,
        background: 'hsl(var(--card))',
        boxShadow: '0 0 40px hsl(var(--primary) / 0.25)',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <TrendingUp className="w-7 h-7" style={{ color: 'hsl(var(--primary))' }} />
      </motion.div>
    </div>
  </div>
);

/* ─── Animated connecting line ─── */
const ConnectLine = ({ x1, y1, x2, y2, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; delay?: number }) => {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="hsl(var(--primary))"
      strokeOpacity="0.18"
      strokeWidth="1"
      strokeDasharray={`${len}`}
      strokeDashoffset={len}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
    />
  );
};

/* ─── Main export ─── */
export const HeroVisual = () => {
  const W = 480;
  const H = 460;
  const cx = W / 2;
  const cy = H / 2;

  // Card anchor points (relative to center)
  const cards = [
    { dx: -185, dy: -120 },
    { dx: 100,  dy: -148 },
    { dx: -210, dy:  80  },
    { dx: 90,   dy:  100 },
  ];

  return (
    <div className="relative select-none" style={{ width: W, height: H }}>

      {/* SVG connecting lines */}
      <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
        {cards.map((c, i) => (
          <ConnectLine
            key={i}
            x1={cx} y1={cy}
            x2={cx + c.dx + 74} y2={cy + c.dy + 36}
            delay={0.2 + i * 0.15}
          />
        ))}
        {/* Grid dots */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * (W / 9)}
              cy={row * (H / 7)}
              r="1.5"
              fill="hsl(var(--primary))"
              fillOpacity="0.08"
            />
          ))
        )}
      </svg>

      {/* Central orb */}
      <div className="absolute" style={{ top: cy - 80, left: cx - 80 }}>
        <CentralOrb />
      </div>

      {/* ─── Metric cards ─── */}
      {/* Portfolio Value */}
      <MetricCard
        icon={<TrendingUp />}
        label="Portfolio Value"
        value="₹48.6L"
        delta="+12.4%"
        positive
        sparkValues={[30, 38, 35, 45, 42, 55, 52, 64, 60, 72]}
        accentColor="hsl(var(--primary))"
        delay={0.3}
        floatY={8}
        className="top-[28px] left-[12px]"
      />

      {/* SIP Returns */}
      <MetricCard
        icon={<Landmark />}
        label="SIP Returns"
        value="18.3%"
        delta="+2.1%"
        positive
        sparkValues={[20, 22, 25, 23, 28, 30, 29, 33, 35, 38]}
        accentColor="hsl(var(--success))"
        delay={0.5}
        floatY={12}
        className="top-[18px] right-[10px]"
      />

      {/* Insured Lives */}
      <MetricCard
        icon={<Shield />}
        label="Lives Insured"
        value="12,400+"
        delta="+340"
        positive
        sparkValues={[40, 42, 47, 50, 53, 55, 60, 63, 68, 72]}
        accentColor="hsl(var(--stat-orange))"
        delay={0.7}
        floatY={10}
        className="bottom-[44px] left-[4px]"
      />

      {/* Active Clients */}
      <MetricCard
        icon={<Users />}
        label="Active Clients"
        value="5,800+"
        delta="+94.5%"
        positive
        sparkValues={[10, 15, 22, 20, 30, 35, 34, 42, 46, 52]}
        accentColor="hsl(var(--stat-purple))"
        delay={0.9}
        floatY={9}
        className="bottom-[32px] right-[8px]"
      />

      {/* Floating accent orbs (decorative) */}
      {[
        { cx: 60,  cy: 200, r: 28, color: 'hsl(var(--primary))',     delay: 0   },
        { cx: 420, cy: 230, r: 18, color: 'hsl(var(--success))',     delay: 0.6 },
        { cx: 240, cy: 32,  r: 12, color: 'hsl(var(--stat-orange))', delay: 1.1 },
        { cx: 390, cy: 380, r: 22, color: 'hsl(var(--stat-purple))', delay: 0.3 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.r * 2,
            height: orb.r * 2,
            top: orb.cy - orb.r,
            left: orb.cx - orb.r,
            background: `radial-gradient(circle, ${orb.color} 0%, ${orb.color}00 70%)`,
            opacity: 0.35,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}
    </div>
  );
};
