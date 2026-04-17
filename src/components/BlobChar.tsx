import { motion } from "framer-motion";

type BlobShape = "round" | "star" | "triangle" | "cloud" | "pentagon" | "squircle";
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
}

const shapePaths: Record<BlobShape, string> = {
  round: "M50,8 C73,8 92,27 92,50 C92,73 73,92 50,92 C27,92 8,73 8,50 C8,27 27,8 50,8 Z",
  star: "M50,6 L61,38 L94,40 L67,60 L77,92 L50,73 L23,92 L33,60 L6,40 L39,38 Z",
  triangle: "M50,10 C53,10 56,12 58,15 L88,72 C90,76 90,80 88,84 C86,88 82,90 78,90 L22,90 C18,90 14,88 12,84 C10,80 10,76 12,72 L42,15 C44,12 47,10 50,10 Z",
  cloud: "M28,62 C18,62 10,54 10,44 C10,34 18,26 28,26 C30,18 38,12 48,12 C58,12 66,18 68,26 C80,26 90,34 90,46 C90,58 80,66 68,66 L28,66 Z",
  pentagon: "M50,8 L88,32 L74,80 L26,80 L12,32 Z",
  squircle: "M30,8 L70,8 C82,8 92,18 92,30 L92,70 C92,82 82,92 70,92 L30,92 C18,92 8,82 8,70 L8,30 C8,18 18,8 30,8 Z",
};

const colorMap: Record<BlobColor, string> = {
  pink: "hsl(var(--blob-pink))",
  blue: "hsl(var(--blob-blue))",
  mint: "hsl(var(--blob-mint))",
  orange: "hsl(var(--blob-orange))",
  yellow: "hsl(var(--blob-yellow))",
  lavender: "hsl(var(--blob-lavender))",
  coral: "hsl(var(--blob-coral))",
  sage: "hsl(var(--blob-sage))",
};

const Face = ({ mood }: { mood: Mood }) => {
  // Eyes
  const eyes = (() => {
    switch (mood) {
      case "sleepy":
        return (
          <>
            <path d="M38,52 Q42,55 46,52" stroke="hsl(240 20% 15%)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M54,52 Q58,55 62,52" stroke="hsl(240 20% 15%)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        );
      case "wink":
        return (
          <>
            <circle cx="42" cy="52" r="2.4" fill="hsl(240 20% 15%)" />
            <path d="M54,52 Q58,55 62,52" stroke="hsl(240 20% 15%)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        );
      case "excited":
        return (
          <>
            <path d="M38,48 L46,56 M46,48 L38,56" stroke="hsl(240 20% 15%)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M54,48 L62,56 M62,48 L54,56" stroke="hsl(240 20% 15%)" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );
      case "sad":
        return (
          <>
            <circle cx="42" cy="54" r="2.4" fill="hsl(240 20% 15%)" />
            <circle cx="58" cy="54" r="2.4" fill="hsl(240 20% 15%)" />
          </>
        );
      default:
        return (
          <>
            <circle cx="42" cy="52" r="2.6" fill="hsl(240 20% 15%)" />
            <circle cx="58" cy="52" r="2.6" fill="hsl(240 20% 15%)" />
            <circle cx="43" cy="51" r="0.8" fill="white" />
            <circle cx="59" cy="51" r="0.8" fill="white" />
          </>
        );
    }
  })();

  // Mouth
  const mouth = (() => {
    switch (mood) {
      case "excited":
        return <path d="M42,62 Q50,72 58,62 Q50,68 42,62 Z" fill="hsl(340 50% 55%)" stroke="hsl(240 20% 15%)" strokeWidth="1.5" />;
      case "sleepy":
        return <path d="M46,64 Q50,66 54,64" stroke="hsl(240 20% 15%)" strokeWidth="1.8" strokeLinecap="round" fill="none" />;
      case "sad":
        return <path d="M44,66 Q50,62 56,66" stroke="hsl(240 20% 15%)" strokeWidth="1.8" strokeLinecap="round" fill="none" />;
      default:
        return <path d="M44,62 Q50,68 56,62" stroke="hsl(240 20% 15%)" strokeWidth="1.8" strokeLinecap="round" fill="none" />;
    }
  })();

  return (
    <>
      {/* Cheeks */}
      <ellipse cx="36" cy="60" rx="3.5" ry="2.2" fill="hsl(340 70% 75% / 0.7)" />
      <ellipse cx="64" cy="60" rx="3.5" ry="2.2" fill="hsl(340 70% 75% / 0.7)" />
      {eyes}
      {mouth}
    </>
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
}: BlobCharProps) => {
  const fill = colorMap[color];
  const path = shapePaths[shape];

  return (
    <motion.button
      onClick={onClick}
      type="button"
      aria-label={label || "character"}
      whileHover={onClick ? { scale: 1.08, rotate: -3 } : undefined}
      whileTap={onClick ? { scale: 0.92 } : undefined}
      animate={bounce ? { y: [0, -3, 0] } : undefined}
      transition={bounce ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : undefined}
      className={`inline-flex items-center justify-center ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Soft shadow under */}
        <ellipse cx="50" cy="94" rx="24" ry="3" fill="hsl(240 20% 50% / 0.12)" />
        {/* Body */}
        <path d={path} fill={fill} stroke="hsl(265 30% 35% / 0.85)" strokeWidth="2" strokeLinejoin="round" />
        {/* Highlight */}
        <ellipse cx="38" cy="32" rx="8" ry="5" fill="white" opacity="0.35" />
        <Face mood={mood} />
      </svg>
    </motion.button>
  );
};

export default BlobChar;
export type { BlobShape, BlobColor, Mood };
