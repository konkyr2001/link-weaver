import { BundleCreator } from "@/components/BundleCreator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getUser } from "@/services/user";
import { toast } from "sonner";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(localStorage);
  // Fetch fresh user data on mount
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

  useEffect(() => {
    const syncUserAfterPayment = async () => {
      const success = searchParams.get("success");

      if (success === "true") {
        if (!user) {
          navigate("/login", { replace: true });
          return;
        }
        try {
          const token = localStorage.getItem("token");
          const fetchUser = await getUser(token);
          if (fetchUser?.error) {
            toast.error(fetchUser.error);
            return;
          }
          localStorage.setItem("user", JSON.stringify(fetchUser));
          setUser(fetchUser);
          toast.success("Payment successful! Your account is being updated...");
          navigate("/", { replace: true });
        } catch (error) {
          toast.error("Failed to refresh user");
        }
      }
    }

    syncUserAfterPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <Header active="home" />

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Share links,{" "}
              <span className="text-gradient">not chaos</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Bundle multiple URLs into one clean, shareable link.
            </p>
          </motion.div>

          <BundleCreator />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
