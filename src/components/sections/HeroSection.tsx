import { motion } from "framer-motion";
import synMascot from "@/assets/syn-mascot.png";

const HeroSection = () => (
  <section className="px-6 pt-14 pb-8 text-center">
    <motion.img
      src={synMascot}
      alt="Syn the capybara mascot"
      width={512}
      height={512}
      className="w-36 h-36 mx-auto mb-4"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    />
    <motion.h1
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
    >
      Sync
    </motion.h1>
    <motion.p
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35 }}
      className="text-muted-foreground mt-2 text-lg"
    >
      Study together. Stay in Sync.
    </motion.p>
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-6 flex gap-3 justify-center"
    >
      <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25">
        Get Started
      </button>
      <button className="px-6 py-3 rounded-full bg-card border border-border text-foreground font-semibold text-sm">
        Learn More
      </button>
    </motion.div>
  </section>
);

export default HeroSection;
