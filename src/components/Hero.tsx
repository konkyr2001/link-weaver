import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Chrome, Link2, Zap, Users } from "lucide-react";

function scrollToCreate() {
  document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const benefits = [
  { icon: Users, label: "No account needed" },
  { icon: Link2, label: "One link, everything inside" },
  { icon: Zap, label: "Generate in one click" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-4 pt-20 md:pt-28">
      {/* Background glow blobs */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(14 100% 57% / 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        {/* Top badge */}
        <motion.div variants={itemVariants}>
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold text-primary"
            style={{
              background: "hsl(14 100% 57% / 0.07)",
              borderColor: "hsl(14 100% 57% / 0.22)",
            }}
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
              style={{ animationDuration: "2s" }}
            />
            Now with Chrome Extension
            <ArrowRight className="h-3 w-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl"
        >
          Share links,{" "}
          <span className="relative inline-block">
            <span className="text-gradient">not chaos</span>
            {/* Underline accent */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(14 100% 57%), hsl(14 100% 74%))",
              }}
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground"
        >
          Bundle multiple links into one clean, shareable URL.
          <p>Paste, generate, and share in seconds.</p>
        </motion.p>
        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            onClick={scrollToCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-bold text-white shadow-[0_8px_24px_hsl(14_100%_57%_/_0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_12px_28px_hsl(14_100%_57%_/_0.35)]"
          >
            Create a bundle
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="https://chromewebstore.google.com/detail/welinkly/bdankdkgeeombeaoaoiliodmcikpgolk?authuser=0&hl=el"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-display text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
          >
            <img className="w-5" src="https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg" alt="Chrome Extension" />
            Get Chrome Extension
          </a>
        </motion.div>

        {/* Benefit pills */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {benefits.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/90"
        >
          <div className="flex -space-x-1.5">
            {["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400"].map(
              (color, i) => (
                <div
                  key={i}
                  className={`h-6 w-6 rounded-full border-2 border-background ${color}`}
                />
              )
            )}
          </div>
          <span>Trusted by link sharers everywhere</span>
        </motion.div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(var(--background)))",
        }}
        aria-hidden
      />
    </section>
  );
}

export default Hero;
