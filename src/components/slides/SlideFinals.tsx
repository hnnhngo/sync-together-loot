import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

const SlideFinals = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-3">
      Finals Frenzy
    </motion.h2>
    <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-12">Seasonal Event</motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-coral/20 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-coral/30 flex items-center justify-center mb-6">
          <Flame className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Limited Currency</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Earn Ember Shards during finals week — a special currency that cannot be used in the regular shop.
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-serif text-xl text-foreground">Ember Shards</span>
        </div>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-warm-gold/20 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-warm-gold/30 flex items-center justify-center mb-6">
          <Trophy className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Event-Exclusive Loot</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Spend shards on high-tier cosmetics that are only available once a year — show off your finals-week survival.
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-serif text-xl text-foreground">Once a year only</span>
        </div>
      </motion.div>
    </div>
  </div>
);

export default SlideFinals;
