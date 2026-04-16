import { Home, AlarmClock, Store, Users, Palette } from "lucide-react";

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
  <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border px-2 pb-[env(safe-area-inset-bottom)] z-50">
    <div className="flex justify-around items-center h-16 max-w-md mx-auto">
      {tabs.map((t, i) => (
        <button
          key={t.label}
          onClick={() => onTap(i)}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            i === active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <t.icon className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{t.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default BottomNav;
