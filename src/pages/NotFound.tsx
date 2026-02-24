import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { Home, Search, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse SERNET Financial Services for trading, investment, and insurance solutions."
        path={location.pathname}
      />
      <section className="section-padding bg-background min-h-[60vh] flex items-center">
        <div className="container-sernet text-center max-w-xl mx-auto">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="heading-lg text-foreground mb-3">Page not found</h1>
          <p className="text-body mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-md font-medium hover:bg-muted transition-colors"
            >
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Popular pages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Pricing', href: '/pricing' },
                { label: 'Calculators', href: '/calculators' },
                { label: 'Contact', href: '/contact' },
                { label: 'Support', href: '/support' },
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary hover:underline px-3 py-1 rounded-full border border-border hover:border-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
