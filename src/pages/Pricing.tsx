import { motion } from "framer-motion";
import { Check, X, Plus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { createCheckoutSession, upgradeToPro } from "@/services/billing";
import { getUser } from "@/services/user";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const RENEWAL_WINDOW_DAYS = 10;

const getDaysRemaining = (currentPeriodEnd: string | null): number | null => {
  if (!currentPeriodEnd) return null;
  const end = new Date(currentPeriodEnd);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getTierState = (userPlan: string | null, daysRemaining: number | null) => {
  const canRenew = daysRemaining !== null && daysRemaining <= RENEWAL_WINDOW_DAYS;

  if (!userPlan) {
    return {
      free: { text: "Get Started", link: "/", disabled: false },
      plus: { text: "Upgrade to Plus", link: "/login", disabled: false },
      pro: { text: "Go Pro", link: "/login", disabled: false },
    };
  }

  if (userPlan === "free") {
    return {
      free: { text: "Current Plan", link: "", disabled: true },
      plus: { text: "Upgrade to Plus", link: "", disabled: false },
      pro: { text: "Go Pro", link: "", disabled: false },
    };
  }

  if (userPlan === "plus") {
    return {
      free: { text: "Included", link: "", disabled: true },
      plus: {
        text: canRenew ? "Renew Plus" : "Current Plan",
        link: "",
        disabled: !canRenew,
      },
      pro: { text: "Upgrade to Pro", link: "", disabled: false },
    };
  }

  if (userPlan === "pro") {
    return {
      free: { text: "Included", link: "", disabled: true },
      plus: { text: "Included", link: "", disabled: true },
      pro: {
        text: canRenew ? "Renew Pro" : "Current Plan",
        link: "",
        disabled: !canRenew,
      },
    };
  }

  return {
    free: { text: "Get Started", link: "/", disabled: false },
    plus: { text: "Upgrade to Plus", link: "/login", disabled: false },
    pro: { text: "Go Pro", link: "/login", disabled: false },
  };
};

const Pricing = () => {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const daysRemaining = getDaysRemaining(user?.currentPeriodEnd ?? null);
  const tierState = getTierState(user?.plan, daysRemaining);
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
        "Expired links are stored in history",
        "Delete bundles",
        "Edit bundles",
      ],
      cta: {
        text: tierState.free.text,
        link: tierState.free.link,
        disabled: tierState.free.disabled,
      },
      plan: "free",
      highlighted: false,
    },
    {
      name: "Plus",
      price: "39€",
      period: "/year",
      description: "Unlimited bundles",
      features: [
        "Unlimited bundles",
        "Unlimited links per bundle",
        "Bundles expire after 1 year",
        "Expired links are stored in history",
        "Delete bundles",
      ],
      negatives: [
        "Edit bundles",
      ],
      cta: {
        text: tierState.plus.text,
        link: tierState.plus.link,
        disabled: tierState.plus.disabled,
      },
      plan: "plus",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "59€",
      period: "/year",
      description: "Full control with no limits",
      features: [
        "Unlimited bundles",
        "Unlimited links per bundle",
        "Bundles expire after 1 year",
        "Expired links are stored in history",
        "Delete bundles",
        "Edit bundles",
        "7-day free trial",
      ],
      cta: {
        text: tierState.pro.text,
        link: tierState.pro.link,
        disabled: tierState.pro.disabled,
      },
      plan: "pro",
      highlighted: true,
    },
  ];

  useEffect(() => {
    const syncUserAfterPayment = async () => {
      const canceled = searchParams.get("canceled");

      if (canceled === "true") {
        toast.error("Payment was canceled");
        navigate("/pricing", { replace: true });
        return;
      }
    }

    syncUserAfterPayment();
  }, [searchParams, navigate]);
  
  const handleCheckout = async (cta, plan, trial: boolean) => {
    if (cta.disabled) return;
    if (!user) {
      navigate(cta.link);
      return;
    }

    if (user?.plan === "plus" && plan === "pro") {
      const res = await upgradeToPro(user._id);

      if (res?.error) {
        toast.error(res?.error);
        return;
      }

      const token = localStorage.getItem("token");
      const freshUser = await getUser(token);

      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
      toast.success("You have been upgraded to Pro");
      return;
    }
    const data = await createCheckoutSession(plan, user._id, user.email, trial);
    if (data.error) {
      return toast.error(data.error);
    }

    window.location.href = data.url;
  }

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
            <p className="text-muted-foreground text-lg max-w-md md:max-w-[unset] mx-auto">
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

                {user?.plan === tier.plan && daysRemaining !== null && (
                  <p className={`text-xs text-center mb-3 font-medium ${
                    daysRemaining <= 0 ? "text-destructive" : daysRemaining <= RENEWAL_WINDOW_DAYS ? "text-yellow-500" : "text-muted-foreground"
                  }`}>
                    {daysRemaining <= 0
                      ? "Your plan has expired"
                      : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
                  </p>
                )}

                {tier.plan === "pro" && user && !user.hasUsedProTrial && (
                <Button
                  variant={"link"}
                  size="sm"
                  className="w-fit mx-auto mb-2 flex flex-col gap-1.5"
                  onClick={() => handleCheckout(tier.cta, tier.plan, true)}
                >
                  7-day free trial
                </Button>
                )}

                <Button
                  variant={tier.highlighted ? "hero" : "glass"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleCheckout(tier.cta, tier.plan, false)}
                  disabled={tier.cta.disabled}
                >
                  {tier.cta.text}
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
