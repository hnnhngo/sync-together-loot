import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Timer, Sparkles, Star, Crown, Gift, RotateCcw } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";

interface GachaItem {
  name: string;
  rarity: "Legendary" | "Rare" | "Common";
  visual: string; // emoji/gradient representation
}

interface Banner {
  id: number;
  name: string;
  tag: string;
  tagColor: string;
  bg: string;
  endsIn: string;
  cost: number;
  pool: GachaItem[];
  rates: { Legendary: number; Rare: number; Common: number };
  pity: number;
}

const banners: Banner[] = [
  {
    id: 1,
    name: "Finals Frenzy",
    tag: "LIMITED",
    tagColor: "bg-coral text-primary-foreground",
    bg: "from-coral/20 to-warm-gold/10",
    endsIn: "3d 14h",
    cost: 150,
    pity: 0,
    rates: { Legendary: 5, Rare: 25, Common: 70 },
    pool: [
      { name: "Ember Aura", rarity: "Legendary", visual: "🔥" },
      { name: "Phoenix Frame", rarity: "Legendary", visual: "🦅" },
      { name: "Inferno Crown", rarity: "Rare", visual: "👑" },
      { name: "Flame Badge", rarity: "Rare", visual: "🏅" },
      { name: "Spark Trail", rarity: "Rare", visual: "✨" },
      { name: "Flame Trail", rarity: "Common", visual: "💨" },
      { name: "Ember Sticker", rarity: "Common", visual: "🔖" },
      { name: "Fire Ring", rarity: "Common", visual: "⭕" },
    ],
  },
  {
    id: 2,
    name: "Spring Bloom",
    tag: "SEASONAL",
    tagColor: "bg-sage text-primary-foreground",
    bg: "from-sage/20 to-secondary/10",
    endsIn: "12d 8h",
    cost: 120,
    pity: 0,
    rates: { Legendary: 5, Rare: 30, Common: 65 },
    pool: [
      { name: "Blossom Aura", rarity: "Legendary", visual: "🌸" },
      { name: "Petal Crown", rarity: "Rare", visual: "🌺" },
      { name: "Vine Frame", rarity: "Rare", visual: "🌿" },
      { name: "Dewdrop Badge", rarity: "Rare", visual: "💧" },
      { name: "Garden Badge", rarity: "Common", visual: "🌱" },
      { name: "Leaf Sticker", rarity: "Common", visual: "🍃" },
      { name: "Daisy Ring", rarity: "Common", visual: "🌼" },
    ],
  },
  {
    id: 3,
    name: "Neon Nights",
    tag: "NEW",
    tagColor: "bg-accent text-accent-foreground",
    bg: "from-accent/15 to-primary/10",
    endsIn: "20d 2h",
    cost: 180,
    pity: 0,
    rates: { Legendary: 3, Rare: 22, Common: 75 },
    pool: [
      { name: "Neon Halo", rarity: "Legendary", visual: "💜" },
      { name: "Cyber Visor", rarity: "Legendary", visual: "🕶️" },
      { name: "Glow Skin", rarity: "Rare", visual: "✨" },
      { name: "Pulse Frame", rarity: "Rare", visual: "💠" },
      { name: "Pixel Shades", rarity: "Common", visual: "🟪" },
      { name: "Circuit Badge", rarity: "Common", visual: "⚡" },
      { name: "Byte Ring", rarity: "Common", visual: "💿" },
    ],
  },
];

const rarityColors: Record<string, string> = {
  Legendary: "from-blob-yellow/50 to-blob-coral/40",
  Rare: "from-blob-lavender/50 to-blob-blue/40",
  Common: "from-muted to-muted/60",
};

const rarityTextColor: Record<string, string> = {
  Legendary: "text-warm-gold",
  Rare: "text-secondary",
  Common: "text-muted-foreground",
};

const rarityGlow: Record<string, string> = {
  Legendary: "shadow-[0_0_40px_hsl(var(--warm-gold)/0.5)]",
  Rare: "shadow-[0_0_30px_hsl(var(--secondary)/0.4)]",
  Common: "",
};

type PullPhase = "idle" | "spinning" | "reveal";

const StationPage = () => {
  const [points, setPoints] = useState(1250);
  const [activeBanner, setActiveBanner] = useState(0);
  const [phase, setPhase] = useState<PullPhase>("idle");
  const [pulledItem, setPulledItem] = useState<GachaItem | null>(null);
  const [history, setHistory] = useState<GachaItem[]>([]);

  const doPull = useCallback(() => {
    const banner = banners[activeBanner];
    if (points < banner.cost || phase !== "idle") return;

    setPoints((p) => p - banner.cost);
    setPhase("spinning");

    // Determine rarity via weighted random
    const roll = Math.random() * 100;
    let rarity: "Legendary" | "Rare" | "Common";
    if (roll < banner.rates.Legendary) rarity = "Legendary";
    else if (roll < banner.rates.Legendary + banner.rates.Rare) rarity = "Rare";
    else rarity = "Common";

    const pool = banner.pool.filter((i) => i.rarity === rarity);
    const item = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      setPulledItem(item);
      setPhase("reveal");
      setHistory((prev) => [item, ...prev.slice(0, 9)]);
    }, 1800);
  }, [activeBanner, points, phase]);

  const closePull = () => {
    setPhase("idle");
    setPulledItem(null);
  };

  const banner = banners[activeBanner];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Station</h1>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-soft border border-border">
          <Coins className="w-4 h-4 text-warm-gold" />
          <span className="text-sm font-bold text-foreground tabular-nums">{points.toLocaleString()}</span>
        </div>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Pull from banners to win cosmetics! Legendary drops are rare — good luck! 🍀" />
      </div>

      {/* Banner selector tabs */}
      <div className="flex gap-2 px-6 mt-4 overflow-x-auto no-scrollbar">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setActiveBanner(i)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              i === activeBanner ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${b.tagColor}`}>{b.tag}</span>
            {b.name}
          </button>
        ))}
      </div>

      {/* Active banner card */}
      <motion.div
        key={banner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mx-6 mt-4 bg-gradient-to-br ${banner.bg} rounded-3xl border border-border overflow-hidden shadow-soft`}
      >
        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Ends in {banner.endsIn}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{banner.name}</h2>

          {/* Rate display */}
          <div className="flex justify-center gap-3 mb-4">
            {(["Legendary", "Rare", "Common"] as const).map((r) => (
              <span key={r} className={`text-[10px] font-bold ${rarityTextColor[r]}`}>
                {r === "Legendary" ? "★" : r === "Rare" ? "◆" : "●"} {banner.rates[r]}%
              </span>
            ))}
          </div>

          {/* Pull button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={doPull}
            disabled={points < banner.cost || phase !== "idle"}
            className={`w-full py-4 rounded-full text-base font-bold transition-colors relative overflow-hidden ${
              points < banner.cost
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground shadow-pop"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              Pull ×1
              <span className="flex items-center gap-0.5 bg-card/20 px-2 py-0.5 rounded-full text-xs">
                <Coins className="w-3 h-3" /> {banner.cost}
              </span>
            </span>
          </motion.button>
        </div>

        {/* Item pool preview */}
        <div className="px-4 pb-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2">Available in this banner:</p>
          <div className="flex flex-wrap gap-1.5">
            {banner.pool.map((item) => (
              <span
                key={item.name}
                className={`inline-flex items-center gap-1 bg-card/70 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-semibold ${rarityTextColor[item.rarity]}`}
              >
                {item.visual} {item.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pull history */}
      {history.length > 0 && (
        <div className="px-6 mt-5">
          <h3 className="text-sm font-bold text-foreground mb-2">Recent Pulls</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {history.map((item, i) => (
              <motion.div
                key={`${item.name}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex-shrink-0 w-16 h-20 rounded-xl bg-gradient-to-br ${rarityColors[item.rarity]} flex flex-col items-center justify-center gap-1 border border-border`}
              >
                <span className="text-xl">{item.visual}</span>
                <span className={`text-[8px] font-bold ${rarityTextColor[item.rarity]}`}>{item.rarity}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="pb-28" />

      {/* Gacha animation overlay */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={phase === "reveal" ? closePull : undefined}
          >
            {phase === "spinning" && (
              <motion.div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                >
                  <Gift className="w-20 h-20 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-lg font-bold text-card"
                >
                  Opening...
                </motion.div>
              </motion.div>
            )}

            {phase === "reveal" && pulledItem && (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 12 }}
                className={`bg-card rounded-3xl p-8 text-center mx-8 ${rarityGlow[pulledItem.rarity]}`}
              >
                {/* Rarity burst */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-3"
                >
                  {pulledItem.visual}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className={`text-xs font-bold mb-1 ${rarityTextColor[pulledItem.rarity]}`}>
                    {pulledItem.rarity === "Legendary" ? "★ LEGENDARY ★" : pulledItem.rarity === "Rare" ? "◆ RARE ◆" : "● COMMON ●"}
                  </p>
                  <h3 className="text-xl font-bold text-foreground">{pulledItem.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2">Tap anywhere to close</p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationPage;
