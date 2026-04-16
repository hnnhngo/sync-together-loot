import { motion } from "framer-motion";
import { HandMetal, Zap } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import FeatureCard from "@/components/FeatureCard";

const NudgeSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="Psst! Give your friends a little nudge when they're slacking. You both earn bonus coins! 🤝" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      Nudge & Friendship Power
    </motion.h2>

    <div className="flex flex-col gap-4">
      <FeatureCard
        icon={HandMetal}
        title="Interactive Nudging"
        description="Send a Nudge to a friend who isn't working. If they start within 10 minutes, you both earn bonus coins."
        color="bg-lavender/20"
      />
      <FeatureCard
        icon={Zap}
        title="The Multiplier"
        description="Work with friends to activate the Power of Friendship multiplier — boosting coin rates for your whole Crew."
        color="bg-warm-gold/15"
      />
    </div>
  </section>
);

export default NudgeSection;
