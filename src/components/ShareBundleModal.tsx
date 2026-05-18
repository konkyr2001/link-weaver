import { useState } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRPanel from "@/components/QRPanel";

interface ShareBundleModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareBundleModal({ open, onClose, url, title }: ShareBundleModalProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <div
            className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: "hsl(14 100% 57% / 0.1)", border: "1px solid hsl(14 100% 57% / 0.2)" }}
          >
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center font-display">Share Bundle</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Copy the link or scan the QR code to share{" "}
            <span className="font-semibold text-foreground">"{title}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {/* QR panel — static mode (always visible in modal) */}
          <QRPanel url={url} title={title} mode="static" />

          {/* URL copy row */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <p className="flex-1 truncate font-mono text-xs text-foreground">{url}</p>
            <Button onClick={copyUrl} size="sm" variant="ghost" className="flex-shrink-0 h-7 px-2.5">
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="ml-1.5 text-xs">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareBundleModal;
