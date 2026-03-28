import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { login, authorizeGoogleUser } from "../services/user";
import Header from "@/components/Header";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  function checkErrors() {
    if (!email.trim() || !password.trim()) {
      setErrorEmail(!email.trim());
      setErrorPassword(!password.trim());
      toast.error("Please fill in all fields");
      return true;
    }

    return false;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkErrors()) return;

    setLoading(true);
    const data = await login(email, password);
    const error = data.error;
    if (error) {
      setLoading(false);
      return toast.error(error);
    }
    navigate("/");
    setLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse ) => {
    setLoading(true);
    const googleUser = await authorizeGoogleUser(credentialResponse );
    const error = googleUser.error;
    if (error) {
      // toast.info("Google login not connected yet");
      setLoading(false);
      return toast.error(error);
    }
    alert("SIGNUP");
    navigate("/");
    setLoading(false);
  };

  return (
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
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Login to manage your bundles
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-6">
            <GoogleLoginButton
              text="continue_with"
              onSuccess={handleGoogleLogin}
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email/password form */}
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className={`pl-10 ${errorEmail ? "border-red-500" : ""}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    className={`pl-10 pr-10 ${errorPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-12"
                disabled={loading}
              >
                {loading ? "Logging in…" : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
