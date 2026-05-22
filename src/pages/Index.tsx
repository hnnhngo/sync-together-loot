import { useState } from "react";
import { LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import AlarmPage from "@/pages/AlarmPage";
import StationPage from "@/pages/StationPage";
import CrewPage from "@/pages/CrewPage";
import LockerPage from "@/pages/LockerPage";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSync from "@/components/ProfileSync";

const pages = [HomePage, AlarmPage, StationPage, CrewPage, LockerPage];

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const Page = pages[activeTab];
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background">
      <button
        onClick={signOut}
        aria-label="Sign out"
        className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-card border border-border shadow-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
      <Page />
      <BottomNav active={activeTab} onTap={setActiveTab} />
    </div>
  );
};

export default Index;
