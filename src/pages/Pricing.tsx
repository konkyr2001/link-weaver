import { motion } from "framer-motion";
import { Check, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const tiers = [
  {
    name: "Free",
    price: "Free",
    description: "No account needed",
    features: [
      "Unlimited bundles",
      "Unlimited links per bundle",
      "Bundles expire after 5 days",
    ],
    negatives: [
      "No bundle deletion",
      "No editing after creation",
    ],
    cta: "Get Started",
    ctaLink: "/",
    highlighted: false,
  },
  {
    name: "Plus",
    price: "17.99€",
    period: "/year",
    description: "Unlimited bundles",
    features: [
      "Unlimited bundles",
      "Unlimited links per bundle",
      "Bundles expire after 1 year",
      "Delete bundles anytime",
    ],
    negatives: [
      "No editing after creation",
    ],
    cta: "Upgrade to Plus",
    ctaLink: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "23.99€",
    period: "/year",
    description: "Full control with no limits",
    features: [
      "Unlimited bundles",
      "Unlimited links per bundle",
      "Bundles never expire",
      "Delete bundles anytime",
      "Edit bundles anytime",
      "30-day backup period after your plan ends",
    ],
    cta: "Go Pro",
    ctaLink: "/signup",
    highlighted: true,
  },
];

const Pricing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <Header active="pricing" />

      <main className="flex-1 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent{" "}
              <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Start for free. Upgrade when you need bundles that last forever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl p-8 flex flex-col ${
                  tier.highlighted
                    ? "glass-card ring-2 ring-primary glow-primary"
                    : "glass-card"
                }`}
              >
                  <span className="text-xs min-h-[16px] font-semibold text-primary uppercase tracking-wider mb-2">
                {tier.highlighted && (
                    "Most Popular"
                )}
                  </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {tier.name}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">{tier.description}</p>

                <div className="mt-6 mb-8">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {tier.negatives?.map((negative) => (
                    <li key={negative} className="flex items-start gap-2 text-sm text-foreground">
                      <X className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {negative}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={tier.highlighted ? "hero" : "glass"}
                  size="lg"
                  className="w-full"
                >
                  <Link to={tier.ctaLink}>{tier.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
          Paste. Bundle. Share.
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
