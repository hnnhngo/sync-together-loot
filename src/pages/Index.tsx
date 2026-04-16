import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import CompetitorSection from "@/components/sections/CompetitorSection";
import SyncAlarmSection from "@/components/sections/SyncAlarmSection";
import StationSection from "@/components/sections/StationSection";
import NudgeSection from "@/components/sections/NudgeSection";
import FinalsSection from "@/components/sections/FinalsSection";
import UISection from "@/components/sections/UISection";

const sectionIds = ["hero", "alarm", "station", "crew", "locker"];

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTap = (i: number) => {
    setActiveTab(i);
    const el = document.getElementById(sectionIds[i]);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <div ref={scrollRef} className="overflow-y-auto no-scrollbar">
        <div id="hero">
          <HeroSection />
          <ProblemSection />
          <CompetitorSection />
        </div>
        <div id="alarm">
          <SyncAlarmSection />
        </div>
        <div id="station">
          <StationSection />
        </div>
        <div id="crew">
          <NudgeSection />
          <FinalsSection />
        </div>
        <div id="locker">
          <UISection />
        </div>
      </div>
      <BottomNav active={activeTab} onTap={handleTap} />
    </div>
  );
};

export default Index;
