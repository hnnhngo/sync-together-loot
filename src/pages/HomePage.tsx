import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gift, Coins, CheckCircle2, X, Sparkles } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar from "@/components/BlobChar";
import { useCosmetics, STREAK_COLORS } from "@/lib/cosmetics-store";
import { useCoins, coinsStore } from "@/lib/coins-store";
import { findVariant } from "@/lib/accessory-variants";

const tierLabels = ["Just starting", "Warming up", "On a roll!", "Blazing!", "Unstoppable!"];
const tierMoods = ["sleepy", "happy", "happy", "excited", "excited"] as const;

const dailyRewards = [
  { day: 1, coins: 10, claimed: true },
  { day: 2, coins: 15, claimed: true },
  { day: 3, coins: 20, claimed: false },
  { day: 4, coins: 30, claimed: false },
  { day: 5, coins: 50, claimed: false },
  { day: 6, coins: 75, claimed: false },
  { day: 7, coins: 150, claimed: false },
];

const HomePage = () => {
  const cosmetics = useCosmetics();
  const { points } = useCoins();
  const [streak, setStreak] = useState(3);
  const [showDailyLogin, setShowDailyLogin] = useState(true);
  const [claimedToday, setClaimedToday] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const tier = Math.min(Math.floor(streak / 2), tierLabels.length - 1);
  const tierLabel = tierLabels[tier];
  const tierMood = tierMoods[tier];
  const streakColor = STREAK_COLORS[cosmetics.streakColor];
  const hatVariant = findVariant(cosmetics.equippedHatVariant);
  const outfitVariant = findVariant(cosmetics.equippedOutfitVariant);
  const glassesVariant = findVariant(cosmetics.equippedGlassesVariant);

  const handleClaim = () => {
    const reward = dailyRewards.find((r) => !r.claimed && !claimedToday);
    if (reward) {
      coinsStore.add(reward.coins);
      setClaimedToday(true);
      setStreak((s) => s + 1);
    }
  };

  const handleSynTap = () => {
    setTapCount((c) => c + 1);
  };

  const synMoods = ["happy", "excited", "wink", "happy"] as const;
  const synMood = synMoods[tapCount % synMoods.length];

  // Visual streak: render a row of flame icons, intensity grows with streak
  const flamesToShow = Math.min(7, streak);

  // Decorative tier (0–4): higher = more extreme & decorative UI
  // Thresholds: 0 (0d), 1 (3d), 2 (7d), 3 (14d), 4 (30d+)
  const decoTier = streak >= 30 ? 4 : streak >= 14 ? 3 : streak >= 7 ? 2 : streak >= 3 ? 1 : 0;
  const auraIntensity = [0.18, 0.32, 0.5, 0.7, 0.95][decoTier];
  const ringCount = [0, 1, 2, 3, 4][decoTier];
  const sparkleCount = [0, 3, 6, 10, 16][decoTier];
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-700"
      style={{
        background: `
          radial-gradient(circle at 20% 0%, ${streakColor.from}${toHex(auraIntensity * 200)}, transparent 55%),
          radial-gradient(circle at 80% 10%, ${streakColor.to}${toHex(auraIntensity * 150)}, transparent 50%),
          linear-gradient(180deg, ${streakColor.from}${toHex(auraIntensity * 120)}, hsl(var(--background)) ${70 - decoTier * 8}%)
        `,
      }}
    >
      {/* Decorative floating sparkles — escalate with streak */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: sparkleCount }).map((_, i) => {
          const left = (i * 53) % 100;
          const top = (i * 37) % 90;
          const delay = (i % 5) * 0.4;
          const sz = 6 + (i % 4) * 3;
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%`, width: sz, height: sz }}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.9, 0.3], rotate: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 3 + (i % 3), delay, ease: "easeInOut" }}
            >
              <Sparkles className="w-full h-full" style={{ color: streakColor.from }} />
            </motion.div>
          );
        })}
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-12 pb-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">Hi, friend ✿</h1>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-soft border"
          style={{
            borderColor: decoTier >= 1 ? streakColor.from : "hsl(var(--border))",
            background: decoTier >= 1
              ? `linear-gradient(135deg, ${streakColor.from}22, ${streakColor.to}11)`
              : "hsl(var(--card))",
          }}
        >
          <Coins className="w-4 h-4 text-warm-gold" />
          <span className="text-sm font-bold text-foreground tabular-nums">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* Mascot + Streak */}
      <div className="relative px-6 pt-6 pb-2 text-center">
        {/* Decorative concentric rings — only render at higher tiers */}
        {Array.from({ length: ringCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              width: 180 + i * 40,
              height: 180 + i * 40,
              border: `2px dashed ${streakColor.from}`,
              opacity: 0.35 - i * 0.06,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ repeat: Infinity, duration: 18 + i * 6, ease: "linear" }}
            aria-hidden
          />
        ))}

        {/* Soft aura-tinted backdrop */}
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 w-52 h-52 blob-shape"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${streakColor.from}, ${streakColor.to}55 70%, transparent)`,
            opacity: 0.5 + decoTier * 0.1,
            filter: decoTier >= 3 ? `drop-shadow(0 0 24px ${streakColor.from})` : undefined,
          }}
          aria-hidden
        />

        <div className="relative inline-block">
          <BlobChar
            shape={cosmetics.shape}
            color={cosmetics.color}
            hat={cosmetics.hat}
            outfit={cosmetics.outfit}
            glasses={cosmetics.glasses}
            hatTint={hatVariant?.primary}
            outfitTint={outfitVariant?.primary}
            glassesTint={glassesVariant?.primary}
            mood={synMood}
            size={150}
            onClick={handleSynTap}
            label="Tap Syn"
          />
          {tapCount > 0 && (
            <motion.div
              key={tapCount}
              initial={{ y: 0, opacity: 1, scale: 0.8 }}
              animate={{ y: -30, opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl"
            >
              ✨
            </motion.div>
          )}
        </div>

        {/* Visual streak: flame row that uses the equipped streak color */}
        <div className="mt-3 flex items-end justify-center gap-1 h-10" aria-label={`${streak} day streak`}>
          {Array.from({ length: 7 }, (_, i) => {
            const lit = i < flamesToShow;
            const sizePx = lit ? 22 + Math.min(i, 4) * 2 + decoTier * 2 : 16;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={lit ? { y: [0, -2 - decoTier, 0], scale: [1, 1.05 + decoTier * 0.04, 1] } : { y: 0, scale: 1 }}
                transition={lit ? { repeat: Infinity, duration: 1.6 + i * 0.15, ease: "easeInOut" } : {}}
                style={{
                  width: sizePx,
                  height: sizePx,
                  background: lit
                    ? `linear-gradient(180deg, ${streakColor.from}, ${streakColor.to})`
                    : "hsl(var(--muted))",
                  WebkitMaskImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z'/></svg>\")",
                  maskImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z'/></svg>\")",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  opacity: lit ? 1 : 0.35,
                  filter: lit && decoTier >= 3 ? `drop-shadow(0 0 6px ${streakColor.from})` : undefined,
                }}
              />
            );
          })}
        </div>

        <motion.div
          key={streak}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft mt-2 border-2"
          style={{
            borderColor: decoTier >= 1 ? streakColor.from : "hsl(var(--border))",
            boxShadow: decoTier >= 2 ? `0 0 ${10 + decoTier * 6}px ${streakColor.from}66` : undefined,
          }}
        >
          <Flame className={`w-5 h-5 ${streakColor.flameClass}`} fill="currentColor" />
          <p className="text-xl font-bold text-foreground leading-none">{streak}</p>
          <span className="text-xs font-bold text-muted-foreground">day streak</span>
          <span className={`text-xs font-bold ${streakColor.flameClass}`}>· {tierLabel}</span>
        </motion.div>

        {decoTier >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="block mt-2 mx-auto w-fit px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
            style={{
              background: `linear-gradient(90deg, ${streakColor.from}, ${streakColor.to})`,
              color: "white",
            }}
          >
            ✦ Legendary streak ✦
          </motion.div>
        )}
      </div>

      <div className="px-6 mt-5">
        <MascotBubble
          mood={synMood}
          message={
            tapCount >= 3
              ? "Hehe, that tickles! Keep grinding to level up your streak! ✨"
              : streak >= 7
              ? "You're on an INSANE streak! I'm so proud of you! 🔥"
              : streak >= 3
              ? "Nice streak! Don't break it now — rewards keep getting better! 💪"
              : "Tap me to say hi! Log in daily to grow your streak 🌟"
          }
        />
      </div>

      {/* Daily Login */}
      <AnimatePresence>
        {showDailyLogin && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mx-6 mt-6 bg-card rounded-3xl p-5 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blob-pink/40 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground leading-tight">Daily Reward</h2>
                  <p className="text-[10px] text-muted-foreground font-semibold">Day {streak} of 7</p>
                </div>
              </div>
              <button onClick={() => setShowDailyLogin(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {dailyRewards.map((r) => {
                const isClaimable = !r.claimed && r.day === 3 && !claimedToday;
                const isJustClaimed = r.day === 3 && claimedToday;
                return (
                  <motion.div
                    key={r.day}
                    whileHover={isClaimable ? { scale: 1.05 } : undefined}
                    className={`flex flex-col items-center rounded-2xl py-2 text-center transition-all ${
                      r.claimed || isJustClaimed
                        ? "bg-blob-mint/30"
                        : isClaimable
                        ? "bg-blob-yellow/40 ring-2 ring-warm-gold/50"
                        : "bg-muted/60"
                    }`}
                  >
                    <span className="text-[9px] font-bold text-muted-foreground">D{r.day}</span>
                    {r.claimed || isJustClaimed ? (
                      <CheckCircle2 className="w-4 h-4 text-blob-sage mt-1" />
                    ) : (
                      <div className="flex items-center gap-0.5 mt-1">
                        <Coins className="w-3 h-3 text-warm-gold" />
                        <span className="text-[9px] font-bold text-foreground">{r.coins}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleClaim}
              disabled={claimedToday}
              className={`w-full py-3 rounded-2xl text-sm font-bold transition-colors ${
                claimedToday
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground shadow-pop"
              }`}
            >
              {claimedToday ? "Claimed today ✓" : "Claim 20 coins"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats - playful character cards */}
      <div className="px-6 mt-6 pb-32">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">Today's vibes</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Tasks Done", value: "24", color: "pink" as const, shape: "bunny" as const, mood: "excited" as const, bg: "bg-blob-pink/25" },
            { label: "Study Hours", value: "18.5h", color: "mint" as const, shape: "frog" as const, mood: "happy" as const, bg: "bg-blob-mint/25" },
            { label: "Crew Rank", value: "#3", color: "yellow" as const, shape: "chick" as const, mood: "wink" as const, bg: "bg-blob-yellow/30" },
            { label: "Nudges Sent", value: "12", color: "lavender" as const, shape: "bear" as const, mood: "happy" as const, bg: "bg-blob-lavender/25" },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileTap={{ scale: 0.97 }}
              className={`${s.bg} rounded-3xl p-4 border border-border flex items-center gap-3`}
            >
              <BlobChar shape={s.shape} color={s.color} mood={s.mood} size={48} bounce={false} />
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
