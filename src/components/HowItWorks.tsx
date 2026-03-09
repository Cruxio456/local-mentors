import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Browse Mentors",
    description: "Explore skilled teachers in your area by category, rating, and availability.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="20" cy="20" r="14" stroke="hsl(152 60% 42%)" strokeWidth="2.5" fill="none" />
        <path d="M30 30L42 42" stroke="hsl(80 65% 55%)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Book a Session",
    description: "Schedule a session at a time that works for both of you — online or in person.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="6" y="10" width="36" height="32" rx="4" stroke="hsl(152 60% 42%)" strokeWidth="2.5" fill="none" />
        <path d="M6 20H42" stroke="hsl(152 60% 42%)" strokeWidth="2" />
        <rect x="14" y="26" width="8" height="8" rx="2" fill="hsl(80 65% 55%)" />
        <path d="M16 6V14" stroke="hsl(152 60% 42%)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 6V14" stroke="hsl(152 60% 42%)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Learn & Grow",
    description: "Get personalized 1-on-1 mentorship and level up your skills with expert guidance.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path d="M8 38L18 24L26 30L40 12" stroke="hsl(152 60% 42%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="12" r="4" fill="hsl(80 65% 55%)" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            How it <span className="text-gradient">works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="gradient-card rounded-xl p-8 border border-border/50 hover:border-primary/30 transition-colors group shadow-card"
            >
              <div className="mb-5">{step.icon}</div>
              <span className="text-xs text-muted-foreground font-medium">{step.number}</span>
              <h3 className="text-xl font-bold mt-1 mb-3 group-hover:text-gradient transition-all">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
