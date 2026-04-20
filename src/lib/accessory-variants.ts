/**
 * Color-variant catalog for accessories.
 * The "Color Lab" shop in Station rotates a subset of these for purchase.
 * Each variant overrides the default fill of a hat / outfit / glasses.
 */

export type AccessorySlot = "hat" | "outfit" | "glasses";

export interface AccessoryVariant {
  id: string;          // unique id, e.g. "crown:rose"
  slot: AccessorySlot;
  /** Base accessory key it recolors (e.g. "crown", "cape") */
  baseKey: string;
  name: string;
  /** Primary fill (HSL string) used to tint the accessory */
  primary: string;
  /** Secondary accent fill (optional, used by some pieces) */
  accent?: string;
  cost: number;
}

export const ACCESSORY_VARIANTS: AccessoryVariant[] = [
  // Crown variants
  { id: "crown:rose",     slot: "hat", baseKey: "crown", name: "Rose Crown",     primary: "hsl(340 80% 70%)", accent: "hsl(45 90% 65%)",  cost: 220 },
  { id: "crown:violet",   slot: "hat", baseKey: "crown", name: "Violet Crown",   primary: "hsl(265 75% 70%)", accent: "hsl(45 90% 65%)",  cost: 240 },
  { id: "crown:emerald",  slot: "hat", baseKey: "crown", name: "Emerald Crown",  primary: "hsl(160 65% 60%)", accent: "hsl(45 90% 65%)",  cost: 260 },

  // Beanie variants
  { id: "beanie:mint",    slot: "hat", baseKey: "beanie", name: "Mint Beanie",   primary: "hsl(160 55% 70%)", cost: 120 },
  { id: "beanie:lavender",slot: "hat", baseKey: "beanie", name: "Lilac Beanie",  primary: "hsl(265 60% 75%)", cost: 120 },
  { id: "beanie:gold",    slot: "hat", baseKey: "beanie", name: "Gold Beanie",   primary: "hsl(45 85% 65%)",  cost: 150 },

  // Cape variants
  { id: "cape:crimson",   slot: "outfit", baseKey: "cape", name: "Crimson Cape", primary: "hsl(355 70% 50%)", cost: 260 },
  { id: "cape:ocean",     slot: "outfit", baseKey: "cape", name: "Ocean Cape",   primary: "hsl(205 70% 50%)", cost: 240 },
  { id: "cape:forest",    slot: "outfit", baseKey: "cape", name: "Forest Cape",  primary: "hsl(150 50% 40%)", cost: 240 },

  // Scarf variants
  { id: "scarf:mint",     slot: "outfit", baseKey: "scarf", name: "Mint Scarf",  primary: "hsl(160 55% 60%)", cost: 110 },
  { id: "scarf:sky",      slot: "outfit", baseKey: "scarf", name: "Sky Scarf",   primary: "hsl(205 75% 65%)", cost: 110 },

  // Shades variants
  { id: "shades:rose",    slot: "glasses", baseKey: "shades", name: "Rose Shades", primary: "hsl(340 70% 55%)", cost: 130 },
  { id: "shades:gold",    slot: "glasses", baseKey: "shades", name: "Gold Shades", primary: "hsl(45 80% 55%)",  cost: 150 },
];

/** Build a stable rotating subset based on a daily-ish seed. */
export const getRotatingVariants = (seed: number, count = 6): AccessoryVariant[] => {
  const arr = [...ACCESSORY_VARIANTS];
  // Deterministic shuffle via seed
  for (let i = arr.length - 1; i > 0; i--) {
    const r = Math.abs(Math.sin(seed * (i + 1))) * (i + 1);
    const j = Math.floor(r) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
};

export const findVariant = (id: string | undefined) =>
  id ? ACCESSORY_VARIANTS.find((v) => v.id === id) : undefined;
