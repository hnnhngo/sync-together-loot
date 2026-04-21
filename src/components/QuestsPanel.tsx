import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Coins, Gift, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { QUESTS, useQuests, questsStore, type Quest } from "@/lib/quests-store";

interface QuestsPanelProps {
  /** Aura colors used to tint headings and CTAs */
  fromColor: string;
  toColor: string;
}

const QuestRow = ({
  quest,
  fromColor,
  toColor,
  onClaimed,
}: {
  quest: Quest;
  fromColor: string;
  toColor: string;
  onClaimed: (msg: string) => void;
}) => {
  const { progress } = useQuests();
  const entry = progress[quest.id] ?? { progress: 0, claimed: false };
  const pct = Math.min(100, (entry.progress / quest.goal) * 100);
  const complete = entry.progress >= quest.goal;
  const claimed = entry.claimed;

  const handleClaim = () => {
    const res = questsStore.claim(quest.id);
    if (res.ok) onClaimed(`${quest.title}: ${quest.reward.label}`);
  };

  return (
    <motion.div
      layout
      className="rounded-2xl p-3 border bg-card flex items-center gap-3"
      style={{
        borderColor: complete && !claimed ? fromColor : "hsl(var(--border))",
        boxShadow: complete && !claimed ? `0 0 0 2px ${fromColor}33` : undefined,
      }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
        style={{ background: `linear-gradient(135deg, ${fromColor}33, ${toColor}22)` }}
        aria-hidden
      >
        {claimed ? <CheckCircle2 className="w-5 h-5 text-blob-sage" /> : <span>{quest.icon}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-foreground truncate">{quest.title}</p>
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground shrink-0">
            {Math.min(entry.progress, quest.goal)}/{quest.goal}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">{quest.description}</p>
        <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            style={{ background: `linear-gradient(90deg, ${fromColor}, ${toColor})` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
            {quest.reward.kind === "coins" ? (
              <Coins className="w-3 h-3 text-warm-gold" />
            ) : (
              <Gift className="w-3 h-3 text-primary" />
            )}
            {quest.reward.label}
          </span>
          <button
            onClick={handleClaim}
            disabled={!complete || claimed}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{
              background:
                complete && !claimed
                  ? `linear-gradient(135deg, ${fromColor}, ${toColor})`
                  : "hsl(var(--muted))",
              color: complete && !claimed ? "white" : "hsl(var(--muted-foreground))",
            }}
          >
            {claimed ? "Claimed ✓" : complete ? "Claim" : "Locked"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const QuestsPanel = ({ fromColor, toColor }: QuestsPanelProps) => {
  const [tab, setTab] = useState<"daily" | "permanent">("daily");
  const [toast, setToast] = useState<string | null>(null);
  const visible = QUESTS.filter((q) => q.kind === tab);

  const handleClaimed = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div
      className="rounded-3xl p-4 border-2 shadow-soft relative overflow-hidden"
      style={{
        borderColor: `${fromColor}55`,
        background: `linear-gradient(135deg, hsl(var(--card)), ${fromColor}14)`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${fromColor}55, ${toColor}33)` }}
          >
            <Trophy className="w-5 h-5" style={{ color: fromColor }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-tight">Quests</h2>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Earn coins & accessories by studying
            </p>
          </div>
        </div>
        <Sparkles className="w-4 h-4" style={{ color: fromColor }} />
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/60 rounded-full p-1 mb-3">
        {(["daily", "permanent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 text-[11px] font-bold py-1.5 rounded-full transition-colors capitalize"
            style={{
              background: tab === t ? `linear-gradient(135deg, ${fromColor}, ${toColor})` : "transparent",
              color: tab === t ? "white" : "hsl(var(--muted-foreground))",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((q) => (
          <QuestRow
            key={q.id}
            quest={q}
            fromColor={fromColor}
            toColor={toColor}
            onClaimed={handleClaimed}
          />
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-2 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-pop"
            style={{ background: `linear-gradient(135deg, ${fromColor}, ${toColor})` }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestsPanel;
