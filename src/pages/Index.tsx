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

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

      {/* 1. Hero — hook */}
      <Hero />

      {/* 2. Bundle Creator — convert */}
      <section id="create" className="flex justify-center px-6 py-16">
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

      {/* 3. How it Works — educate */}
      <HowItWorks />

      {/* 4. Chrome Extension CTA — upsell */}
      <ChromeExtensionCTA />

      <Footer />
    </div>
  );
};

export default Index;
