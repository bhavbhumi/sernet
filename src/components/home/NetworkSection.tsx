import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Users, Handshake, Building2 } from 'lucide-react';
import networkClients from '@/assets/network-clients.webp';
import networkPartners from '@/assets/network-partners.webp';
import networkPrincipals from '@/assets/network-principals.webp';

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toString());

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2, ease: 'easeOut' });
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const networkCards = [
  {
    title: 'Clients',
    subtitle: 'Individuals & institutions who trust us',
    stat: '10,000+',
    statLabel: 'Active clients across segments',
    image: networkClients,
    icon: Users,
    tab: 'clients',
    points: ['Retail & HNW Individuals', 'NRIs & Foreign Nationals', 'Family Offices & MSMEs'],
  },
  {
    title: 'Partners',
    subtitle: 'Professionals who grow with us',
    stat: '500+',
    statLabel: 'Empanelled partners nationwide',
    image: networkPartners,
    icon: Handshake,
    tab: 'partners',
    points: ['CAs, CSs & Fiduciaries', 'Freelancers & Finfluencers', 'Cross-industry professionals'],
  },
  {
    title: 'Principals',
    subtitle: 'Institutions who back our promise',
    stat: '50+',
    statLabel: 'Regulated principal associations',
    image: networkPrincipals,
    icon: Building2,
    tab: 'principals',
    points: ['Fund Houses & Insurers', 'Stock Exchanges & Depositories', 'Bond & Bullion Issuers'],
  },
];

const headlineStats = [
  { value: 54, suffix: '+', label: 'Cities' },
  { value: 18, suffix: '+', label: 'Countries' },
  { value: 35, suffix: '+', label: 'Years' },
];

export const NetworkSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">
            Our Network
          </p>
          <h2 className="heading-lg text-foreground mb-4">
            Whom we serve
          </h2>
          {/* Inline animated stats */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-6">
            {headlineStats.map((s, i) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-light text-foreground">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {networkCards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <motion.img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-500" />
                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {/* Stat pill */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm">
                    <span className="text-sm font-semibold text-foreground">{card.stat}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="heading-md text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{card.subtitle}</p>

                  {/* Points with staggered reveal */}
                  <ul className="space-y-2 mb-4">
                    {card.points.map((point, pi) => (
                      <motion.li
                        key={pi}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        initial={false}
                        animate={{ 
                          x: isHovered ? 0 : -4,
                          opacity: isHovered ? 1 : 0.7 
                        }}
                        transition={{ duration: 0.3, delay: pi * 0.05 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {point}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="text-xs text-muted-foreground">{card.statLabel}</div>
                </div>

                {/* Hover bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/network"
            className="inline-flex items-center gap-2 link-primary font-medium group/link"
          >
            Explore Our Network
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
