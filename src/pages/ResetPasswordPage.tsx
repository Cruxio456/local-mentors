import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash on load and
    // emits a PASSWORD_RECOVERY event. Listen for it to confirm the user
    // has a valid recovery session before allowing them to set a password.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setValidSession(true);
      }
    });

    // Fallback check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true);
      else if (validSession === null) setValidSession(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setError(error.message);
    else {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    }
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
            <h1 className="text-3xl font-bold mb-2">Set a new password</h1>
            <p className="text-muted-foreground text-sm">
              Choose a strong password to secure your account.
            </p>
          </div>

          <div className="gradient-card rounded-2xl border border-border/50 p-8 shadow-card">
            {validSession === false ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  This password reset link is invalid or has expired.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-3 rounded-lg gradient-accent font-bold text-accent-foreground"
                >
                  Back to Sign In
                </button>
              </div>
            ) : success ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
                <h2 className="font-bold text-lg">Password updated!</h2>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password</label>
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

                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || validSession === null}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-lg gradient-accent font-bold text-accent-foreground shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
