import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, Upload, FileText,
  CheckCircle2, X, Loader2, FileBadge,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string | null;
  user_role: string;
  verification_status: "pending" | "approved" | "rejected";
  id_document_url: string | null;
  certificate_urls: string[] | null;
  verification_notes: string | null;
}

interface Props {
  profile: Profile;
  onUpdated: () => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_CERTIFICATES = 5;

const MentorVerification = ({ profile, onUpdated }: Props) => {
  const { toast } = useToast();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const idInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  if (profile.user_role !== "mentor") return null;

  const status = profile.verification_status;
  const hasUploadedDocs = !!profile.id_document_url && (profile.certificate_urls?.length ?? 0) > 0;
  // Show upload form only when not approved AND no docs already submitted (or rejected — they can reupload)
  const showUploadForm = status === "rejected" || (status === "pending" && !hasUploadedDocs);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP or PDF files are allowed.";
    if (file.size > MAX_FILE_BYTES) return "Each file must be under 5MB.";
    return null;
  };

  const handleIdSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) return toast({ title: err, variant: "destructive" });
    setIdFile(file);
  };

  const handleCertSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid: File[] = [];
    for (const f of files) {
      const err = validateFile(f);
      if (err) {
        toast({ title: `${f.name}: ${err}`, variant: "destructive" });
        continue;
      }
      valid.push(f);
    }
    setCertFiles((prev) => [...prev, ...valid].slice(0, MAX_CERTIFICATES));
    if (certInputRef.current) certInputRef.current.value = "";
  };

  const removeCert = (i: number) => setCertFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!profile.user_id) return;
    if (!idFile) return toast({ title: "Please attach your ID document.", variant: "destructive" });
    if (certFiles.length === 0)
      return toast({ title: "Please attach at least one certificate.", variant: "destructive" });

    setSubmitting(true);
    try {
      const folder = profile.user_id;
      const ts = Date.now();

      // Upload ID
      const idExt = idFile.name.split(".").pop()?.toLowerCase() || "bin";
      const idPath = `${folder}/id-${ts}.${idExt}`;
      const { error: idErr } = await supabase.storage
        .from("mentor-documents")
        .upload(idPath, idFile, { upsert: true, contentType: idFile.type });
      if (idErr) throw idErr;

      // Upload certs
      const certPaths: string[] = [];
      for (let i = 0; i < certFiles.length; i++) {
        const f = certFiles[i];
        const ext = f.name.split(".").pop()?.toLowerCase() || "bin";
        const path = `${folder}/cert-${ts}-${i}.${ext}`;
        const { error } = await supabase.storage
          .from("mentor-documents")
          .upload(path, f, { upsert: true, contentType: f.type });
        if (error) throw error;
        certPaths.push(path);
      }

      // Update profile — status goes back to pending if it was rejected
      const { error: updErr } = await supabase
        .from("profiles")
        .update({
          id_document_url: idPath,
          certificate_urls: certPaths,
          verification_status: "pending",
          verification_notes: null,
        })
        .eq("id", profile.id);
      if (updErr) throw updErr;

      toast({
        title: "Documents submitted",
        description: "We'll review your documents shortly. You'll be notified once verified.",
      });
      setIdFile(null);
      setCertFiles([]);
      onUpdated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Status banner styles
  const statusConfig = {
    pending: {
      Icon: ShieldAlert,
      title: hasUploadedDocs ? "Verification in progress" : "Verification required",
      description: hasUploadedDocs
        ? "Our team is reviewing your documents. You'll be visible to learners once approved."
        : "Upload your ID and certificates to get verified and start receiving bookings.",
      tone: "border-yellow-500/30 bg-yellow-500/5 text-yellow-500",
      iconTone: "text-yellow-500",
    },
    approved: {
      Icon: ShieldCheck,
      title: "You're verified",
      description: "Your profile is live and visible to learners.",
      tone: "border-emerald-500/30 bg-emerald-500/5",
      iconTone: "text-emerald-500",
    },
    rejected: {
      Icon: ShieldX,
      title: "Verification rejected",
      description:
        profile.verification_notes ||
        "Your previous documents weren't approved. Please re-upload clear, valid documents.",
      tone: "border-destructive/30 bg-destructive/5",
      iconTone: "text-destructive",
    },
  } as const;

  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 sm:p-5 mb-6 ${cfg.tone}`}
    >
      <div className="flex items-start gap-3">
        <cfg.Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.iconTone}`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground">{cfg.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{cfg.description}</p>
        </div>
      </div>

      {showUploadForm && (
        <div className="mt-5 space-y-4">
          {/* ID document */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">
              Government ID <span className="text-destructive">*</span>
            </label>
            <p className="text-[11px] text-muted-foreground mb-2">
              Aadhaar, PAN, Driver's License, or Passport. JPG / PNG / PDF, max 5MB.
            </p>
            <input
              ref={idInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleIdSelect}
              className="hidden"
            />
            {idFile ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-sm">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 truncate text-xs">{idFile.name}</span>
                <button
                  type="button"
                  onClick={() => setIdFile(null)}
                  className="text-muted-foreground hover:text-destructive p-1"
                  aria-label="Remove ID file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => idInputRef.current?.click()}
                className="w-full py-2.5 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Upload className="w-3.5 h-3.5" /> Choose ID file
              </button>
            )}
          </div>

          {/* Certificates */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-foreground">
              Teaching certificates <span className="text-destructive">*</span>
            </label>
            <p className="text-[11px] text-muted-foreground mb-2">
              Diplomas, course certificates, or professional credentials. Up to {MAX_CERTIFICATES} files.
            </p>
            <input
              ref={certInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={handleCertSelect}
              className="hidden"
            />
            {certFiles.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {certFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-sm"
                  >
                    <FileBadge className="w-4 h-4 text-primary shrink-0" />
                    <span className="flex-1 truncate text-xs">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCert(i)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {certFiles.length < MAX_CERTIFICATES && (
              <button
                type="button"
                onClick={() => certInputRef.current?.click()}
                className="w-full py-2.5 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Upload className="w-3.5 h-3.5" />
                {certFiles.length === 0 ? "Choose certificate(s)" : "Add another"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !idFile || certFiles.length === 0}
            className="w-full py-2.5 rounded-lg gradient-accent text-accent-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Submit for verification
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MentorVerification;
