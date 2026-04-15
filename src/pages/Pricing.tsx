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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const RENEWAL_WINDOW_DAYS = 10;

function getTimeRemaining(expiresAt: string) {
  const delta = Math.max(0, new Date(expiresAt).getTime() - Date.now()) / 1000;

  const days = Math.floor(delta / 86400);
  const hours = Math.floor((delta % 86400) / 3600);
  const minutes = Math.floor((delta % 3600) / 60);

  return { days, hours, minutes };
}

const getTierState = (userPlan: string | null, daysRemaining: number | null, autoRenewEnabled: boolean) => {
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
  const isTrial = user?.trialEnd && new Date(user.trialEnd) > new Date();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<{ cta: any; plan: string; trial: boolean } | null>(null);
  const time = user?.currentPeriodEnd ? getTimeRemaining(user.currentPeriodEnd) : null;
  const tierState = getTierState(user?.plan, time.days, user?.autoRenewEnabled);

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
        "Expired links are stored in history (account needed)",
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
      price: `${import.meta.env.VITE_PLUS_PACKAGE_COST}`,
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
      price: `${import.meta.env.VITE_PRO_PACKAGE_COST}`,
      period: "/year",
      description: "Full control with no limits",
      features: [
        "Unlimited bundles",
        "Unlimited links per bundle",
        "Bundles expire after 1 year",
        "Expired links are stored in history",
        "Delete bundles",
        "Edit bundles",
        "7-day free trial available",
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
                  {parseInt(tier.price) > 0 ? (
                    <>
                      <span className="font-display text-4xl font-bold text-foreground">
                        {tier.price.split(".")[0]}
                      </span>
                      <span className="font-display text-xl font-bold text-foreground">
                        .{tier.price.split(".")[1]}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                  )}
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
          <FaqSection />
          
          {/* View Full FAQ Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              Still have questions?{" "}
              <a
                href="/faq"
                className="text-primary hover:underline font-medium"
              >
                View full FAQ
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />

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
