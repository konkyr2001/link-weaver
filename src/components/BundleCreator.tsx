import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, Share2, UserPlus, RotateCcw, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkInput } from "@/components/LinkInput";
import { LinkItem } from "@/components/LinkItem";
import { BundleLink, generateId, createBundle, normalizeUrl } from "@/lib/bundle";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import Captcha from "react-google-recaptcha";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import QRPanel from "@/components/QRPanel";
import { DisplayModeToggle } from "./DisplayModeToggle";

const BUNDLE_DRAFT_KEY = "bundle_draft";


export function BundleCreator() {
  const token = localStorage.getItem("token");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState(false);
  const [links, setLinks] = useState<BundleLink[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const captchaRef = useRef<Captcha>(null);
  const [displayMode, setDisplayMode] = useState<"screenshot" | "favicon">("screenshot");

  useEffect(() => {
    const savedDraft = sessionStorage.getItem(BUNDLE_DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || "");
        setLinks(Array.isArray(parsed.links) ? parsed.links : []);
      } catch {
        sessionStorage.removeItem(BUNDLE_DRAFT_KEY);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(BUNDLE_DRAFT_KEY, JSON.stringify({ title, links }));
  }, [title, links]);

  function saveDraft() {
    sessionStorage.setItem(BUNDLE_DRAFT_KEY, JSON.stringify({ title, links }));
  }

  const isValidUrl = (url: string): boolean => {
    const normalized = normalizeUrl(url);
    try {
      const parsed = new URL(normalized);
      return /\.[a-z]{2,}$/i.test(parsed.hostname);
    } catch { return false; }
  };

  const addLink = (url: string) => {
    if (!isValidUrl(url)) { toast.error("Please enter a valid URL"); return; }
    setLinks((prev) => [...prev, { id: generateId(), url: normalizeUrl(url) }]);
    setGeneratedUrl(null);
    setShowQr(false);
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setGeneratedUrl(null);
    setShowQr(false);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    setLinks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setGeneratedUrl(null);
    setShowQr(false);
  };

  const proceedWithGenerate = async () => {
    const bundle = { title: title.trim() || undefined, links, createdAt: Date.now(), icons: displayMode };
    let captcha = null;
    if (!token) {
      captcha = await captchaRef.current?.executeAsync();
      captchaRef.current?.reset();
    }
    const url = await createBundle(bundle, token || null, captcha);
    if (url?.error) { toast.error(url.error); return; }
    sessionStorage.removeItem(BUNDLE_DRAFT_KEY);
    setGeneratedUrl(url.data);
    setShowQr(false);
  };

  const generateLink = async () => {
    setErrorTitle(false);
    if (links.length === 0) { toast.error("Add at least one link first"); return; }
    if (!token && !sessionStorage.getItem("signup_prompt_shown")) {
      sessionStorage.setItem("signup_prompt_shown", "true");
      setShowSignupModal(true);
      return;
    }
    await proceedWithGenerate();
  };

  const copyToClipboard = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetBundle = () => {
    setTitle(""); setLinks([]); setGeneratedUrl(null); setShowQr(false);
    sessionStorage.removeItem(BUNDLE_DRAFT_KEY);
  };

  return (
    <>
      {!token && (
        <div className="relative z-50">
          <Captcha
            key={theme}
            theme={theme}
            ref={captchaRef}
            size="invisible"
            sitekey={import.meta.env.VITE_RECAPTCHA_INVISIBLE_SECRET_KEY}
          />
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-3 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setGeneratedUrl(null);
                  setShowQr(false);
                  if (e.target.value.trim()) setErrorTitle(false);
                }}
                placeholder="Bundle title here..."
                className={`font-display text-lg font-semibold border-none bg-transparent outline-none w-full rounded-md px-1 py-1 transition-all ${
                  errorTitle
                    ? "text-destructive placeholder:text-destructive/70"
                    : "text-foreground placeholder:text-muted-foreground"
                }`}
              />
              <p className="text-muted-foreground text-sm">Add your links and share them in one URL</p>
            </div>
          </div>

          {/* Input */}
          <LinkInput onAdd={addLink} />

          {/* Links list */}
          <div className="space-y-2 min-h-[60px]">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {links.map((link, i) => (
                      <Draggable key={link.id} draggableId={link.id} index={i}>
                        {(provided, snapshot) => {
                          const child = (
                            <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                              <LinkItem
                                link={link}
                                index={i}
                                onRemove={removeLink}
                                dragHandleProps={provided.dragHandleProps ?? undefined}
                                displayMode={displayMode}
                              />
                            </div>
                          );
                          return snapshot.isDragging ? createPortal(child, document.body) : child;
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {links.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-muted-foreground text-sm">
                Paste URLs above to start building your bundle
              </motion.div>
            )}
          </div>

          {/* Generate section */}
          {links.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <DisplayModeToggle value={displayMode} onChange={setDisplayMode} />
              <div className="flex gap-3">
                <Button onClick={resetBundle} variant="outline" size="lg" className="flex-2 h-12 px-2 sm:px-8">
                  <RotateCcw className="h-4" />
                </Button>
                <Button onClick={generateLink} variant="hero" size="lg" className="flex-1 h-12 text-sm sm:text-base px-2">
                  <Share2 className="w-5 h-5 mr-2" />
                  Generate Share Link
                </Button>
              </div>

              {/* Generated URL + QR */}
              <AnimatePresence>
                {generatedUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {/* URL row */}
                    <div className="bg-secondary/50 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                      <p className="text-sm text-foreground truncate flex-1 font-mono">
                        <a href={generatedUrl} target="_blank" rel="noopener noreferrer">{generatedUrl}</a>
                      </p>
                      <Button onClick={copyToClipboard} variant="glass" size="sm" className="flex-shrink-0">
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      {/* QR toggle */}
                      <Button
                        onClick={() => setShowQr((v) => !v)}
                        variant={showQr ? "hero" : "glass"}
                        size="sm"
                        className="flex-shrink-0"
                        title="Show QR code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>

                    <QRPanel url={generatedUrl} title={title || "My Bundle"} mode="inline" show={showQr} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Signup prompt modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Extend your bundle's life!</DialogTitle>
            <DialogDescription className="text-center">
              Create a free account to extend your bundles from {import.meta.env.VITE_FREE_NO_ACCOUNT_EXPIRATION_DAY} days to {import.meta.env.VITE_FREE_ACCOUNT_EXPIRATION_DAY} days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setShowSignupModal(false); proceedWithGenerate(); }}>
              Continue without account
            </Button>
            <Button variant="hero" className="flex-1" onClick={() => { saveDraft(); setShowSignupModal(false); navigate("/signup"); }}>
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
