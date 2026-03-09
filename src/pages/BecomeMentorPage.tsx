import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { icon: "💰", title: "Set your own rates", desc: "Charge what you're worth. Full control over your pricing and session length." },
  { icon: "📅", title: "Flexible schedule", desc: "Teach when it suits you. Accept or decline sessions at your own pace." },
  { icon: "🏘️", title: "Local students", desc: "Connect with eager learners right in your neighborhood." },
  { icon: "🚀", title: "Grow your brand", desc: "Build a reputation with reviews, a profile, and a growing student base." },
  { icon: "🔒", title: "Secure payments", desc: "Payments released after every session. Zero risk, all reward." },
  { icon: "📊", title: "Track earnings", desc: "Dashboard with analytics so you always know where you stand." },
];

const faqs = [
  { q: "Do I need formal qualifications?", a: "No! You just need proven skills and a passion to teach. Many of our best mentors are self-taught practitioners." },
  { q: "How much can I earn?", a: "Mentors on our platform earn anywhere between ₹8,000 to ₹80,000 per month depending on their availability and skill." },
  { q: "How do I get paid?", a: "Payments are processed after each completed session and deposited directly to your bank account within 2 business days." },
  { q: "Can I teach online as well?", a: "Absolutely! You can offer in-person sessions, online video calls, or both. You're in full control." },
  { q: "Is there a fee to join?", a: "Joining is completely free. We only take a small platform fee (10%) per completed session." },
];

const steps = [
  { num: "1", title: "Create your profile", desc: "Tell us about your skills, experience, and the areas you cover locally." },
  { num: "2", title: "Set your availability", desc: "Choose the days, times, and session formats that work for you." },
  { num: "3", title: "Get matched & earn", desc: "Students find you, book sessions, and you start earning right away." },
];

const BecomeMentorPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", skill: "", bio: "", rate: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 border border-accent/20">
              💰 Join 1,200+ mentors already earning
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Share your skills,<br />
              <span className="text-gradient">earn from home</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Turn your expertise into a rewarding side income or full-time career.
              Teach students in your locality on your own terms.
            </p>
            <a href="#apply">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-lg gradient-accent font-bold text-accent-foreground shadow-glow text-base"
              >
                Apply to Teach →
              </motion.button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mt-16"
          >
            {[
              { value: "₹24K", label: "Avg. monthly earnings" },
              { value: "1,200+", label: "Active mentors" },
              { value: "4.8★", label: "Avg. mentor rating" },
            ].map((s) => (
              <div key={s.label} className="gradient-card rounded-xl p-5 border border-border/50">
                <div className="text-2xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Simple steps</span>
            <h2 className="text-3xl font-bold mt-3">Start in <span className="text-gradient">3 easy steps</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="gradient-card rounded-xl p-7 border border-border/50 shadow-card relative"
              >
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-accent-foreground mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-primary text-2xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Why us</span>
            <h2 className="text-3xl font-bold mt-3">Everything you <span className="text-gradient">need to thrive</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all shadow-card"
              >
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings visualizer */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-3">Your potential <span className="text-gradient">earnings</span></h2>
          <p className="text-muted-foreground mb-10 text-sm">Based on sessions per week & hourly rate</p>
          <div className="gradient-card rounded-xl border border-border/50 shadow-card p-8">
            <svg viewBox="0 0 400 200" fill="none" className="w-full mb-6">
              {[
                { label: "4 sessions/wk", monthly: 12800, bar: 60 },
                { label: "8 sessions/wk", monthly: 25600, bar: 110 },
                { label: "12 sessions/wk", monthly: 38400, bar: 155 },
                { label: "16 sessions/wk", monthly: 51200, bar: 180 },
              ].map((d, i) => (
                <g key={d.label}>
                  <rect x={30 + i * 90} y={195 - d.bar} rx="6" width="60" height={d.bar}
                    fill={i === 3 ? "hsl(80 65% 55%)" : "hsl(152 60% 42%)"} opacity={0.7 + i * 0.08} />
                  <text x={60 + i * 90} y="195" textAnchor="middle" fontSize="9" fill="hsl(150 15% 55%)" fontFamily="Outfit">
                    {d.label.split(" ")[0]}
                  </text>
                  <text x={60 + i * 90} y={d.bar < 40 ? 175 : 190 - d.bar - 4} textAnchor="middle" fontSize="9" fill="hsl(140 20% 90%)" fontFamily="Outfit">
                    ₹{(d.monthly / 1000).toFixed(0)}K
                  </text>
                </g>
              ))}
            </svg>
            <p className="text-xs text-muted-foreground">Based on ₹800/hr average session rate</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently asked <span className="text-gradient">questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="gradient-card rounded-xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 px-6">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Apply to <span className="text-gradient">become a mentor</span></h2>
            <p className="text-muted-foreground text-sm mt-2">We'll review your application and get back within 24 hours.</p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gradient-card rounded-xl border border-primary/30 p-10 text-center shadow-card"
            >
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground text-sm">Thanks, {formData.name}! We'll review your profile and reach out to <span className="text-primary">{formData.email}</span> within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="gradient-card rounded-xl border border-border/50 p-8 shadow-card space-y-5"
            >
              {[
                { field: "name", label: "Full Name", placeholder: "e.g. Priya Sharma", type: "text" },
                { field: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
                { field: "skill", label: "Your Skill / Subject", placeholder: "e.g. Classical Guitar, Python, Yoga", type: "text" },
                { field: "rate", label: "Desired Hourly Rate (₹)", placeholder: "e.g. 800", type: "number" },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5">Tell us about yourself</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience, teaching style, and why you'd be a great mentor..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors resize-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-lg gradient-accent font-bold text-accent-foreground shadow-glow"
              >
                Submit Application
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeMentorPage;
