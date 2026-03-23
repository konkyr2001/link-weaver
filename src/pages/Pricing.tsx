import { motion } from "framer-motion";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "No account needed",
    features: [
      "Unlimited bundles",
      "Unlimited links per bundle",
      "Shareable URLs",
      "Bundles expire in 3 days",
    ],
    cta: "Get Started",
    ctaLink: "/",
    highlighted: false,
  },
  {
    name: "Free+",
    price: "$0",
    period: "",
    description: "Account required",
    features: [
      "Everything in Free",
      "Bundles expire in 7 days",
      "Manage your bundles",
      "Access from any device",
    ],
    cta: "Create Account",
    ctaLink: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/year",
    description: "For power users",
    features: [
      "Everything in Free+",
      "Bundles never expire",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Subscribe",
    ctaLink: "/register",
    highlighted: true,
  },
];

const Pricing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">bundl</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-primary">
              Pricing
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

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
                {tier.highlighted && (
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Most Popular
                  </span>
                )}
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
