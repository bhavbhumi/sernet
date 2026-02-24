import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { ReviewsContent } from '@/components/about/ReviewsContent';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Reviews = () => {
  return (
    <Layout>
      <SEOHead
        title="Client Reviews"
        description="Read what thousands of clients say about SERNET Financial Services — trusted for 35+ years."
        path="/reviews"
      />
      <ReviewsContent />
    </Layout>
  );
};

export default Reviews;
