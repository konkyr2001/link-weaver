import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface BundleAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface BundleActionsPopoverProps {
  actions: BundleAction[];
  align?: "end" | "start" | "center";
}

function BundleActionsPopover({
  actions,
  align = "end",
}: BundleActionsPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-44 p-1.5">
        {actions.map(({ label, icon: Icon, onClick, variant = "default" }) => (
          <button
            key={label}
            onClick={() => { onClick(); setOpen(false); }}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left transition-colors ${
              variant === "destructive"
                ? "hover:bg-destructive/10 text-destructive"
                : "hover:bg-accent text-foreground"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default BundleActionsPopover;