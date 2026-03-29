import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...(role === "mentor" && hourlyRate ? { hourly_rate: parseInt(hourlyRate) } : {}),
            ...(role === "mentor" && skills ? { skills: skills.split(",").map(s => s.trim()).filter(Boolean) } : {}),
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) setError(error.message);
      else setMessage("Check your email to verify your account!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome back" : "Join Local Mentor"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Sign in to continue learning" : "Create your account to get started"}
            </p>
          </div>

          <div className="gradient-card rounded-2xl border border-border/50 p-8 shadow-card">
            {/* Toggle */}
            <div className="flex rounded-lg bg-secondary p-1 mb-6">
              {(["Sign In", "Sign Up"] as const).map((label, i) => (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError(""); setMessage(""); }}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    (i === 0 ? isLogin : !isLogin) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">I want to</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: "student" as const, label: "🎓 Learn", desc: "Find mentors" },
                        { value: "mentor" as const, label: "🧑‍🏫 Teach", desc: "Become a mentor" },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            role === opt.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="font-medium text-sm">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {role === "mentor" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Hourly Rate (₹)</label>
                        <input
                          type="number"
                          required
                          min="100"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="e.g. 800"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Skills (comma separated)</label>
                        <input
                          type="text"
                          required
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="e.g. Music, Guitar, Vocals"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-sm text-primary bg-primary/10 rounded-lg p-3">
                  {message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-lg gradient-accent font-bold text-accent-foreground shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
