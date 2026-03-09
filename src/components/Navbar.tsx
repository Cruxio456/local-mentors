import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Home", href: "/" },
    { label: "Find a Mentor", href: "/find" },
    { label: "Become a Mentor", href: "/teach" },
    { label: "About", href: "#" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
            <circle cx="16" cy="16" r="14" fill="hsl(152 60% 42%)" />
            <path d="M12 22V14L20 10V18" stroke="hsl(152 45% 6%)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="22" r="3" fill="hsl(152 45% 6%)" />
            <circle cx="18" cy="18" r="3" fill="hsl(80 65% 55%)" />
          </svg>
          <span className="font-display font-bold text-lg">Local Mentor</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className={`transition-colors ${location.pathname === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </button>
          <Link to="/teach">
            <button className="px-5 py-2 rounded-lg gradient-accent text-sm font-semibold text-accent-foreground">
              Start Teaching
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border/50 px-6 py-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${location.pathname === l.href ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/teach" onClick={() => setOpen(false)}>
            <button className="w-full py-2.5 rounded-lg gradient-accent text-sm font-semibold text-accent-foreground">
              Start Teaching
            </button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
