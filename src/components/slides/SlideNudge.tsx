import { motion } from "framer-motion";
import { HandMetal, Zap } from "lucide-react";

const SlideNudge = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-3">
      Nudge & Power of Friendship
    </motion.h2>
    <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-12">Social Accountability Features</motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-sage/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-sage/30 flex items-center justify-center mb-6">
          <HandMetal className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Interactive Nudging</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Send a "Nudge" to a friend who isn't working. If they start within 10 minutes, you both earn bonus coins.
        </p>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-warm-gold/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-warm-gold/30 flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">The Multiplier</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          When friends work together, the Power of Friendship multiplier boosts coin-earn rates for everyone in the "Crew."
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="text-3xl font-serif text-primary">×2.5</span>
          <span className="text-sm text-muted-foreground">max multiplier</span>
        </div>
      </motion.div>
    </div>
  </div>
);

export default SlideNudge;
