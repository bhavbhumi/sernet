import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ArrowRight, Shield, Clock, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const OpenAccount = () => {
  const benefits = [
    'Free equity delivery trades',
    'Flat ₹20 for intraday and F&O',
    'Free direct mutual funds',
    'No account maintenance charges',
    'Free Kite trading platform',
    'Access to Console and Coin',
  ];

  const steps = [
    {
      icon: Smartphone,
      title: 'Enter your details',
      description: 'Provide your mobile number and email to get started',
    },
    {
      icon: Shield,
      title: 'Complete KYC',
      description: 'Verify your identity with Aadhaar and PAN',
    },
    {
      icon: Clock,
      title: 'Start investing',
      description: 'Your account is ready within 24 hours',
    },
  ];

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-display mb-6">
                Open a free <span className="text-primary">demat account</span>
              </h1>
              <p className="text-body mb-8">
                Join 1.6+ crore Indians who trust Zerodha for their investments. 
                Modern platforms, ₹0 brokerage for investments, and flat ₹20 for F&O.
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Account opening is free. A one-time payment of ₹200 for account activation 
                  (refundable as brokerage credit) is applicable only if you want to trade in F&O.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Signup now
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your name
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mobile number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input 
                      type="tel" 
                      placeholder="Enter mobile number"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Sign up now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
              Open your account in 3 simple steps
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm text-primary font-medium mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default OpenAccount;
