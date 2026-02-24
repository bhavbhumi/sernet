import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useState } from 'react';

const features = [
  'Free equity delivery trades',
  'Free direct mutual funds',
  'Flat ₹20 for intraday & F&O',
  'No account opening fee',
  'No annual maintenance charge',
  'Advanced trading platforms',
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
    console.log('Signup:', { email, phone });
  };

  return (
    <Layout>
      <section className="section-padding bg-hero min-h-[calc(100vh-4rem)]">
        <div className="container-sernet">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-xl text-foreground mb-6">
                Open a free <br />
                <span className="text-primary">SERNET</span> account
              </h1>
              <p className="text-body mb-8">
                Join 1500+ families who trust SERNET for their financial journey.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-body">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
                <h2 className="heading-md text-foreground mb-6 text-center">
                  Sign up now
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Mobile number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full py-4">
                    Continue
                  </button>
                </form>

                <p className="text-small text-center mt-6">
                  By proceeding, you agree to the{' '}
                  <a href="#" className="link-primary">Terms of Use</a>
                  {' '}and{' '}
                  <a href="#" className="link-primary">Privacy Policy</a>.
                </p>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-small">
                    Already have an account?{' '}
                    <a href="#" className="link-primary font-medium">Login</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Signup;
