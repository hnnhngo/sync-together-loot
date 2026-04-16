import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlideTitle from "@/components/slides/SlideTitle";
import SlideProblem from "@/components/slides/SlideProblem";
import SlideExistingApps from "@/components/slides/SlideExistingApps";
import SlideSyncAlarm from "@/components/slides/SlideSyncAlarm";
import SlideStation from "@/components/slides/SlideStation";
import SlideNudge from "@/components/slides/SlideNudge";
import SlideFinals from "@/components/slides/SlideFinals";
import SlideUI from "@/components/slides/SlideUI";

const slides = [SlideTitle, SlideProblem, SlideExistingApps, SlideSyncAlarm, SlideStation, SlideNudge, SlideFinals, SlideUI];

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback((d: number) => {
    setCurrent((p) => {
      const next = p + d;
      if (next < 0 || next >= slides.length) return p;
      setDirection(d);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const Slide = slides[current];

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Slide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 pb-8">
        <button onClick={() => go(-1)} disabled={current === 0} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-cream-dark transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-8" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <button onClick={() => go(1)} disabled={current === slides.length - 1} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-cream-dark transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Index;
