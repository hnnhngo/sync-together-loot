import { motion } from "framer-motion";
import { Store, Gift } from "lucide-react";

const SlideStation = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-3">
      The Station
    </motion.h2>
    <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-12">Monthly Gacha Shop</motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-lavender/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-lavender/30 flex items-center justify-center mb-6">
          <Store className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Monthly Rotation</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The shop refreshes its inventory every 30 days, giving students time to earn enough Sync Coins.
        </p>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-coral/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-coral/30 flex items-center justify-center mb-6">
          <Gift className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">The "Pull" System</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Spend coins on randomized "Loot Crates" with Common, Rare, and Legendary rarity tiers for avatars, auras, and alarm sounds.
        </p>
        <div className="flex gap-3 mt-6">
          {["Common", "Rare", "Legendary"].map((tier, i) => (
            <span key={tier} className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              i === 0 ? "bg-cream-dark text-foreground" : i === 1 ? "bg-dusty-blue/30 text-foreground" : "bg-warm-gold/30 text-foreground"
            }`}>{tier}</span>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default SlideStation;
