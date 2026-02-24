import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Award, Check, Download, UserCheck, Play, Lightbulb, Users, Video, FileText, Globe, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import findemyShowcase from '@/assets/findemy-showcase.png';

const stats = [
  { icon: BookOpen, value: '50+', label: 'Courses' },
  { icon: Users, value: '10K+', label: 'Learners' },
  { icon: Award, value: '4.5', label: 'Avg Rating' },
];

const products = [
  { icon: Lightbulb, name: 'Awareness', description: 'Free financial literacy programs covering basics of markets, personal finance, and smart money management for everyone.' },
  { icon: Users, name: 'Coaching', description: 'Affordable one-on-one and group coaching sessions with industry practitioners to build practical market skills.' },
  { icon: GraduationCap, name: 'Training', description: 'Top-notch certification-ready training courses with structured curricula, live sessions, and hands-on projects.' },
];

export const EducationServiceContent = () => (
  <>
    {/* Hero — Findemy */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-foreground mb-3">Findemy</h2>
            <p className="text-body text-muted-foreground mb-8">
              Your gateway to financial education — from free awareness content to expert-led training programs that turn beginners into confident market participants.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Free Financial Awareness for Beginners — no barriers to financial freedom',
                'Affordable Coaching for Certification Courses',
                'Training for Soft and Finishing Skills',
                'Self-paced & live learning formats',
                'Practical, hands-on curriculum — not just theory',
              ].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {hook}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Globe className="w-5 h-5" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] opacity-80">Visit</span>
                  <span className="text-sm font-semibold">Findemy.com</span>
                </div>
              </a>
              <Link to="/findemy" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Explore Content <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Trust strip stats */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <img src={findemyShowcase} alt="Findemy education platform showcase" className="rounded-xl w-full max-w-[520px] max-h-[400px] object-contain dark:bg-white dark:p-3" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Programs We Offer */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Programs we offer
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Three tiers of learning designed to meet you where you are — whether you're just starting out or ready to go pro.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="feature-card group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <product.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground mb-2">{product.name}</h3>
              <p className="text-small leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* What Makes Findemy Different */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
        >
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Why Findemy
            </span>
            <h2 className="heading-lg text-foreground mb-3">Learning paths, irrespective of programs</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Adaptive learning is at the core of our education initiative. Everyone has an ability to master the knowledge or a skill they aspire, but with discipline and dedication. Financial education that prepares you.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Curriculum designed by SEBI-registered professionals',
                'Real case studies from live market scenarios',
                'Completion certificates for career advancement',
                'Community access with peer learning groups',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Courses
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex-shrink-0 w-full max-w-[280px] lg:max-w-[320px]">
            <div className="rounded-xl bg-background border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Learning Path</p>
                  <p className="text-xs text-muted-foreground">Sample Progress</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Awareness</span><span className="text-foreground font-medium">100%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '100%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Coaching</span><span className="text-foreground font-medium">65%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: '65%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Training</span><span className="text-foreground font-medium">30%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: '30%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Frequently Asked Questions
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">
          Everything you need to know about learning with Findemy
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'Is the awareness content really free?', a: 'Yes, 100%. Our awareness modules covering financial basics, market fundamentals, and personal finance are completely free with no hidden charges. We believe financial literacy is a right, not a privilege.' },
            { q: 'What makes the coaching programs different from free content?', a: 'Coaching sessions are led by active market practitioners in small groups or one-on-one settings. You get personalized feedback, live Q&A, real-time market walkthroughs, and actionable strategies tailored to your goals — all at affordable pricing.' },
            { q: 'Do I get a certificate after completing a training course?', a: 'Yes, all our structured training programs come with completion certificates. These are industry-recognized and can be shared on LinkedIn or added to your professional profile.' },
            { q: 'What topics do the training courses cover?', a: 'Our training courses span technical analysis, fundamental analysis, options strategies, portfolio management, risk management, and more. Each course includes video lessons, assignments, live sessions, and hands-on projects.' },
            { q: 'Can I learn at my own pace?', a: 'Absolutely. All recorded content is available on-demand so you can learn at your own schedule. Live coaching and training sessions are scheduled but recordings are shared for those who miss them.' },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* Ready to Get Started */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">
          Ready to start learning?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">
          Begin your financial education journey in four simple steps
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Globe, step: '01', title: 'Visit & Sign Up', description: 'Head to Findemy.com and create your free account to unlock your learning dashboard.' },
            { icon: BookOpen, step: '02', title: 'Choose Your Program', description: 'Pick from free Awareness modules, affordable Coaching sessions, or structured Training courses.' },
            { icon: UserCheck, step: '03', title: 'Decide Your Path', description: 'Select a learning path tailored to your goals — whether beginner, intermediate, or advanced.' },
            { icon: Play, step: '04', title: 'Start Learning', description: 'Access video lessons, join live sessions, complete assignments, and earn certificates as you progress.' },
          ].map((card, index) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card relative"
            >
              <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{card.step}</span>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-md text-foreground mb-2">{card.title}</h3>
              <p className="text-small leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Findemy
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* Advisory Note */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Advisory Note:</strong> Financial education content provided through Findemy is for informational and learning purposes only and does not constitute investment advice, stock recommendations, or financial planning guidance. Learners are advised to consult qualified financial professionals before making any investment decisions. SERNET facilitates education services through Findemy and is not responsible for individual trading or investment outcomes based on course content.
        </p>
      </div>
    </section>
  </>
);
