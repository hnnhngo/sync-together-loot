import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import AlarmPage from "@/pages/AlarmPage";
import StationPage from "@/pages/StationPage";
import CrewPage from "@/pages/CrewPage";
import LockerPage from "@/pages/LockerPage";

const pages = [HomePage, AlarmPage, StationPage, CrewPage, LockerPage];

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const Page = pages[activeTab];

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background">
      <Page />
      <BottomNav active={activeTab} onTap={setActiveTab} />
    </div>
  );
};

export default Index;
