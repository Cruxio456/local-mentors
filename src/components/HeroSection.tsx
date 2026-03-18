import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroIllustration from "./HeroIllustration";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              🌱 Learn locally, grow globally
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn from{" "}
              <span className="text-gradient">mentors</span>
              <br />
              in your neighborhood
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Connect with skilled teachers in your locality. Whether you want to
              learn guitar, coding, cooking, or a new language — your next mentor
              is just around the corner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/find" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg gradient-accent font-semibold text-accent-foreground shadow-glow transition-shadow hover:shadow-[0_0_60px_hsl(152_60%_42%/0.25)]"
                >
                  Find a Mentor
                </motion.button>
              </Link>
              <Link to="/teach" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-primary/30 font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  Start Teaching
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["A", "K", "M", "S"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span>
                <strong className="text-foreground">2,400+</strong> mentors & students connected
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="animate-float"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
