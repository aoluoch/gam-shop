import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: December 17, 2024</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
          <p className="text-foreground/80 leading-relaxed">
            Welcome to GAM Shop. We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
            our website and make purchases from our store.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">2.1 Personal Information</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>Register for an account</li>
            <li>Make a purchase</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us with inquiries</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          <p className="text-foreground/80 leading-relaxed mt-4">
            This information may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>Name</strong> - Your full name for account and shipping purposes</li>
            <li><strong>Email Address</strong> - For order confirmations, updates, and communications</li>
            <li><strong>Phone Number</strong> - For delivery coordination and customer support</li>
            <li><strong>Shipping Address</strong> - To deliver your orders</li>
            <li><strong>Billing Information</strong> - Processed securely through Paystack</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.2 Payment Information</h3>
          <p className="text-foreground/80 leading-relaxed">
            We use Paystack as our payment processor. When you make a payment, your payment information 
            (credit/debit card details, M-Pesa information) is collected and processed directly by Paystack. 
            We do not store your complete payment card details on our servers. Paystack's privacy policy 
            governs the collection and use of your payment information.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.3 Automatically Collected Information</h3>
          <p className="text-foreground/80 leading-relaxed">
            When you visit our website, we automatically collect certain information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
            <li>Referring website addresses</li>
            <li>Shopping preferences and cart contents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. How We Use Your Information</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>Process Transactions</strong> - To fulfill your orders, process payments, and arrange delivery</li>
            <li><strong>Customer Service</strong> - To respond to your inquiries, provide support, and resolve issues</li>
            <li><strong>Communications</strong> - To send order confirmations, shipping updates, and important notices</li>
            <li><strong>Marketing</strong> - To send promotional materials (only with your consent)</li>
            <li><strong>Improvement</strong> - To analyze usage patterns and improve our website and services</li>
            <li><strong>Security</strong> - To detect and prevent fraud, unauthorized access, and other illegal activities</li>
            <li><strong>Legal Compliance</strong> - To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information 
            only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>Service Providers</strong> - With trusted third parties who assist us in operating our website, 
            conducting our business, or servicing you (e.g., Paystack for payments, delivery partners for shipping)</li>
            <li><strong>Legal Requirements</strong> - When required by law, court order, or governmental authority</li>
            <li><strong>Business Transfers</strong> - In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>Protection</strong> - To protect our rights, privacy, safety, or property</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Data Security</h2>
          <p className="text-foreground/80 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure servers and databases</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
          <p className="text-foreground/80 leading-relaxed mt-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
            to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Your Rights</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>Access</strong> - Request a copy of the personal information we hold about you</li>
            <li><strong>Correction</strong> - Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion</strong> - Request deletion of your personal information (subject to legal requirements)</li>
            <li><strong>Opt-out</strong> - Unsubscribe from marketing communications at any time</li>
            <li><strong>Data Portability</strong> - Request a copy of your data in a structured, machine-readable format</li>
          </ul>
          <p className="text-foreground/80 leading-relaxed mt-4">
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Cookies</h2>
          <p className="text-foreground/80 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small 
            files stored on your device that help us remember your preferences, understand how you use our website, 
            and improve our services.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            You can control cookies through your browser settings. However, disabling cookies may limit your ability 
            to use certain features of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Third-Party Links</h2>
          <p className="text-foreground/80 leading-relaxed">
            Our website may contain links to third-party websites or services. We are not responsible for the privacy 
            practices or content of these external sites. We encourage you to read the privacy policies of any 
            third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">9. Children's Privacy</h2>
          <p className="text-foreground/80 leading-relaxed">
            Our website is not intended for children under the age of 13. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child has provided 
            us with personal information, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-foreground/80 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
            updated policy on this page with a new "Last updated" date.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">11. Contact Us</h2>
          <p className="text-foreground/80 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4">
            <p className="text-foreground font-medium">GAM Shop</p>
            <p className="text-foreground/80 mt-2">Email: privacy@gamshop.com</p>
            <p className="text-foreground/80">Phone: +123 456 7890</p>
            <p className="text-foreground/80">Address: 123 Ministry Street, City, Country</p>
          </div>
        </section>

        <div className="border-t pt-8 mt-8">
          <p className="text-muted-foreground text-sm">
            By using GAM Shop, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to={ROUTES.TERMS} className="text-primary hover:underline">
              Terms & Conditions
            </Link>
            <Link to={ROUTES.CONTACT} className="text-primary hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
