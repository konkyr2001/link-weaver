import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const FREE_NO_ACCOUNT = import.meta.env.VITE_FREE_NO_ACCOUNT_EXPIRATION_DAY;
const FREE_ACCOUNT = import.meta.env.VITE_FREE_ACCOUNT_EXPIRATION_DAY;
const faq = [
  {
    question: "What is WeLinkly used for?",
    answer: `
      WeLinkly is a place where you can store all your links and never worry about losing them.
      It helps you organize and share multiple links in one clean, professional, and user-friendly page.
      All your links are saved on your History page, so even if the original message gets lost in the chat,
      you can always find them here 😊.
    `
  },
  {
    question: "What is a bundle?",
    answer:
      "A bundle is a single shareable link that contains multiple URLs.",
  },
  {
    question: "Can I use WeLinkly for free?",
    answer:
      "Yes. You can create and share bundles for free. Paid plans unlock longer expiration times, history access, and additional features.",
  },
  {
    question: "Do I need an account to create bundles?",
    answer:
      "No. You can create and share bundles without an account. Creating a free account gives you longer expiration times and access to your History page.",
  },
  {
    question: "How many links can I add to a bundle?",
    answer:
      "You can add unlimited links to each bundle. There are no restrictions.",
  },
  {
    question: "How many bundles can I create?",
    answer:
      "You can create unlimited bundles on all plans.",
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
    answer:
      "For free users, expired bundles are permanently deleted. Plus and Pro users keep their bundles in History, where they remain saved but inactive. If you renew your subscription, they become active again.",
  },
  {
    question: "Are my bundles private?",
    answer:
      "Yes. Your bundles are only accessible through the unique link you share. They are not publicly listed or indexed.",
  },
  {
    question: "How can I contact support?",
    answer: <span>You can contact us anytime <Link to="/contact" className="text-primary underline hover:opacity-80">here</Link>.</span>,
  }
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about bundles and subscriptions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;