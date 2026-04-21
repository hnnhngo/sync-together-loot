import { motion } from "framer-motion";

type BlobShape =
  | "capybara"
  | "bunny"
  | "bear"
  | "frog"
  | "cat"
  | "fox"
  | "chick"
  | "panda"
  | "penguin"
  | "hamster"
  | "axolotl"
  | "dog"
  | "owl"
  | "sheep"
  | "dino"
  | "otter";
type BlobColor = "pink" | "blue" | "mint" | "orange" | "yellow" | "lavender" | "coral" | "sage";
type Mood = "happy" | "sleepy" | "excited" | "wink" | "sad";

interface BlobCharProps {
  shape?: BlobShape;
  color?: BlobColor;
  mood?: Mood;
  size?: number;
  className?: string;
  bounce?: boolean;
  onClick?: () => void;
  label?: string;
  /** Render the iconic Syn capybara (pink + blue). Overrides shape/color. */
  isSyn?: boolean;
  /** Optional outfit/hat/glasses cosmetic overlay key */
  hat?: HatKey;
  outfit?: OutfitKey;
  glasses?: GlassesKey;
  /** Optional color overrides for accessories (HSL strings). */
  hatTint?: string;
  outfitTint?: string;
  glassesTint?: string;
}

type HatKey =
  | "none"
  | "crown"
  | "beanie"
  | "topHat"
  | "flowerCrown"
  | "halo"
  | "graduationCap"
  | "neonVisor";
type OutfitKey = "none" | "scarf" | "cape" | "bowtie" | "spaceCollab" | "kawaiiApron";
type GlassesKey = "none" | "round" | "shades" | "heart";

const colorMap: Record<BlobColor, { fill: string; stroke: string; deep: string }> = {
  pink:     { fill: "hsl(var(--blob-pink))",     stroke: "hsl(340 35% 45%)", deep: "hsl(340 60% 78%)" },
  blue:     { fill: "hsl(var(--blob-blue))",     stroke: "hsl(210 35% 40%)", deep: "hsl(210 55% 72%)" },
  mint:     { fill: "hsl(var(--blob-mint))",     stroke: "hsl(160 30% 35%)", deep: "hsl(160 40% 70%)" },
  orange:   { fill: "hsl(var(--blob-orange))",   stroke: "hsl(20 40% 40%)",  deep: "hsl(20 60% 75%)"  },
  yellow:   { fill: "hsl(var(--blob-yellow))",   stroke: "hsl(38 45% 40%)",  deep: "hsl(38 65% 72%)"  },
  lavender: { fill: "hsl(var(--blob-lavender))", stroke: "hsl(265 35% 45%)", deep: "hsl(265 50% 78%)" },
  coral:    { fill: "hsl(var(--blob-coral))",    stroke: "hsl(10 40% 45%)",  deep: "hsl(10 60% 75%)"  },
  sage:     { fill: "hsl(var(--blob-sage))",     stroke: "hsl(145 25% 35%)", deep: "hsl(145 30% 68%)" },
};

const INK = "hsl(240 30% 18%)";

/* Big sparkly chibi eyes */
const Eyes = ({ mood, cx1 = 38, cx2 = 62, cy = 50 }: { mood: Mood; cx1?: number; cx2?: number; cy?: number }) => {
  switch (mood) {
    case "sleepy":
      return (
        <g stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d={`M${cx1 - 5},${cy} Q${cx1},${cy + 4} ${cx1 + 5},${cy}`} />
          <path d={`M${cx2 - 5},${cy} Q${cx2},${cy + 4} ${cx2 + 5},${cy}`} />
        </g>
      );
    case "wink":
      return (
        <g>
          <ellipse cx={cx1} cy={cy} rx="5.5" ry="6.5" fill={INK} />
          <circle cx={cx1 + 1.6} cy={cy - 2.2} r="2" fill="white" />
          <circle cx={cx1 - 1.8} cy={cy + 2.2} r="0.9" fill="white" />
          <path d={`M${cx2 - 5},${cy + 1} Q${cx2},${cy - 3} ${cx2 + 5},${cy + 1}`} stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "excited":
      return (
        <g fill={INK}>
          <path d={`M${cx1},${cy - 6} L${cx1 + 2},${cy - 1} L${cx1 + 6},${cy} L${cx1 + 2},${cy + 1} L${cx1},${cy + 6} L${cx1 - 2},${cy + 1} L${cx1 - 6},${cy} L${cx1 - 2},${cy - 1} Z`} />
          <path d={`M${cx2},${cy - 6} L${cx2 + 2},${cy - 1} L${cx2 + 6},${cy} L${cx2 + 2},${cy + 1} L${cx2},${cy + 6} L${cx2 - 2},${cy + 1} L${cx2 - 6},${cy} L${cx2 - 2},${cy - 1} Z`} />
        </g>
      );
    case "sad":
      return (
        <g fill={INK}>
          <ellipse cx={cx1} cy={cy + 1} rx="4.5" ry="5.5" />
          <ellipse cx={cx2} cy={cy + 1} rx="4.5" ry="5.5" />
          <circle cx={cx1 + 1.2} cy={cy - 1} r="1.5" fill="white" />
          <circle cx={cx2 + 1.2} cy={cy - 1} r="1.5" fill="white" />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx={cx1} cy={cy} rx="5.5" ry="7" fill={INK} />
          <ellipse cx={cx2} cy={cy} rx="5.5" ry="7" fill={INK} />
          <circle cx={cx1 + 1.8} cy={cy - 2.4} r="2.2" fill="white" />
          <circle cx={cx2 + 1.8} cy={cy - 2.4} r="2.2" fill="white" />
          <circle cx={cx1 - 1.8} cy={cy + 2.6} r="1" fill="white" />
          <circle cx={cx2 - 1.8} cy={cy + 2.6} r="1" fill="white" />
        </g>
      );
  }
};

const Cheeks = ({ y = 62 }: { y?: number }) => (
  <g fill="hsl(340 80% 75% / 0.55)">
    <ellipse cx="28" cy={y} rx="5" ry="3" />
    <ellipse cx="72" cy={y} rx="5" ry="3" />
  </g>
);

const Mouth = ({ mood, cy = 68 }: { mood: Mood; cy?: number }) => {
  switch (mood) {
    case "excited":
      return <path d={`M44,${cy - 1} Q50,${cy + 6} 56,${cy - 1} Q50,${cy + 3} 44,${cy - 1} Z`} fill="hsl(340 50% 60%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />;
    case "sleepy":
      return <path d={`M47,${cy} Q50,${cy + 1.5} 53,${cy}`} stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />;
    case "sad":
      return <path d={`M45,${cy + 2} Q50,${cy - 2} 55,${cy + 2}`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
    default:
      return <path d={`M46,${cy - 1} Q50,${cy + 3} 54,${cy - 1}`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
  }
};

/* Soft organic body shared by all animals */
const SoftBody = ({ fill, stroke }: { fill: string; stroke: string }) => (
  <>
    <ellipse cx="50" cy="94" rx="28" ry="3" fill="hsl(240 20% 50% / 0.12)" />
    <path
      d="M50,18 C72,16 90,32 90,52 C90,72 76,88 54,88 C32,88 12,76 10,54 C8,34 22,20 50,18 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeOpacity="0.5"
    />
    <ellipse cx="50" cy="68" rx="26" ry="14" fill="hsl(0 0% 100% / 0.3)" />
    <ellipse cx="38" cy="32" rx="10" ry="6" fill="white" opacity="0.35" />
  </>
);

/* ----- Animal feature overlays ----- */

const BunnyEars = ({ fill, deep }: { fill: string; deep: string }) => (
  <g>
    <ellipse cx="36" cy="8" rx="5" ry="14" fill={fill} stroke={INK} strokeWidth="1.6" transform="rotate(-12 36 8)" />
    <ellipse cx="64" cy="8" rx="5" ry="14" fill={fill} stroke={INK} strokeWidth="1.6" transform="rotate(12 64 8)" />
    <ellipse cx="36" cy="10" rx="2" ry="8" fill={deep} transform="rotate(-12 36 10)" />
    <ellipse cx="64" cy="10" rx="2" ry="8" fill={deep} transform="rotate(12 64 10)" />
  </g>
);

const BearEars = ({ fill, deep }: { fill: string; deep: string }) => (
  <g>
    <circle cx="22" cy="22" r="9" fill={fill} stroke={INK} strokeWidth="1.6" />
    <circle cx="78" cy="22" r="9" fill={fill} stroke={INK} strokeWidth="1.6" />
    <circle cx="22" cy="23" r="4" fill={deep} />
    <circle cx="78" cy="23" r="4" fill={deep} />
  </g>
);

const CatEars = ({ fill, deep }: { fill: string; deep: string }) => (
  <g>
    <path d="M22,28 L18,8 L34,22 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M78,28 L82,8 L66,22 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M22,24 L21,14 L29,22 Z" fill={deep} />
    <path d="M78,24 L79,14 L71,22 Z" fill={deep} />
  </g>
);

const FoxEars = ({ fill, deep }: { fill: string; deep: string }) => (
  <g>
    <path d="M24,30 L14,6 L36,24 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M76,30 L86,6 L64,24 Z" fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M24,26 L18,12 L30,22 Z" fill={deep} />
    <path d="M76,26 L82,12 L70,22 Z" fill={deep} />
    {/* white snout/cheek patches */}
    <ellipse cx="50" cy="64" rx="22" ry="14" fill="white" opacity="0.7" />
  </g>
);

const FrogEyes = ({ mood }: { mood: Mood }) => (
  <g>
    {/* eye bumps on top of head */}
    <circle cx="34" cy="22" r="11" fill="hsl(var(--blob-mint))" stroke={INK} strokeWidth="1.6" />
    <circle cx="66" cy="22" r="11" fill="hsl(var(--blob-mint))" stroke={INK} strokeWidth="1.6" />
    <circle cx="34" cy="22" r="6" fill="white" />
    <circle cx="66" cy="22" r="6" fill="white" />
    {mood === "sleepy" ? (
      <g stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M29,22 Q34,25 39,22" />
        <path d="M61,22 Q66,25 71,22" />
      </g>
    ) : (
      <g fill={INK}>
        <circle cx="34" cy="23" r="3" />
        <circle cx="66" cy="23" r="3" />
        <circle cx="35" cy="22" r="0.9" fill="white" />
        <circle cx="67" cy="22" r="0.9" fill="white" />
      </g>
    )}
  </g>
);

const ChickBeak = () => (
  <path d="M46,60 L54,60 L50,67 Z" fill="hsl(38 80% 55%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
);

const PandaPatches = () => (
  <g>
    <ellipse cx="38" cy="50" rx="9" ry="11" fill="hsl(240 25% 22%)" />
    <ellipse cx="62" cy="50" rx="9" ry="11" fill="hsl(240 25% 22%)" />
  </g>
);

/* Penguin: tuxedo body + tiny wings + orange beak/feet */
const PenguinFeatures = ({ mood }: { mood: Mood }) => (
  <g>
    <ellipse cx="50" cy="64" rx="22" ry="20" fill="white" stroke={INK} strokeWidth="1.4" opacity="0.95" />
    <ellipse cx="14" cy="60" rx="6" ry="14" fill="hsl(220 25% 22%)" stroke={INK} strokeWidth="1.4" />
    <ellipse cx="86" cy="60" rx="6" ry="14" fill="hsl(220 25% 22%)" stroke={INK} strokeWidth="1.4" />
    <Cheeks y={62} />
    <Eyes mood={mood} cy={48} />
    <path d="M44,58 L56,58 L50,66 Z" fill="hsl(28 90% 55%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
    <ellipse cx="40" cy="92" rx="6" ry="3" fill="hsl(28 90% 55%)" stroke={INK} strokeWidth="1.2" />
    <ellipse cx="60" cy="92" rx="6" ry="3" fill="hsl(28 90% 55%)" stroke={INK} strokeWidth="1.2" />
  </g>
);

/* Hamster: small ears + puffy cheek pouches */
const HamsterFeatures = ({ fill, deep }: { fill: string; deep: string }) => (
  <g>
    <circle cx="28" cy="20" r="6" fill={fill} stroke={INK} strokeWidth="1.4" />
    <circle cx="72" cy="20" r="6" fill={fill} stroke={INK} strokeWidth="1.4" />
    <circle cx="28" cy="21" r="2.5" fill={deep} />
    <circle cx="72" cy="21" r="2.5" fill={deep} />
    <ellipse cx="22" cy="64" rx="9" ry="8" fill={deep} stroke={INK} strokeWidth="1.2" opacity="0.7" />
    <ellipse cx="78" cy="64" rx="9" ry="8" fill={deep} stroke={INK} strokeWidth="1.2" opacity="0.7" />
  </g>
);

/* Axolotl: pink with feathery side gills */
const AxolotlFeatures = ({ mood }: { mood: Mood }) => (
  <g>
    <g stroke={INK} strokeWidth="1.2" fill="hsl(340 80% 78%)" strokeLinejoin="round">
      <path d="M14,40 Q4,32 6,46 Q-2,52 8,56 Q0,64 12,62 Z" />
      <path d="M86,40 Q96,32 94,46 Q102,52 92,56 Q100,64 88,62 Z" />
    </g>
    <Cheeks y={64} />
    <Eyes mood={mood} cy={48} />
    <path d="M46,66 Q50,69 54,66" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </g>
);

/* Dog: floppy ears */
const DogEars = ({ deep }: { deep: string }) => (
  <g>
    <ellipse cx="22" cy="32" rx="8" ry="14" fill={deep} stroke={INK} strokeWidth="1.4" transform="rotate(-15 22 32)" />
    <ellipse cx="78" cy="32" rx="8" ry="14" fill={deep} stroke={INK} strokeWidth="1.4" transform="rotate(15 78 32)" />
  </g>
);

/* Owl: feather tufts + big eye discs + beak */
const OwlFeatures = ({ mood, fill, deep }: { mood: Mood; fill: string; deep: string }) => (
  <g>
    <path d="M22,12 L28,24 L18,24 Z" fill={fill} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M78,12 L82,24 L72,24 Z" fill={fill} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="36" cy="48" r="14" fill="white" stroke={INK} strokeWidth="1.4" />
    <circle cx="64" cy="48" r="14" fill="white" stroke={INK} strokeWidth="1.4" />
    <circle cx="36" cy="48" r="6" fill={deep} opacity="0.4" />
    <circle cx="64" cy="48" r="6" fill={deep} opacity="0.4" />
    <Eyes mood={mood} cx1={36} cx2={64} cy={48} />
    <path d="M46,62 L54,62 L50,70 Z" fill="hsl(38 80% 55%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
    <g stroke={INK} strokeWidth="0.8" fill="none" opacity="0.4">
      <path d="M40,76 Q44,80 48,76" />
      <path d="M52,76 Q56,80 60,76" />
    </g>
  </g>
);

/* Sheep: fluffy wool puffs around face panel */
const SheepFeatures = ({ mood }: { mood: Mood }) => (
  <g>
    <g fill="hsl(0 0% 98%)" stroke={INK} strokeWidth="1.4">
      <circle cx="20" cy="30" r="9" />
      <circle cx="32" cy="14" r="9" />
      <circle cx="50" cy="8" r="10" />
      <circle cx="68" cy="14" r="9" />
      <circle cx="80" cy="30" r="9" />
    </g>
    <ellipse cx="50" cy="58" rx="22" ry="18" fill="hsl(30 25% 88%)" stroke={INK} strokeWidth="1.4" />
    <ellipse cx="26" cy="44" rx="5" ry="3" fill="hsl(30 25% 75%)" stroke={INK} strokeWidth="1.2" transform="rotate(-25 26 44)" />
    <ellipse cx="74" cy="44" rx="5" ry="3" fill="hsl(30 25% 75%)" stroke={INK} strokeWidth="1.2" transform="rotate(25 74 44)" />
    <Cheeks y={64} />
    <Eyes mood={mood} cy={54} />
    <ellipse cx="50" cy="66" rx="2" ry="1.5" fill={INK} />
    <Mouth mood={mood} cy={72} />
  </g>
);

/* Dino: small back spikes */
const DinoFeatures = ({ mood }: { mood: Mood }) => (
  <g>
    <g fill="hsl(140 50% 45%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <path d="M30,18 L34,8 L38,18 Z" />
      <path d="M42,12 L46,2 L50,12 Z" />
      <path d="M54,12 L58,2 L62,12 Z" />
      <path d="M66,18 L70,8 L74,18 Z" />
    </g>
    <Cheeks y={64} />
    <Eyes mood={mood} cy={48} />
    <circle cx="46" cy="64" r="1" fill={INK} />
    <circle cx="54" cy="64" r="1" fill={INK} />
    <Mouth mood={mood} cy={70} />
  </g>
);

/* Otter: small ears + lighter face patch + round nose */
const OtterFeatures = ({ mood, fill }: { mood: Mood; fill: string }) => (
  <g>
    <circle cx="26" cy="22" r="5" fill={fill} stroke={INK} strokeWidth="1.4" />
    <circle cx="74" cy="22" r="5" fill={fill} stroke={INK} strokeWidth="1.4" />
    <ellipse cx="50" cy="60" rx="22" ry="16" fill="hsl(30 30% 88%)" opacity="0.7" />
    <Cheeks y={66} />
    <Eyes mood={mood} cy={50} />
    <ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill={INK} />
    <Mouth mood={mood} cy={72} />
  </g>
);

/* ----- Cosmetic overlays ----- */

const Hat = ({ kind, tint }: { kind: HatKey; tint?: string }) => {
  switch (kind) {
    case "crown":
      return (
        <g>
          <path d="M28,12 L36,22 L44,8 L50,20 L56,8 L64,22 L72,12 L70,28 L30,28 Z"
            fill={tint ?? "hsl(45 90% 60%)"} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="44" cy="9" r="2" fill="hsl(340 80% 65%)" stroke={INK} strokeWidth="0.8" />
          <circle cx="56" cy="9" r="2" fill="hsl(205 70% 55%)" stroke={INK} strokeWidth="0.8" />
          <circle cx="50" cy="22" r="2.5" fill="hsl(340 80% 65%)" stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d="M24,26 Q26,4 50,4 Q74,4 76,26 Z" fill={tint ?? "hsl(340 60% 70%)"} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="22" y="22" width="56" height="8" rx="3" fill={tint ?? "hsl(340 50% 60%)"} stroke={INK} strokeWidth="1.4" opacity={tint ? 0.75 : 1} />
          <circle cx="50" cy="2" r="4" fill="hsl(0 0% 100%)" stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case "topHat":
      return (
        <g>
          <rect x="34" y="0" width="32" height="22" rx="2" fill={tint ?? "hsl(240 25% 20%)"} stroke={INK} strokeWidth="1.4" />
          <rect x="24" y="20" width="52" height="6" rx="2" fill={tint ?? "hsl(240 25% 20%)"} stroke={INK} strokeWidth="1.4" />
          <rect x="34" y="14" width="32" height="3" fill="hsl(340 70% 60%)" />
        </g>
      );
    case "flowerCrown":
      return (
        <g>
          <g transform="translate(28 14)">
            <circle r="5" fill={tint ?? "hsl(340 75% 78%)"} stroke={INK} strokeWidth="1" />
            <circle r="1.6" fill="hsl(45 80% 60%)" />
          </g>
          <g transform="translate(50 8)">
            <circle r="6" fill={tint ?? "hsl(265 60% 80%)"} stroke={INK} strokeWidth="1" />
            <circle r="2" fill="hsl(45 80% 60%)" />
          </g>
          <g transform="translate(72 14)">
            <circle r="5" fill={tint ?? "hsl(160 50% 75%)"} stroke={INK} strokeWidth="1" />
            <circle r="1.6" fill="hsl(45 80% 60%)" />
          </g>
          <g transform="translate(40 18)">
            <circle r="3.5" fill="hsl(205 60% 78%)" stroke={INK} strokeWidth="1" />
          </g>
          <g transform="translate(60 18)">
            <circle r="3.5" fill="hsl(20 70% 78%)" stroke={INK} strokeWidth="1" />
          </g>
        </g>
      );
    case "halo":
      return (
        <g>
          <ellipse cx="50" cy="6" rx="18" ry="4" fill="none" stroke={tint ?? "hsl(45 95% 60%)"} strokeWidth="3" />
          <ellipse cx="50" cy="6" rx="18" ry="4" fill="none" stroke="white" strokeWidth="1" />
        </g>
      );
    case "graduationCap":
      return (
        <g>
          <path d="M14,18 L50,6 L86,18 L50,30 Z" fill={tint ?? "hsl(240 25% 20%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="42" y="20" width="16" height="10" rx="1" fill={tint ?? "hsl(240 25% 20%)"} stroke={INK} strokeWidth="1.4" />
          <line x1="78" y1="14" x2="82" y2="30" stroke="hsl(45 80% 60%)" strokeWidth="2" />
          <circle cx="82" cy="32" r="2.5" fill="hsl(45 80% 60%)" />
        </g>
      );
    case "neonVisor":
      return (
        <g>
          <rect x="20" y="14" width="60" height="10" rx="5" fill={tint ?? "hsl(285 80% 50%)"} stroke={INK} strokeWidth="1.4" />
          <rect x="22" y="16" width="56" height="3" fill="hsl(285 100% 80%)" opacity="0.7" />
        </g>
      );
    default:
      return null;
  }
};

const Glasses = ({ kind, tint }: { kind: GlassesKey; tint?: string }) => {
  switch (kind) {
    case "round":
      return (
        <g fill="none" stroke={tint ?? INK} strokeWidth="1.8">
          <circle cx="38" cy="50" r="9" fill="hsl(0 0% 100% / 0.4)" />
          <circle cx="62" cy="50" r="9" fill="hsl(0 0% 100% / 0.4)" />
          <line x1="47" y1="50" x2="53" y2="50" />
        </g>
      );
    case "shades":
      return (
        <g stroke={INK} strokeWidth="1.6">
          <rect x="28" y="44" width="20" height="12" rx="3" fill={tint ?? "hsl(240 30% 20%)"} />
          <rect x="52" y="44" width="20" height="12" rx="3" fill={tint ?? "hsl(240 30% 20%)"} />
          <line x1="48" y1="50" x2="52" y2="50" />
          <line x1="32" y1="46" x2="36" y2="46" stroke="white" strokeWidth="1.2" />
          <line x1="56" y1="46" x2="60" y2="46" stroke="white" strokeWidth="1.2" />
        </g>
      );
    case "heart":
      return (
        <g stroke={INK} strokeWidth="1.6" fill={tint ?? "hsl(340 80% 75% / 0.6)"}>
          <path d="M30,46 C28,42 32,40 34,44 C36,40 40,42 38,46 L34,52 Z" />
          <path d="M62,46 C60,42 64,40 66,44 C68,40 72,42 70,46 L66,52 Z" />
        </g>
      );
    default:
      return null;
  }
};

const Outfit = ({ kind, tint }: { kind: OutfitKey; tint?: string }) => {
  switch (kind) {
    case "scarf":
      return (
        <g>
          <path d="M22,72 Q50,80 78,72 L80,82 Q50,90 20,82 Z" fill={tint ?? "hsl(340 70% 65%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M30,82 L26,98 L34,98 L36,84 Z" fill={tint ?? "hsl(340 70% 65%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <line x1="26" y1="76" x2="78" y2="74" stroke="white" strokeWidth="1.2" opacity="0.7" />
        </g>
      );
    case "cape":
      return (
        <g>
          <path d="M14,40 Q50,98 86,40 L92,90 Q50,108 8,90 Z" fill={tint ?? "hsl(265 60% 55%)"} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" opacity="0.92" />
          <circle cx="30" cy="42" r="3" fill="hsl(45 90% 60%)" stroke={INK} strokeWidth="1" />
          <circle cx="70" cy="42" r="3" fill="hsl(45 90% 60%)" stroke={INK} strokeWidth="1" />
        </g>
      );
    case "bowtie":
      return (
        <g transform="translate(50 78)">
          <path d="M0,0 L-12,-6 L-12,6 Z" fill={tint ?? "hsl(0 70% 55%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M0,0 L12,-6 L12,6 Z" fill={tint ?? "hsl(0 70% 55%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="-3" y="-4" width="6" height="8" rx="1" fill={tint ?? "hsl(0 70% 45%)"} stroke={INK} strokeWidth="1" />
        </g>
      );
    case "spaceCollab":
      return (
        <g>
          <ellipse cx="50" cy="78" rx="24" ry="6" fill="hsl(0 0% 100%)" stroke={INK} strokeWidth="1.6" />
          <rect x="34" y="76" width="32" height="4" fill={tint ?? "hsl(205 70% 55%)"} />
          <path d="M68,72 L70,76 L74,76 L71,79 L72,83 L68,81 L64,83 L65,79 L62,76 L66,76 Z" fill="hsl(45 90% 60%)" stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case "kawaiiApron":
      return (
        <g>
          <path d="M30,72 L70,72 L74,96 L26,96 Z" fill={tint ?? "hsl(340 50% 88%)"} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="38" y="78" width="24" height="4" rx="1" fill="hsl(340 60% 75%)" stroke={INK} strokeWidth="1" />
          <path d="M50,86 C46,82 42,86 46,90 L50,94 L54,90 C58,86 54,82 50,86 Z" fill="hsl(0 70% 65%)" stroke={INK} strokeWidth="1" />
        </g>
      );
    default:
      return null;
  }
};

/* ----- Animal renderers ----- */

const renderAnimal = (
  shape: BlobShape,
  color: BlobColor,
  mood: Mood,
  isSyn: boolean
) => {
  const c = colorMap[color];
  const fill = c.fill;
  const stroke = c.stroke;
  const deep = c.deep;

  // Syn capybara overrides
  if (isSyn || shape === "capybara") {
    const blue = "hsl(var(--blob-blue))";
    const pink = "hsl(var(--blob-pink))";
    const pinkDeep = "hsl(340 70% 78%)";
    return (
      <>
        <ellipse cx="50" cy="94" rx="28" ry="3" fill="hsl(240 20% 50% / 0.12)" />
        <ellipse cx="36" cy="86" rx="6" ry="4" fill={pink} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="64" cy="86" rx="6" ry="4" fill={pink} stroke={INK} strokeWidth="1.4" />
        <path
          d="M50,18 C72,16 90,32 90,52 C90,72 76,88 54,88 C32,88 12,76 10,54 C8,34 22,20 50,18 Z"
          fill={blue} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"
        />
        <ellipse cx="50" cy="68" rx="26" ry="14" fill="hsl(0 0% 100% / 0.3)" />
        <ellipse cx="26" cy="28" rx="8" ry="9" fill={pink} stroke={INK} strokeWidth="1.6" transform="rotate(-18 26 28)" />
        <ellipse cx="74" cy="28" rx="8" ry="9" fill={pink} stroke={INK} strokeWidth="1.6" transform="rotate(18 74 28)" />
        <ellipse cx="26" cy="30" rx="3.5" ry="4.5" fill={pinkDeep} transform="rotate(-18 26 30)" />
        <ellipse cx="74" cy="30" rx="3.5" ry="4.5" fill={pinkDeep} transform="rotate(18 74 30)" />
        <ellipse cx="38" cy="32" rx="10" ry="6" fill="white" opacity="0.35" />
        <ellipse cx="50" cy="66" rx="14" ry="9" fill={pink} stroke={INK} strokeWidth="1.4" />
        <ellipse cx="30" cy="58" rx="5" ry="3" fill="hsl(340 80% 70% / 0.55)" />
        <ellipse cx="70" cy="58" rx="5" ry="3" fill="hsl(340 80% 70% / 0.55)" />
        <Eyes mood={mood} cx1={38} cx2={62} cy={48} />
        {mood === "excited" ? (
          <path d="M45,66 Q50,72 55,66 Q50,69 45,66 Z" fill="hsl(340 50% 50%)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
        ) : (
          <path d="M47,65 Q50,68 53,65" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
        <ellipse cx="50" cy="61" rx="1.6" ry="1.2" fill={INK} />
      </>
    );
  }

  // Frog: mint body forced
  if (shape === "frog") {
    return (
      <>
        <SoftBody fill="hsl(var(--blob-mint))" stroke="hsl(160 30% 35%)" />
        <FrogEyes mood={mood} />
        <Cheeks y={64} />
        {/* wide frog smile */}
        <path d={mood === "excited" ? "M36,64 Q50,78 64,64" : "M40,64 Q50,72 60,64"} stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="42" cy="66" r="0.8" fill={INK} />
        <circle cx="58" cy="66" r="0.8" fill={INK} />
      </>
    );
  }

  // Chick: yellow body forced
  if (shape === "chick") {
    return (
      <>
        <SoftBody fill="hsl(var(--blob-yellow))" stroke="hsl(38 45% 40%)" />
        {/* tiny tuft */}
        <path d="M50,8 Q48,2 46,6 M50,8 Q52,2 54,6 M50,8 L50,16" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <Cheeks y={62} />
        <Eyes mood={mood} cy={48} />
        <ChickBeak />
      </>
    );
  }

  // Panda: white body, dark patches
  if (shape === "panda") {
    return (
      <>
        <SoftBody fill="hsl(0 0% 98%)" stroke="hsl(240 15% 30%)" />
        <BearEars fill="hsl(240 25% 22%)" deep="hsl(240 25% 14%)" />
        <PandaPatches />
        <Cheeks y={64} />
        <Eyes mood={mood} cy={50} />
        <ellipse cx="50" cy="62" rx="2" ry="1.4" fill={INK} />
        <Mouth mood={mood} cy={70} />
      </>
    );
  }

  // Bunny / Bear / Cat / Fox use color palette
  return (
    <>
      <SoftBody fill={fill} stroke={stroke} />
      {shape === "bunny" && <BunnyEars fill={fill} deep={deep} />}
      {shape === "bear" && <BearEars fill={fill} deep={deep} />}
      {shape === "cat" && <CatEars fill={fill} deep={deep} />}
      {shape === "fox" && <FoxEars fill={fill} deep={deep} />}
      <Cheeks y={62} />
      <Eyes mood={mood} cy={50} />
      {/* tiny snout */}
      <ellipse cx="50" cy="62" rx="1.6" ry="1.2" fill={INK} />
      <Mouth mood={mood} cy={68} />
      {/* whiskers for cat/fox */}
      {(shape === "cat" || shape === "fox") && (
        <g stroke={INK} strokeWidth="0.9" strokeLinecap="round" opacity="0.7">
          <line x1="22" y1="64" x2="34" y2="63" />
          <line x1="22" y1="68" x2="34" y2="67" />
          <line x1="78" y1="64" x2="66" y2="63" />
          <line x1="78" y1="68" x2="66" y2="67" />
        </g>
      )}
    </>
  );
};

const BlobChar = ({
  shape = "bunny",
  color = "blue",
  mood = "happy",
  size = 80,
  className = "",
  bounce = true,
  onClick,
  label,
  isSyn = false,
  hat = "none",
  outfit = "none",
  glasses = "none",
  hatTint,
  outfitTint,
  glassesTint,
}: BlobCharProps) => {
  return (
    <motion.button
      onClick={onClick}
      type="button"
      aria-label={label || "character"}
      whileHover={onClick ? { scale: 1.06, rotate: -2 } : undefined}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      animate={bounce ? { y: [0, -3, 0] } : undefined}
      transition={bounce ? { repeat: Infinity, duration: 2.6, ease: "easeInOut" } : undefined}
      className={`inline-flex items-center justify-center ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {renderAnimal(shape, color, mood, isSyn)}
        {outfit !== "none" && <Outfit kind={outfit} tint={outfitTint} />}
        {glasses !== "none" && <Glasses kind={glasses} tint={glassesTint} />}
        {hat !== "none" && <Hat kind={hat} tint={hatTint} />}
      </svg>
    </motion.button>
  );
};

export default BlobChar;
export type { BlobShape, BlobColor, Mood, HatKey, OutfitKey, GlassesKey };
