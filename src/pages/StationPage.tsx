import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Timer, Sparkles, Star, Crown, Gift } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";

const banners = [
  {
    id: 1,
    name: "Finals Frenzy",
    tag: "LIMITED",
    tagColor: "bg-coral text-primary-foreground",
    bg: "from-coral/20 to-warm-gold/10",
    endsIn: "3d 14h",
    items: [
      { name: "Ember Aura", rarity: "Legendary", icon: Crown, cost: 500 },
      { name: "Phoenix Frame", rarity: "Rare", icon: Star, cost: 250 },
      { name: "Flame Trail", rarity: "Common", icon: Sparkles, cost: 100 },
    ],
  },
  {
    id: 2,
    name: "Spring Bloom",
    tag: "SEASONAL",
    tagColor: "bg-sage text-primary-foreground",
    bg: "from-sage/20 to-secondary/10",
    endsIn: "12d 8h",
    items: [
      { name: "Cherry Blossom Aura", rarity: "Legendary", icon: Crown, cost: 450 },
      { name: "Petal Crown", rarity: "Rare", icon: Star, cost: 200 },
      { name: "Garden Badge", rarity: "Common", icon: Sparkles, cost: 80 },
    ],
  },
  {
    id: 3,
    name: "Neon Nights",
    tag: "NEW",
    tagColor: "bg-accent text-accent-foreground",
    bg: "from-accent/15 to-primary/10",
    endsIn: "20d 2h",
    items: [
      { name: "Neon Halo", rarity: "Legendary", icon: Crown, cost: 600 },
      { name: "Glow Skin", rarity: "Rare", icon: Star, cost: 300 },
      { name: "Pixel Shades", rarity: "Common", icon: Sparkles, cost: 120 },
    ],
  },
];

const rarityColor: Record<string, string> = {
  Legendary: "text-warm-gold",
  Rare: "text-secondary",
  Common: "text-muted-foreground",
};

const StationPage = () => {
  const [points] = useState(1250);
  const [pulledItem, setPulledItem] = useState<string | null>(null);

  const handlePull = (itemName: string) => {
    setPulledItem(itemName);
    setTimeout(() => setPulledItem(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">The Station</h1>
        <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur rounded-full px-3 py-1.5 shadow-sm border border-border">
          <Coins className="w-4 h-4 text-warm-gold" />
          <span className="text-sm font-bold text-foreground">{points.toLocaleString()}</span>
        </div>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Welcome to The Station! These banners rotate monthly — grab the limited stuff before it's gone! ✨" />
      </div>

      {/* Pull animation overlay */}
      <AnimatePresence>
        {pulledItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-card rounded-3xl p-8 text-center shadow-2xl mx-6"
            >
              <Gift className="w-16 h-16 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground">You got:</h3>
              <p className="text-lg font-bold text-primary mt-1">{pulledItem}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners */}
      <div className="px-6 mt-5 pb-28 flex flex-col gap-5">
        {banners.map((banner, bi) => (
          <motion.div
            key={banner.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: bi * 0.1 }}
            className={`bg-gradient-to-br ${banner.bg} rounded-2xl border border-border overflow-hidden`}
          >
            {/* Banner header */}
            <div className="p-5 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.tagColor}`}>
                    {banner.tag}
                  </span>
                  <h2 className="text-lg font-bold text-foreground">{banner.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Timer className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{banner.endsIn}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="px-4 pb-4 space-y-2">
              {banner.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-card/70 backdrop-blur rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${rarityColor[item.rarity]}`} />
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className={`text-[10px] font-semibold ${rarityColor[item.rarity]}`}>{item.rarity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePull(item.name)}
                    className="flex items-center gap-1 bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold"
                  >
                    <Coins className="w-3 h-3" /> {item.cost}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StationPage;
