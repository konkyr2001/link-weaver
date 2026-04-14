import { motion } from "framer-motion";
import { Check, X, Plus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { createCheckoutSession, upgradeToPro } from "@/services/billing";
import { getUser } from "@/services/user";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const RENEWAL_WINDOW_DAYS = 10;

const getDaysRemaining = (currentPeriodEnd: string | null): number | null => {
  if (!currentPeriodEnd) return null;
  const end = new Date(currentPeriodEnd);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getTierState = (userPlan: string | null, daysRemaining: number | null) => {
  const canPurchase = daysRemaining === null || daysRemaining <= 0;
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
        text: canPurchase ? "Renew Plus" : "Current Plan",
        link: "",
        disabled: !canPurchase,
      },
      pro: { text: "Upgrade to Pro", link: "", disabled: false },
    };
  }

  if (userPlan === "pro") {
    return {
      free: { text: "Included", link: "", disabled: true },
      plus: { text: "Included", link: "", disabled: true },
      pro: {
        text: canPurchase ? "Renew Pro" : "Current Plan",
        link: "",
        disabled: !canPurchase,
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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isTrial = user.trialEnd && new Date(user.trialEnd) > new Date();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<{ cta: any; plan: string; trial: boolean } | null>(null);
  const daysRemaining = getDaysRemaining(user?.currentPeriodEnd ?? null);
  const tierState = getTierState(user?.plan, daysRemaining);

  // Fetch fresh user data from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      const freshUser = await getUser(token);
      if (!freshUser?.error) {
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      }
    };
    fetchUser();
  }, []);
  const tiers = [
    {
      name: "Free",
      price: "Free",
      description: "No account needed",
      features: [
        "Unlimited bundles",
        "Unlimited links per bundle",
        `Bundles expire after ${import.meta.env.VITE_FREE_NO_ACCOUNT_EXPIRATION_DAY} days`,
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

    if (!token) {
      navigate(cta.link);
      return;
    }

    // Intercept Plus → Pro: show confirmation modal
    if (user?.plan === "plus" && plan === "pro") {
      setPendingUpgrade({ cta, plan, trial });
      setUpgradeModalOpen(true);
      return;
    }

    await proceedCheckout(plan, trial);
  }

  const proceedCheckout = async (plan: string, trial: boolean) => {
    let data = null;
    if (user?.plan === "plus" && plan === "pro") {
      data = await upgradeToPro(token!, trial);
    } else {
      data = await createCheckoutSession(plan, token!, trial);
    }
    if (data?.error) {
      toast.error(data?.error);
      return;
    }
    window.location.href = data.url;
  }

  const confirmUpgrade = async () => {
    if (!pendingUpgrade) return;
    setUpgradeModalOpen(false);
    await proceedCheckout(pendingUpgrade.plan, pendingUpgrade.trial);
    setPendingUpgrade(null);
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
                      : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} ${isTrial ? " free trial " : ""} remaining`}
                  </p>
                )}

                {tier.plan === "pro" && user && !user.hasUsedProTrial && user.plan !== "pro" && (
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
                  className="w-full gap-2"
                  onClick={() => handleCheckout(tier.cta, tier.plan, false)}
                  disabled={tier.cta.disabled}
                >
                  {tier.plan === "plus" && <Plus className="w-4 h-4" />}
                  {tier.plan === "pro" && <Crown className="w-4 h-4" />}
                  {tier.cta.text}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  What happens when my bundles expire?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Free bundles automatically expire after 5 days. Don't worry—your expired bundles 
                  are still saved in your History page (if you're logged in), so you can view, share, 
                  or reference them anytime. Plus and Pro plans extend your active bundle time to 1 full year.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Do I need an account to create bundles?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Nope! You can create and share bundles instantly without signing up. However, 
                  creating an account unlocks your History page, permanent storage for expired bundles, 
                  and access to Plus/Pro features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Can I edit a bundle after I create it?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Editing is available exclusively on the Pro plan. Free and Plus users can view 
                  and delete their bundles from History, but only Pro users can modify links in an 
                  existing bundle after creation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  What's the difference between Plus and Pro?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Both Plus and Pro give you 1-year active bundle expiration and History access. 
                  The key difference is editing—Pro allows you to modify existing bundles anytime. 
                  Pro also includes a 7-day free trial.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  How does the 7-day free trial work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  When you select the Pro plan, you can start with a 7-day free trial. You get full 
                  Pro access immediately, and if you cancel before the trial ends, you won't be charged. 
                  After the trial, your Pro subscription begins automatically.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
          Paste. Bundle. Share.
        </div>
      </footer>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={(open) => {
        if (!open) {
          setUpgradeModalOpen(false);
          setPendingUpgrade(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Upgrade to Pro</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to upgrade to the Pro plan?
              {pendingUpgrade?.trial
                ? " Your Plus subscription will be cancelled and a 7-day free Pro trial will begin. After the trial, Pro will renew for one year."
                : " Your Plus subscription will be cancelled and your Pro subscription will start for one year."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => {
              setUpgradeModalOpen(false);
              setPendingUpgrade(null);
            }}>
              Cancel
            </Button>
            <Button variant="hero" onClick={confirmUpgrade} className="gap-2">
              <Crown className="w-4 h-4" />
              Yes, upgrade to Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
