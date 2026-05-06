import { motion, Variants } from "framer-motion";
import {
  ScrollText,
  UserCheck,
  ShieldAlert,
  Link2,
  Ban,
  RefreshCw,
  Scale,
  Mail,
  Clock,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    id: 1,
    icon: UserCheck,
    title: "Acceptance of Terms",
    content: (
      <p className="text-sm leading-relaxed text-muted-foreground">
        By accessing or using WeLinkly — including our website at{" "}
        <a href="https://www.welinkly.com" className="text-primary hover:underline">
          welinkly.com
        </a>{" "}
        and our Chrome extension — you agree to be bound by these Terms of Service. If you do not
        agree to these terms, please do not use our service.
      </p>
    ),
  },
  {
    id: 2,
    icon: Link2,
    title: "Description of Service",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          WeLinkly is a link bundling service that allows users to:
        </p>
        <div className="space-y-2">
          {[
            "Bundle multiple links into a single shareable URL",
            "Share bundles via a unique generated URL",
            "Save and manage bundles through an account",
            "Add links to bundles directly from the browser via the Chrome extension",
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
    id: 3,
    icon: UserCheck,
    title: "User Accounts",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          You may use WeLinkly without creating an account. However, to access certain features
          such as saved history and extended bundle lifespan, an account is required.
        </p>
        <div className="space-y-2">
          {[
            "You are responsible for maintaining the confidentiality of your account credentials",
            "You must provide accurate and complete information when creating an account",
            "You are responsible for all activity that occurs under your account",
            "You must be at least 13 years old to create an account",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground"
            >
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Free & Pro Plans",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          WeLinkly offers both a free tier and a paid Pro plan. By using the Pro plan you agree to
          the following:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Free Plan", items: ["Create and share bundles", "Bundles expire after 30 days", "No account required"] },
            { label: "Pro Plan", items: ["All free features", "Bundles active for up to 1 year", "Full bundle history access"] },
          ].map((plan) => (
            <div
              key={plan.label}
              className="rounded-xl border p-4"
              style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.03)" }}
            >
              <p className="mb-2 text-sm font-semibold text-primary">{plan.label}</p>
              <div className="space-y-1.5">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Payments are processed securely. Refund requests are handled on a case-by-case basis —
          contact us at{" "}
          <a href="mailto:support@welinkly.com" className="text-primary hover:underline">
            support@welinkly.com
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: 5,
    icon: Ban,
    title: "Acceptable Use",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          You agree not to use WeLinkly to:
        </p>
        <div className="space-y-2">
          {[
            "Share links to illegal, harmful, or malicious content",
            "Distribute spam, phishing, or misleading URLs",
            "Violate the intellectual property rights of others",
            "Attempt to reverse-engineer or exploit the service",
            "Use automated tools to bulk-generate bundles without permission",
            "Impersonate other users or entities",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive/70" />
              {item}
            </div>
          ))}
        </div>
        <div
          className="rounded-xl border p-3.5 text-sm text-muted-foreground"
          style={{ borderColor: "hsl(0 84% 60% / 0.2)", background: "hsl(0 84% 60% / 0.04)" }}
        >
          Violation of these terms may result in immediate suspension or termination of your account.
        </div>
      </div>
    ),
  },
  {
    id: 6,
    icon: Clock,
    title: "Bundle Expiration & Availability",
    content: (
      <div className="space-y-2">
        {[
          "Bundles created without an account may expire and become inaccessible after a set period.",
          "Pro plan bundles remain active for up to 1 year from the date of creation.",
          "We reserve the right to remove bundles that violate our acceptable use policy.",
          "We are not responsible for broken or changed destination URLs within a bundle.",
        ].map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground"
          >
            <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            {item}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    icon: ShieldAlert,
    title: "Disclaimer of Warranties",
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          WeLinkly is provided <strong className="text-foreground">"as is"</strong> and{" "}
          <strong className="text-foreground">"as available"</strong> without warranties of any kind,
          either express or implied. We do not guarantee that:
        </p>
        <div className="space-y-2">
          {[
            "The service will be uninterrupted, error-free, or fully secure",
            "Links within bundles will remain valid or active",
            "The service will meet all of your requirements",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/40" />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 8,
    icon: Scale,
    title: "Limitation of Liability",
    content: (
      <p className="text-sm leading-relaxed text-muted-foreground">
        To the fullest extent permitted by law, WeLinkly and its team shall not be liable for any
        indirect, incidental, special, or consequential damages arising from your use of the
        service — including but not limited to loss of data, revenue, or access to bundled content.
      </p>
    ),
  },
  {
    id: 9,
    icon: RefreshCw,
    title: "Changes to These Terms",
    content: (
      <p className="text-sm leading-relaxed text-muted-foreground">
        We may update these Terms of Service at any time. Changes will be posted on this page with
        a revised "Last updated" date. Continued use of the service after changes are posted
        constitutes your acceptance of the updated terms.
      </p>
    ),
  },
  {
    id: 10,
    icon: Mail,
    title: "Contact",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          For questions about these Terms of Service, reach out to us at:
        </p>
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

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Terms of Service – WeLinkly</title>
        <meta
          key="description"
          name="description"
          content="Read the WeLinkly terms of service and understand the rules for using our link bundling platform."
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
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "hsl(14 100% 57% / 0.1)", border: "1px solid hsl(14 100% 57% / 0.2)" }}
            >
              <ScrollText className="h-7 w-7 text-primary" />
            </div>

            <h1 className="font-display text-4xl font-bold text-foreground">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Please read these terms carefully before using WeLinkly.
            </p>

            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Last updated: May 2025
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>
                Applies to{" "}
                <a href="https://www.welinkly.com" className="text-primary hover:underline">
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

                  <div className="mb-4 h-px bg-border" />

                  {section.content}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center text-xs text-muted-foreground/50"
          >
            By using WeLinkly you agree to these terms. See also our{" "}
            <Link to="/privacy-policy" className="text-primary/70 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            .
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;