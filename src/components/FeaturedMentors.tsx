import { motion } from "framer-motion";
import { Star } from "lucide-react";

const mentors = [
  { name: "Priya Sharma", skill: "Classical Guitar", rating: 4.9, sessions: 230, initials: "PS", color: "bg-primary" },
  { name: "Arjun Mehta", skill: "Web Development", rating: 4.8, sessions: 185, initials: "AM", color: "bg-accent" },
  { name: "Kavitha R.", skill: "Watercolor Art", rating: 5.0, sessions: 142, initials: "KR", color: "bg-primary" },
  { name: "David Chen", skill: "Mandarin Chinese", rating: 4.7, sessions: 310, initials: "DC", color: "bg-accent" },
];

const FeaturedMentors = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Top Rated</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Featured <span className="text-gradient">mentors</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all shadow-card group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full ${m.color} flex items-center justify-center text-lg font-bold text-primary-foreground mb-4`}>
                {m.initials}
              </div>
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{m.skill}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{m.rating}</span>
                <span className="text-xs text-muted-foreground">• {m.sessions} sessions</span>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-lg border border-primary/30 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMentors;
