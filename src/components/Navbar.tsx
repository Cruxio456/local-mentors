import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, MessageCircle, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const links = [
    { label: "Home", href: "/" },
    { label: "Find a Mentor", href: "/find" },
    { label: "Become a Mentor", href: "/teach" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          {user ? (
            <>
              <Link to="/dashboard" className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/chat" className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {profile?.name?.charAt(0)?.toUpperCase() || <User className="w-3 h-3" />}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{profile?.name || "User"}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link to="/teach">
                <button className="px-5 py-2 rounded-lg gradient-accent text-sm font-semibold text-accent-foreground">
                  Start Teaching
                </button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground">
                Dashboard
              </Link>
              <Link to="/chat" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground">
                Messages
              </Link>
              <button onClick={() => { handleSignOut(); setOpen(false); }} className="text-sm font-medium text-muted-foreground text-left">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground">
                Log In
              </Link>
              <Link to="/teach" onClick={() => setOpen(false)}>
                <button className="w-full py-2.5 rounded-lg gradient-accent text-sm font-semibold text-accent-foreground">
                  Start Teaching
                </button>
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
