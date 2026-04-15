import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const faq = [
  {
    question: "How does the 7-day free trial work?",
    answer: `When you start your Pro free trial, you get full access to all 
    Pro features for 7 days at no cost. When the trial ends, your subscription 
    will automatically renew and you’ll be charged unless you cancel beforehand.`,
  },
  {
    question: "How can I cancel my subscription?",
    answer: <span>
      When your subscription is about to renew, it will automatically charge you.
      If you prefer not to continue your subscription, you can update your {" "}
      <Link to="/account" className="text-primary underline hover:opacity-80">account</Link>{" "}
      settings by turning off the auto‑renewal toggle.
    </span>

  },
  {
    question: "How long does a subscription last?",
    answer:
      "Plus and Pro subscriptions last for one year, starting from the date of purchase.",
  },
  {
    question: "Can I get a refund after purchasing a plan?",
    answer: <span>
      Unfortunately refunds are currently not supported. If you experience any issues,
      feel free to  <Link to="/contact" className="text-primary underline hover:opacity-80">contact</Link> us.
    </span>
  },
  {
    question: "What happens if I upgrade from Plus to Pro?",
    answer:
      "You can upgrade from Plus to Pro at any time. Your Plus subscription will be cancelled, and your Pro plan will begin immediately under a new billing cycle.",
  },
]

const FaqSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-20 max-w-[50rem] mx-auto"
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