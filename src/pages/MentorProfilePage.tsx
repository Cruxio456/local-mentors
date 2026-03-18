import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, MessageCircle, ArrowLeft, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookSessionDialog from "@/components/BookSessionDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MentorProfile {
  id: string;
  name: string;
  bio: string | null;
  skills: string[] | null;
  rating: number | null;
  total_sessions: number | null;
  location: string | null;
  hourly_rate: number | null;
  is_available: boolean | null;
  avatar_url: string | null;
}

const MentorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (id) fetchMentor(id);
  }, [id]);

  const fetchMentor = async (mentorId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", mentorId)
      .eq("user_role", "mentor")
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
    } else {
      setMentor(data);
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!user || !profile || !mentor) {
      navigate("/auth");
      return;
    }

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("student_id", profile.id)
      .eq("mentor_id", mentor.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("conversations").insert({
        student_id: profile.id,
        mentor_id: mentor.id,
      });
    }
    navigate("/chat");
  };

  const initials = mentor?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "";

  const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(mentor?.rating || 0));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back link */}
          <Link
            to="/find"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to mentors
          </Link>

          {loading ? (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : notFound ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold mb-2">Mentor not found</p>
              <p className="text-muted-foreground mb-6">This profile doesn't exist or is no longer available.</p>
              <Link
                to="/find"
                className="px-6 py-2.5 rounded-lg gradient-accent font-semibold text-accent-foreground text-sm"
              >
                Browse Mentors
              </Link>
            </div>
          ) : mentor ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Header */}
              <div className="gradient-card rounded-2xl border border-border/50 p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{mentor.name}</h1>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          mentor.is_available
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {mentor.is_available ? "Available" : "Booked"}
                      </span>
                    </div>

                    {mentor.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{mentor.location}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        {ratingStars.map((filled, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              filled ? "fill-accent text-accent" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="ml-1.5 font-semibold">{mentor.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{mentor.total_sessions || 0} sessions</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{mentor.hourly_rate || 0}
                        <span className="text-base font-normal text-muted-foreground">/hr</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-3 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => setShowBooking(true)}
                      disabled={!mentor.is_available}
                      className={`flex-1 md:flex-none px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                        mentor.is_available
                          ? "gradient-accent text-accent-foreground hover:shadow-glow"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Book Session
                    </button>
                    <button
                      onClick={handleChat}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {mentor.bio && (
                <div className="gradient-card rounded-2xl border border-border/50 p-8">
                  <h2 className="text-lg font-bold mb-3">About</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{mentor.bio}</p>
                </div>
              )}

              {/* Skills */}
              {mentor.skills && mentor.skills.length > 0 && (
                <div className="gradient-card rounded-2xl border border-border/50 p-8">
                  <h2 className="text-lg font-bold mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-4 py-1.5 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Rating", value: mentor.rating?.toFixed(1) || "0.0", icon: Star },
                  { label: "Sessions", value: String(mentor.total_sessions || 0), icon: Users },
                  { label: "Rate", value: `₹${mentor.hourly_rate || 0}/hr`, icon: Clock },
                  { label: "Status", value: mentor.is_available ? "Available" : "Booked", icon: MapPin },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="gradient-card rounded-xl border border-border/50 p-5 text-center"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {mentor && showBooking && (
        <BookSessionDialog
          open={showBooking}
          onClose={() => setShowBooking(false)}
          mentor={{
            id: mentor.id,
            name: mentor.name,
            skill: mentor.skills?.[0] || "General",
            price: mentor.hourly_rate || 0,
            initials,
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default MentorProfilePage;
