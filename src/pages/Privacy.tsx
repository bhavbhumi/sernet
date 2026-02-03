import { Layout } from '@/components/layout/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container-zerodha section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                make a transaction, or contact us for support. This includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Personal identification information (Name, PAN, Aadhaar, etc.)</li>
                <li>Contact information (Email address, phone number, address)</li>
                <li>Financial information (Bank account details, income details)</li>
                <li>Trading and investment history</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
                <li>Send you technical notices and support messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>With regulatory authorities as required by law (SEBI, exchanges, etc.)</li>
                <li>With service providers who assist in our operations</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Two-factor authentication for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and 
                hold certain information. You can instruct your browser to refuse all cookies or to 
                indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:<br />
                Email: privacy@zerodha.com<br />
                Address: #153/154, 4th Cross, Dollars Colony, J.P Nagar 4th Phase, Bengaluru - 560078
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

export default Privacy;
