import { Monitor, Globe } from "lucide-react";

type DisplayMode = "screenshot" | "favicon";

interface DisplayModeToggleProps {
  value: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

const OPTIONS: { value: DisplayMode; icon: typeof Monitor; label: string; desc: string }[] = [
  { value: "screenshot", icon: Monitor, label: "Screenshot",  desc: "Website preview image" },
  { value: "favicon",    icon: Globe,   label: "Logo",        desc: "Website logo" },
];

export function DisplayModeToggle({ value, onChange }: DisplayModeToggleProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1">
      {OPTIONS.map(({ value: opt, icon: Icon, label, desc }) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200"
            style={
              isActive
                ? {
                    background: "hsl(var(--card))",
                    color: "hsl(14 100% 57%)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    fontWeight: 600,
                  }
                : {
                    color: "hsl(var(--muted-foreground))",
                    fontWeight: 400,
                  }
            }
          >
            <Icon
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: isActive ? "hsl(14 100% 57%)" : undefined }}
            />
            <span className="hidden sm:inline">{label}</span>
            <span className="text-xs opacity-60 hidden md:inline">— {desc}</span>
          </button>
        );
      })}
    </div>
  );
}
