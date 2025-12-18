import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay securely using M-Pesa or other available payment methods.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa payments for convenient and secure transactions.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery within Nairobi typically takes 1-3 business days. Deliveries to other parts of Kenya may take 3-7 business days depending on your location.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, once your order is shipped, you will receive a notification with tracking information. You can also check your order status in your account.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery for unused items in their original packaging. Please contact us to initiate a return.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at gracearenakenya@gmail.com or call us at 0759 212574. We are available Monday to Saturday, 9 AM to 6 PM.',
  },
]

export function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
