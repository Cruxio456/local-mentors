import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar, MessageCircle, User, Clock, MapPin,
  Edit2, Trash2, BookOpen, Star, AlertTriangle, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string | null;
  hourly_rate: number;
  notes: string | null;
  mentor_id: string;
  student_id: string;
  other_name?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const DashboardPage = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [switchHourlyRate, setSwitchHourlyRate] = useState("");
  const [switchSkills, setSwitchSkills] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profile) return;
    setEditName(profile.name || "");
    setEditBio(profile.bio || "");
    setEditLocation(profile.location || "");
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;
    setLoadingData(true);

    const [bookingsRes, convsRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("*")
        .order("start_time", { ascending: false }),
      supabase
        .from("conversations")
        .select("id", { count: "exact", head: true }),
    ]);

    if (bookingsRes.data) {
      const enriched = await Promise.all(
        bookingsRes.data.map(async (b) => {
          const otherId = b.student_id === profile.id ? b.mentor_id : b.student_id;
          const { data: p } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", otherId)
            .maybeSingle();
          return { ...b, other_name: p?.name || "User" };
        })
      );
      setBookings(enriched);
    }

    setConversationCount(convsRes.count || 0);
    setLoadingData(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: editName, bio: editBio, location: editLocation })
      .eq("id", profile.id);
    setSaving(false);
    if (!error) {
      toast({ title: "Profile updated" });
      setEditingProfile(false);
      window.location.reload();
    } else {
      toast({ title: "Error updating profile", variant: "destructive" });
    }
  };

  const handleSwitchRole = async () => {
    if (!profile) return;
    const newRole = profile.user_role === "mentor" ? "student" : "mentor";
    setSwitchingRole(true);

    const updates: Record<string, unknown> = { user_role: newRole };
    if (newRole === "mentor") {
      const rate = parseInt(switchHourlyRate);
      if (!rate || rate < 100) {
        toast({ title: "Please enter a valid hourly rate (min ₹100)", variant: "destructive" });
        setSwitchingRole(false);
        return;
      }
      updates.hourly_rate = rate;
      const skillsArr = switchSkills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillsArr.length) updates.skills = skillsArr;
    }

    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    setSwitchingRole(false);

    if (error) {
      toast({ title: "Failed to switch role", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: `You're now a ${newRole}`,
        description: newRole === "mentor" ? "Start sharing your skills!" : "Find a mentor and keep learning.",
      });
      setSwitchDialogOpen(false);
      setSwitchHourlyRate("");
      setSwitchSkills("");
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const res = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw res.error;

      await signOut();
      navigate("/");
      toast({ title: "Account deleted", description: "Your account has been permanently removed." });
    } catch {
      toast({ title: "Failed to delete account", variant: "destructive" });
    }
    setDeleting(false);
    setDeleteDialogOpen(false);
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const upcoming = bookings.filter(
    (b) => new Date(b.start_time) >= new Date() && b.status !== "cancelled" && b.status !== "rejected"
  );
  const past = bookings.filter(
    (b) => new Date(b.start_time) < new Date() || b.status === "completed"
  );

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    accepted: "bg-primary/20 text-primary",
    completed: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-destructive/20 text-destructive",
    rejected: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              Welcome back, <span className="text-primary">{profile.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.user_role === "mentor" ? "Manage your sessions and profile" : "Track your learning journey"}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-primary" },
              { label: "Completed", value: past.filter((b) => b.status === "completed").length, icon: BookOpen, color: "text-emerald-400" },
              { label: "Conversations", value: conversationCount, icon: MessageCircle, color: "text-blue-400" },
              { label: "Total Sessions", value: bookings.length, icon: Star, color: "text-yellow-400" },
            ].map((s) => (
              <div key={s.label} className="gradient-card rounded-xl border border-border/50 p-4">
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <div className="text-2xl font-bold">{loadingData ? "–" : s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Sessions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming sessions */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Upcoming Sessions
                </h2>
                {upcoming.length === 0 ? (
                  <div className="gradient-card rounded-xl border border-border/50 p-8 text-center">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                    <Link
                      to="/find"
                      className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
                    >
                      Find a mentor →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 5).map((b) => (
                      <div key={b.id} className="gradient-card rounded-xl border border-border/50 p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                            {b.other_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{b.other_name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(b.start_time).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              {" · "}
                              {new Date(b.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColor[b.status || "pending"]}`}>
                          {b.status || "pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Past sessions */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" /> Past Sessions
                </h2>
                {past.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No past sessions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {past.slice(0, 5).map((b) => (
                      <div key={b.id} className="rounded-xl border border-border/30 bg-secondary/30 p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{b.other_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(b.start_time).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                            {" · ₹"}{b.hourly_rate}
                          </div>
                        </div>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColor[b.status || "pending"]}`}>
                          {b.status || "pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Profile & Actions */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-4">
              {/* Profile card */}
              <div className="gradient-card rounded-xl border border-border/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {profile.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{profile.name}</div>
                    <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                      <User className="w-3 h-3" /> {profile.user_role}
                    </div>
                  </div>
                </div>

                {editingProfile ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                      <input
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary/50"
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary/50 resize-none"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-semibold disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {profile.location && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {profile.location}
                      </div>
                    )}
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{profile.bio}</p>
                    )}
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="w-full py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  </>
                )}
              </div>

              {/* Quick actions */}
              <div className="gradient-card rounded-xl border border-border/50 p-5 space-y-2">
                <h3 className="font-bold text-sm mb-3">Quick Actions</h3>
                <Link
                  to="/find"
                  className="w-full py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Find a Mentor
                </Link>
                <Link
                  to="/chat"
                  className="w-full py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Messages
                </Link>
              </div>

              {/* Danger zone */}
              <div className="rounded-xl border border-destructive/20 p-5">
                <h3 className="font-bold text-sm text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full py-2.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, all your bookings, conversations, and profile data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;
