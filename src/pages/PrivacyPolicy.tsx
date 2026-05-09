import { motion, Variants } from "framer-motion";
import { Shield, Link2, Database, Share2, Lock, Clock, UserCheck, RefreshCw, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    id: 1,
    icon: Database,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We may collect the following types of data:
        </p>
        <div className="space-y-3">
          {[
            { label: "Account Information", desc: "If you create an account, we may collect your email address and basic profile information." },
            { label: "Link Data", desc: "We collect URLs that you explicitly choose to save or bundle using our service." },
            { label: "Local Storage Data", desc: "The Chrome Extension may store data locally in your browser (such as saved links or temporary session data)." },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.04)" }}
        >
          <p className="mb-2 text-sm font-semibold text-primary">We do NOT collect:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {["Passwords", "Financial information", "Health data", "Personal communications"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-primary" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Link2,
    title: "How We Use Your Information",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">We use your data to:</p>
        <div className="space-y-2">
          {[
            "Create and manage link bundles",
            "Allow you to share links through generated URLs",
            "Sync your data with your account (if logged in)",
            "Improve the functionality of our service",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-xl border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground">
          We do <strong className="text-foreground">not</strong> use your data for advertising or tracking purposes.
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Shield,
    title: "Chrome Extension Data Usage",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">The WeLinkly Chrome Extension:</p>
        <div className="space-y-2">
          {[
            { positive: true, text: 'Accesses the active tab URL only when you interact with the Chrome Extension (e.g. clicking "Add link")' },
            { positive: false, text: "Does NOT track browsing history" },
            { positive: false, text: "Does NOT monitor user activity" },
            { positive: false, text: "Does NOT collect data without user action" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${item.positive ? "bg-primary" : "bg-green-500"}`} />
              {item.text}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          This access is required solely to allow users to quickly add the current page to a bundle.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    icon: Share2,
    title: "Data Sharing",
    content: (
      <div className="space-y-3">
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.04)" }}
        >
          <p className="text-sm font-semibold text-primary">
            We do NOT sell, rent, or trade your personal data.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">We only share data:</p>
        <div className="space-y-2">
          {[
            "When necessary to provide the service (e.g. storing bundles on our servers)",
            "If required by law",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: Lock,
    title: "Data Storage & Security",
    content: (
      <div className="space-y-2">
        {[
          "Data is stored securely on our servers and/or in your browser",
          "All communication is encrypted using HTTPS",
          "We take reasonable steps to protect your data from unauthorized access",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 6,
    icon: Clock,
    title: "Data Retention",
    content: (
      <div className="space-y-2">
        {[
          "Non-account bundles may expire after a certain period",
          "Account data is retained as long as your account is active",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            {item}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    icon: UserCheck,
    title: "Your Rights",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">You have the right to:</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {["Access your data", "Request deletion of your data", "Stop using the service at any time"].map((item) => (
            <div
              key={item}
              className="rounded-xl border p-3.5 text-center text-sm font-medium text-foreground"
              style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.04)" }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 8,
    icon: RefreshCw,
    title: "Changes to This Policy",
    content: (
      <p className="text-sm leading-relaxed text-muted-foreground">
        We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated" date.
      </p>
    ),
  },
  {
    id: 9,
    icon: Mail,
    title: "Contact",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">If you have any questions, contact us at:</p>
        <a
          href="mailto:support@welinkly.com"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-primary/30"
          style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.04)", color: "hsl(14 100% 57%)" }}
        >
          <Mail className="h-4 w-4" />
          support@welinkly.com
        </a>
      </div>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Privacy Policy – WeLinkly</title>
        <meta
          name="description"
          content="WeLinkly respects your privacy and is committed to protecting your personal data. Learn about the information we collect, how we use it, and your rights in our Privacy Policy."
        />
      </Helmet>
      <Header />

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto w-full max-w-2xl">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "hsl(14 100% 57% / 0.1)", border: "1px solid hsl(14 100% 57% / 0.2)" }}
            >
              <Shield className="h-7 w-7 text-primary" />
            </div>

            <h1 className="font-display text-4xl font-bold text-foreground">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              WeLinkly respects your privacy and is committed to protecting your personal data.
            </p>

            {/* Meta */}
            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Last updated: May 2025
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>
                Applies to{" "}
                <a href="https://welinkly.com" className="text-primary hover:underline">
                  welinkly.com
                </a>{" "}
                and Chrome Extension
              </span>
            </div>
          </motion.div>

          {/* Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  variants={itemVariants}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-[0_0_0_3px_hsl(14_100%_57%_/_0.04)]"
                >
                  {/* Section header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "hsl(14 100% 57% / 0.08)" }}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-muted-foreground/50">
                        {String(section.id).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-base font-semibold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-4 h-px bg-border" />

                  {section.content}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;