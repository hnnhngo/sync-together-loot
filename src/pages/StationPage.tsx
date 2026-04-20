import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Timer, Gift } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar, { HatKey, OutfitKey, GlassesKey, BlobShape, BlobColor } from "@/components/BlobChar";
import { cosmeticsStore, STREAK_COLORS, StreakColorKey } from "@/lib/cosmetics-store";

type Rarity = "Legendary" | "Rare" | "Common";

interface GachaItem {
  name: string;
  rarity: Rarity;
  /** Which slot the cosmetic equips into. */
  slot: "hat" | "outfit" | "glasses" | "streakColor" | "shape" | "color";
  hat?: HatKey;
  outfit?: OutfitKey;
  glasses?: GlassesKey;
  streakColor?: StreakColorKey;
  shape?: BlobShape;
  color?: BlobColor;
}

interface Banner {
  id: number;
  name: string;
  tag: string;
  tagColor: string;
  bg: string;
  endsIn: string;
  cost: number;
  /** Preview character for the banner art. */
  previewShape: BlobShape;
  previewColor: BlobColor;
  previewHat?: HatKey;
  previewOutfit?: OutfitKey;
  previewGlasses?: GlassesKey;
  pool: GachaItem[];
  rates: { Legendary: number; Rare: number; Common: number };
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
    previewShape: "fox",
    previewColor: "orange",
    previewHat: "graduationCap",
    previewOutfit: "cape",
    rates: { Legendary: 5, Rare: 25, Common: 70 },
    pool: [
      { name: "Ember Streak",  rarity: "Legendary", slot: "streakColor", streakColor: "ember" },
      { name: "Hero Cape",     rarity: "Legendary", slot: "outfit", outfit: "cape" },
      { name: "Royal Crown",   rarity: "Rare",      slot: "hat", hat: "crown" },
      { name: "Grad Cap",      rarity: "Rare",      slot: "hat", hat: "graduationCap" },
      { name: "Cool Shades",   rarity: "Rare",      slot: "glasses", glasses: "shades" },
      { name: "Cozy Beanie",   rarity: "Common",    slot: "hat", hat: "beanie" },
      { name: "Cozy Scarf",    rarity: "Common",    slot: "outfit", outfit: "scarf" },
      { name: "Round Glasses", rarity: "Common",    slot: "glasses", glasses: "round" },
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
    previewShape: "bunny",
    previewColor: "mint",
    previewHat: "flowerCrown",
    previewOutfit: "kawaiiApron",
    rates: { Legendary: 5, Rare: 30, Common: 65 },
    pool: [
      { name: "Emerald Streak",  rarity: "Legendary", slot: "streakColor", streakColor: "emerald" },
      { name: "Kawaii Apron",    rarity: "Legendary", slot: "outfit", outfit: "kawaiiApron" },
      { name: "Flower Crown",    rarity: "Rare",      slot: "hat", hat: "flowerCrown" },
      { name: "Halo",            rarity: "Rare",      slot: "hat", hat: "halo" },
      { name: "Heart Eyes",      rarity: "Rare",      slot: "glasses", glasses: "heart" },
      { name: "Bowtie",          rarity: "Common",    slot: "outfit", outfit: "bowtie" },
      { name: "Rose Streak",     rarity: "Common",    slot: "streakColor", streakColor: "rose" },
      { name: "Round Glasses",   rarity: "Common",    slot: "glasses", glasses: "round" },
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
    previewShape: "cat",
    previewColor: "lavender",
    previewHat: "neonVisor",
    previewGlasses: "shades",
    rates: { Legendary: 3, Rare: 22, Common: 75 },
    pool: [
      { name: "Neon Visor",     rarity: "Legendary", slot: "hat", hat: "neonVisor" },
      { name: "Violet Streak",  rarity: "Legendary", slot: "streakColor", streakColor: "violet" },
      { name: "Top Hat",        rarity: "Rare",      slot: "hat", hat: "topHat" },
      { name: "Cool Shades",    rarity: "Rare",      slot: "glasses", glasses: "shades" },
      { name: "Sky Streak",     rarity: "Rare",      slot: "streakColor", streakColor: "sky" },
      { name: "Cozy Beanie",    rarity: "Common",    slot: "hat", hat: "beanie" },
      { name: "Round Glasses",  rarity: "Common",    slot: "glasses", glasses: "round" },
    ],
  },
];

const rarityTextColor: Record<Rarity, string> = {
  Legendary: "text-warm-gold",
  Rare: "text-secondary",
  Common: "text-muted-foreground",
};

const rarityGlow: Record<Rarity, string> = {
  Legendary: "shadow-[0_0_40px_hsl(var(--warm-gold)/0.5)]",
  Rare: "shadow-[0_0_30px_hsl(var(--secondary)/0.4)]",
  Common: "",
};

const rarityRing: Record<Rarity, string> = {
  Legendary: "ring-2 ring-warm-gold/60",
  Rare: "ring-2 ring-secondary/50",
  Common: "ring-1 ring-border",
};

/** Render a tiny BlobChar preview tinted to show only the cosmetic accessory. */
const ItemPreview = ({ item, size = 56 }: { item: GachaItem; size?: number }) => {
  // Use a neutral cream blob to highlight the accessory.
  const baseProps = {
    shape: "bunny" as BlobShape,
    color: "yellow" as BlobColor,
    mood: "happy" as const,
    size,
    bounce: false,
  };

  if (item.slot === "hat")     return <BlobChar {...baseProps} hat={item.hat} />;
  if (item.slot === "outfit")  return <BlobChar {...baseProps} outfit={item.outfit} />;
  if (item.slot === "glasses") return <BlobChar {...baseProps} glasses={item.glasses} />;
  if (item.slot === "shape")   return <BlobChar {...baseProps} shape={item.shape!} />;
  if (item.slot === "color")   return <BlobChar {...baseProps} color={item.color!} />;
  if (item.slot === "streakColor" && item.streakColor) {
    const sc = STREAK_COLORS[item.streakColor];
    return (
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 30%, ${sc.from}, ${sc.to})`,
          boxShadow: `0 0 12px ${sc.from}88`,
        }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="white" aria-hidden>
          <path d="M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />
        </svg>
      </div>
    );
  }
  return <BlobChar {...baseProps} />;
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

    const roll = Math.random() * 100;
    let rarity: Rarity;
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

  const equipPulled = () => {
    if (!pulledItem) return;
    if (pulledItem.slot === "hat" && pulledItem.hat)               cosmeticsStore.set({ hat: pulledItem.hat });
    else if (pulledItem.slot === "outfit" && pulledItem.outfit)    cosmeticsStore.set({ outfit: pulledItem.outfit });
    else if (pulledItem.slot === "glasses" && pulledItem.glasses)  cosmeticsStore.set({ glasses: pulledItem.glasses });
    else if (pulledItem.slot === "streakColor" && pulledItem.streakColor) cosmeticsStore.set({ streakColor: pulledItem.streakColor });
    else if (pulledItem.slot === "shape" && pulledItem.shape)      cosmeticsStore.set({ shape: pulledItem.shape });
    else if (pulledItem.slot === "color" && pulledItem.color)      cosmeticsStore.set({ color: pulledItem.color });
    closePull();
  };

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
        <MascotBubble message="Pull from banners to win real accessories — hats, outfits, streak auras and more! 🍀" />
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
        {/* Banner hero with character preview wearing the banner's signature look */}
        <div className="relative px-5 pt-5 pb-2 flex items-center justify-center">
          <BlobChar
            shape={banner.previewShape}
            color={banner.previewColor}
            hat={banner.previewHat}
            outfit={banner.previewOutfit}
            glasses={banner.previewGlasses}
            mood="excited"
            size={120}
          />
        </div>

        <div className="px-5 pb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Ends in {banner.endsIn}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{banner.name}</h2>

          <div className="flex justify-center gap-3 mb-4">
            {(["Legendary", "Rare", "Common"] as const).map((r) => (
              <span key={r} className={`text-[10px] font-bold ${rarityTextColor[r]}`}>
                {r === "Legendary" ? "★" : r === "Rare" ? "◆" : "●"} {banner.rates[r]}%
              </span>
            ))}
          </div>

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

        {/* Item pool preview — visual accessory previews instead of emoji */}
        <div className="px-4 pb-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2 px-1">Available accessories:</p>
          <div className="grid grid-cols-4 gap-2">
            {banner.pool.map((item) => (
              <div
                key={item.name}
                className={`bg-card/80 backdrop-blur rounded-2xl p-2 flex flex-col items-center gap-1 ${rarityRing[item.rarity]}`}
              >
                <ItemPreview item={item} size={48} />
                <span className={`text-[9px] font-bold text-center leading-tight ${rarityTextColor[item.rarity]}`}>
                  {item.name}
                </span>
              </div>
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
                className={`flex-shrink-0 w-20 h-24 rounded-xl bg-card flex flex-col items-center justify-center gap-1 ${rarityRing[item.rarity]}`}
              >
                <ItemPreview item={item} size={40} />
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
                onClick={(e) => e.stopPropagation()}
                className={`bg-card rounded-3xl p-6 text-center mx-8 ${rarityGlow[pulledItem.rarity]}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mb-2 flex justify-center"
                >
                  <ItemPreview item={pulledItem} size={120} />
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

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={equipPulled}
                      className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-pop"
                    >
                      Equip now
                    </button>
                    <button
                      onClick={closePull}
                      className="flex-1 py-2.5 rounded-full bg-muted text-foreground text-sm font-bold"
                    >
                      Keep in locker
                    </button>
                  </div>
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
