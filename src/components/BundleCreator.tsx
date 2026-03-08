import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkInput } from "@/components/LinkInput";
import { LinkItem } from "@/components/LinkItem";
import { BundleLink, generateId, encodeBundleToUrl, normalizeUrl } from "@/lib/bundle";
import { toast } from "sonner";

export function BundleCreator() {
  const [links, setLinks] = useState<BundleLink[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addLink = (url: string) => {
    const normalized = normalizeUrl(url);
    const newLink: BundleLink = {
      id: generateId(),
      url: normalized,
    };
    setLinks((prev) => [...prev, newLink]);
    setGeneratedUrl(null);
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setGeneratedUrl(null);
  };

  const moveUp = (id: string) => {
    setLinks((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
    setGeneratedUrl(null);
  };

  const moveDown = (id: string) => {
    setLinks((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
    setGeneratedUrl(null);
  };

  const generateLink = () => {
    if (links.length === 0) {
      toast.error("Add at least one link first");
      return;
    }
    const bundle = { links, createdAt: Date.now() };
    const url = encodeBundleToUrl(bundle);
    setGeneratedUrl(url);
  };

  const copyToClipboard = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Create Bundle</h2>
            <p className="text-muted-foreground text-sm">Add your links and share them in one URL</p>
          </div>
        </div>

        {/* Input */}
        <LinkInput onAdd={addLink} />

        {/* Links list */}
        <div className="space-y-2 min-h-[60px]">
          <AnimatePresence mode="popLayout">
            {links.map((link, i) => (
              <LinkItem
                key={link.id}
                link={link}
                index={i}
                onRemove={removeLink}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                isFirst={i === 0}
                isLast={i === links.length - 1}
              />
            ))}
          </AnimatePresence>

          {links.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground text-sm"
            >
              Paste URLs above to start building your bundle
            </motion.div>
          )}
        </div>

        {/* Generate button */}
        {links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button
              onClick={generateLink}
              variant="hero"
              size="lg"
              className="w-full h-12 text-base"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Generate Share Link
            </Button>

            {/* Generated URL */}
            <AnimatePresence>
              {generatedUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
                    <p className="text-sm text-foreground truncate flex-1 font-mono">
                      {generatedUrl}
                    </p>
                    <Button
                      onClick={copyToClipboard}
                      variant="glass"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
