import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Heart, MessageCircle, Share2, Mail, BookOpen, FileText, Megaphone, Newspaper, FolderOpen, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const articles = [
  {
    id: 1,
    category: 'Market Analysis',
    title: 'Understanding the Impact of RBI Policy on Equity Markets',
    excerpt: 'A deep dive into how monetary policy decisions shape market trends and what investors should watch for in the coming quarters.',
    date: 'Feb 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    category: 'Personal Finance',
    title: 'SIP vs Lumpsum: Making the Right Choice in a Volatile Market',
    excerpt: 'Comparing investment strategies to help you make informed decisions based on your financial goals and risk appetite.',
    date: 'Feb 8, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    category: 'Insurance',
    title: 'Term Insurance in Your 20s: Why Starting Early Matters',
    excerpt: 'The compounding advantage of early insurance planning and how it fits into a holistic financial strategy.',
    date: 'Feb 5, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
  },
];

export const InsightsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{t('insights.label')}</p>
            <h2 className="heading-lg text-foreground">{t('insights.heading')}</h2>
          </div>
          <Link
            to="/z-connect"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" aria-label="Like">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Comment">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/z-connect"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-16 rounded-2xl bg-muted/50 border border-primary/30 p-6 md:p-8 text-center overflow-hidden shadow-[0_0_25px_-5px_hsl(var(--primary)/0.3),0_0_10px_-5px_hsl(var(--sernet-yellow)/0.2)]"
        >
          {/* Background watermark elements */}
          {/* Background visual elements - Resources */}
          <FolderOpen className="absolute top-5 left-8 w-12 h-12 text-primary/[0.07] rotate-[-12deg] pointer-events-none" />
          <BookOpen className="absolute top-3 left-24 w-8 h-8 text-primary/[0.05] rotate-[8deg] pointer-events-none" />
          
          {/* Background visual elements - Articles */}
          <Newspaper className="absolute top-4 right-10 w-14 h-14 text-sernet-yellow/[0.08] rotate-[10deg] pointer-events-none" />
          <FileText className="absolute top-1/2 -translate-y-1/2 right-8 w-10 h-10 text-primary/[0.06] rotate-[-6deg] pointer-events-none" />
          
          {/* Background visual elements - Promotion */}
          <Megaphone className="absolute bottom-4 left-10 w-12 h-12 text-sernet-yellow/[0.07] rotate-[15deg] pointer-events-none" />
          <Send className="absolute bottom-5 right-16 w-9 h-9 text-primary/[0.06] rotate-[-20deg] pointer-events-none" />
          <Mail className="absolute top-1/2 left-6 w-8 h-8 text-sernet-yellow/[0.05] -translate-y-1/2 rotate-[5deg] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">{t('insights.newsletter')}</h3>
            </div>
            <div className="flex items-center justify-center gap-6 mb-4">
              {[
                { key: 'insights.resources', label: t('insights.resources') },
                { key: 'insights.articles', label: t('insights.articles') },
                { key: 'insights.promotion', label: t('insights.promotion') },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox defaultChecked />
                  {item.label}
                </label>
              ))}
            </div>
            <NewsletterForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const NewsletterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName) {
      setSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder={t('insights.firstName')}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="flex-1 h-10"
      />
      <Input
        type="text"
        placeholder={t('insights.lastName')}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="flex-1 h-10"
      />
      <Input
        type="email"
        placeholder={t('insights.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-[2] h-12 text-base"
      />
      <Button type="submit" className="w-full sm:w-auto">
        {submitted ? t('testimonials.subscribed') : t('insights.subscribe')}
      </Button>
    </form>
  );
};
