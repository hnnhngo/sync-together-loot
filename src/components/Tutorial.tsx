import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Home, AlarmClock, Train, Users, Backpack, Sparkles } from "lucide-react";
import BlobChar from "@/components/BlobChar";

interface TutorialProps {
  open: boolean;
  onClose: () => void;
}

interface Step {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const steps: Step[] = [
  {
    title: "Meet Syn ✿",
    body: "This is your study buddy! Tap Syn on the home page to say hi. Log in daily to grow your streak and level up the home aura.",
    icon: Home,
    accent: "from-blob-pink/40 to-blob-lavender/30",
  },
  {
    title: "Set focus alarms",
    body: "Use the Alarm tab to set wake-up or study reminders. Drag the buffer or type a number, name your alarm, and toggle it on. Group alarms can be suggested to your crew!",
    icon: AlarmClock,
    accent: "from-blob-blue/40 to-blob-mint/30",
  },
  {
    title: "Visit the Station",
    body: "Spend coins on limited banners for hats, outfits, glasses & streak colors. Permanent shops unlock new animals and alternate color schemes for accessories.",
    icon: Train,
    accent: "from-blob-yellow/40 to-blob-coral/30",
  },
  {
    title: "Build your Crew",
    body: "Add friends with your unique code, join study groups, and send nudges. Suggest a group alarm so everyone studies together.",
    icon: Users,
    accent: "from-blob-mint/40 to-blob-blue/30",
  },
  {
    title: "Customize in the Locker",
    body: "Equip animals & accessories. Capes sit behind Syn, hats on top. Toggle 'Random streak color daily' to get a fresh aura every day from your owned streaks.",
    icon: Backpack,
    accent: "from-blob-lavender/40 to-blob-pink/30",
  },
  {
    title: "Quests & rewards",
    body: "Study, complete assignments, and keep alarms to finish daily and permanent quests. Rewards range from coins to legendary accessories. Have fun! ✨",
    icon: Sparkles,
    accent: "from-blob-coral/40 to-blob-yellow/30",
  },
];

const Tutorial = ({ open, onClose }: TutorialProps) => {
  const [step, setStep] = useState(0);
  const s = steps[step];
  const Icon = s.icon;
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm rounded-3xl p-6 shadow-pop border-2 border-border bg-gradient-to-br ${s.accent}`}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-foreground border border-border"
              aria-label="Close tutorial"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-3">
              <BlobChar shape="capybara" mood="excited" size={96} bounce />
            </div>

            <div className="flex items-center gap-2 justify-center mb-2">
              <Icon className="w-4 h-4 text-foreground" />
              <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
            </div>
            <p className="text-sm text-foreground/80 text-center leading-relaxed font-medium">{s.body}</p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 mt-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold bg-card/80 border border-border text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={onClose}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Skip
              </button>
              {isLast ? (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-4 py-2 rounded-2xl text-xs font-bold bg-primary text-primary-foreground shadow-pop"
                >
                  Let's go ✨
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold bg-primary text-primary-foreground shadow-pop"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tutorial;
