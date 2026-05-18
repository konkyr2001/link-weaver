import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Download card constants ────────────────────────────────
const CANVAS_W   = 400;
const CANVAS_H   = 400;
const CARD_W     = 240;
const CARD_H     = 310;
const CARD_X     = (CANVAS_W - CARD_W) / 2;
const CARD_Y     = (CANVAS_H - CARD_H) / 2;
const QR_PADDING = 10;
const QR_AREA_W  = CARD_W - 40;
const QR_X       = CARD_X + 20;
const QR_Y       = CARD_Y + 110;

// ── Base64 logo fetcher ───────────────────────────────────
async function getBase64Image(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ── SVG card builder ──────────────────────────────────────
function buildDownloadSvg(
  url: string,
  title: string,
  qrInnerSvg: string,
  base64Logo: string,
): string {
  const displayUrl = url.replace("https://", "");
  const safeTitle  = title.length > 30 ? title.slice(0, 27) + "…" : title;
  const safeUrl    = displayUrl.length > 36 ? displayUrl.slice(0, 33) + "…" : displayUrl;

  const LOGO_SIZE = 28;
  const LOGO_X    = CARD_X + CARD_W / 2 - LOGO_SIZE / 2;
  const LOGO_Y    = CARD_Y + 14;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="${CANVAS_W}" y2="${CANVAS_H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fff9f7"/>
      <stop offset="100%" stop-color="#fff3ef"/>
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b35"/>
      <stop offset="100%" stop-color="#ff8c5a"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="rgba(0,0,0,0.10)"/>
    </filter>
    <filter id="qrShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.07)"/>
    </filter>
    <clipPath id="logoClip">
      <rect x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" rx="7"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#bgGrad)"/>
  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="#ff6b35" opacity="0.07"/>
  </pattern>
  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#dots)"/>

  <!-- Card -->
  <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="20" fill="white" filter="url(#cardShadow)"/>
  <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="5" rx="2.5" fill="url(#orangeGrad)"/>

  <!-- Logo -->
  <image href="${base64Logo}" x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" clip-path="url(#logoClip)" preserveAspectRatio="xMidYMid meet"/>

  <!-- Brand -->
  <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + 58}"
    font-family="'Space Grotesk',system-ui,sans-serif"
    font-size="14" font-weight="700" fill="#1e2433"
    text-anchor="middle" dominant-baseline="middle"
  >We<tspan fill="#ff6b35">Linkly</tspan></text>

  <!-- Subtitle -->
  <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + 74}"
    font-family="'Inter',system-ui,sans-serif"
    font-size="7" fill="#8a9ab0"
    text-anchor="middle" dominant-baseline="middle"
  >Scan to open bundle</text>

  <!-- Bundle title -->
  <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + 90}"
    font-family="'Space Grotesk',system-ui,sans-serif"
    font-size="8" font-weight="600" fill="#ff6b35"
    text-anchor="middle" dominant-baseline="middle"
  >${safeTitle}</text>

  <!-- QR box -->
  <rect x="${QR_X - QR_PADDING}" y="${QR_Y - QR_PADDING}"
    width="${QR_AREA_W + QR_PADDING * 2}" height="${QR_AREA_W + QR_PADDING * 2}"
    rx="10" fill="white" filter="url(#qrShadow)"/>

  <!-- QR code (29-module grid scaled up) -->
  <g transform="translate(${QR_X}, ${QR_Y}) scale(${QR_AREA_W / 29})">
    ${qrInnerSvg}
  </g>

  <!-- Divider -->
  <line
    x1="${CARD_X + 20}" y1="${QR_Y + QR_AREA_W + QR_PADDING + 10}"
    x2="${CARD_X + CARD_W - 20}" y2="${QR_Y + QR_AREA_W + QR_PADDING + 10}"
    stroke="#eceef2" stroke-width="0.8"
  />

  <!-- URL -->
  <text x="${CARD_X + CARD_W / 2}" y="${QR_Y + QR_AREA_W + QR_PADDING + 22}"
    font-family="'Space Grotesk',ui-monospace,monospace"
    font-size="6.5" font-weight="600" fill="#1e2433"
    text-anchor="middle" dominant-baseline="middle"
  >${safeUrl}</text>

  <!-- Tagline -->
  <text x="${CARD_X + CARD_W / 2}" y="${CARD_Y + CARD_H - 10}"
    font-family="'Inter',system-ui,sans-serif"
    font-size="5.5" fill="#b0bac8"
    text-anchor="middle" dominant-baseline="middle"
  >welinkly.com — Bundle links, share smarter</text>
</svg>`;
}

// ── Props ─────────────────────────────────────────────────
interface QRPanelProps {
  /** The URL to encode in the QR code */
  url: string;
  /** Bundle title — shown in the downloaded SVG card */
  title: string;
  /**
   * "inline" — animated expand/collapse panel (used in BundleCreator)
   * "static" — always visible, no animation (used in ShareBundleModal)
   */
  mode?: "inline" | "static";
  /** For inline mode — whether the panel is currently visible */
  show?: boolean;
}

function QRPanel({ url, title, mode = "static", show = true }: QRPanelProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) { toast.error("Could not generate QR code"); return; }

    setDownloading(true);
    try {
      const base64Logo = await getBase64Image("/favicon-32x-32.png");
      const qrInner    = svgEl.innerHTML;
      const fullSvg    = buildDownloadSvg(url, title, qrInner, base64Logo);

      const blob    = new Blob([fullSvg], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const a       = document.createElement("a");
      a.href        = blobUrl;
      a.download    = `welinkly-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success("QR card downloaded!");
    } catch {
      toast.error("Failed to generate QR card");
    } finally {
      setDownloading(false);
    }
  }

  const panel = (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5">
      {/* QR code */}
      <div ref={qrRef} className="rounded-xl bg-white p-4 shadow-sm">
        <QRCode
          value={url}
          style={{ display: "block", width: "100%", height: "auto" }}
          viewBox="0 0 256 256"
          size={170}
          fgColor="hsl(220, 20%, 14%)"
          bgColor="white"
          level="M"
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        Scan to open{" "}
        <span className="font-semibold text-foreground font-mono">
          {url.replace("https://", "")}
        </span>
      </p>

      {/* Download */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Generating..." : "Download QR Card"}
      </Button>
    </div>
  );

  if (mode === "static") return panel;

  // Inline animated mode
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mt-3"
        >
          {panel}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QRPanel;