import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BundleCreator } from "@/components/BundleCreator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ChromeExtensionCTA } from "@/components/ChromeExtensionCTA";
import { getUser } from "@/services/user";
import { Helmet } from "react-helmet-async";
import { Link2, Zap, Chrome, Home } from "lucide-react";

// ── Nav items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "hero",      label: "Home",             icon: Home   },
  { id: "create",    label: "Create a Bundle",  icon: Link2  },
  { id: "how",       label: "How it Works",     icon: Zap    },
  { id: "extension", label: "Chrome Extension", icon: Chrome },
];

// ── Shared scroll logic ────────────────────────────────────
function getActiveId(): string {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollY < 50) return "hero";

  // Near bottom of page — force last section active
  if (scrollY + windowHeight >= docHeight - 50) {
    return NAV_ITEMS[NAV_ITEMS.length - 1].id;
  }

  let current = "hero";
  for (const { id } of NAV_ITEMS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + scrollY;
    if (scrollY >= top - 120) current = id;
  }
  return current;
}

function smoothScrollTo(id: string) {
  if (id === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ── Sidebar (xl+) ──────────────────────────────────────────
function SidebarNav({ active }: { active: string }) {
  return (
    <aside className="hidden xl:flex flex-col gap-0.5 sticky top-28 self-start w-52 flex-shrink-0">
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
        HomePage
      </p>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => smoothScrollTo(id)}
            className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
              isActive
                ? "font-semibold text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            style={isActive ? { background: "hsl(14 100% 57% / 0.08)" } : {}}
          >
            <span
              className="h-4 w-0.5 rounded-full flex-shrink-0 transition-all duration-200"
              style={{ background: isActive ? "hsl(14 100% 57%)" : "transparent" }}
            />
            <Icon
              className={`h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-foreground"
              }`}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
}

// ── Page ───────────────────────────────────────────────────
const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Keep user fresh on mount
  useEffect(() => {
    const fetchFreshUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const freshUser = await getUser(token);
      if (!freshUser?.error) {
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      }
    };
    fetchFreshUser();
  }, []);

  // Sync user after Stripe payment redirect
  useEffect(() => {
    const syncUserAfterPayment = async () => {
      const success = searchParams.get("success");
      if (success !== "true") return;
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const fetchedUser = await getUser(token);
        if (fetchedUser?.error) {
          toast.error(fetchedUser.error);
          return;
        }
        localStorage.setItem("user", JSON.stringify(fetchedUser));
        setUser(fetchedUser);
        toast.success("Payment successful! Your account is being updated...");
        navigate("/", { replace: true });
      } catch {
        toast.error("Failed to refresh user");
      }
    };
    syncUserAfterPayment();
  }, [searchParams, navigate]);

  // Reliable scroll-based active section
  useEffect(() => {
    const onScroll = () => setActiveSection(getActiveId());

    // Set correct active item immediately on mount
    setActiveSection(getActiveId());

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>WeLinkly – Bundle Multiple Links into One URL</title>
        <meta
          name="description"
          content="Bundle multiple links into one URL. WeLinkly helps you organize, share and manage links easily."
        />
      </Helmet>

      <Header active="home" />

      {/* Sidebar + content */}
      <div className="flex-1 justify-center xl:justify-normal flex w-full max-w-7xl mx-auto px-6 xl:gap-0">
        <SidebarNav active={activeSection} />

        <main className="min-w-0">

          {/* 1. Hero */}
          <section id="hero">
            <Hero />
          </section>

          {/* 2. Bundle Creator */}
          <section id="create" className="flex justify-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="mb-8 text-center">
                <span
                  className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary"
                  style={{
                    background: "hsl(14 100% 57% / 0.08)",
                    borderColor: "hsl(14 100% 57% / 0.2)",
                  }}
                >
                  Try it now
                </span>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Create your bundles here
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Paste your links, add a title and generate a shareable URL instantly.
                </p>
              </div>
              <BundleCreator />
            </motion.div>
          </section>

          {/* 3. How it Works */}
          <section id="how">
            <HowItWorks />
          </section>

          {/* 4. Chrome Extension CTA */}
          <section id="extension">
            <ChromeExtensionCTA />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
