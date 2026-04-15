import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faq = [
  {
    question: "How does the 7-day free trial work?",
    answer:
      "When you start the Pro free trial, you get full access to all Pro features for 7 days at no cost. If auto-renewal is enabled, your subscription will automatically begin at the end of the trial and you will be charged for one year. If you disable auto-renewal before the trial ends, you will not be charged and your account will return to the free plan.",
  },
  {
    question: "How long does a subscription last?",
    answer:
      "Plus and Pro subscriptions last for one year from the date of purchase.",
  },
  {
    question: "How does subscription renewal work?",
    answer:
      "If auto-renewal is enabled in your account settings, your plan will automatically renew at the end of the billing period. If it is disabled, your subscription will expire and your account will return to the free plan.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can disable auto-renewal at any time from your account settings. Your plan will remain active until the end of the current billing period.",
  },
  {
    question: "Can I get a refund after purchasing a plan?",
    answer:
      "Refunds are currently not supported. If you experience any issues, please contact us at [your email].",
  },
  {
    question: "What happens if I upgrade from Plus to Pro?",
    answer:
      "You can upgrade from Plus to Pro at any time. Your Plus subscription will be replaced, and your Pro plan will begin immediately under a new billing cycle.",
  },
]

const FaqSection = () => {
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

export default FaqSection;