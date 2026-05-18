import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Bundle, fetchBundleBySlug, updateProject, deleteProject,
  extractDomain, getFaviconUrl, generateId, normalizeUrl,
} from "@/lib/bundle";
import { BundleLinkCard } from "@/components/BundleLinkCard";
import ShareBundleModal from "@/components/ShareBundleModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2, ArrowLeft, Plus, MoreVertical, Pencil,
  Trash2, QrCode, GripVertical, X, Save, Monitor, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";
import NotFound from "./NotFound";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import BundleActionsPopover from "@/components/BundleActionsPopover";

type DisplayMode = "screenshot" | "favicon";
interface EditLink { id: string; url: string; title?: string; }

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url));
    return /\.[a-z]{2,}$/i.test(parsed.hostname);
  } catch { return false; }
}

function DisplayModeToggle({ value, onChange }: { value: DisplayMode; onChange: (m: DisplayMode) => void }) {
  const options: { value: DisplayMode; icon: typeof Monitor; label: string }[] = [
    { value: "screenshot", icon: Monitor, label: "Screenshot" },
    { value: "favicon",    icon: Globe,   label: "Logo" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
      {options.map(({ value: opt, icon: Icon, label }) => {
        const isActive = value === opt;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200"
            style={isActive
              ? { background: "hsl(var(--card))", color: "hsl(14 100% 57%)", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
              : { color: "hsl(var(--muted-foreground))" }}
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: isActive ? "hsl(14 100% 57%)" : undefined }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function EditLinkRow({ link, index, onRemove, onDragStart, onDragOver, onDrop }: {
  link: EditLink; index: number; onRemove: (id: string) => void;
  onDragStart: (i: number) => void; onDragOver: (e: React.DragEvent) => void; onDrop: (i: number) => void;
}) {
  const domain = extractDomain(link.url);
  const favicon = getFaviconUrl(link.url);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      draggable onDragStart={() => onDragStart(index)} onDragOver={onDragOver} onDrop={() => onDrop(index)}
      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 cursor-grab active:cursor-grabbing group"
    >
      <GripVertical className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      <span className="w-5 text-center text-xs font-semibold text-muted-foreground/50 flex-shrink-0">{index + 1}</span>
      <img src={favicon} alt="" className="h-4 w-4 flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      <span className="flex-1 min-w-0 text-sm text-foreground truncate">{link.title || domain}</span>
      <span className="text-xs text-muted-foreground truncate hidden sm:block max-w-[120px]">
        {new URL(link.url).hostname}
      </span>
      <Button variant="ghost" size="icon" type="button"
        className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(link.id)}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

export default function BundleView() {
  const { theme, toggleTheme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editLinks, setEditLinks] = useState<EditLink[]>([]);
  const [editDisplayMode, setEditDisplayMode] = useState<DisplayMode>("screenshot");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Current user
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  })();

  async function loadBundle() {
    if (!slug) { setBundle(null); setLoading(false); return; }
    const result = await fetchBundleBySlug(slug);
    setLoading(false);
    setBundle(result);
  }

  useEffect(() => { loadBundle(); }, [slug]);

  // Derive ownership after bundle loads
  const isOwner = !!currentUser && !!bundle?.userId && String(bundle.userId) === String(currentUser._id);

  // ── Edit ─────────────────────────────────────────────────
  function openEdit() {
    if (!bundle) return;
    setEditTitle(bundle.title);
    setEditDisplayMode((bundle.icons as DisplayMode) || "screenshot");
    setEditLinks(bundle.links.map((l: any) => ({ id: l.id || generateId(), url: l.url, title: l.title })));
    setNewUrl("");
    setEditOpen(true);
  }

  function addEditLink() {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) { toast.error("Please enter a valid URL"); return; }
    setEditLinks((prev) => [...prev, { id: generateId(), url: normalizeUrl(trimmed) }]);
    setNewUrl("");
  }

  function removeEditLink(id: string) { setEditLinks((prev) => prev.filter((l) => l.id !== id)); }
  function handleDragStart(i: number) { dragIndex.current = i; }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }
  function handleDrop(targetIndex: number) {
    if (dragIndex.current === null || dragIndex.current === targetIndex) return;
    const updated = [...editLinks];
    const [moved] = updated.splice(dragIndex.current, 1);
    updated.splice(targetIndex, 0, moved);
    setEditLinks(updated);
    dragIndex.current = null;
  }

  async function handleSaveEdit() {
    if (editLinks.length === 0) { toast.error("Add at least one link"); return; }
    setSaving(true);
    const token = localStorage.getItem("token");
    const result = await updateProject(token, slug, editTitle.trim(), editLinks, editDisplayMode);
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Bundle updated!");
    setEditOpen(false);
    // Live update — re-fetch without page reload
    const updated = await fetchBundleBySlug(slug!);
    if (updated) setBundle(updated);
  }

  // ── Delete ───────────────────────────────────────────────
  function openDelete() { setDeleteConfirm(""); setDeleteOpen(true); }

  async function handleDelete() {
    setDeleting(true);
    const token = localStorage.getItem("token");
    const result = await deleteProject(token, slug);
    setDeleting(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Bundle deleted");
    navigate("/");
  }

  if (loading) return null;
  if (!bundle) return <NotFound />;

  const isFavicon = bundle.icons === "favicon";
  const bundleUrl = window.location.href;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2 text-foreground transition-all duration-300 ease-out">
            <ArrowLeft className="w-4 h-4 transition-all duration-300 group-hover:text-primary group-hover:-translate-x-1" />
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary transition-all duration-300 ease-out group-hover:scale-110" />
              <span className="font-display font-bold text-lg flex items-center">
                <span className="transition-all duration-300 ease-out group-hover:text-primary">We</span>
                <span className="text-primary transition-all duration-300 ease-out group-hover:tracking-wide">Linkly</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* Owner actions */}
            {isOwner && (
              <BundleActionsPopover actions={[
                { label: "Share",  icon: QrCode,  onClick: () => setShareOpen(true) },
                { label: "Edit",   icon: Pencil,  onClick: openEdit },
                { label: "Delete", icon: Trash2,  onClick: openDelete, variant: "destructive" },
              ]} />
            )}

            <Link to="/"><Button variant="hero" size="sm"><Plus className="w-4 h-4 mr-1" />Create Bundle</Button></Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{bundle.title}</h1>
          <p className="text-muted-foreground">
            {bundle.links.length} link{bundle.links.length !== 1 ? "s" : ""} shared
          </p>
        </motion.div>

        {isFavicon ? (
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            {bundle.links.map((link: any, i: number) => (
              <motion.a key={link.id || i} href={link.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_0_3px_hsl(14_100%_57%_/_0.06)]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <img src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`} alt=""
                    className="h-5 w-5 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{link.title || new URL(link.url).hostname}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                </div>
                <ArrowLeft className="h-4 w-4 flex-shrink-0 rotate-180 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundle.links.map((link: any, i: number) => (
              <BundleLinkCard key={link.id || i} link={link} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Share Modal */}
      <ShareBundleModal open={shareOpen} onClose={() => setShareOpen(false)} url={bundleUrl} title={bundle.title} />

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="font-display text-lg">Edit Bundle</DialogTitle>
            <DialogDescription className="text-sm">
              Changes will be reflected on this page immediately after saving.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Bundle Title</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Bundle title..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Display Mode</label>
              <DisplayModeToggle value={editDisplayMode} onChange={setEditDisplayMode} />
              <p className="text-xs text-muted-foreground">
                {editDisplayMode === "screenshot" ? "Links will show a website screenshot preview." : "Links will show the website logo — better for mobile."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Links <span className="text-muted-foreground font-normal">({editLinks.length})</span>
                </label>
                {editLinks.length > 1 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <GripVertical className="h-3 w-3" />Drag to reorder
                  </span>
                )}
              </div>

              <AnimatePresence>
                {editLinks.map((link, index) => (
                  <EditLinkRow key={link.id} link={link} index={index}
                    onRemove={removeEditLink} onDragStart={handleDragStart}
                    onDragOver={handleDragOver} onDrop={handleDrop} />
                ))}
              </AnimatePresence>

              {editLinks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                  No links yet. Add one below.
                </p>
              )}

              <form onSubmit={(e) => { e.preventDefault(); addEditLink(); }} className="flex gap-2 pt-1">
                <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="flex-1" />
                <Button type="submit" variant="outline" size="sm" className="h-10 flex-shrink-0">
                  <Plus className="w-4 h-4 mr-1" />Add
                </Button>
              </form>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(o) => !o && setDeleteOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Delete Bundle</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type{" "}
              <span className="font-mono font-semibold text-foreground">"{bundle.title}"</span>{" "}
              to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={`Type "${bundle.title}"`} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteConfirm !== bundle.title || deleting}>
              <Trash2 className="w-4 h-4 mr-1" />{deleting ? "Deleting..." : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
