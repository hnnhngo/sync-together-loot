import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Sparkles, Palette, Check } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import synMascot from "@/assets/syn-mascot.png";

interface CosmeticItem {
  id: number;
  name: string;
  type: "aura" | "frame" | "accessory" | "alarm";
  rarity: "Legendary" | "Rare" | "Common";
  equipped: boolean;
  color: string;
}

const inventory: CosmeticItem[] = [
  { id: 1, name: "Ember Aura", type: "aura", rarity: "Legendary", equipped: true, color: "from-coral/60 to-warm-gold/40" },
  { id: 2, name: "Cherry Blossom Aura", type: "aura", rarity: "Legendary", equipped: false, color: "from-primary/50 to-accent/40" },
  { id: 3, name: "Phoenix Frame", type: "frame", rarity: "Rare", equipped: true, color: "from-warm-gold/50 to-coral/30" },
  { id: 4, name: "Petal Crown", type: "accessory", rarity: "Rare", equipped: false, color: "from-primary/40 to-sage/30" },
  { id: 5, name: "Neon Halo", type: "accessory", rarity: "Legendary", equipped: true, color: "from-accent/50 to-secondary/40" },
  { id: 6, name: "Flame Trail", type: "aura", rarity: "Common", equipped: false, color: "from-coral/30 to-muted" },
  { id: 7, name: "Study Chime", type: "alarm", rarity: "Common", equipped: true, color: "from-secondary/30 to-muted" },
  { id: 8, name: "Pixel Shades", type: "accessory", rarity: "Common", equipped: false, color: "from-muted to-accent/20" },
];

const typeFilters = ["all", "aura", "frame", "accessory", "alarm"] as const;
const rarityIcon = { Legendary: Crown, Rare: Star, Common: Sparkles };
const rarityColor = { Legendary: "text-warm-gold", Rare: "text-secondary", Common: "text-muted-foreground" };

const LockerPage = () => {
  const [items, setItems] = useState(inventory);
  const [filter, setFilter] = useState<typeof typeFilters[number]>("all");

  const toggleEquip = (id: number) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, equipped: !item.equipped } : item)));

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  const equipped = items.filter((i) => i.equipped);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Locker</h1>
        <Palette className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="This is YOUR locker! Equip cosmetics to customize your look. Flex those limited items! 🎨" />
      </div>

      {/* Character Preview */}
      <div className="mx-6 mt-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl border border-border p-6 text-center relative overflow-hidden">
        {/* Aura ring effect */}
        {equipped.some((e) => e.type === "aura") && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 to-warm-gold/20 blur-xl"
          />
        )}
        <img src={synMascot} alt="Your character" className="w-32 h-32 mx-auto relative z-10" />

        {/* Equipped tags */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 relative z-10">
          {equipped.map((item) => {
            const Icon = rarityIcon[item.rarity];
            return (
              <span
                key={item.id}
                className={`flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-semibold ${rarityColor[item.rarity]}`}
              >
                <Icon className="w-3 h-3" /> {item.name}
              </span>
            );
          })}
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
              className={`relative bg-gradient-to-br ${item.color} rounded-2xl p-4 text-left border transition-colors ${
                item.equipped ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {item.equipped && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <Icon className={`w-6 h-6 ${rarityColor[item.rarity]} mb-2`} />
              <p className="text-sm font-bold text-foreground">{item.name}</p>
              <p className={`text-[10px] font-semibold ${rarityColor[item.rarity]}`}>{item.rarity} · {item.type}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LockerPage;
