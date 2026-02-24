import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Award, Check, Download, UserCheck, Play, Lightbulb, Users, Video, FileText, Globe, Clock } from 'lucide-react';


import sernetShowcase from '@/assets/sernet-product-showcase.png';

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
    {/* Hero — Education */}
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
            <h2 className="heading-lg text-foreground mb-3">SERNET Education</h2>
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
              <Link to="/awareness" className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Lightbulb className="w-5 h-5" />
                Explore Awareness Content
              </Link>
              <Link to="/insights" className="link-primary inline-flex items-center gap-1 text-sm font-medium">
                Browse Insights <ArrowRight className="w-4 h-4" />
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
            <img src={sernetShowcase} alt="SERNET education platform showcase" className="rounded-xl w-full max-w-[520px] max-h-[400px] object-contain dark:bg-white dark:p-3" />
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

    {/* What Makes SERNET Education Different */}
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
              Why SERNET Education
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
            { icon: Globe, step: '01', title: 'Visit & Sign Up', description: 'Create your free account on our platform to unlock your learning dashboard.' },
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
          <Link
            to="/awareness"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Awareness
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Advisory Note */}
    <section className="py-6 bg-muted/30">
      <div className="container-zerodha">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          <strong>Advisory Note:</strong> Financial education content is for informational and learning purposes only and does not constitute investment advice, stock recommendations, or financial planning guidance. Learners are advised to consult qualified financial professionals before making any investment decisions. SERNET is not responsible for individual trading or investment outcomes based on course content.
        </p>
      </div>
    </section>
  </>
);
