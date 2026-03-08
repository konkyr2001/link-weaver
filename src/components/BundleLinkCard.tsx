import { ExternalLink } from "lucide-react";
import { BundleLink, extractDomain, getFaviconUrl, normalizeUrl } from "@/lib/bundle";
import { motion } from "framer-motion";
import { useState } from "react";

interface BundleLinkCardProps {
  link: BundleLink;
  index: number;
}

export function BundleLinkCard({ link, index }: BundleLinkCardProps) {
  const domain = extractDomain(link.url);
  const favicon = getFaviconUrl(link.url);
  const normalizedUrl = normalizeUrl(link.url);
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={normalizedUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="block glass-card rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
    >
      {/* Screenshot preview */}
      <div className="aspect-video bg-secondary/30 relative overflow-hidden">
        {!imgError ? (
          <img
            src={screenshotUrl}
            alt={`Preview of ${domain}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">{domain}</p>
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3">
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex items-center gap-3">
        <img
          src={favicon}
          alt=""
          className="w-5 h-5 rounded-sm flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-foreground text-sm font-medium truncate">{link.title || domain}</p>
          <p className="text-muted-foreground text-xs truncate">{link.url}</p>
        </div>
        <span className="text-muted-foreground/40 font-display text-xs">#{index + 1}</span>
      </div>
    </motion.a>
  );
}
