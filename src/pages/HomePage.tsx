import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gift, Coins, CheckCircle2, X } from "lucide-react";
import synMascot from "@/assets/syn-mascot.png";
import MascotBubble from "@/components/MascotBubble";

const streakColors = [
  { bg: "from-muted to-muted", accent: "text-muted-foreground", label: "Get started!" },
  { bg: "from-secondary/20 to-secondary/10", accent: "text-secondary", label: "Warming up" },
  { bg: "from-primary/20 to-primary/10", accent: "text-primary", label: "On fire!" },
  { bg: "from-coral/30 to-warm-gold/20", accent: "text-foreground", label: "Blazing!" },
  { bg: "from-warm-gold/30 to-primary/20", accent: "text-foreground", label: "Unstoppable!" },
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

  const streakTier = Math.min(Math.floor(streak / 2), streakColors.length - 1);
  const colors = streakColors[streakTier];

  const handleClaim = () => {
    const reward = dailyRewards.find((r) => !r.claimed && !claimedToday);
    if (reward) {
      setPoints((p) => p + reward.coins);
      setClaimedToday(true);
      setStreak((s) => s + 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.bg} transition-colors duration-700`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Home</h1>
        <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur rounded-full px-3 py-1.5 shadow-sm border border-border">
          <Coins className="w-4 h-4 text-warm-gold" />
          <span className="text-sm font-bold text-foreground">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* Mascot + Streak */}
      <div className="px-6 pt-4 pb-2 text-center">
        <motion.img
          src={synMascot}
          alt="Syn"
          className="w-28 h-28 mx-auto mb-3"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.div
          key={streak}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-card/90 backdrop-blur rounded-2xl px-5 py-3 shadow-sm border border-border"
        >
          <Flame className={`w-6 h-6 ${colors.accent}`} />
          <div className="text-left">
            <p className="text-2xl font-bold text-foreground leading-tight">{streak} Day Streak</p>
            <p className={`text-xs font-semibold ${colors.accent}`}>{colors.label}</p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-4">
        <MascotBubble
          message={
            streak >= 7
              ? "You're on an INSANE streak! Keep going and I'll throw in bonus loot! 🔥"
              : streak >= 3
              ? "Nice streak! Don't break it now — rewards get better every day! 💪"
              : "Hey! Log in every day to build your streak and earn bonus coins! 🌟"
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
            className="mx-6 mt-6 bg-card rounded-2xl p-5 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Daily Login</h2>
              </div>
              <button onClick={() => setShowDailyLogin(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {dailyRewards.map((r) => {
                const isClaimable = !r.claimed && r.day === 3 && !claimedToday;
                return (
                  <div
                    key={r.day}
                    className={`flex flex-col items-center rounded-xl py-2 text-center transition-colors ${
                      r.claimed
                        ? "bg-primary/15"
                        : isClaimable
                        ? "bg-warm-gold/20 ring-2 ring-warm-gold/40"
                        : "bg-muted/50"
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-muted-foreground">D{r.day}</span>
                    {r.claimed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                    ) : (
                      <div className="flex items-center gap-0.5 mt-1">
                        <Coins className="w-3 h-3 text-warm-gold" />
                        <span className="text-[10px] font-bold text-foreground">{r.coins}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleClaim}
              disabled={claimedToday}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                claimedToday
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              }`}
            >
              {claimedToday ? "Claimed Today ✓" : "Claim Day 3 Reward"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-6 pb-28">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Tasks Done</p>
          <p className="text-2xl font-bold text-foreground">24</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Study Hours</p>
          <p className="text-2xl font-bold text-foreground">18.5h</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Crew Rank</p>
          <p className="text-2xl font-bold text-foreground">#3</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Nudges Sent</p>
          <p className="text-2xl font-bold text-foreground">12</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
