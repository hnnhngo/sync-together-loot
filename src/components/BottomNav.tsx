import { Home, AlarmClock, Store, Users, Palette } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home" },
  { icon: AlarmClock, label: "Alarm" },
  { icon: Store, label: "Station" },
  { icon: Users, label: "Crew" },
  { icon: Palette, label: "Locker" },
];

interface BottomNavProps {
  active: number;
  onTap: (i: number) => void;
}

const BottomNav = ({ active, onTap }: BottomNavProps) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 pointer-events-none">
    <div className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-border rounded-full shadow-pop pointer-events-auto">
      <div className="flex justify-around items-center h-14 px-2">
        {tabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.label}
              onClick={() => onTap(i)}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-colors"
              aria-label={t.label}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 bg-primary/15 rounded-full"
                />
              )}
              <t.icon className={`w-5 h-5 relative ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-bold relative ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </nav>
);

export default BottomNav;
