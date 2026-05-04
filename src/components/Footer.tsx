import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-4xl px-6 py-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          {/* Left — logo + copyright */}
          <div className="flex items-center gap-1">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
            >
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-sm font-semibold text-foreground">
              We<span className="text-primary">Linkly</span>
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved
            </span>
          </div>

          {/* Right — nav links */}
          <div className="flex items-center gap-1">
            {[
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms-of-service", label: "Terms of Service" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((link, i, arr) => (
              <span key={link.to} className="flex items-center gap-1">
                <Link
                  to={link.to}
                  className="rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-all duration-150 hover:bg-mutsed hover:text-foreground"
                >
                  {link.label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-border">·</span>
                )}
              </span>
            ))}
          </div>

        </div>

        {/* reCAPTCHA disclosure — required by Google when hiding the badge */}
        <p className="mt-4 border-t border-border pt-3 text-center text-[11px] text-muted-foreground/50">
          This site is protected by reCAPTCHA —{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground/60 transition-colors"
          >
            Privacy Policy
          </a>{" "}
          &{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground/60 transition-colors"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
    </footer>
  );
};

export default Footer;