import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding the new margin rules for F&O trading',
    excerpt: 'SEBI has introduced new margin rules that affect how traders can use leverage in futures and options trading...',
    author: 'Nithin Kamath',
    date: 'Jan 15, 2024',
    category: 'Regulations',
  },
  {
    id: 2,
    title: 'How to read and analyze quarterly results',
    excerpt: 'A comprehensive guide to understanding corporate earnings reports and making informed investment decisions...',
    author: 'Karthik Rangappa',
    date: 'Jan 10, 2024',
    category: 'Education',
  },
  {
    id: 3,
    title: 'New features in Kite 4.0',
    excerpt: 'We are excited to announce the latest updates to Kite including advanced charting, new order types, and more...',
    author: 'Kailash Nadh',
    date: 'Jan 5, 2024',
    category: 'Product Updates',
  },
  {
    id: 4,
    title: 'Tax-saving investment options for FY 2023-24',
    excerpt: 'As the financial year ends, here are the best tax-saving investment options under Section 80C and beyond...',
    author: 'Zerodha Team',
    date: 'Dec 28, 2023',
    category: 'Tax Planning',
  },
  {
    id: 5,
    title: 'Understanding index funds and why they matter',
    excerpt: 'Index funds have become increasingly popular among investors. Learn why they might be right for your portfolio...',
    author: 'Karthik Rangappa',
    date: 'Dec 20, 2023',
    category: 'Education',
  },
  {
    id: 6,
    title: 'Market outlook for 2024',
    excerpt: 'Our analysis of market trends and what investors can expect in the coming year...',
    author: 'Nithin Kamath',
    date: 'Dec 15, 2023',
    category: 'Market Analysis',
  },
];

const ZConnect = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Z-Connect Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Updates, announcements, and insights from the Zerodha team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-muted/30 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="flex items-center gap-1 text-primary text-sm font-medium mt-4 hover:underline"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="https://zerodha.com/z-connect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View all posts on Z-Connect <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ZConnect;
