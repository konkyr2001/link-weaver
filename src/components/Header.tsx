import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { Link2 } from "lucide-react";

type HeaderProps = {
  active?: "home" | "pricing" | "login" | "signup";
};

const Header = ({ active }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">
            bundl
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium ${
              active === "home"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Home
          </Link>

          <Link
            to="/pricing"
            className={`text-sm font-medium ${
              active === "pricing"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Pricing
          </Link>

          {user ? (
            <>
              <span className="text-sm text-foreground">
                Hi, {user.firstName}
              </span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button>
                {active == "login" ? (
                  <Link to="/signup" className="text-sm font-medium">
                    Sign up
                  </Link>
                ) : (
                  <Link to="/login" className="text-sm font-medium">
                    Login
                  </Link>
                )}
              </Button>
            </>
          )}

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;
