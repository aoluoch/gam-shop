import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-2">Terms and Conditions</h1>
      <p className="text-muted-foreground mb-8">Last updated: December 17, 2024</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Agreement to Terms</h2>
          <p className="text-foreground/80 leading-relaxed">
            Welcome to GAM Shop. These Terms and Conditions ("Terms") govern your use of our website and the purchase 
            of products from our online store. By accessing or using our website, creating an account, or making a 
            purchase, you agree to be bound by these Terms.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            If you do not agree to these Terms, please do not use our website or services. We reserve the right to 
            modify these Terms at any time, and your continued use of the website constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Products and Services</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">2.1 Product Descriptions</h3>
          <p className="text-foreground/80 leading-relaxed">
            We strive to provide accurate descriptions, images, and pricing for all products. However, we do not 
            warrant that product descriptions, images, or other content on our website are accurate, complete, 
            reliable, current, or error-free.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.2 Product Categories</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            GAM Shop offers the following product categories:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>Books</strong> - Spiritual books authored by Apostle David Owusu and Rev. Eunice</li>
            <li><strong>Apparel</strong> - T-shirts available in sizes S, M, L, XL, XXL, and XXXL, in various colors 
            including Red, White, Blue, Black, Grey, Maroon, Mustard Yellow, Yellow, and Purple</li>
            <li><strong>Accessories</strong> - Branded caps and rubber bands</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.3 Availability</h3>
          <p className="text-foreground/80 leading-relaxed">
            All products are subject to availability. We reserve the right to limit quantities, discontinue products, 
            or modify product offerings without prior notice. If a product you ordered is unavailable, we will notify 
            you and offer alternatives or a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Pricing and Payment</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">3.1 Pricing</h3>
          <p className="text-foreground/80 leading-relaxed">
            All prices are displayed in the applicable currency and are inclusive of any applicable taxes unless 
            otherwise stated. We reserve the right to change prices at any time without prior notice. The price 
            charged will be the price in effect at the time of order placement.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">3.2 Payment Methods</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We accept the following payment methods through our secure payment processor, Paystack:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li><strong>M-Pesa</strong> - Mobile money payments</li>
            <li><strong>Credit/Debit Cards</strong> - Visa, Mastercard, and other major cards</li>
            <li><strong>Bank Transfers</strong> - Where available</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">3.3 Payment Security</h3>
          <p className="text-foreground/80 leading-relaxed">
            All payment transactions are processed securely through Paystack. We do not store your complete payment 
            card information on our servers. By making a purchase, you agree to Paystack's terms of service and 
            privacy policy.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">3.4 Order Confirmation</h3>
          <p className="text-foreground/80 leading-relaxed">
            Upon successful payment, you will receive an order confirmation email with your order details and 
            tracking information. Please review this information carefully and contact us immediately if there 
            are any discrepancies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Shipping and Delivery</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">4.1 Shipping Areas</h3>
          <p className="text-foreground/80 leading-relaxed">
            We currently ship to locations as specified on our website. Shipping availability and costs may vary 
            depending on your location.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">4.2 Delivery Times</h3>
          <p className="text-foreground/80 leading-relaxed">
            Estimated delivery times are provided at checkout and in your order confirmation. These are estimates 
            only and may vary due to factors beyond our control, including customs processing, weather conditions, 
            or carrier delays.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">4.3 Shipping Costs</h3>
          <p className="text-foreground/80 leading-relaxed">
            Shipping costs are calculated based on your location and order weight/size and will be displayed at 
            checkout before you complete your purchase.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">4.4 Risk of Loss</h3>
          <p className="text-foreground/80 leading-relaxed">
            Risk of loss and title for items purchased pass to you upon delivery to the carrier. We are not 
            responsible for lost or damaged packages once they have been handed over to the shipping carrier.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Returns and Refunds</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">5.1 Return Policy</h3>
          <p className="text-foreground/80 leading-relaxed">
            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return 
            eligible items within 14 days of delivery for a refund or exchange, subject to the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
            <li>Items must be unused, unworn, and in original condition with all tags attached</li>
            <li>Items must be in original packaging</li>
            <li>Books must be unopened and in resalable condition</li>
            <li>Proof of purchase is required</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">5.2 Non-Returnable Items</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>Items marked as final sale</li>
            <li>Personalized or customized items</li>
            <li>Items damaged due to customer misuse</li>
            <li>Items without original tags or packaging</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">5.3 Refund Process</h3>
          <p className="text-foreground/80 leading-relaxed">
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of 
            your refund. If approved, your refund will be processed to your original payment method within 7-10 
            business days. Shipping costs are non-refundable unless the return is due to our error.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">5.4 Damaged or Defective Items</h3>
          <p className="text-foreground/80 leading-relaxed">
            If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos 
            of the damage. We will arrange for a replacement or full refund at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">6. User Accounts</h2>
          
          <h3 className="text-xl font-medium text-foreground mb-3">6.1 Account Registration</h3>
          <p className="text-foreground/80 leading-relaxed">
            To make purchases, you may need to create an account. You agree to provide accurate, current, and 
            complete information during registration and to update this information to keep it accurate.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">6.2 Account Security</h3>
          <p className="text-foreground/80 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all 
            activities that occur under your account. You agree to notify us immediately of any unauthorized 
            use of your account.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">6.3 Account Termination</h3>
          <p className="text-foreground/80 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time for any reason, including 
            violation of these Terms, fraudulent activity, or abusive behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Intellectual Property</h2>
          <p className="text-foreground/80 leading-relaxed">
            All content on this website, including but not limited to text, graphics, logos, images, audio clips, 
            digital downloads, and software, is the property of GAM Shop or its content suppliers and is protected 
            by international copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly 
            perform, republish, download, store, or transmit any content from our website without our prior 
            written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Prohibited Activities</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>Using the website for any unlawful purpose</li>
            <li>Attempting to gain unauthorized access to our systems</li>
            <li>Interfering with or disrupting the website or servers</li>
            <li>Using automated systems to access the website without permission</li>
            <li>Impersonating another person or entity</li>
            <li>Submitting false or misleading information</li>
            <li>Engaging in fraudulent transactions</li>
            <li>Harassing, threatening, or intimidating other users or staff</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">9. Limitation of Liability</h2>
          <p className="text-foreground/80 leading-relaxed">
            To the fullest extent permitted by law, GAM Shop shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including but not limited to loss of profits, data, 
            use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
            <li>Your access to or use of (or inability to access or use) the website</li>
            <li>Any conduct or content of any third party on the website</li>
            <li>Any content obtained from the website</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          <p className="text-foreground/80 leading-relaxed mt-4">
            Our total liability for any claims arising from your use of the website or purchase of products 
            shall not exceed the amount you paid for the specific product(s) giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">10. Indemnification</h2>
          <p className="text-foreground/80 leading-relaxed">
            You agree to indemnify, defend, and hold harmless GAM Shop, its officers, directors, employees, 
            agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses 
            (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms 
            or your use of the website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">11. Dispute Resolution</h2>
          <p className="text-foreground/80 leading-relaxed">
            Any disputes arising from these Terms or your use of our website shall first be attempted to be 
            resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through 
            binding arbitration in accordance with the rules of the applicable arbitration body in our jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">12. Governing Law</h2>
          <p className="text-foreground/80 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
            which GAM Shop operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">13. Severability</h2>
          <p className="text-foreground/80 leading-relaxed">
            If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining 
            provisions shall continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">14. Changes to Terms</h2>
          <p className="text-foreground/80 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
            posting on the website. Your continued use of the website after any changes constitutes your acceptance 
            of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">15. Customer Service</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We are committed to providing excellent customer service. Here's how we can help you:
          </p>
          
          <h3 className="text-xl font-medium text-foreground mb-3">15.1 Order Tracking</h3>
          <p className="text-foreground/80 leading-relaxed">
            You can track your order status by logging into your account and viewing your order history. 
            You will also receive email updates as your order progresses through processing, shipping, and delivery.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">15.2 Frequently Asked Questions</h3>
          <p className="text-foreground/80 leading-relaxed">
            For common questions about orders, payments, shipping, and returns, please visit our{' '}
            <Link to={ROUTES.FAQ} className="text-primary hover:underline">FAQ page</Link>.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">15.3 Shipping Information</h3>
          <p className="text-foreground/80 leading-relaxed">
            For detailed information about our shipping areas, delivery times, and costs, please visit our{' '}
            <Link to={ROUTES.SHIPPING} className="text-primary hover:underline">Shipping Info page</Link>.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3 mt-6">15.4 Returns & Refunds</h3>
          <p className="text-foreground/80 leading-relaxed">
            For our complete return and refund policy, eligibility requirements, and how to request a return, 
            please visit our{' '}
            <Link to={ROUTES.RETURNS} className="text-primary hover:underline">Returns & Refunds page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">16. Contact Information</h2>
          <p className="text-foreground/80 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4">
            <p className="text-foreground font-medium">Grace Arena Ministries</p>
            <p className="text-foreground/80 mt-2">Email: gracearenakenya@gmail.com</p>
            <p className="text-foreground/80">Phone: 0759 212574</p>
            <p className="text-foreground/80">Address: Bungoma Road, off Baricho Road, Nairobi, Kenya</p>
            <p className="text-foreground/80">Website: gracearenaministries.org</p>
          </div>
        </section>

        <div className="border-t pt-8 mt-8">
          <p className="text-muted-foreground text-sm">
            By using GAM Shop and making purchases, you acknowledge that you have read, understood, and agree 
            to be bound by these Terms and Conditions.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to={ROUTES.PRIVACY} className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link to={ROUTES.FAQ} className="text-primary hover:underline">
              FAQ
            </Link>
            <Link to={ROUTES.SHIPPING} className="text-primary hover:underline">
              Shipping Info
            </Link>
            <Link to={ROUTES.RETURNS} className="text-primary hover:underline">
              Returns & Refunds
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

export default TermsPage;
