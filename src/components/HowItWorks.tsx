import { motion, Variants } from "framer-motion";
import { Link2, Type, Zap, Share2, History, Crown, Clock } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Link2,
    title: "Paste your links",
    description:
      "Add as many URLs as you want — articles, docs, videos, anything. Paste them one by one or in bulk. Drag to reorder before sharing.",
    preview: (
      <div className="mt-4 flex flex-col gap-1.5 cursor-default">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary/50" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            notion.so/my-doc
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 opacity-60">
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary/50" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            figma.com/file/design-v2
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 opacity-40">
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            Add another link...
          </span>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Type,
    title: "Add your bundle title",
    description:
      "Give your bundle a meaningful name so you and your recipients know what it's about at a glance. Keep it short and descriptive.",
    preview: (
      <div className="mt-4 cursor-default">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
          <Type className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <span className="text-xs text-foreground">Q3 Design Resources</span>
          <span className="ml-auto h-4 w-px animate-pulse bg-primary" />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground/60">
          This becomes the title your recipients see when they open the bundle.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Zap,
    title: "Generate your bundle",
    description:
      "Hit generate and your links are instantly bundled into one clean, unique URL. No waiting, no sign-up required.",
    badge: "Free",
    preview: (
      <div className="mt-4 cursor-default">
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs"
          style={{
            borderColor: "hsl(14 100% 57% / 0.3)",
            background: "hsl(14 100% 57% / 0.04)",
          }}
        >
          <Link2 className="h-3 w-3 flex-shrink-0 text-primary" />
          <a href="https://welinkly.com/q3-design" target="_blank" className="text-muted-foreground">
            welinkly.com/
            <span className="font-semibold text-primary">q3-design</span>
          </a>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground/60">
          Your bundle URL is ready to copy and share immediately.
        </p>
      </div>
    ),
  },
  {
    number: 4,
    icon: Share2,
    title: "Share it anywhere",
    description:
      "Copy your bundle link and send it via chat, email, or social. Anyone who opens it sees all your links in one place — no account needed to view.",
    preview: (
      <div className="mt-4 flex flex-wrap gap-1.5 cursor-default">
        {["Slack", "Email", "WhatsApp", "Twitter / X", "LinkedIn"].map(
          (platform) => (
            <span
              key={platform}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
            >
              {platform}
            </span>
          ),
        )}
      </div>
    ),
  },
  {
    number: 5,
    icon: History,
    title: "Save bundles to your history",
    description:
      "Every bundle you create while logged in is automatically saved. Revisit, copy, or reshare any past bundle from your history page anytime.",
    preview: (
      <div className="mt-4 flex flex-col gap-1.5 cursor-default">
        {[
          {
            title: "Q3 Design Resources",
            date: "Expires in: 28 days",
            count: 4,
          },
          { title: "Onboarding Docs", date: "Expires in: 13 days", count: 6 },
          { title: "Team Reading List", date: "Expires in: 3 days", count: 3 },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2"
          >
            <div>
              <p className="text-xs font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3 inline-block text-muted-foreground mb-[1.2px] mr-1" />
                {item.date}
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
              {item.count} links
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: 6,
    icon: Crown,
    title: "Keep bundles alive up to 1 year",
    description:
      "Free bundles expire after 30 days. Upgrade to Pro to keep your bundles active for up to a full year — perfect for long-running projects or resources you share repeatedly.",
    badge: "Premium",
    preview: (
      <div className="mt-4 flex flex-col gap-2 cursor-default">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5">
          <span className="text-xs text-muted-foreground">
            No Account free plan
          </span>
          <div className="w-[150px] flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[2%] rounded-full bg-primary/40" />
            </div>
            <span className="text-[11px] text-muted-foreground">3 days</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5">
          <span className="text-xs text-muted-foreground">
            Account Free plan
          </span>
          <div className="w-[150px] flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div className="h-full w-1/4 rounded-full bg-primary/40" />
            </div>
            <span className="text-[11px] text-muted-foreground">30 days</span>
          </div>
        </div>
        <div
          className="flex items-center justify-between rounded-lg border px-3 py-2.5"
          style={{
            borderColor: "hsl(14 100% 57% / 0.3)",
            background: "hsl(14 100% 57% / 0.04)",
          }}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <Crown className="h-3 w-3" />
            Premium plan
          </span>
          <div className="w-[150px] flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div className="h-full w-full rounded-full bg-primary" />
            </div>
            <span className="text-[11px] font-medium text-primary">1 year</span>
          </div>
        </div>
      </div>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <span
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary"
          style={{
            background: "hsl(14 100% 57% / 0.08)",
            borderColor: "hsl(14 100% 57% / 0.2)",
          }}
        >
          How it works
        </span>
        <h2 className="font-display text-4xl font-bold text-foreground">
          From links to <span className="text-gradient">one shareable URL</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          No sign-up required to get started. Bundle your links and share in
          seconds.
        </p>
      </motion.div>

      {/* Steps grid — 2 columns */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          const isPremium = step.badge === "Premium";

          return (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_0_3px_hsl(14_100%_57%_/_0.06)]"
              style={
                isPremium
                  ? {
                      borderColor: "hsl(14 100% 57% / 0.25)",
                      background: "hsl(14 100% 57% / 0.02)",
                    }
                  : {}
              }
            >
              {/* Badge */}
              {step.badge && (
                <span
                  className="absolute right-4 top-[-11px] rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                  style={{
                    background: isPremium
                      ? "linear-gradient(135deg, hsl(14 100% 50%), hsl(14 100% 68%))"
                      : "hsl(14 100% 57%)",
                  }}
                >
                  {isPremium ? "✦ Premium" : step.badge}
                </span>
              )}

              {/* Step number + icon */}
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(14 100% 57%), hsl(14 100% 74%))",
                  }}
                >
                  {step.number}
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "hsl(14 100% 57% / 0.08)" }}
                >
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>

              <h3 className="font-display text-[17px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {step.preview}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
