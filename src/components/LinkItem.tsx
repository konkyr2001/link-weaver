import { GripVertical, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BundleLink, extractDomain, getFaviconUrl, normalizeUrl } from "@/lib/bundle";
import { useState } from "react";

interface LinkItemProps {
  link: BundleLink;
  index: number;
  onRemove: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

export function LinkItem({ link, index, onRemove, dragHandleProps }: LinkItemProps) {
  const domain = extractDomain(link.url);
  const favicon = getFaviconUrl(link.url);
  const normalizedUrl = normalizeUrl(link.url);
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="glass-card rounded-lg p-4 flex items-center gap-4 group">
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <span className="text-muted-foreground font-display text-sm w-6 text-center">{index + 1}</span>

      {/* Website screenshot thumbnail */}
      <div className="w-16 h-10 rounded-md overflow-hidden bg-secondary/30 flex-shrink-0">
        {!imgError ? (
          <img
            src={screenshotUrl}
            alt={`Preview of ${domain}`}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={favicon}
              alt=""
              className="w-5 h-5"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium truncate">{link.title || domain}</p>
        <p className="text-muted-foreground text-xs truncate">{link.url}</p>
      </div>

      <a
        href={normalizedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
      >
        <ExternalLink className="w-4 h-4" />
      </a>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(link.id)}
        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
