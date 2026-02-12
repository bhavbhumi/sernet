import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "SERNET has been instrumental in growing my portfolio. Their personalized approach and deep market knowledge have helped me achieve my financial goals.",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "The team at SERNET is incredibly professional. They've been managing my family's investments for over 10 years with excellent returns.",
  },
  {
    name: "Anand Mehta",
    location: "Bangalore",
    rating: 5,
    text: "Exceptional service and transparent communication. I highly recommend SERNET for anyone looking for reliable investment advisory.",
  },
  {
    name: "Sunita Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "From insurance planning to equity investments, SERNET has provided comprehensive solutions for all my financial needs.",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    text: "Switched from a big-name broker and couldn't be happier. Personal attention and zero hidden charges make SERNET stand out.",
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    rating: 5,
    text: "Their research reports are top-notch. I've made informed decisions that consistently outperform the market benchmarks.",
  },
];

// Duplicate for seamless loop
const doubledTestimonials = [...testimonials, ...testimonials];

const TestimonialCard = ({ name, location, rating, text }: typeof testimonials[0]) => (
  <div className="flex-shrink-0 w-[340px] md:w-[400px] p-6 rounded-xl border border-border bg-card relative group hover:border-primary/30 transition-colors duration-300">
    <Quote className="w-8 h-8 text-primary/15 absolute top-4 right-4" />
    <div className="flex items-center gap-0.5 mb-3">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]" />
      ))}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
      "{text}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </div>
  </div>
);

export const TestimonialSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      if (!isPaused && el) {
        scrollPos += speed;
        // Reset when we've scrolled through the first set
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="section-padding bg-section-alt overflow-hidden">
      <div className="container-zerodha mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="heading-lg text-foreground mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Hear from our clients who've made smarter financial decisions with SERNET.
          </p>
        </motion.div>
      </div>

      {/* Scrolling testimonials */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-5 overflow-hidden px-4 py-2"
      >
        {doubledTestimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>

      {/* Social CTA + See all reviews */}
      <div className="container-zerodha mt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
            <span>Love SERNET? Share your experience on</span>
            <div className="flex items-center gap-2">
              <a
                href="https://g.page/r/sernet/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Google
              </a>
              <a
                href="https://www.facebook.com/sernetindia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/sernetindia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          <Link
            to="/reviews"
            className="link-primary font-medium inline-flex items-center gap-1 group"
          >
            See all reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
