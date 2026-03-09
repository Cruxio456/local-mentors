import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allMentors = [
  { name: "Priya Sharma", skill: "Classical Guitar", rating: 4.9, sessions: 230, initials: "PS", location: "Koramangala, Bangalore", price: 800, category: "Music", available: true },
  { name: "Arjun Mehta", skill: "Web Development", rating: 4.8, sessions: 185, initials: "AM", location: "HSR Layout, Bangalore", price: 1200, category: "Coding", available: true },
  { name: "Kavitha R.", skill: "Watercolor Art", rating: 5.0, sessions: 142, initials: "KR", location: "Indiranagar, Bangalore", price: 600, category: "Art", available: false },
  { name: "David Chen", skill: "Mandarin Chinese", rating: 4.7, sessions: 310, initials: "DC", location: "Whitefield, Bangalore", price: 900, category: "Language", available: true },
  { name: "Meera Iyer", skill: "Carnatic Vocals", rating: 4.9, sessions: 198, initials: "MI", location: "JP Nagar, Bangalore", price: 700, category: "Music", available: true },
  { name: "Rohan Verma", skill: "Python & AI", rating: 4.6, sessions: 95, initials: "RV", location: "Electronic City, Bangalore", price: 1500, category: "Coding", available: true },
  { name: "Sunita Patel", skill: "Yoga & Fitness", rating: 4.8, sessions: 280, initials: "SP", location: "Jayanagar, Bangalore", price: 500, category: "Fitness", available: false },
  { name: "Kiran Nair", skill: "Indian Cooking", rating: 4.7, sessions: 160, initials: "KN", location: "Malleshwaram, Bangalore", price: 650, category: "Cooking", available: true },
];

const categories = ["All", "Music", "Coding", "Art", "Language", "Fitness", "Cooking"];

const MentorCard = ({ mentor, index }: { mentor: typeof allMentors[0]; index: number }) => {
  const colors = ["bg-primary", "bg-accent", "bg-primary/80", "bg-accent/80"];

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
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0`}>
              {mentor.initials}
            </div>
            <div>
              <h3 className="font-bold text-base">{mentor.name}</h3>
              <p className="text-sm text-primary font-medium">{mentor.skill}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${mentor.available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {mentor.available ? "Available" : "Booked"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{mentor.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm mb-5">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-medium">{mentor.rating}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{mentor.sessions} sessions</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">
            <span className="font-bold text-lg text-foreground">₹{mentor.price}</span>
            <span className="text-muted-foreground">/hr</span>
          </span>
          <button
            disabled={!mentor.available}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mentor.available ? "gradient-accent text-accent-foreground hover:shadow-glow" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
          >
            Book Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FindMentorPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Rating");

  const filtered = allMentors.filter((m) => {
    const matchCat = activeCategory === "All" || m.category === activeCategory;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.skill.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Price: Low") return a.price - b.price;
    if (sortBy === "Price: High") return b.price - a.price;
    if (sortBy === "Sessions") return b.sessions - a.sessions;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find your <span className="text-gradient">perfect mentor</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">Browse skilled teachers near you, read reviews, and book a session instantly.</p>

            {/* Search bar */}
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

      {/* Filter bar */}
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

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong className="text-foreground">{sorted.length}</strong> mentors
            {activeCategory !== "All" && <> in <span className="text-primary">{activeCategory}</span></>}
          </p>
          {sorted.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((m, i) => (
                <MentorCard key={m.name} mentor={m} index={i} />
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

      <Footer />
    </div>
  );
};

export default FindMentorPage;
