import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles, Palette, Check } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar, { BlobShape, BlobColor, Mood } from "@/components/BlobChar";

interface CosmeticItem {
  id: number;
  name: string;
  type: "aura" | "frame" | "accessory" | "shape" | "color";
  rarity: "Legendary" | "Rare" | "Common";
  equipped: boolean;
  visual: string;
  // Targeted properties:
  auraColor?: string; // tailwind class fragment
  frameColor?: string; // tailwind class fragment for ring color
  shape?: BlobShape;
  color?: BlobColor;
  mood?: Mood;
}

const inventory: CosmeticItem[] = [
  // Shapes (the character's body shape)
  { id: 100, name: "Round Body", type: "shape", rarity: "Common", equipped: true, visual: "⚪", shape: "round" },
  { id: 101, name: "Star Body", type: "shape", rarity: "Rare", equipped: false, visual: "⭐", shape: "star" },
  { id: 102, name: "Cloud Body", type: "shape", rarity: "Rare", equipped: false, visual: "☁️", shape: "cloud" },
  { id: 103, name: "Pentagon Body", type: "shape", rarity: "Legendary", equipped: false, visual: "🔷", shape: "pentagon" },

  // Colors (palette)
  { id: 200, name: "Sky Blue", type: "color", rarity: "Common", equipped: true, visual: "🟦", color: "blue" },
  { id: 201, name: "Cherry Pink", type: "color", rarity: "Common", equipped: false, visual: "🌸", color: "pink" },
  { id: 202, name: "Mint Green", type: "color", rarity: "Rare", equipped: false, visual: "🍃", color: "mint" },
  { id: 203, name: "Lavender", type: "color", rarity: "Rare", equipped: false, visual: "💜", color: "lavender" },
  { id: 204, name: "Sunset Orange", type: "color", rarity: "Legendary", equipped: false, visual: "🧡", color: "orange" },

  // Auras (background blob)
  { id: 1, name: "Ember Aura", type: "aura", rarity: "Legendary", equipped: true, visual: "🔥", auraColor: "bg-blob-coral/60" },
  { id: 2, name: "Cherry Blossom", type: "aura", rarity: "Legendary", equipped: false, visual: "🌸", auraColor: "bg-blob-pink/60" },
  { id: 3, name: "Neon Aura", type: "aura", rarity: "Rare", equipped: false, visual: "💜", auraColor: "bg-blob-lavender/70" },

  // Frames (ring around character)
  { id: 4, name: "Phoenix Frame", type: "frame", rarity: "Legendary", equipped: false, visual: "🦅", frameColor: "ring-warm-gold" },
  { id: 5, name: "Vine Frame", type: "frame", rarity: "Rare", equipped: false, visual: "🌿", frameColor: "ring-blob-sage" },

  // Accessories (floating emoji above)
  { id: 6, name: "Neon Halo", type: "accessory", rarity: "Legendary", equipped: true, visual: "💜" },
  { id: 7, name: "Petal Crown", type: "accessory", rarity: "Rare", equipped: false, visual: "🌺" },
  { id: 8, name: "Pixel Shades", type: "accessory", rarity: "Common", equipped: false, visual: "🟪" },
  { id: 9, name: "Inferno Crown", type: "accessory", rarity: "Rare", equipped: false, visual: "👑" },
];

const typeFilters = ["all", "shape", "color", "aura", "frame", "accessory"] as const;
const rarityIcon = { Legendary: Crown, Rare: Star, Common: Sparkles };
const rarityColor = { Legendary: "text-warm-gold", Rare: "text-secondary", Common: "text-muted-foreground" };
const rarityBg = {
  Legendary: "from-blob-yellow/40 to-blob-coral/30",
  Rare: "from-blob-lavender/40 to-blob-blue/30",
  Common: "from-muted to-muted/50",
};

const moods: Mood[] = ["happy", "excited", "wink", "sleepy"];

const LockerPage = () => {
  const [items, setItems] = useState(inventory);
  const [filter, setFilter] = useState<typeof typeFilters[number]>("all");
  const [previewMood, setPreviewMood] = useState<Mood>("happy");

  const toggleEquip = (item: CosmeticItem) => {
    setItems((prev) =>
      prev.map((it) => {
        // For shape & color, only one can be equipped at a time
        if ((item.type === "shape" || item.type === "color") && it.type === item.type) {
          return { ...it, equipped: it.id === item.id };
        }
        if (it.id === item.id) return { ...it, equipped: !it.equipped };
        return it;
      })
    );
  };

  const cycleMood = () => {
    const idx = moods.indexOf(previewMood);
    setPreviewMood(moods[(idx + 1) % moods.length]);
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  const equipped = items.filter((i) => i.equipped);
  const equippedShape = equipped.find((i) => i.type === "shape")?.shape || "round";
  const equippedColor = equipped.find((i) => i.type === "color")?.color || "blue";
  const equippedAura = equipped.find((i) => i.type === "aura");
  const equippedFrame = equipped.find((i) => i.type === "frame");
  const equippedAccessories = equipped.filter((i) => i.type === "accessory");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Locker</h1>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-soft border border-border">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{equipped.length} equipped</span>
        </div>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble
          mood={previewMood}
          message="Mix shapes, colors and accessories to make Syn truly yours! Tap me in the preview to change my mood ✨"
        />
      </div>

      {/* Character Preview */}
      <div className="mx-6 mt-5 bg-gradient-to-br from-cream to-blob-pink/15 rounded-3xl border border-border p-6 text-center relative overflow-hidden shadow-soft">
        {/* Aura blob */}
        {equippedAura && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 blob-shape ${equippedAura.auraColor} blur-xl`}
          />
        )}

        <div className="relative z-10">
          {/* Floating accessories */}
          <div className="flex justify-center gap-3 mb-1 h-7">
            {equippedAccessories.map((acc, i) => (
              <motion.span
                key={acc.id}
                animate={{ y: [0, -5, 0], rotate: [0, i % 2 === 0 ? 12 : -12, 0] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
                className="text-2xl"
              >
                {acc.visual}
              </motion.span>
            ))}
          </div>

          {/* Character with optional frame */}
          <div
            className={`inline-block rounded-full p-1 ${
              equippedFrame ? `ring-4 ring-offset-2 ring-offset-card ${equippedFrame.frameColor}` : ""
            }`}
          >
            <BlobChar
              shape={equippedShape}
              color={equippedColor}
              mood={previewMood}
              size={120}
              onClick={cycleMood}
              label="Your character"
            />
          </div>

          <p className="text-base font-bold text-foreground mt-2">Your Syn</p>
          <p className="text-[10px] text-muted-foreground">Tap to change mood</p>

          {/* Equipped chips */}
          <div className="flex flex-wrap gap-1 justify-center mt-3">
            {equipped.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 bg-card/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-semibold ${rarityColor[item.rarity]} border border-border`}
              >
                {item.visual} {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 px-6 mt-5 overflow-x-auto no-scrollbar">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${
              filter === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-4 pb-32">
        {filtered.map((item) => {
          const Icon = rarityIcon[item.rarity];
          return (
            <motion.button
              key={item.id}
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleEquip(item)}
              className={`relative bg-gradient-to-br ${rarityBg[item.rarity]} rounded-3xl p-3 text-left border-2 transition-all ${
                item.equipped ? "border-primary shadow-soft" : "border-transparent"
              }`}
            >
              {item.equipped && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 z-10">
                  <Check className="w-3 h-3" />
                </span>
              )}

              {/* Visual preview - actual character preview for shape/color */}
              <div className="w-full h-20 rounded-2xl bg-card/60 flex items-center justify-center mb-2">
                {item.type === "shape" ? (
                  <BlobChar shape={item.shape!} color="blue" mood="happy" size={56} bounce={false} />
                ) : item.type === "color" ? (
                  <BlobChar shape="round" color={item.color!} mood="happy" size={56} bounce={false} />
                ) : (
                  <span className="text-3xl">{item.visual}</span>
                )}
              </div>

              <p className="text-xs font-bold text-foreground leading-tight">{item.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Icon className={`w-3 h-3 ${rarityColor[item.rarity]}`} />
                <p className={`text-[9px] font-semibold ${rarityColor[item.rarity]}`}>
                  {item.rarity} · {item.type}
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
