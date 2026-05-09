import { motion } from "framer-motion";
import { Link2, X, Plus } from "lucide-react";

const features = [
  "Add the current page with one click",
  "Auto-syncs with your WeLinkly account",
  "Generate your bundle URL without opening the site",
  "Save bundles in your account's history",
];

function ExtensionMockup() {
  return (
    <div className="w-[260px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_24px_rgba(0,0,0,0.08)] cursor-default">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md ">
            <Link2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-sm font-bold text-foreground">
            <p>We<span className="text-primary">Linkly</span></p>
          </span>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium text-primary"
          style={{ background: "hsl(14 100% 57% / 0.08)" }}
        >
          john@gmail.com
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Link items */}
        <div className="mb-1.5 flex items-center gap-2 rounded-lg border border-border bg-muted px-2.5 py-2">
          <div className="h-4 w-4 flex-shrink-0 rounded bg-blue-500" />
          <span className="flex-1 truncate text-[11px] text-muted-foreground">
            notion.so/project-brief
          </span>
          <X className="h-2.5 w-2.5 text-muted-foreground/50" />
        </div>
        <div className="mb-1.5 flex items-center gap-2 rounded-lg border border-border bg-muted px-2.5 py-2">
          <div className="h-4 w-4 flex-shrink-0 rounded bg-purple-500" />
          <span className="flex-1 truncate text-[11px] text-muted-foreground">
            figma.com/file/design-v2
          </span>
          <X className="h-2.5 w-2.5 text-muted-foreground/50" />
        </div>

        {/* Add current page */}
        <div
          className="mb-3 flex items-center gap-2 rounded-lg border border-dashed px-2.5 py-2 opacity-60"
          style={{ borderColor: "hsl(14 100% 57% / 0.4)" }}
        >
          <Plus
            className="h-3 w-3 flex-shrink-0 text-primary"
            strokeWidth={2.5}
          />
          <span className="text-[11px] text-primary">Add current page</span>
        </div>

        {/* Generate button */}
        <button className="w-full rounded-lg bg-primary py-2 cursor-default font-display text-xs font-semibold text-white">
          Generate Share Link
        </button>
      </div>
    </div>
  );
}

export function ChromeExtensionCTA() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — copy */}
          <div className="border-b border-border p-10 md:border-b-0 md:border-r">
            <span
              className="mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary"
              style={{
                background: "hsl(14 100% 57% / 0.08)",
                borderColor: "hsl(14 100% 57% / 0.2)",
              }}
            >
              Chrome Extension
            </span>

            <h2 className="font-display text-3xl font-bold leading-tight text-foreground">
              Bundle links without{" "}
              <span className="text-gradient">leaving your tab</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Install the WeLinkly Chrome Extension and add the page you're on to a
              bundle in one click. Log in once and your projects sync
              automatically, no need to open the site every time.
            </p>

            {/* CTA button */}
            <a
              href="https://chromewebstore.google.com/detail/welinkly/bdankdkgeeombeaoaoiliodmcikpgolk?authuser=0&hl=el"
              target="_blank"
              className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-primary px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <img className="w-5" src="https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg" alt="Chrome Extension" />
              Add to Chrome — it's free
            </a>

            {/* Feature list */}
            <ul className="mt-6 flex flex-col gap-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: "hsl(14 100% 57% / 0.1)" }}
                  >
                    <svg
                      className="h-2.5 w-2.5"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="hsl(14 100% 57%)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — mockup */}
          <div className="flex flex-col items-center justify-center gap-4 bg-muted/40 px-10 py-12">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <ExtensionMockup />
            </motion.div>
            <p className="text-center text-xs text-muted-foreground">
              Works on Chrome <span className="opacity-20">for now :)</span>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}