import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { CreditCard, Building2, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const transferMethods = [
  {
    icon: Building2,
    title: 'UPI',
    description: 'Instant fund transfer using UPI. Free and available 24x7.',
    time: 'Instant',
    charges: 'Free',
  },
  {
    icon: CreditCard,
    title: 'Net Banking',
    description: 'Transfer funds directly from your bank account.',
    time: '1-2 hours',
    charges: 'Free',
  },
  {
    icon: Building2,
    title: 'NEFT/RTGS',
    description: 'Transfer funds via NEFT or RTGS to your trading account.',
    time: '2-4 hours',
    charges: 'Bank charges apply',
  },
];

const FundTransfer = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fund Transfer
            </h1>
            <p className="text-lg text-muted-foreground">
              Add funds to your trading account or withdraw to your bank
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Add Funds</h2>
              <p className="text-muted-foreground mb-6">
                Transfer money from your bank account to start trading
              </p>
              <Button asChild>
                <a href="https://kite.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Add Funds in Kite <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-muted/50 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Withdraw Funds</h2>
              <p className="text-muted-foreground mb-6">
                Transfer your available balance back to your bank
              </p>
              <Button variant="outline" asChild>
                <a href="https://console.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Withdraw in Console <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Transfer Methods</h2>
            <div className="space-y-4">
              {transferMethods.map((method, index) => (
                <div
                  key={method.title}
                  className="bg-muted/50 rounded-lg p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Time: {method.time}</span>
                      <span>Charges: {method.charges}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-primary/10 rounded-lg p-6 flex items-start gap-4"
          >
            <Shield className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Secure Transfers</h3>
              <p className="text-sm text-muted-foreground">
                All fund transfers are secured with bank-grade encryption. We follow RBI and SEBI 
                guidelines for fund handling. Your money is always safe with us.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FundTransfer;
