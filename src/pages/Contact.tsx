import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { toast } from "sonner";
import { sendContactMessage } from "@/services/contact";
import Captcha from "react-google-recaptcha";
import { useTheme } from "@/hooks/use-theme";

const Contact = () => {
  const { theme } = useTheme();
  const captchaRef = useRef<any>(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors =
      !email.trim() || !title.trim() || !message.trim();

    setErrorEmail(!email.trim());
    setErrorTitle(!title.trim());
    setErrorMessage(!message.trim());

    if (hasErrors) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const captchaToken = await captchaRef.current?.executeAsync();
      captchaRef.current?.reset();

      if (!captchaToken) {
        toast.error("Captcha verification failed. Please try again.");
        setLoading(false);
        return;
      }

      const result = await sendContactMessage({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        title: title.trim(),
        message: message.trim(),
        captcha: captchaToken,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Message sent successfully!");
        setTitle("");
        setMessage("");
        if (!user) {
          setFirstName("");
          setLastName("");
          setEmail("");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed z-50">
        <Captcha
          ref={captchaRef}
          size="invisible"
          theme={theme}
          sitekey={import.meta.env.VITE_RECAPTCHA_INVISIBLE_SECRET_KEY}
        />
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Have a question, found a bug, or have an idea? Let us know.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorEmail(false);
                }}
                className={errorEmail ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Bug report, feature idea, question..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrorTitle(false);
                }}
                className={errorTitle ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us more..."
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrorMessage(false);
                }}
                className={errorMessage ? "border-destructive" : ""}
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
