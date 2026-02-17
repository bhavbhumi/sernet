import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Star, Lightbulb, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import bhaveshVora from '@/assets/bhavesh-vora.png';
import journeyNextgen from '@/assets/journey/nextgen.jpg';
import journeyAnniversary from '@/assets/journey/anniversary.jpg';
import journeyDigital from '@/assets/journey/digital.jpg';
import journeyNetwork from '@/assets/journey/network.jpg';
import journeyTechnology from '@/assets/journey/technology.jpg';
import journeyResilience from '@/assets/journey/resilience.jpg';
import journeyFounding from '@/assets/journey/founding.jpg';
import journeyExpertise from '@/assets/journey/expertise.jpg';
import journeyMarket from '@/assets/journey/market.jpg';
import journeySpark from '@/assets/journey/spark.jpg';

const sernetValues = [
  { letter: 'S', value: 'Security', description: 'Safeguarding your wealth with robust risk management and compliance frameworks.' },
  { letter: 'E', value: 'Integrity', description: 'Upholding the highest ethical standards in every transaction and relationship.' },
  { letter: 'R', value: 'Reliability', description: 'Delivering consistent, dependable service you can count on, every single time.' },
  { letter: 'N', value: 'Innovation', description: 'Pioneering creative futuristic solutions to stay ahead of the evolving financial landscape.' },
  { letter: 'E', value: 'Excellence', description: 'Striving for exceptional quality in every aspect of our service experience.' },
  { letter: 'T', value: 'Team Work', description: 'Collaborating as one cohesive unit to achieve shared prosperity and success.' },
];

const people = [
  { name: 'Arvind Vora', relation: 'Father', role: 'Guiding Legacy Star', icon: Star },
  { name: 'Kiran Vora', relation: 'Mother', role: 'Guiding Legacy Star', icon: Star },
  { name: 'Bhumika Vora', relation: 'Spouse', role: 'Partner in Prosperity', icon: Heart },
  { name: 'Akshat Vora', relation: 'Son', role: 'The Bright Future', icon: Lightbulb },
];

// Latest first
const journeyEvents = [
  { period: 'Jan 2025', title: 'NextGen Platform', description: 'Launching the next generation financial service network with cutting-edge technology and holistic wealth solutions.', image: journeyNextgen },
  { period: 'Aug 2024', title: '20 Years of SERNET', description: 'Celebrating two decades of empowering prosperity with a vision to be one\'s first choice for any financial decision.', image: journeyAnniversary },
  { period: 'Mar 2020', title: 'Digital Transformation', description: 'Accelerated digital-first strategy during the pandemic, ensuring uninterrupted service to all stakeholders.', image: journeyDigital },
  { period: 'Jul 2016', title: 'Network Expansion', description: 'Grew the partner and principal network significantly, extending reach across multiple geographies.', image: journeyNetwork },
  { period: 'Apr 2012', title: 'Technology Adoption', description: 'Embraced digital trading platforms and online advisory, modernising the client experience.', image: journeyTechnology },
  { period: 'Oct 2008', title: 'Weathering the Storm', description: 'Navigated the global financial crisis with client-first principles, strengthening trust and credibility.', image: journeyResilience },
  { period: 'Aug 2004', title: 'SERNET Founded', description: 'The brand SERNET is born — a fusion of SERVICE and NETWORK — with a mission to make wealth creation holistic and enjoyable.', image: journeyFounding },
  { period: 'Jun 2000', title: 'Building Expertise', description: 'Expanded into insurance and mutual fund distribution, broadening the financial service horizon.', image: journeyExpertise },
  { period: 'Mar 1995', title: 'Market Immersion', description: 'Deep dive into equity and commodity markets, gaining invaluable hands-on trading and advisory experience.', image: journeyMarket },
  { period: 'Jan 1990', title: 'The Spark', description: 'Bhavesh Vora begins his career in financial services, laying the groundwork for a lifelong mission.', image: journeySpark },
];

const socialLinks = [
  { name: 'X', href: 'https://twitter.com/sernetindia', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  )},
  { name: 'Instagram', href: 'https://instagram.com/sernetindia', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
  )},
  { name: 'LinkedIn', href: 'https://linkedin.com/company/sernetindia', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
  )},
  { name: 'YouTube', href: 'https://youtube.com/@sernetindia', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
  )},
  { name: 'WhatsApp', href: 'https://wa.me/919206767670', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  )},
  { name: 'Telegram', href: 'https://t.me/sernetindia', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  )},
];

// Responsive: show 3 on lg, 2 on md, 1 on sm
const useVisibleCount = () => {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCount(3);
      else if (window.innerWidth >= 768) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
};

export const CompanyContent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const visibleCount = useVisibleCount();
  const maxIndex = journeyEvents.length - visibleCount;

  const scrollLeft = () => setTimelineIndex((prev) => Math.max(0, prev - 1));
  const scrollRight = () => setTimelineIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <>
      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="heading-lg text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-body">
                <p>
                  SERNET was founded by Bhavesh Vora in 2004 with a mission to make wealth creation holistic and enjoyable for the world. Our{' '}
                  <span className="text-primary font-medium">Vision</span> is to be one's first choice for any financial decision and execution, and our{' '}
                  <span className="text-primary font-medium">Strategy</span> to achieve this is through creative futuristic solutions with an ethical approach and giving excellent service experience.
                </p>
                <p>
                  We named our brand <span className="text-primary font-medium">SERNET</span>, as a fusion of "<strong>SER</strong>VICE" and "<strong>NET</strong>WORK", two most basic ingredients for Prosperity. Our logo reveals four keys of <em>Luck, Wisdom, Courage</em> and <em>Control</em> to achieve required financial success.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
              className="flex justify-center items-center"
            >
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Newsletter-style glow: box-shadow based */}
                <div
                  className="relative overflow-hidden rounded-2xl bg-background border border-primary/30"
                  style={{
                    boxShadow: '0 0 25px -5px hsl(var(--primary) / 0.3), 0 0 10px -5px hsl(var(--sernet-yellow) / 0.2)',
                  }}
                >
                  <motion.img
                    src={bhaveshVora}
                    alt="Bhavesh Vora - Founder, SERNET"
                    className="w-full h-auto object-cover max-w-[320px] md:max-w-[360px]"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Hover overlay with name & social links */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 py-5 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white text-lg font-semibold">Bhavesh Vora</h3>
                    <p className="text-white/70 text-sm mb-3">Founder & Promoter</p>
                    <div className="flex gap-3">
                      <a
                        href="https://www.linkedin.com/in/bhaveshvora-wealthmanagement/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                      <a
                        href="https://x.com/bhavtweetss"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values — SERNET Letters */}
      <section className="section-padding bg-section-alt">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sernetValues.map((v, index) => (
              <motion.div
                key={`${v.letter}-${v.value}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="feature-card flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">{v.letter}</span>
                </div>
                <div>
                  <h3 className="heading-md text-foreground mb-1">{v.value}</h3>
                  <p className="text-small">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* People */}
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-12 text-center"
          >
            The People Behind SERNET
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {people.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <person.icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="heading-md text-foreground">{person.name}</h3>
                <p className="text-small text-primary font-medium mt-1">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey So Far - Horizontal with arrows */}
      <section className="section-padding bg-section-alt overflow-hidden">
        <div className="container-zerodha">
          <div className="flex items-center justify-between mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-lg text-foreground"
            >
              Journey So Far
            </motion.h2>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                disabled={timelineIndex === 0}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={timelineIndex >= maxIndex}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${timelineIndex * (100 / visibleCount)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: `${(journeyEvents.length / visibleCount) * 100}%` }}
            >
              {journeyEvents.map((event, index) => (
                <motion.div
                  key={event.period}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex-shrink-0"
                  style={{ width: `${100 / journeyEvents.length}%` }}
                >
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-36 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      {/* Content */}
                      <div className="p-5 flex-1">
                        <span className="text-xs font-semibold text-primary tracking-wide uppercase">{event.period}</span>
                        <h3 className="heading-md text-foreground mt-1 mb-2">{event.title}</h3>
                        <p className="text-small leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prosper With Us */}
      <section className="section-padding bg-background">
        <div className="container-zerodha text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-lg text-foreground mb-4"
          >
            Prosper With Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Stay connected and join our growing community across social platforms.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-5">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.15, y: -4 }}
                className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                title={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
