import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Globe, BookOpen, GraduationCap, Award,
  Users, Star, Play, UserCheck, Lightbulb, Video, FileText, Clock,
  Target, Layers, MessageCircle, Monitor
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import findemyShowcase from '@/assets/findemy-showcase.png';

const stats = [
  { icon: BookOpen, value: '50+', label: 'Courses' },
  { icon: Users, value: '10K+', label: 'Learners' },
  { icon: Award, value: '4.5', label: 'Avg Rating' },
];

const features = [
  { icon: Lightbulb, title: 'Learn by Doing', description: 'Real case studies from live markets, hands-on projects, and practical assignments — not just theory.' },
  { icon: Target, title: 'Adaptive Learning Paths', description: 'Personalised curriculum that meets you where you are — beginner, intermediate, or advanced.' },
  { icon: Video, title: 'Live & On-Demand', description: 'Attend live sessions with experts or learn at your own pace with recorded content available 24/7.' },
  { icon: GraduationCap, title: 'Industry Certifications', description: 'Earn completion certificates recognised by the industry and shareable on LinkedIn.' },
  { icon: MessageCircle, title: 'Community Learning', description: 'Join peer learning groups, discuss strategies, and grow together with fellow learners.' },
  { icon: Monitor, title: 'Multi-Device Access', description: 'Learn seamlessly on desktop, tablet, or mobile — your progress syncs everywhere.' },
];

const programs = [
  {
    icon: Lightbulb, name: 'Awareness', price: 'Free', tag: 'No barriers to financial freedom',
    items: ['Market basics & terminology', 'Personal finance fundamentals', 'Savings & budgeting strategies', 'Investment instruments overview'],
  },
  {
    icon: Users, name: 'Coaching', price: 'Affordable', tag: 'Learn from practitioners', featured: true,
    items: ['One-on-one & group sessions', 'Live market walkthroughs', 'Personalised feedback', 'Certification course prep'],
  },
  {
    icon: GraduationCap, name: 'Training', price: 'Premium', tag: 'Career-ready skills',
    items: ['Structured multi-week courses', 'Technical & fundamental analysis', 'Portfolio & risk management', 'Completion certificates'],
  },
];

const testimonials = [
  { name: 'Rohit S.', role: 'Beginner, Delhi', text: 'The free awareness modules gave me confidence to start my investment journey. I went from zero knowledge to opening my first SIP in two weeks.' },
  { name: 'Kavita M.', role: 'Coaching Student, Mumbai', text: 'The live coaching sessions with real market scenarios were a game-changer. My mentor\'s personalised feedback accelerated my learning by months.' },
  { name: 'Deepak R.', role: 'Training Graduate, Bangalore', text: 'Completed the options strategy course and got certified. The curriculum is practical and industry-relevant — now I trade with confidence.' },
];

const Findemy = () => (
  <Layout>
    {/* Hero */}
    <section className="section-padding bg-background">
      <div className="container-zerodha">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Financial Education</span>
            <h1 className="heading-xl mb-4">Master your finances with <span className="text-primary font-normal">Findemy</span></h1>
            <p className="text-body text-muted-foreground mb-8 max-w-lg">
              From free awareness content to expert-led training programs — financial education that turns beginners into confident market participants.
            </p>
            <ul className="space-y-2 mb-8">
              {['Free Financial Awareness for Beginners', 'Affordable Coaching for Certification Courses', 'Training for Soft and Finishing Skills', 'Self-paced & live learning formats', 'Practical, hands-on curriculum'].map((hook) => (
                <li key={hook} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-primary shrink-0" />{hook}</li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href="#" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Globe className="w-5 h-5" />
                <div className="flex flex-col leading-tight"><span className="text-[10px] opacity-80">Visit</span><span className="text-sm font-semibold">Findemy.com</span></div>
              </a>
              <Link to="/z-connect" className="btn-secondary text-sm">Explore Free Content <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10"><stat.icon className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium text-foreground leading-tight">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex items-center justify-center">
            <img src={findemyShowcase} alt="Findemy education platform" className="rounded-xl w-full max-w-[540px] object-contain dark:bg-white dark:p-3" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why Findemy */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Why Findemy?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Financial education that prepares you for real markets, not just exams.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="feature-card group">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><f.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{f.title}</h3>
              <p className="text-small leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Programs / Pricing */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Choose your learning path</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Three tiers of learning — whether you're just starting out or ready to go pro.</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {programs.map((prog, i) => (
            <motion.div key={prog.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`rounded-xl border p-8 ${prog.featured ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-card'}`}>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><prog.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-1">{prog.name}</h3>
              <p className="text-2xl font-bold text-primary mb-1">{prog.price}</p>
              <p className="text-xs text-muted-foreground mb-6">{prog.tag}</p>
              <ul className="space-y-3">
                {prog.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-primary shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* What Makes Findemy Different */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-primary/10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">Our Philosophy</span>
            <h2 className="heading-lg text-foreground mb-3">Learning paths, irrespective of programs</h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl">
              Adaptive learning is at the core of our education initiative. Everyone has the ability to master the knowledge or a skill they aspire to — with discipline and dedication.
            </p>
            <ul className="space-y-2 mb-8">
              {['Curriculum designed by SEBI-registered professionals', 'Real case studies from live market scenarios', 'Completion certificates for career advancement', 'Community access with peer learning groups'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground justify-center lg:justify-start"><Check className="w-4 h-4 text-primary shrink-0" />{item}</li>
              ))}
            </ul>
            <a href="#" className="btn-primary">Browse All Courses <ArrowRight className="w-4 h-4 ml-2" /></a>
          </div>
          <div className="flex-shrink-0 w-full max-w-[280px] lg:max-w-[320px]">
            <div className="rounded-xl bg-background border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">Learning Path</p><p className="text-xs text-muted-foreground">Sample Progress</p></div>
              </div>
              <div className="space-y-3">
                {[{ label: 'Awareness', value: '100%', width: '100%' }, { label: 'Coaching', value: '65%', width: '65%', accent: true }, { label: 'Training', value: '30%', width: '30%' }].map((bar) => (
                  <div key={bar.label}><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{bar.label}</span><span className="text-foreground font-medium">{bar.value}</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${bar.accent ? 'bg-accent' : 'bg-primary'}`} style={{ width: bar.width }} /></div></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">What our learners say</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Real stories from real learners.</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="feature-card">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div><p className="text-sm font-medium text-foreground">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How to Get Started */}
    <section className="section-padding bg-section-alt">
      <div className="container-zerodha">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Start learning in 4 simple steps</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12 max-w-2xl mx-auto">Your financial education journey begins here.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Globe, step: '01', title: 'Visit & Sign Up', description: 'Head to Findemy.com and create your free account.' },
            { icon: BookOpen, step: '02', title: 'Choose Program', description: 'Pick from free Awareness, affordable Coaching, or structured Training.' },
            { icon: UserCheck, step: '03', title: 'Select Your Path', description: 'Choose a path tailored to your goals and experience level.' },
            { icon: Play, step: '04', title: 'Start Learning', description: 'Access lessons, join live sessions, complete assignments, earn certificates.' },
          ].map((card, i) => (
            <motion.div key={card.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="feature-card relative">
              <span className="text-4xl font-bold text-primary/10 absolute top-4 right-4">{card.step}</span>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><card.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="heading-md text-foreground mb-2">{card.title}</h3>
              <p className="text-small leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center mt-12">
          <a href="#" className="btn-primary">Explore Findemy <ArrowRight className="w-4 h-4 ml-2" /></a>
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section className="section-padding">
      <div className="container-zerodha max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-3 text-center">Frequently Asked Questions</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-center mb-12">Everything you need to know about Findemy</motion.p>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: 'Is the awareness content really free?', a: 'Yes, 100%. Financial literacy is a right, not a privilege. All awareness modules are completely free with no hidden charges.' },
            { q: 'What makes coaching different from free content?', a: 'Coaching sessions are led by active practitioners in small groups or one-on-one. You get personalised feedback, live Q&A, and real-time market walkthroughs.' },
            { q: 'Do I get a certificate?', a: 'Yes, all structured training programs come with industry-recognised completion certificates shareable on LinkedIn.' },
            { q: 'What topics do training courses cover?', a: 'Technical analysis, fundamental analysis, options strategies, portfolio management, risk management, and more — with video lessons, assignments, and hands-on projects.' },
            { q: 'Can I learn at my own pace?', a: 'Absolutely. All recorded content is on-demand. Live sessions are scheduled but recordings are shared for those who miss them.' },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-16 md:py-20 bg-section-alt">
      <div className="container-zerodha text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-foreground mb-4">Your financial education starts here</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">Join 10,000+ learners who are mastering their finances with Findemy.</motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4">
          <a href="#" className="btn-primary">Start Learning Free <ArrowRight className="w-4 h-4 ml-2" /></a>
          <Link to="/services" className="btn-secondary">Explore All Services</Link>
        </motion.div>
      </div>
    </section>

    {/* Advisory Note */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Advisory Note:</strong> Financial education content provided through Findemy is for informational and learning purposes only and does not constitute investment advice, stock recommendations, or financial planning guidance. Learners are advised to consult qualified financial professionals before making any investment decisions.
        </p>
      </div>
    </section>
  </Layout>
);

export default Findemy;