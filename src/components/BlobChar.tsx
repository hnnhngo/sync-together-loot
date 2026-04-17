import { motion } from "framer-motion";

type BlobShape = "round" | "star" | "triangle" | "cloud" | "pentagon" | "squircle" | "capybara";
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
  /** When true, render the iconic Syn capybara (pink + blue). Overrides shape/color. */
  isSyn?: boolean;
}

/* Softer, more organic blob silhouettes — wobbly hand-drawn feel */
const shapePaths: Record<Exclude<BlobShape, "capybara">, string> = {
  // Lopsided round - organic, not perfect circle
  round:
    "M50,10 C68,8 88,22 90,42 C92,60 84,80 64,88 C46,94 22,86 12,68 C4,52 8,28 26,16 C34,11 42,11 50,10 Z",
  // Soft chubby star with rounded points
  star:
    "M50,10 C54,10 56,14 58,22 C60,30 64,32 72,32 C80,32 86,34 86,40 C86,46 80,52 74,56 C68,60 68,64 72,72 C76,80 76,86 70,88 C64,90 56,86 50,80 C44,86 36,90 30,88 C24,86 24,80 28,72 C32,64 32,60 26,56 C20,52 14,46 14,40 C14,34 20,32 28,32 C36,32 40,30 42,22 C44,14 46,10 50,10 Z",
  // Cute soft triangle / "raindrop" shape
  triangle:
    "M50,10 C56,10 60,14 64,22 L86,72 C90,82 86,90 76,90 L24,90 C14,90 10,82 14,72 L36,22 C40,14 44,10 50,10 Z",
  // Pillowy cloud
  cloud:
    "M28,68 C16,68 8,58 10,46 C12,36 22,30 32,32 C34,22 44,16 54,18 C62,20 68,26 70,34 C82,32 92,40 92,52 C92,62 84,70 72,70 L28,70 Z",
  // Soft chunky pentagon
  pentagon:
    "M50,10 C54,10 58,12 62,16 L82,32 C88,38 90,46 88,54 L80,80 C78,86 72,90 66,90 L34,90 C28,90 22,86 20,80 L12,54 C10,46 12,38 18,32 L38,16 C42,12 46,10 50,10 Z",
  // Squircle / soft rounded square
  squircle:
    "M30,10 L70,10 C84,10 90,16 90,30 L90,70 C90,84 84,90 70,90 L30,90 C16,90 10,84 10,70 L10,30 C10,16 16,10 30,10 Z",
};

const colorMap: Record<BlobColor, { fill: string; stroke: string }> = {
  pink:     { fill: "hsl(var(--blob-pink))",     stroke: "hsl(340 45% 50%)" },
  blue:     { fill: "hsl(var(--blob-blue))",     stroke: "hsl(210 45% 45%)" },
  mint:     { fill: "hsl(var(--blob-mint))",     stroke: "hsl(165 35% 40%)" },
  orange:   { fill: "hsl(var(--blob-orange))",   stroke: "hsl(20 50% 45%)"  },
  yellow:   { fill: "hsl(var(--blob-yellow))",   stroke: "hsl(38 55% 45%)"  },
  lavender: { fill: "hsl(var(--blob-lavender))", stroke: "hsl(265 40% 50%)" },
  coral:    { fill: "hsl(var(--blob-coral))",    stroke: "hsl(10 50% 50%)"  },
  sage:     { fill: "hsl(var(--blob-sage))",     stroke: "hsl(145 30% 38%)" },
};

/* Big, sparkly anime-style eyes for maximum cuteness */
const Eyes = ({ mood, cx1 = 38, cx2 = 62, cy = 54 }: { mood: Mood; cx1?: number; cx2?: number; cy?: number }) => {
  const ink = "hsl(240 30% 15%)";
  switch (mood) {
    case "sleepy":
      return (
        <g stroke={ink} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d={`M${cx1 - 5},${cy} Q${cx1},${cy + 4} ${cx1 + 5},${cy}`} />
          <path d={`M${cx2 - 5},${cy} Q${cx2},${cy + 4} ${cx2 + 5},${cy}`} />
        </g>
      );
    case "wink":
      return (
        <g>
          {/* Left big eye */}
          <ellipse cx={cx1} cy={cy} rx="5" ry="6" fill={ink} />
          <circle cx={cx1 + 1.5} cy={cy - 1.8} r="1.6" fill="white" />
          <circle cx={cx1 - 1.6} cy={cy + 2} r="0.8" fill="white" />
          {/* Right wink */}
          <path d={`M${cx2 - 5},${cy + 1} Q${cx2},${cy - 3} ${cx2 + 5},${cy + 1}`} stroke={ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "excited":
      return (
        <g fill={ink}>
          {/* Sparkly star eyes */}
          <path d={`M${cx1},${cy - 6} L${cx1 + 2},${cy - 1} L${cx1 + 6},${cy} L${cx1 + 2},${cy + 1} L${cx1},${cy + 6} L${cx1 - 2},${cy + 1} L${cx1 - 6},${cy} L${cx1 - 2},${cy - 1} Z`} />
          <path d={`M${cx2},${cy - 6} L${cx2 + 2},${cy - 1} L${cx2 + 6},${cy} L${cx2 + 2},${cy + 1} L${cx2},${cy + 6} L${cx2 - 2},${cy + 1} L${cx2 - 6},${cy} L${cx2 - 2},${cy - 1} Z`} />
        </g>
      );
    case "sad":
      return (
        <g fill={ink}>
          <ellipse cx={cx1} cy={cy + 1} rx="4" ry="5" />
          <ellipse cx={cx2} cy={cy + 1} rx="4" ry="5" />
          <circle cx={cx1 + 1} cy={cy - 1} r="1.4" fill="white" />
          <circle cx={cx2 + 1} cy={cy - 1} r="1.4" fill="white" />
        </g>
      );
    default:
      return (
        <g>
          {/* Big chibi eyes */}
          <ellipse cx={cx1} cy={cy} rx="5" ry="6.5" fill={ink} />
          <ellipse cx={cx2} cy={cy} rx="5" ry="6.5" fill={ink} />
          {/* Big highlight */}
          <circle cx={cx1 + 1.6} cy={cy - 2.2} r="1.8" fill="white" />
          <circle cx={cx2 + 1.6} cy={cy - 2.2} r="1.8" fill="white" />
          {/* Small lower highlight */}
          <circle cx={cx1 - 1.8} cy={cy + 2.4} r="0.9" fill="white" />
          <circle cx={cx2 - 1.8} cy={cy + 2.4} r="0.9" fill="white" />
        </g>
      );
  }
};

const Mouth = ({ mood, cy = 68 }: { mood: Mood; cy?: number }) => {
  const ink = "hsl(240 30% 15%)";
  switch (mood) {
    case "excited":
      return <path d={`M44,${cy - 2} Q50,${cy + 6} 56,${cy - 2} Q50,${cy + 3} 44,${cy - 2} Z`} fill="hsl(340 50% 60%)" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />;
    case "sleepy":
      return <path d={`M47,${cy} Q50,${cy + 1.5} 53,${cy}`} stroke={ink} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
    case "sad":
      return <path d={`M45,${cy + 2} Q50,${cy - 2} 55,${cy + 2}`} stroke={ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />;
    default:
      return <path d={`M46,${cy - 1} Q50,${cy + 3} 54,${cy - 1}`} stroke={ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />;
  }
};

const Cheeks = ({ y = 64 }: { y?: number }) => (
  <g fill="hsl(340 80% 75% / 0.6)">
    <ellipse cx="32" cy={y} rx="5" ry="3" />
    <ellipse cx="68" cy={y} rx="5" ry="3" />
  </g>
);

/* The iconic Syn — a soft pink & blue capybara */
const SynCapybara = ({ mood, size }: { mood: Mood; size: number }) => {
  // Body is soft pastel blue, ears/snout/feet are pink
  const blue = "hsl(var(--blob-blue))";
  const blueDeep = "hsl(205 60% 70%)";
  const pink = "hsl(var(--blob-pink))";
  const pinkDeep = "hsl(340 70% 78%)";
  const ink = "hsl(240 30% 18%)";

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Soft shadow */}
      <ellipse cx="50" cy="94" rx="28" ry="3" fill="hsl(240 20% 50% / 0.12)" />

      {/* Tiny feet - pink */}
      <ellipse cx="36" cy="86" rx="6" ry="4" fill={pink} stroke={ink} strokeWidth="1.6" />
      <ellipse cx="64" cy="86" rx="6" ry="4" fill={pink} stroke={ink} strokeWidth="1.6" />

      {/* Body - lopsided organic blob */}
      <path
        d="M50,18 C72,16 90,32 90,52 C90,72 76,88 54,88 C32,88 12,76 10,54 C8,34 22,20 50,18 Z"
        fill={blue}
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Body shadow / belly highlight */}
      <ellipse cx="50" cy="68" rx="26" ry="14" fill="hsl(0 0% 100% / 0.35)" />

      {/* Ears - pink with darker outline */}
      <ellipse cx="26" cy="28" rx="8" ry="9" fill={pink} stroke={ink} strokeWidth="1.8" transform="rotate(-18 26 28)" />
      <ellipse cx="74" cy="28" rx="8" ry="9" fill={pink} stroke={ink} strokeWidth="1.8" transform="rotate(18 74 28)" />
      {/* Inner ear */}
      <ellipse cx="26" cy="30" rx="3.5" ry="4.5" fill={pinkDeep} transform="rotate(-18 26 30)" />
      <ellipse cx="74" cy="30" rx="3.5" ry="4.5" fill={pinkDeep} transform="rotate(18 74 30)" />

      {/* Top highlight on body */}
      <ellipse cx="38" cy="32" rx="10" ry="6" fill="white" opacity="0.35" />

      {/* Snout patch - soft pink oval on lower face */}
      <ellipse cx="50" cy="66" rx="14" ry="9" fill={pink} stroke={ink} strokeWidth="1.6" />

      {/* Cheeks blush */}
      <ellipse cx="30" cy="58" rx="5" ry="3" fill="hsl(340 80% 70% / 0.55)" />
      <ellipse cx="70" cy="58" rx="5" ry="3" fill="hsl(340 80% 70% / 0.55)" />

      {/* Big sparkly eyes - positioned slightly above snout */}
      <Eyes mood={mood} cx1={38} cx2={62} cy={48} />

      {/* Tiny capybara mouth on snout */}
      {mood === "excited" ? (
        <path d="M45,66 Q50,72 55,66 Q50,69 45,66 Z" fill="hsl(340 50% 50%)" stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />
      ) : mood === "sleepy" ? (
        <path d="M47,66 Q50,67.5 53,66" stroke={ink} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      ) : mood === "sad" ? (
        <path d="M46,68 Q50,65 54,68" stroke={ink} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M47,65 Q50,68 53,65" stroke={ink} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}

      {/* Tiny nose dot */}
      <ellipse cx="50" cy="61" rx="1.6" ry="1.2" fill={ink} />
    </svg>
  );
};

const BlobChar = ({
  shape = "round",
  color = "blue",
  mood = "happy",
  size = 80,
  className = "",
  bounce = true,
  onClick,
  label,
  isSyn = false,
}: BlobCharProps) => {
  const renderSyn = isSyn || shape === "capybara";

  return (
    <motion.button
      onClick={onClick}
      type="button"
      aria-label={label || "character"}
      whileHover={onClick ? { scale: 1.08, rotate: -3 } : undefined}
      whileTap={onClick ? { scale: 0.92 } : undefined}
      animate={bounce ? { y: [0, -3, 0] } : undefined}
      transition={bounce ? { repeat: Infinity, duration: 2.6, ease: "easeInOut" } : undefined}
      className={`inline-flex items-center justify-center ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
      style={{ width: size, height: size }}
    >
      {renderSyn ? (
        <SynCapybara mood={mood} size={size} />
      ) : (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          {/* Soft shadow */}
          <ellipse cx="50" cy="94" rx="24" ry="3" fill="hsl(240 20% 50% / 0.12)" />
          {/* Body */}
          <path
            d={shapePaths[shape as Exclude<BlobShape, "capybara">]}
            fill={colorMap[color].fill}
            stroke={colorMap[color].stroke}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeOpacity="0.7"
          />
          {/* Highlight */}
          <ellipse cx="36" cy="32" rx="9" ry="5" fill="white" opacity="0.4" />
          <Cheeks />
          <Eyes mood={mood} />
          <Mouth mood={mood} />
        </svg>
      )}
    </motion.button>
  );
};

export default BlobChar;
export type { BlobShape, BlobColor, Mood };
