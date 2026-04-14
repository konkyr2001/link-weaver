import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FREE_NO_ACCOUNT = import.meta.env.VITE_FREE_NO_ACCOUNT_EXPIRATION_DAY;
const FREE_ACCOUNT = import.meta.env.VITE_FREE_ACCOUNT_EXPIRATION_DAY;
const faq = [
  {
    question: "What is a bundle?",
    answer: `A bundle is a single shareable link that contains multiple URLs.
      It helps you organize and share multiple links in one clean, professional, and user-friendly page.`
  },
  {
    question: "How many links can I add to a bundle?",
    answer: "You can add unlimited links to each bundle. There are no restrictions.",
  },
  {
    question: "How many bundles can I create?",
    answer: "You can create unlimited bundles on all plans.",
  },
  {
    question: "When do my bundles expire?",
    answer: (
      <span>
        Without an account: bundles expire after {FREE_NO_ACCOUNT} days <br />
        With a free account: bundles expire after {FREE_ACCOUNT} days <br />
        With a Plus or Pro subscription: bundles remain active as long as your subscription is active
      </span>
    ),
  },
  {
    question: "What happens when my bundles expire?",
    answer: `Expired bundles are automatically removed for free users. 
      Premium users keep their bundles in History, where they remain saved but inactive.`,
  },
  {
    question: "Are expired bundles permanently deleted?",
    answer: "Yes for free users. For Plus and Pro users, bundles are محفوظ in your History and can become active again if you renew your subscription.",
  },
  {
    question: "How does the 7-day free trial work?",
    answer: "When you choose the Pro plan, you get full access for 7 days at no cost. If you don’t cancel before the trial ends, your subscription will automatically start and you will be charged.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes. You can disable auto-renewal at any time from your account settings. Your plan will remain active until the end of the billing period.",
  },
  {
    question: "Can I get a refund?",
    answer: "Refunds are currently not supported. If you experience any issues, please contact support at [your email].",
  },
  {
    question: "What happens if I upgrade from Plus to Pro?",
    answer: "You can upgrade at any time. Your Plus subscription will be cancelled, and your Pro plan will start immediately with the new billing cycle.",
  },
  {
    question: "Are my bundles private?",
    answer: "Yes. Your bundles are only accessible via the unique link you share. They are not publicly listed or indexed.",
  },
];

const FAQ = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-20 max-w-3xl mx-auto"
    >
      <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
        Frequently Asked <span className="text-gradient">Questions</span>
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faq.map((object, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-lg px-6 border-0">
            <AccordionTrigger className="sm:text-lg text-left font-semibold text-foreground hover:no-underline py-4">
              {object.question}
            </AccordionTrigger>
            <AccordionContent className="sm:text-base text-muted-foreground pb-4">
              {object.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  )
};

export default FAQ;