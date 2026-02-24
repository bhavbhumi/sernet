import { Layout } from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container-sernet section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-xl text-foreground mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using SERNET's services, you agree to be bound by these Terms and Conditions, 
                all applicable laws and regulations, and agree that you are responsible for compliance with any 
                applicable local laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Account Registration</h2>
              <p>
                To use our services, you must register for an account. You agree to provide accurate, current, 
                and complete information during the registration process and to update such information to keep 
                it accurate, current, and complete.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>You must be at least 18 years old to open an account</li>
                <li>You must be a resident of India with valid KYC documents</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Trading and Investment</h2>
              <p>
                Trading in securities market involves significant risk. Past performance is not indicative of 
                future results. You should carefully consider whether trading or investing is appropriate for 
                you in light of your financial condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Fees and Charges</h2>
              <p>
                You agree to pay all applicable fees and charges as listed on our pricing page. We reserve 
                the right to modify our fee structure with prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
              <p>
                All content, trademarks, and data on this platform, including but not limited to software, 
                databases, text, graphics, icons, hyperlinks, private information, designs, and agreements, 
                are the property of SERNET Financial Services Pvt. Ltd.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>
                SERNET shall not be liable for any direct, indirect, incidental, special, consequential, 
                or punitive damages resulting from your access to or use of, or inability to access or use, 
                the services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p>
                For any questions regarding these Terms & Conditions, please contact us at:<br />
                Email: support@sernetindia.com<br />
                Phone: 080-47181888
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
