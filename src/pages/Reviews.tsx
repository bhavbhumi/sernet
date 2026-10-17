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
        description="Read client reviews of SERNET Financial Services, continuing a family financial-services practice started in October 1986."
        path="/reviews"
      />
      <ReviewsContent />
    </Layout>
  );
};

export default Reviews;
