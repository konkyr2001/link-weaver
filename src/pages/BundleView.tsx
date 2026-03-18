import { useParams, Link } from "react-router-dom";
import { decodeBundleFromParam } from "@/lib/bundle";
import { BundleLinkCard } from "@/components/BundleLinkCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import { Link2, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BundleView() {
  const { theme, toggleTheme } = useTheme();
  const { data } = useParams<{ data: string }>();
  const bundle = data ? decodeBundleFromParam(data) : null;

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Invalid Bundle</h1>
          <p className="text-muted-foreground">This link appears to be broken or expired.</p>
          <Link to="/">
            <Button variant="hero">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg">bundl</span>
            </div>
          </Link>
          <Link to="/">
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Bundle
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {bundle.title || "Link Bundle"}
          </h1>
          <p className="text-muted-foreground">
            {bundle.links.length} link{bundle.links.length !== 1 ? 's' : ''} shared
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundle.links.map((link, i) => (
            <BundleLinkCard key={link.id} link={link} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
