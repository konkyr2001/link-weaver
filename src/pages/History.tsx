import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Clock,
  FolderOpen,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  X,
  Save,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserHistory } from "@/services/user";
import { 
  normalizeUrl,
  generateId, 
  extractDomain, 
  getFaviconUrl, 
  updateProject, 
  deleteProject 
} from "@/lib/bundle";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HistoryItem {
  _id: string;
  projectName: string;
  slug: string;
  expiresAt: string;
  createdAt: string;
  urlCount: number;
  urls?: { id: string; url: string; title?: string }[];
}

function daysRemaining(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function hoursRemaining(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
}

function isValidUrl(url: string): boolean {
  const normalized = normalizeUrl(url);
  try {
    const parsed = new URL(normalized);
    return /\.[a-z]{2,}$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userPlan = user?.plan;

  // Edit state
  const [editItem, setEditItem] = useState<HistoryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLinks, setEditLinks] = useState<{ id: string; url: string; title?: string }[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<HistoryItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Popover open state
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const data = await getUserHistory(token);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data.projects.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setItems(data.projects);
  }

  // Edit handlers
  function openEdit(item: HistoryItem) {
    setEditItem(item);
    setEditTitle(item.projectName);
    setEditLinks(item.urls ? item.urls.map((u) => ({ ...u })) : []);
    setNewUrl("");
    setOpenPopover(null);
  }

  function addEditLink() {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      toast.error("Please enter a valid URL");
      return;
    }
    const normalized = normalizeUrl(trimmed);
    setEditLinks((prev) => [...prev, { id: generateId(), url: normalized }]);
    setNewUrl("");
  }

  function removeEditLink(id: string) {
    setEditLinks((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleSaveEdit() {
    if (!editItem) return;
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (editLinks.length === 0) {
      toast.error("Add at least one link");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("token");
    const result = await updateProject(token, editItem.slug, editTitle.trim(), editLinks);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Bundle updated successfully");
    setEditItem(null);
    fetchHistory();
  }

  // Delete handlers
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
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Bundle deleted");
    setDeleteItem(null);
    setItems((prev) => prev.filter((i) => i._id !== deleteItem._id));
  }

  const deleteConfirmPhrase = deleteItem ? deleteItem.projectName : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header active="history" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Your Bundles
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            All the link bundles you've created
          </p>

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
              <p className="text-muted-foreground mb-4">
                You haven't created any bundles yet
              </p>
              <Link to="/">
                <Button variant="hero">Create your first bundle</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => {
                const days = item.expiresAt ? daysRemaining(item.expiresAt) : null;
                const bundleUrl = `${window.location.origin}/b/${item.slug}`;
                const showMenu = userPlan === "pro" || userPlan === "plus";

                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-6 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display font-semibold text-foreground truncate">
                        {item.projectName}
                      </h2>
                      <p className="text-sm text-muted-foreground font-mono truncate mt-1">
                        {bundleUrl}
                      </p>
                      {days !== null && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span
                            className={`text-xs font-medium ${
                              days < 3
                                ? "text-destructive"
                                : "text-muted-foreground"
                            }`}
                          >
                            {days === 0
                              ? `Expires in ${hoursRemaining(item.expiresAt)} hour${hoursRemaining(item.expiresAt) !== 1 ? "s" : ""}`
                              : `${days} day${days !== 1 ? "s" : ""} remaining`}
                          </span>
                        </div>
                      )}
                    </div>

                    {showMenu ? (
                      <Popover
                        open={openPopover === item._id}
                        onOpenChange={(open) =>
                          setOpenPopover(open ? item._id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-40 p-1.5"
                        >
                          <Link
                            to={`/b/${item.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors w-full"
                            onClick={() => setOpenPopover(null)}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </Link>
                          {userPlan === "pro" && (
                            <button
                              onClick={() => openEdit(item)}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors w-full text-left"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => openDelete(item)}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors w-full text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Link to={`/b/${item.slug}`}>
                        <Button variant="glass" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Bundle</DialogTitle>
            <DialogDescription>
              Update the title or links in your bundle.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Bundle title..."
              />
            </div>

            {/* Links */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Links</label>
              <AnimatePresence>
                {editLinks.map((link) => {
                  const domain = extractDomain(link.url);
                  const favicon = getFaviconUrl(link.url);
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2"
                    >
                      <img
                        src={favicon}
                        alt=""
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-sm text-foreground truncate flex-1">
                        {link.title || domain}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEditLink(link.id)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add new link */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addEditLink();
                }}
                className="flex gap-2"
              >
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Add a URL..."
                  className="flex-1"
                />
                <Button type="submit" variant="outline" size="sm" className="h-10">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </form>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditItem(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Delete Bundle</DialogTitle>
            <DialogDescription>
              This action cannot be undone. To confirm, type{" "}
              <span className="font-mono font-semibold text-foreground">
                {deleteConfirmPhrase}
              </span>{" "}
              below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={`Type "${deleteConfirmPhrase}" to confirm`}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteItem(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirmText !== deleteConfirmPhrase || deleting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {deleting ? "Deleting..." : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
