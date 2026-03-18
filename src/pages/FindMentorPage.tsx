import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Filter, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookSessionDialog from "@/components/BookSessionDialog";

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

const categories = ["All", "Music", "Coding", "Art", "Language", "Fitness", "Cooking"];

const MentorCard = ({
  mentor,
  index,
  onBook,
  onChat,
}: {
  mentor: MentorProfile;
  index: number;
  onBook: () => void;
  onChat: () => void;
}) => {
  const colors = ["bg-primary", "bg-accent", "bg-primary/80", "bg-accent/80"];
  const initials = mentor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const skill = mentor.skills?.[0] || "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="gradient-card rounded-xl border border-border/50 hover:border-primary/30 transition-all shadow-card overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link to={`/mentor/${mentor.id}`} className="flex items-center gap-3 group">
            <div className={`w-14 h-14 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0`}>
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-base group-hover:text-primary transition-colors">{mentor.name}</h3>
              <p className="text-sm text-primary font-medium">{skill}</p>
            </div>
          </Link>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${mentor.is_available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {mentor.is_available ? "Available" : "Booked"}
          </span>
        </div>

        {mentor.location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{mentor.location}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm mb-5">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-medium">{mentor.rating?.toFixed(1) || "0.0"}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{mentor.total_sessions || 0} sessions</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">
            <span className="font-bold text-lg text-foreground">₹{mentor.hourly_rate || 0}</span>
            <span className="text-muted-foreground">/hr</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onChat}
              className="p-2 rounded-lg border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
              title="Message"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onBook}
              disabled={!mentor.is_available}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mentor.is_available ? "gradient-accent text-accent-foreground hover:shadow-glow" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FindMentorPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Rating");
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [bookingMentor, setBookingMentor] = useState<MentorProfile | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_role", "mentor");
    if (data) setMentors(data);
    setLoadingMentors(false);
  };

  const handleChat = async (mentor: MentorProfile) => {
    if (!user || !profile) {
      navigate("/auth");
      return;
    }

    // Check existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("student_id", profile.id)
      .eq("mentor_id", mentor.id)
      .maybeSingle();

    if (existing) {
      navigate("/chat");
      return;
    }

    // Create new conversation
    await supabase.from("conversations").insert({
      student_id: profile.id,
      mentor_id: mentor.id,
    });
    navigate("/chat");
  };

  const filtered = mentors.filter((m) => {
    const matchCat = activeCategory === "All" || (m.skills || []).some((s) =>
      s.toLowerCase().includes(activeCategory.toLowerCase())
    );
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      (m.location || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "Price: Low") return (a.hourly_rate || 0) - (b.hourly_rate || 0);
    if (sortBy === "Price: High") return (b.hourly_rate || 0) - (a.hourly_rate || 0);
    if (sortBy === "Sessions") return (b.total_sessions || 0) - (a.total_sessions || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Find your <span className="text-gradient">perfect mentor</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">Browse skilled teachers near you, read reviews, and book a session instantly.</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by skill, name, or location..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-card border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-3.5 rounded-lg gradient-accent font-semibold text-accent-foreground text-sm">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary text-sm text-foreground rounded-lg px-3 py-1.5 border border-border/50 outline-none cursor-pointer"
            >
              <option>Rating</option>
              <option>Price: Low</option>
              <option>Price: High</option>
              <option>Sessions</option>
            </select>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container mx-auto px-6">
          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong className="text-foreground">{sorted.length}</strong> mentors
            {activeCategory !== "All" && <> in <span className="text-primary">{activeCategory}</span></>}
          </p>
          {loadingMentors ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="gradient-card rounded-xl border border-border/50 p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : sorted.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((m, i) => (
                <MentorCard
                  key={m.id}
                  mentor={m}
                  index={i}
                  onBook={() => setBookingMentor(m)}
                  onChat={() => handleChat(m)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none">
                <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="2.5" />
                <path d="M44 44L56 56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-lg font-medium">No mentors found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          )}
        </div>
      </section>

      {bookingMentor && (
        <BookSessionDialog
          open={!!bookingMentor}
          onClose={() => setBookingMentor(null)}
          mentor={{
            id: bookingMentor.id,
            name: bookingMentor.name,
            skill: bookingMentor.skills?.[0] || "General",
            price: bookingMentor.hourly_rate || 0,
            initials: bookingMentor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default FindMentorPage;
