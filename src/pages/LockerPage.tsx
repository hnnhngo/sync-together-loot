import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Sparkles, Palette, Check } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import synMascot from "@/assets/syn-mascot.png";

interface CosmeticItem {
  id: number;
  name: string;
  type: "aura" | "frame" | "accessory" | "alarm";
  rarity: "Legendary" | "Rare" | "Common";
  equipped: boolean;
  visual: string;
  auraColor?: string;
  frameColor?: string;
}

const inventory: CosmeticItem[] = [
  { id: 1, name: "Ember Aura", type: "aura", rarity: "Legendary", equipped: true, visual: "🔥", auraColor: "from-coral/50 to-warm-gold/30" },
  { id: 2, name: "Cherry Blossom Aura", type: "aura", rarity: "Legendary", equipped: false, visual: "🌸", auraColor: "from-primary/40 to-accent/30" },
  { id: 3, name: "Neon Aura", type: "aura", rarity: "Rare", equipped: false, visual: "💜", auraColor: "from-accent/50 to-secondary/40" },
  { id: 4, name: "Phoenix Frame", type: "frame", rarity: "Legendary", equipped: true, visual: "🦅", frameColor: "ring-warm-gold" },
  { id: 5, name: "Vine Frame", type: "frame", rarity: "Rare", equipped: false, visual: "🌿", frameColor: "ring-sage" },
  { id: 6, name: "Neon Halo", type: "accessory", rarity: "Legendary", equipped: true, visual: "💜" },
  { id: 7, name: "Petal Crown", type: "accessory", rarity: "Rare", equipped: false, visual: "🌺" },
  { id: 8, name: "Pixel Shades", type: "accessory", rarity: "Common", equipped: false, visual: "🟪" },
  { id: 9, name: "Inferno Crown", type: "accessory", rarity: "Rare", equipped: false, visual: "👑" },
  { id: 10, name: "Study Chime", type: "alarm", rarity: "Common", equipped: true, visual: "🔔" },
  { id: 11, name: "Flame Trail", type: "aura", rarity: "Common", equipped: false, visual: "💨", auraColor: "from-coral/20 to-muted" },
  { id: 12, name: "Circuit Badge", type: "accessory", rarity: "Common", equipped: false, visual: "⚡" },
];

const typeFilters = ["all", "aura", "frame", "accessory", "alarm"] as const;
const rarityIcon = { Legendary: Crown, Rare: Star, Common: Sparkles };
const rarityColor = { Legendary: "text-warm-gold", Rare: "text-secondary", Common: "text-muted-foreground" };
const rarityBg = {
  Legendary: "from-warm-gold/30 to-coral/20",
  Rare: "from-secondary/20 to-accent/15",
  Common: "from-muted/60 to-muted/30",
};

const LockerPage = () => {
  const [items, setItems] = useState(inventory);
  const [filter, setFilter] = useState<typeof typeFilters[number]>("all");

  const toggleEquip = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, equipped: !item.equipped } : item)));
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  const equipped = items.filter((i) => i.equipped);
  const equippedAura = equipped.find((i) => i.type === "aura");
  const equippedFrame = equipped.find((i) => i.type === "frame");
  const equippedAccessories = equipped.filter((i) => i.type === "accessory");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Locker</h1>
        <Palette className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Equip cosmetics to customize Syn! Auras glow around you, frames change your border, accessories float nearby! 🎨" />
      </div>

      {/* Character Preview */}
      <div className="mx-6 mt-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl border border-border p-6 text-center relative overflow-hidden">
        {/* Aura effect */}
        {equippedAura && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className={`absolute inset-0 m-auto w-40 h-40 rounded-full bg-gradient-to-br ${equippedAura.auraColor} blur-2xl`}
          />
        )}

        {/* Secondary aura pulse */}
        {equippedAura?.rarity === "Legendary" && (
          <motion.div
            animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
            className={`absolute inset-0 m-auto w-48 h-48 rounded-full bg-gradient-to-br ${equippedAura.auraColor} blur-3xl`}
          />
        )}

        <div className="relative z-10">
          {/* Floating accessories above */}
          <div className="flex justify-center gap-4 mb-2 h-8">
            {equippedAccessories.map((acc, i) => (
              <motion.span
                key={acc.id}
                animate={{ y: [0, -5, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
                className="text-2xl"
              >
                {acc.visual}
              </motion.span>
            ))}
          </div>

          {/* Character with frame */}
          <div className={`inline-block rounded-full p-1 ${equippedFrame ? `ring-4 ${equippedFrame.frameColor}` : ""}`}>
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-card to-muted/50 flex items-center justify-center overflow-hidden">
              <img src={synMascot} alt="Your character" className="w-24 h-24" />
            </div>
          </div>

          {/* Name plate */}
          <p className="text-base font-bold text-foreground mt-2">Your Syn</p>

          {/* Equipped summary */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {equipped.map((item) => {
              const Icon = rarityIcon[item.rarity];
              return (
                <span
                  key={item.id}
                  className={`inline-flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-semibold ${rarityColor[item.rarity]}`}
                >
                  {item.visual} {item.name}
                </span>
              );
            })}
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
              filter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-4 pb-28">
        {filtered.map((item) => {
          const Icon = rarityIcon[item.rarity];
          return (
            <motion.button
              key={item.id}
              layout
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleEquip(item.id)}
              className={`relative bg-gradient-to-br ${rarityBg[item.rarity]} rounded-2xl p-4 text-left border transition-all ${
                item.equipped ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {item.equipped && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </span>
              )}

              {/* Visual preview */}
              <div className="w-12 h-12 rounded-xl bg-card/50 flex items-center justify-center text-2xl mb-2">
                {item.visual}
              </div>

              <p className="text-sm font-bold text-foreground">{item.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Icon className={`w-3 h-3 ${rarityColor[item.rarity]}`} />
                <p className={`text-[10px] font-semibold ${rarityColor[item.rarity]}`}>
                  {item.rarity} · {item.type}
                </p>
              </div>

              {/* Type-specific hint */}
              {item.type === "aura" && (
                <div className={`w-full h-1 rounded-full mt-2 bg-gradient-to-r ${item.auraColor || "from-muted to-muted"}`} />
              )}
              {item.type === "frame" && (
                <div className={`w-6 h-6 rounded-full mt-2 border-2 ${item.frameColor || "border-muted"}`} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LockerPage;
