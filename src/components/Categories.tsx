import { motion } from "framer-motion";
import CategoryIcon from "./CategoryIcon";

const categories = [
  { type: "music" as const, label: "Music", count: "120+ mentors" },
  { type: "code" as const, label: "Programming", count: "95+ mentors" },
  { type: "art" as const, label: "Art & Design", count: "80+ mentors" },
  { type: "language" as const, label: "Languages", count: "110+ mentors" },
  { type: "fitness" as const, label: "Fitness", count: "65+ mentors" },
  { type: "cooking" as const, label: "Cooking", count: "50+ mentors" },
];

const Categories = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-secondary/30 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Explore</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Popular <span className="text-gradient">categories</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/40 transition-all cursor-pointer text-center shadow-card group"
            >
              <div className="flex justify-center mb-3">
                <CategoryIcon type={cat.type} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{cat.label}</h3>
              <p className="text-xs text-muted-foreground">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
