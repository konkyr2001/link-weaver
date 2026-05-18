import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ExternalLink, Clock, FolderOpen, MoreVertical, Pencil,
  Trash2, Plus, X, Save, GripVertical, Monitor, Globe,
  QrCode,
  Share2,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, getUserHistory } from "@/services/user";
import {
  normalizeUrl, generateId, extractDomain,
  getFaviconUrl, updateProject, deleteProject,
} from "@/lib/bundle";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import ShareBundleModal from "@/components/ShareBundleModal";
import BundleActionsPopover from "@/components/BundleActionsPopover";

interface HistoryItem {
  _id: string;
  projectName: string;
  slug: string;
  expiresAt: string | null;
  premiumExpiresAt: string | null;
  createdAt: string;
  urlCount: number;
  icons?: "screenshot" | "favicon";
  urls?: { id: string; url: string; title?: string }[];
}

type DisplayMode = "screenshot" | "favicon";

function getTimeRemaining(expiresAt: string) {
  const delta = Math.max(0, new Date(expiresAt).getTime() - Date.now()) / 1000;
  return {
    days: Math.floor(delta / 86400),
    hours: Math.floor((delta % 86400) / 3600),
    minutes: Math.floor((delta % 3600) / 60),
  };
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url));
    return /\.[a-z]{2,}$/i.test(parsed.hostname);
  } catch { return false; }
}

// ── Display mode toggle ───────────────────────────────────
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
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200"
            style={
              isActive
                ? { background: "hsl(var(--card))", color: "hsl(14 100% 57%)", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                : { color: "hsl(var(--muted-foreground))" }
            }
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: isActive ? "hsl(14 100% 57%)" : undefined }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Draggable link row in edit dialog ─────────────────────
function EditLinkRow({
  link, index, onRemove, onDragStart, onDragOver, onDrop,
}: {
  link: { id: string; url: string; title?: string };
  index: number;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
}) {
  const domain = extractDomain(link.url);
  const favicon = getFaviconUrl(link.url);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 cursor-grab active:cursor-grabbing group"
    >
      {/* Drag handle */}
      <GripVertical className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />

      {/* Index */}
      <span className="w-5 text-center text-xs font-semibold text-muted-foreground/50 flex-shrink-0">
        {index + 1}
      </span>

      {/* Favicon */}
      <img
        src={favicon}
        alt=""
        className="h-4 w-4 flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {/* Text */}
      <span className="flex-1 min-w-0 text-sm text-foreground truncate">
        {link.title || domain}
      </span>
      <span className="text-xs text-muted-foreground truncate hidden sm:block max-w-[120px]">
        {new URL(link.url).hostname}
      </span>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(link.id)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function History() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const userPlan = user?.plan;

  // Edit state
  const [editItem, setEditItem] = useState<HistoryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLinks, setEditLinks] = useState<{ id: string; url: string; title?: string }[]>([]);
  const [editDisplayMode, setEditDisplayMode] = useState<DisplayMode>("screenshot");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareItem, setShareItem] = useState<{ url: string; title: string } | null>(null);

  // Drag state
  const dragIndex = useRef<number | null>(null);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<HistoryItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [openPopover, setOpenPopover] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      const freshUser = await getUser(token);
      if (!freshUser?.error) {
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      }
    };
    fetchUser();
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const data = await getUserHistory(token);
    setLoading(false);
    if (data.error || data.projects.length === 0) return;
    setItems(data.projects);
  }

  // ── Edit handlers ────────────────────────────────────
  function openEdit(item: HistoryItem) {
    setEditItem(item);
    setEditTitle(item.projectName);
    setEditDisplayMode((item.icons as DisplayMode) || "screenshot");
    setEditLinks(
      item.urls ? item.urls.map((u) => ({ id: u.id || generateId(), url: u.url, title: u.title })) : []
    );
    setNewUrl("");
    setOpenPopover(null);
  }

  function addEditLink() {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) { toast.error("Please enter a valid URL"); return; }
    setEditLinks((prev) => [...prev, { id: generateId(), url: normalizeUrl(trimmed) }]);
    setNewUrl("");
  }

  function removeEditLink(id: string) {
    setEditLinks((prev) => prev.filter((l) => l.id !== id));
  }

  // Drag-to-reorder
  function handleDragStart(index: number) { dragIndex.current = index; }
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
    if (!editItem) return;
    if (editLinks.length === 0) { toast.error("Add at least one link"); return; }
    setSaving(true);
    const token = localStorage.getItem("token");
    const result = await updateProject(token, editItem.slug, editTitle.trim(), editLinks, editDisplayMode);
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Bundle updated successfully");
    setEditItem(null);
    fetchHistory();
  }

  // ── Delete handlers ──────────────────────────────────
  function openDelete(item: HistoryItem) {
    setDeleteItem(item);
    setDeleteConfirmText("");
    setOpenPopover(null);
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    const result = await deleteProject(token, deleteItem.slug);
    setDeleting(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Bundle deleted");
    setDeleteItem(null);
    setItems((prev) => prev.filter((i) => i._id !== deleteItem._id));
  }

  const deleteConfirmPhrase = deleteItem?.projectName ? deleteItem.projectName : "delete";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header active="history" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Your Bundles</h1>
          <p className="text-muted-foreground text-sm mb-8">All the link bundles you've created</p>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                  <div className="h-5 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't created any bundles yet</p>
              <Link to="/"><Button variant="hero">Create your first bundle</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => {
                const bundleUrl = `${window.location.origin}/${item.slug}`;
                const isBundleExpiry = item.expiresAt;
                const hasPaidPlan = userPlan === "pro" || userPlan === "plus";
                const isPremiumBundle = item.expiresAt === null;
                const isActivePremiumBundle = isPremiumBundle && item.premiumExpiresAt && new Date(item.premiumExpiresAt) > new Date();
                const isTrial = user.trialEnd && new Date(user.trialEnd) > new Date();
                const currentPeriodEnd = isTrial ? user.trialEnd : isPremiumBundle ? item.premiumExpiresAt : item.expiresAt;
                const time = currentPeriodEnd ? getTimeRemaining(currentPeriodEnd) : null;

                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-6 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-display font-semibold text-foreground truncate">
                          {hasPaidPlan || isActivePremiumBundle || (user.plan === "free" && isBundleExpiry) ? (
                            <Link to={bundleUrl} target="_blank">{item.projectName}</Link>
                          ) : (
                            <span>{item.projectName}</span>
                          )}
                        </h2>
                        {/* Display mode badge */}
                        {item.icons && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium flex-shrink-0"
                            style={{ borderColor: "hsl(14 100% 57% / 0.2)", background: "hsl(14 100% 57% / 0.06)", color: "hsl(14 100% 57%)" }}
                          >
                            {item.icons === "favicon" ? <Globe className="h-2.5 w-2.5" /> : <Monitor className="h-2.5 w-2.5" />}
                            {item.icons === "favicon" ? "Logo" : "Screenshot"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono truncate">{bundleUrl}</p>
                      {time && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className={`text-xs font-medium ${time.days < 3 ? "text-destructive" : "text-muted-foreground"}`}>
                            {time.days > 0
                              ? `${isBundleExpiry ? "Bundle expires" : "Expires"} in ${time.days}d${time.days < 7 && time.hours > 0 ? ` ${time.hours}h` : ""}${isTrial ? " (trial)" : ""}`
                              : time.hours > 0
                              ? `Expires in ${time.hours}h${isTrial ? " (trial)" : ""}`
                              : `Expires in ${time.minutes}m`}
                          </span>
                        </div>
                      )}
                    </div>

                    {hasPaidPlan ? (
                      <BundleActionsPopover actions={[
                        { label: "View",   icon: ExternalLink, onClick: () => window.open(`/${item.slug}`, "_blank") },
                        { label: "Share",  icon: QrCode,       onClick: () => setShareItem({ url: bundleUrl, title: item.projectName }) },
                        { label: "Edit",   icon: Pencil,       onClick: () => openEdit(item) },         // Pro only — add conditionally
                        { label: "Delete", icon: Trash2,       onClick: () => openDelete(item), variant: "destructive" },
                      ]} />
                    ) : isPremiumBundle ? (
                      <Button variant="ghost" onClick={() => openDelete(item)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-1" />Delete
                      </Button>
                    ) : (
                      <Link to={`/${item.slug}`} target="_blank">
                        <Button variant="glass" size="sm"><ExternalLink className="w-4 h-4 mr-1" />View</Button>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="font-display text-lg">Edit Bundle</DialogTitle>
            <DialogDescription className="text-sm">
              Update the title, display mode, or reorder and manage links.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Bundle Title</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Bundle title..." />
            </div>

            {/* Display mode */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Display Mode</label>
              <DisplayModeToggle value={editDisplayMode} onChange={setEditDisplayMode} />
              <p className="text-xs text-muted-foreground">
                {editDisplayMode === "screenshot"
                  ? "Links will show a website screenshot preview."
                  : "Links will show the website logo/favicon — better for mobile."}
              </p>
            </div>

            {/* Links — drag to reorder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Links <span className="text-muted-foreground font-normal">({editLinks.length})</span>
                </label>
                {editLinks.length > 1 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <GripVertical className="h-3 w-3" />
                    Drag to reorder
                  </span>
                )}
              </div>

              <AnimatePresence>
                {editLinks.map((link, index) => (
                  <EditLinkRow
                    key={link.id}
                    link={link}
                    index={index}
                    onRemove={removeEditLink}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </AnimatePresence>

              {editLinks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                  No links yet. Add one below.
                </p>
              )}

              {/* Add new link */}
              <form onSubmit={(e) => { e.preventDefault(); addEditLink(); }} className="flex gap-2 pt-1">
                <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="flex-1" />
                <Button type="submit" variant="outline" size="sm" className="h-10 flex-shrink-0">
                  <Plus className="w-4 h-4 mr-1" />Add
                </Button>
              </form>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={() => setEditItem(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Delete Bundle</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type{" "}
              {deleteConfirmPhrase ? (
                <span className="font-mono font-semibold text-foreground">{deleteConfirmPhrase}</span>
              ) : (
                <span className="font-mono font-semibold text-foreground">delete</span>
              )}{" "}
              to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder={`Type "${deleteConfirmPhrase ? deleteConfirmPhrase : "delete"}"`} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteConfirmText !== deleteConfirmPhrase || deleting}>
              <Trash2 className="w-4 h-4 mr-1" />{deleting ? "Deleting..." : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ShareBundleModal
        open={!!shareItem}
        onClose={() => setShareItem(null)}
        url={shareItem?.url ?? ""}
        title={shareItem?.title ?? ""}
      />
      <Footer />
    </div>
  );
}
