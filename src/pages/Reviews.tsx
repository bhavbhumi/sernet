import { Layout } from '@/components/layout/Layout';
import { ReviewsContent } from '@/components/about/ReviewsContent';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Reviews = () => {
  return (
    <Layout>
      <ReviewsContent />
    </Layout>
  );
};

export default Reviews;
