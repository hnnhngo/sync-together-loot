import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gift, Coins, CheckCircle2, X, Sparkles } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar from "@/components/BlobChar";

const streakTiers = [
  { from: "from-blob-blue/30", to: "to-cream", accent: "text-secondary", label: "Just starting", mood: "sleepy" as const },
  { from: "from-blob-mint/30", to: "to-cream", accent: "text-blob-sage", label: "Warming up", mood: "happy" as const },
  { from: "from-blob-yellow/40", to: "to-cream", accent: "text-warm-gold", label: "On a roll!", mood: "happy" as const },
  { from: "from-blob-orange/40", to: "to-cream", accent: "text-coral", label: "Blazing!", mood: "excited" as const },
  { from: "from-blob-pink/50", to: "to-blob-lavender/30", accent: "text-primary", label: "Unstoppable!", mood: "excited" as const },
];

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
  const [streak, setStreak] = useState(3);
  const [points, setPoints] = useState(1250);
  const [showDailyLogin, setShowDailyLogin] = useState(true);
  const [claimedToday, setClaimedToday] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const tier = Math.min(Math.floor(streak / 2), streakTiers.length - 1);
  const colors = streakTiers[tier];

  const handleClaim = () => {
    const reward = dailyRewards.find((r) => !r.claimed && !claimedToday);
    if (reward) {
      setPoints((p) => p + reward.coins);
      setClaimedToday(true);
      setStreak((s) => s + 1);
    }
  };

  const handleSynTap = () => {
    setTapCount((c) => c + 1);
  };

  const synMoods = ["happy", "excited", "wink", "happy"] as const;
  const synMood = synMoods[tapCount % synMoods.length];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.from} ${colors.to} transition-colors duration-700`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">Hi, friend ✿</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-soft border border-border">
          <Coins className="w-4 h-4 text-warm-gold" />
          <span className="text-sm font-bold text-foreground tabular-nums">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* Mascot + Streak */}
      <div className="px-6 pt-6 pb-2 text-center relative">
        {/* Soft blob backdrop */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-48 h-48 bg-blob-pink/40 blob-shape" aria-hidden />

        <div className="relative inline-block">
          <BlobChar
            isSyn
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

        <motion.div
          key={streak}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft border border-border mt-2"
        >
          <Flame className={`w-5 h-5 ${colors.accent}`} />
          <p className="text-xl font-bold text-foreground leading-none">{streak}</p>
          <span className="text-xs font-bold text-muted-foreground">day streak</span>
          <span className={`text-xs font-bold ${colors.accent}`}>· {colors.label}</span>
        </motion.div>
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
            { label: "Tasks Done", value: "24", color: "pink" as const, shape: "star" as const, mood: "excited" as const, bg: "bg-blob-pink/25" },
            { label: "Study Hours", value: "18.5h", color: "mint" as const, shape: "round" as const, mood: "happy" as const, bg: "bg-blob-mint/25" },
            { label: "Crew Rank", value: "#3", color: "yellow" as const, shape: "cloud" as const, mood: "wink" as const, bg: "bg-blob-yellow/30" },
            { label: "Nudges Sent", value: "12", color: "lavender" as const, shape: "pentagon" as const, mood: "happy" as const, bg: "bg-blob-lavender/25" },
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
