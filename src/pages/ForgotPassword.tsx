import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword } from "../services/user";
import { useRef } from "react";
import Header from "@/components/Header";
import Captcha from "react-google-recaptcha";
import { useTheme } from "@/hooks/use-theme";

const ForgotPassword = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const captchaRef = useRef<Captcha>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const captcha = await captchaRef.current?.executeAsync();
    captchaRef.current?.reset();
    console.log(captcha)
    if (!captcha) {
      return toast.error("Captcha verification failed");
    }

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    setLoading(true);
    const data = await forgotPassword(email, captcha);
    setLoading(false);

    if (data.error) {
      return toast.error(data.error);
    }

    setSent(true);
    toast.success("Check your email for a reset link");
  };

  return (
    <>
      <Captcha
        key={theme}
        theme={theme}
        ref={captchaRef}
        size="invisible"
        sitekey={import.meta.env.VITE_RECAPTCHA_INVISIBLE_SECRET_KEY}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header active="login" />

        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Forgot password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-6">
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">Check your inbox</p>
                  <p className="text-muted-foreground text-sm">
                    If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a password reset link shortly.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Don't forget to check your spam folder.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setSent(false); setEmail(""); }}
                  >
                    Send again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              )}

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ForgotPassword;
