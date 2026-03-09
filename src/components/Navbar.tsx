import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
            <circle cx="16" cy="16" r="14" fill="hsl(152 60% 42%)" />
            <path d="M12 22V14L20 10V18" stroke="hsl(152 45% 6%)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="22" r="3" fill="hsl(152 45% 6%)" />
            <circle cx="18" cy="18" r="3" fill="hsl(80 65% 55%)" />
          </svg>
          <span className="font-display font-bold text-lg">SkillNest</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Browse</a>
          <a href="#" className="hover:text-foreground transition-colors">Categories</a>
          <a href="#" className="hover:text-foreground transition-colors">Teach</a>
          <a href="#" className="hover:text-foreground transition-colors">About</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </button>
          <button className="px-5 py-2 rounded-lg gradient-accent text-sm font-semibold text-accent-foreground">
            Sign Up
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
