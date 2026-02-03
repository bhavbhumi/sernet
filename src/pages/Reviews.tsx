import { Layout } from '@/components/layout/Layout';
import { Star } from 'lucide-react';

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
];

const Reviews = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <h1 className="text-3xl font-medium text-foreground mb-4">Client Reviews</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Don't just take our word for it. Here's what our clients have to say about their 
          experience with SERNET Financial Services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="p-6 border border-border rounded-lg"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{review.review}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
