import { Layout } from '@/components/layout/Layout';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    review: "SERNET has been instrumental in growing my portfolio. Their personalized approach and deep market knowledge have helped me achieve my financial goals.",
    date: "Jan 2025"
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    review: "The team at SERNET is incredibly professional and knowledgeable. They've been managing my family's investments for over 10 years with excellent returns.",
    date: "Dec 2024"
  },
  {
    name: "Anand Mehta",
    location: "Bangalore",
    rating: 5,
    review: "Exceptional service and transparent communication. I highly recommend SERNET for anyone looking for reliable investment advisory services.",
    date: "Nov 2024"
  },
  {
    name: "Sunita Patel",
    location: "Ahmedabad",
    rating: 5,
    review: "From insurance planning to equity investments, SERNET has provided comprehensive solutions for all my financial needs. Truly a one-stop destination.",
    date: "Oct 2024"
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    review: "Switched from a big-name broker and couldn't be happier. Personal attention and zero hidden charges make SERNET stand out from the crowd.",
    date: "Sep 2024"
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    rating: 5,
    review: "Their research reports are top-notch. I've made informed decisions that consistently outperform the market benchmarks.",
    date: "Aug 2024"
  },
  {
    name: "Deepak Verma",
    location: "Lucknow",
    rating: 5,
    review: "The onboarding process was seamless and the support team is always just a call away. Great experience overall with SERNET.",
    date: "Jul 2024"
  },
  {
    name: "Kavita Joshi",
    location: "Pune",
    rating: 5,
    review: "I trust SERNET with my retirement planning. Their long-term vision and disciplined approach give me complete peace of mind.",
    date: "Jun 2024"
  },
];

const Reviews = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="heading-lg text-foreground mb-3">Client Reviews</h1>
          <p className="text-body max-w-2xl">
            Don't just take our word for it. Here's what our clients have to say about their 
            experience with SERNET Financial Services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 border border-border rounded-xl relative group hover:border-primary/30 transition-colors duration-300"
            >
              <Quote className="w-8 h-8 text-primary/10 absolute top-4 right-4" />
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--sernet-yellow))] text-[hsl(var(--sernet-yellow))]" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                "{review.review}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social media invite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-12 px-6 rounded-xl border border-border bg-section-alt"
        >
          <h2 className="heading-md text-foreground mb-2">Share Your Experience</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Had a great experience with SERNET? We'd love to hear from you. Leave us a review on your favourite platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://g.page/r/sernet/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Review on Google
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/sernetindia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Review on Facebook
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.instagram.com/sernetindia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Review on Instagram
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Reviews;
