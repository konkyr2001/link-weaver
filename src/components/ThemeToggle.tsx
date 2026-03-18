import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
