import { motion } from "framer-motion";
import { Flame, Crown } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import FeatureCard from "@/components/FeatureCard";

const FinalsSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="Finals Frenzy drops once a year! Earn Ember Shards and flex those exclusive cosmetics. 🔥" direction="right" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      Finals Frenzy
    </motion.h2>

    <div className="flex flex-col gap-4">
      <FeatureCard
        icon={Flame}
        title="Ember Shards"
        description="Earn this limited currency during finals week — can't be used in the regular shop."
        color="bg-coral/15"
      />
      <FeatureCard
        icon={Crown}
        title="Event-Exclusive Loot"
        description="Spend shards on high-tier cosmetics available only once a year. Show off your finals survival!"
        color="bg-warm-gold/15"
      />
    </div>
  </section>
);

export default FinalsSection;
