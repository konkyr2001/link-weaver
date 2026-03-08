import { GripVertical, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BundleLink, extractDomain, getFaviconUrl } from "@/lib/bundle";
import { motion } from "framer-motion";

interface LinkItemProps {
  link: BundleLink;
  index: number;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function LinkItem({ link, index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: LinkItemProps) {
  const domain = extractDomain(link.url);
  const favicon = getFaviconUrl(link.url);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-lg p-4 flex items-center gap-4 group"
    >
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onMoveUp(link.id)}
          disabled={isFirst}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors p-0.5"
          aria-label="Move up"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button
          onClick={() => onMoveDown(link.id)}
          disabled={isLast}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors p-0.5"
          aria-label="Move down"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <span className="text-muted-foreground font-display text-sm w-6 text-center">{index + 1}</span>

      <img
        src={favicon}
        alt=""
        className="w-6 h-6 rounded-sm flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium truncate">{link.title || domain}</p>
        <p className="text-muted-foreground text-xs truncate">{link.url}</p>
      </div>

      <a
        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
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
    </motion.div>
  );
}
