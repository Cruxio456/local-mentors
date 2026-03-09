import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TeachCTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden gradient-card border border-border/50 shadow-card"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-10 p-10 md:p-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20">
                💰 Earn while you teach
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Share your skills,<br />
                <span className="text-gradient">earn in your locality</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Turn your expertise into income. Set your own rates, choose your schedule,
                and teach students in your neighborhood. Join thousands of mentors already
                earning on our platform.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["Set your own rates", "Flexible schedule", "Local students"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <circle cx="8" cy="8" r="8" fill="hsl(152 60% 42% / 0.2)" />
                      <path d="M5 8L7 10L11 6" stroke="hsl(152 60% 42%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
              <Link to="/teach">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-lg gradient-accent font-semibold text-accent-foreground shadow-glow"
                >
                  Become a Mentor
                </motion.button>
              </Link>
            </div>

            {/* Earnings illustration */}
            <div className="flex justify-center">
              <svg viewBox="0 0 300 250" fill="none" className="w-full max-w-xs">
                <rect x="40" y="30" width="220" height="190" rx="16" fill="hsl(152 35% 12%)" stroke="hsl(152 25% 20%)" strokeWidth="1.5" />
                <text x="60" y="65" fontSize="14" fill="hsl(140 20% 90%)" fontFamily="DM Sans" fontWeight="600">Monthly Earnings</text>
                <text x="60" y="100" fontSize="28" fill="hsl(80 65% 55%)" fontFamily="Fraunces" fontWeight="700">₹24,500</text>
                <text x="60" y="120" fontSize="11" fill="hsl(150 15% 55%)">+18% from last month</text>
                {/* Mini bar chart */}
                {[40, 65, 50, 80, 72, 95, 88].map((h, i) => (
                  <rect key={i} x={70 + i * 26} y={190 - h} width="16" rx="4" height={h} fill={i === 5 ? "hsl(80 65% 55%)" : "hsl(152 60% 42% / 0.5)"} />
                ))}
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeachCTA;
