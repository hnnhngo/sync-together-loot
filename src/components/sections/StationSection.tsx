import { motion } from "framer-motion";
import { Store, Gift } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";

const tiers = [
  { label: "Common", color: "bg-muted text-foreground" },
  { label: "Rare", color: "bg-secondary/20 text-secondary" },
  { label: "Legendary", color: "bg-warm-gold/30 text-foreground" },
];

const StationSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="Welcome to The Station! Spend your hard-earned Sync Coins on loot crates. I got a legendary aura last month! ✨" direction="right" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      The Station
    </motion.h2>

    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="bg-accent/10 rounded-2xl p-5"
      >
        <Store className="w-7 h-7 text-foreground mb-3" />
        <h3 className="text-base font-bold text-foreground mb-1">Monthly Rotation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">Shop refreshes every 30 days — plenty of time to earn Sync Coins.</p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="bg-primary/10 rounded-2xl p-5"
      >
        <Gift className="w-7 h-7 text-foreground mb-3" />
        <h3 className="text-base font-bold text-foreground mb-1">The Pull System</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">Randomized loot crates with rarity tiers for avatars, auras, and alarm sounds.</p>
        <div className="flex gap-2 flex-wrap">
          {tiers.map((t) => (
            <span key={t.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${t.color}`}>{t.label}</span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default StationSection;
