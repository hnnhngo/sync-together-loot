import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles, Palette, Check, Flame } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar, { BlobShape, BlobColor, Mood, HatKey, OutfitKey, GlassesKey } from "@/components/BlobChar";
import { cosmeticsStore, useCosmetics, STREAK_COLORS, StreakColorKey } from "@/lib/cosmetics-store";

type CosmeticType = "shape" | "color" | "hat" | "outfit" | "glasses" | "streakColor" | "frame" | "aura";

interface CosmeticItem {
  id: number;
  name: string;
  type: CosmeticType;
  rarity: "Legendary" | "Rare" | "Common";
  shape?: BlobShape;
  color?: BlobColor;
  hat?: HatKey;
  outfit?: OutfitKey;
  glasses?: GlassesKey;
  streakColor?: StreakColorKey;
  frameClass?: string;
  auraClass?: string;
}

const inventory: CosmeticItem[] = [
  // Animals (shape)
  { id: 10, name: "Capybara (Syn)", type: "shape", rarity: "Legendary", shape: "capybara" },
  { id: 11, name: "Bunny", type: "shape", rarity: "Common", shape: "bunny" },
  { id: 12, name: "Bear", type: "shape", rarity: "Common", shape: "bear" },
  { id: 13, name: "Cat", type: "shape", rarity: "Common", shape: "cat" },
  { id: 14, name: "Frog", type: "shape", rarity: "Rare", shape: "frog" },
  { id: 15, name: "Fox", type: "shape", rarity: "Rare", shape: "fox" },
  { id: 16, name: "Chick", type: "shape", rarity: "Rare", shape: "chick" },
  { id: 17, name: "Panda", type: "shape", rarity: "Legendary", shape: "panda" },

  // Colors
  { id: 20, name: "Sky Blue", type: "color", rarity: "Common", color: "blue" },
  { id: 21, name: "Cherry Pink", type: "color", rarity: "Common", color: "pink" },
  { id: 22, name: "Mint Green", type: "color", rarity: "Rare", color: "mint" },
  { id: 23, name: "Lavender", type: "color", rarity: "Rare", color: "lavender" },
  { id: 24, name: "Sunset", type: "color", rarity: "Legendary", color: "orange" },
  { id: 25, name: "Sage", type: "color", rarity: "Rare", color: "sage" },
  { id: 26, name: "Coral", type: "color", rarity: "Rare", color: "coral" },
  { id: 27, name: "Buttercup", type: "color", rarity: "Common", color: "yellow" },

  // Hats
  { id: 30, name: "Royal Crown", type: "hat", rarity: "Legendary", hat: "crown" },
  { id: 31, name: "Cozy Beanie", type: "hat", rarity: "Common", hat: "beanie" },
  { id: 32, name: "Top Hat", type: "hat", rarity: "Rare", hat: "topHat" },
  { id: 33, name: "Flower Crown", type: "hat", rarity: "Rare", hat: "flowerCrown" },
  { id: 34, name: "Halo", type: "hat", rarity: "Legendary", hat: "halo" },
  { id: 35, name: "Grad Cap", type: "hat", rarity: "Rare", hat: "graduationCap" },
  { id: 36, name: "Neon Visor (Cyber Collab)", type: "hat", rarity: "Legendary", hat: "neonVisor" },

  // Outfits / Collabs
  { id: 40, name: "Cozy Scarf", type: "outfit", rarity: "Common", outfit: "scarf" },
  { id: 41, name: "Hero Cape", type: "outfit", rarity: "Legendary", outfit: "cape" },
  { id: 42, name: "Bowtie", type: "outfit", rarity: "Common", outfit: "bowtie" },
  { id: 43, name: "Astronaut (Space Collab)", type: "outfit", rarity: "Legendary", outfit: "spaceCollab" },
  { id: 44, name: "Kawaii Apron (Cafe Collab)", type: "outfit", rarity: "Rare", outfit: "kawaiiApron" },

  // Glasses
  { id: 50, name: "Round Glasses", type: "glasses", rarity: "Common", glasses: "round" },
  { id: 51, name: "Cool Shades", type: "glasses", rarity: "Rare", glasses: "shades" },
  { id: 52, name: "Heart Eyes", type: "glasses", rarity: "Legendary", glasses: "heart" },

  // Streak Colors
  { id: 60, name: "Ember Streak", type: "streakColor", rarity: "Common", streakColor: "ember" },
  { id: 61, name: "Rose Streak", type: "streakColor", rarity: "Common", streakColor: "rose" },
  { id: 62, name: "Violet Streak", type: "streakColor", rarity: "Rare", streakColor: "violet" },
  { id: 63, name: "Sky Streak", type: "streakColor", rarity: "Rare", streakColor: "sky" },
  { id: 64, name: "Emerald Streak", type: "streakColor", rarity: "Legendary", streakColor: "emerald" },
  { id: 65, name: "Gold Streak", type: "streakColor", rarity: "Legendary", streakColor: "gold" },
];

const typeFilters: { key: "all" | CosmeticType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "shape", label: "Animal" },
  { key: "color", label: "Color" },
  { key: "hat", label: "Hat" },
  { key: "outfit", label: "Outfit" },
  { key: "glasses", label: "Glasses" },
  { key: "streakColor", label: "Streak" },
];

const rarityIcon = { Legendary: Crown, Rare: Star, Common: Sparkles };
const rarityColor = { Legendary: "text-warm-gold", Rare: "text-secondary", Common: "text-muted-foreground" };
const rarityBg = {
  Legendary: "from-blob-yellow/40 to-blob-coral/30",
  Rare: "from-blob-lavender/40 to-blob-blue/30",
  Common: "from-muted to-muted/50",
};

const moods: Mood[] = ["happy", "excited", "wink", "sleepy"];

const LockerPage = () => {
  const cosmetics = useCosmetics();
  const [filter, setFilter] = useState<"all" | CosmeticType>("all");
  const [previewMood, setPreviewMood] = useState<Mood>("happy");

  // Determine if an item is currently equipped based on the global cosmetics state
  const isEquipped = (item: CosmeticItem): boolean => {
    if (item.type === "shape") return cosmetics.shape === item.shape;
    if (item.type === "color") return cosmetics.color === item.color;
    if (item.type === "hat") return cosmetics.hat === item.hat;
    if (item.type === "outfit") return cosmetics.outfit === item.outfit;
    if (item.type === "glasses") return cosmetics.glasses === item.glasses;
    if (item.type === "streakColor") return cosmetics.streakColor === item.streakColor;
    return false;
  };

  const toggleEquip = (item: CosmeticItem) => {
    const equipped = isEquipped(item);
    switch (item.type) {
      case "shape":
        if (item.shape) cosmeticsStore.set({ shape: item.shape });
        break;
      case "color":
        if (item.color) cosmeticsStore.set({ color: item.color });
        break;
      case "hat":
        cosmeticsStore.set({ hat: equipped ? "none" : item.hat! });
        break;
      case "outfit":
        cosmeticsStore.set({ outfit: equipped ? "none" : item.outfit! });
        break;
      case "glasses":
        cosmeticsStore.set({ glasses: equipped ? "none" : item.glasses! });
        break;
      case "streakColor":
        if (item.streakColor) cosmeticsStore.set({ streakColor: item.streakColor });
        break;
    }
  };

  const cycleMood = () => {
    const idx = moods.indexOf(previewMood);
    setPreviewMood(moods[(idx + 1) % moods.length]);
  };

  const filtered = filter === "all" ? inventory : inventory.filter((i) => i.type === filter);
  const equippedCount = inventory.filter(isEquipped).length;
  const equippedStreak = STREAK_COLORS[cosmetics.streakColor];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Locker</h1>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-soft border border-border">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{equippedCount} equipped</span>
        </div>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble
          mood={previewMood}
          message="Mix animals, hats, glasses, outfits, and streak colors to make Syn truly yours! Tap to change my mood ✨"
        />
      </div>

      {/* Character Preview */}
      <div className={`mx-6 mt-5 bg-gradient-to-br from-cream ${equippedStreak.tintClass} rounded-3xl border border-border p-6 text-center relative overflow-hidden shadow-soft`}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 blob-shape ${equippedStreak.tintClass} blur-xl`}
        />

        <div className="relative z-10">
          <div className="inline-block">
            <BlobChar
              shape={cosmetics.shape}
              color={cosmetics.color}
              hat={cosmetics.hat}
              outfit={cosmetics.outfit}
              glasses={cosmetics.glasses}
              mood={previewMood}
              size={140}
              onClick={cycleMood}
              label="Your character"
            />
          </div>

          <p className="text-base font-bold text-foreground mt-2">Your Syn</p>
          <p className="text-[10px] text-muted-foreground">Tap to change mood</p>

          {/* Streak preview */}
          <div className="inline-flex items-center gap-1.5 bg-card rounded-full px-3 py-1 mt-3 border border-border">
            <Flame className={`w-4 h-4 ${equippedStreak.flameClass}`} fill="currentColor" />
            <span className="text-xs font-bold text-foreground">{equippedStreak.name} streak</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 px-6 mt-5 overflow-x-auto no-scrollbar">
        {typeFilters.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filter === t.key ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-4 pb-32">
        {filtered.map((item) => {
          const Icon = rarityIcon[item.rarity];
          const equipped = isEquipped(item);
          return (
            <motion.button
              key={item.id}
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleEquip(item)}
              className={`relative bg-gradient-to-br ${rarityBg[item.rarity]} rounded-3xl p-3 text-left border-2 transition-all ${
                equipped ? "border-primary shadow-soft" : "border-transparent"
              }`}
            >
              {equipped && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 z-10">
                  <Check className="w-3 h-3" />
                </span>
              )}

              {/* Visual preview */}
              <div className="w-full h-24 rounded-2xl bg-card/60 flex items-center justify-center mb-2 overflow-hidden">
                {item.type === "shape" ? (
                  <BlobChar shape={item.shape!} color={cosmetics.color} mood="happy" size={68} bounce={false} />
                ) : item.type === "color" ? (
                  <BlobChar shape={cosmetics.shape} color={item.color!} mood="happy" size={68} bounce={false} />
                ) : item.type === "hat" ? (
                  <BlobChar shape={cosmetics.shape} color={cosmetics.color} hat={item.hat!} mood="happy" size={68} bounce={false} />
                ) : item.type === "outfit" ? (
                  <BlobChar shape={cosmetics.shape} color={cosmetics.color} outfit={item.outfit!} mood="happy" size={68} bounce={false} />
                ) : item.type === "glasses" ? (
                  <BlobChar shape={cosmetics.shape} color={cosmetics.color} glasses={item.glasses!} mood="happy" size={68} bounce={false} />
                ) : item.type === "streakColor" ? (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${STREAK_COLORS[item.streakColor!].from}, ${STREAK_COLORS[item.streakColor!].to})` }}
                  >
                    <Flame className="w-7 h-7 text-white" fill="white" />
                  </div>
                ) : null}
              </div>

              <p className="text-xs font-bold text-foreground leading-tight">{item.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Icon className={`w-3 h-3 ${rarityColor[item.rarity]}`} />
                <p className={`text-[9px] font-semibold ${rarityColor[item.rarity]}`}>
                  {item.rarity} · {item.type === "streakColor" ? "streak" : item.type}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LockerPage;
