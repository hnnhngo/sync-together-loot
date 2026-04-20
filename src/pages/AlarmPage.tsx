import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlarmClock, Plus, Trash2, Users, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import MascotBubble from "@/components/MascotBubble";

type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface Alarm {
  id: number;
  label: string;
  hour: number;
  minute: number;
  buffer: number;
  syncWith: string | null;
  enabled: boolean;
  days: DayId[];
}

const dayList: { id: DayId; label: string }[] = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

const initialAlarms: Alarm[] = [
  { id: 1, label: "Math Exam Prep", hour: 8, minute: 0, buffer: 60, syncWith: "Alex", enabled: true, days: ["mon", "wed", "fri"] },
  { id: 2, label: "Essay Deadline", hour: 14, minute: 30, buffer: 30, syncWith: null, enabled: true, days: ["tue"] },
  { id: 3, label: "Study Group", hour: 19, minute: 0, buffer: 45, syncWith: "Crew", enabled: false, days: ["mon", "tue", "wed", "thu", "fri"] },
];

const formatTime = (h: number, m: number) =>
  `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

const DIAL_SIZE = 200;
const KNOB_R = 80;

const TimeDial = ({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"hour" | "minute" | null>(null);

  const center = DIAL_SIZE / 2;
  const hourAngle = ((hour % 12) / 12) * 360 - 90;
  const minuteAngle = (minute / 60) * 360 - 90;

  const hourX = center + Math.cos((hourAngle * Math.PI) / 180) * (KNOB_R - 20);
  const hourY = center + Math.sin((hourAngle * Math.PI) / 180) * (KNOB_R - 20);
  const minX = center + Math.cos((minuteAngle * Math.PI) / 180) * KNOB_R;
  const minY = center + Math.sin((minuteAngle * Math.PI) / 180) * KNOB_R;

  const getAngleFromEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return 0;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      return angle;
    },
    [center]
  );

  const handlePointerDown = (type: "hour" | "minute") => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = type;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const angle = getAngleFromEvent(e);
    if (dragging.current === "hour") {
      const newHour = Math.round((angle / 360) * 12) % 12;
      onChange(hour >= 12 ? newHour + 12 : newHour, minute);
    } else {
      const newMin = Math.round((angle / 360) * 60) % 60;
      onChange(hour, newMin);
    }
  };

  const handlePointerUp = () => {
    dragging.current = null;
  };

  const isPM = hour >= 12;

  const clampHour = (n: number) => Math.max(0, Math.min(23, n));
  const clampMin = (n: number) => Math.max(0, Math.min(59, n));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={23}
          value={hour.toString().padStart(2, "0")}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (Number.isFinite(n)) onChange(clampHour(n), minute);
          }}
          className="w-16 h-12 text-center text-2xl font-bold tabular-nums rounded-2xl px-1"
          aria-label="Hour"
        />
        <span className="text-2xl font-bold text-foreground">:</span>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={minute.toString().padStart(2, "0")}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (Number.isFinite(n)) onChange(hour, clampMin(n));
          }}
          className="w-16 h-12 text-center text-2xl font-bold tabular-nums rounded-2xl px-1"
          aria-label="Minute"
        />
        <button
          onClick={() => onChange(isPM ? hour - 12 : hour + 12, minute)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
            isPM ? "bg-accent/20 text-accent-foreground" : "bg-primary/15 text-primary"
          }`}
        >
          {isPM ? "PM" : "AM"}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground font-semibold">Type the time or drag the hands below</p>
      <svg
        ref={svgRef}
        width={DIAL_SIZE}
        height={DIAL_SIZE}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="touch-none"
      >
        {/* Background circle */}
        <circle cx={center} cy={center} r={KNOB_R + 8} fill="none" stroke="hsl(var(--border))" strokeWidth={2} />
        <circle cx={center} cy={center} r={KNOB_R - 28} fill="none" stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="4 4" />

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * 360 - 90;
          const x = center + Math.cos((a * Math.PI) / 180) * (KNOB_R + 8);
          const y = center + Math.sin((a * Math.PI) / 180) * (KNOB_R + 8);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
              fontWeight={600}
            >
              {i === 0 ? 12 : i}
            </text>
          );
        })}

        {/* Hour hand */}
        <line x1={center} y1={center} x2={hourX} y2={hourY} stroke="hsl(var(--primary))" strokeWidth={3} strokeLinecap="round" />
        {/* Minute hand */}
        <line x1={center} y1={center} x2={minX} y2={minY} stroke="hsl(var(--secondary))" strokeWidth={2} strokeLinecap="round" />

        {/* Center dot */}
        <circle cx={center} cy={center} r={4} fill="hsl(var(--foreground))" />

        {/* Hour knob */}
        <circle
          cx={hourX}
          cy={hourY}
          r={12}
          fill="hsl(var(--primary))"
          stroke="hsl(var(--card))"
          strokeWidth={3}
          onPointerDown={handlePointerDown("hour")}
          className="cursor-grab active:cursor-grabbing"
        />
        {/* Minute knob */}
        <circle
          cx={minX}
          cy={minY}
          r={10}
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--card))"
          strokeWidth={3}
          onPointerDown={handlePointerDown("minute")}
          className="cursor-grab active:cursor-grabbing"
        />
      </svg>
      <div className="flex gap-3 text-[10px] font-semibold">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Hour</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" /> Minute</span>
      </div>
    </div>
  );
};

const BufferSlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(String(value));

  // keep local text in sync when slider drives changes
  if (text !== String(value) && document.activeElement?.tagName !== "INPUT") {
    // intentional: avoid effect just for mirror-state
  }

  const clamp = (n: number) => Math.max(1, Math.min(720, n));

  const setBoth = (n: number) => {
    const v = clamp(n);
    onChange(v);
    setText(String(v));
  };

  const handleDrag = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setBoth(Math.round(5 + pct * 115));
  };

  const startDrag = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const sliderPct = Math.max(0, Math.min(100, ((value - 5) / 115) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-muted-foreground">Adaptive Buffer</p>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={720}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              const n = parseInt(text, 10);
              if (!Number.isFinite(n)) {
                setText(String(value));
              } else {
                setBoth(n);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
            }}
            className="w-16 h-8 text-center text-sm font-bold rounded-xl"
          />
          <span className="text-xs font-bold text-muted-foreground">min</span>
        </div>
      </div>
      <div
        ref={trackRef}
        className="relative h-8 flex items-center cursor-pointer"
        onPointerMove={(e) => {
          if (e.buttons > 0) handleDrag(e);
        }}
        onClick={(e) => {
          const track = trackRef.current;
          if (!track) return;
          const rect = track.getBoundingClientRect();
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setBoth(Math.round(5 + pct * 115));
        }}
      >
        <div className="absolute inset-y-3 left-0 right-0 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-[width] duration-75"
            style={{ width: `${sliderPct}%` }}
          />
        </div>
        <motion.div
          className="absolute top-1 w-6 h-6 rounded-full bg-card border-2 border-primary shadow-lg cursor-grab active:cursor-grabbing touch-none"
          style={{ left: `calc(${sliderPct}% - 12px)` }}
          onPointerDown={startDrag}
          onPointerMove={(e) => {
            if (e.buttons > 0) handleDrag(e);
          }}
          whileTap={{ scale: 1.2 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-0.5">
        <span>5 min</span>
        <span>1 hr</span>
        <span>2 hr</span>
      </div>
      <p className="text-[10px] text-muted-foreground font-semibold mt-1">
        Type any value 1–720 min, or drag the slider for 5–120 min.
      </p>
    </div>
  );
};

const AlarmPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);

  const toggleAlarm = (id: number) =>
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));

  const updateTime = (id: number, h: number, m: number) =>
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, hour: h, minute: m } : a)));

  const updateBuffer = (id: number, v: number) =>
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, buffer: v } : a)));

  const toggleDay = (id: number, day: DayId) =>
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, days: a.days.includes(day) ? a.days.filter((d) => d !== day) : [...a.days, day] }
          : a
      )
    );

  const deleteAlarm = (id: number) => setAlarms((prev) => prev.filter((a) => a.id !== id));

  const addAlarm = () => {
    const newId = Math.max(0, ...alarms.map((a) => a.id)) + 1;
    setAlarms((prev) => [
      ...prev,
      { id: newId, label: "New Alarm", hour: 12, minute: 0, buffer: 60, syncWith: null, enabled: true, days: [] },
    ]);
    setExpandedId(newId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Alarms</h1>
        <button onClick={addAlarm} className="bg-primary text-primary-foreground rounded-full p-2 shadow-pop">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Drag the clock hands to set your time! Slide the buffer to adjust how early you get reminded ⏰" />
      </div>

      {/* Calendar */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2 px-2"
        >
          Calendar {showCalendar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-3xl border border-border shadow-soft p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="pointer-events-auto"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alarm List */}
      <div className="px-6 mt-5 pb-32 flex flex-col gap-3">
        <AnimatePresence>
          {alarms.map((alarm) => (
            <motion.div
              key={alarm.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-card rounded-3xl border border-border shadow-soft overflow-hidden transition-colors ${
                !alarm.enabled ? "opacity-60" : ""
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === alarm.id ? null : alarm.id)}
              >
                <div className="flex items-center gap-3">
                  <AlarmClock className={`w-5 h-5 ${alarm.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{alarm.label}</p>
                    <p className="text-2xl font-bold text-foreground leading-tight">{formatTime(alarm.hour, alarm.minute)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alarm.syncWith && (
                    <span className="flex items-center gap-1 bg-secondary/15 text-secondary px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      <Users className="w-3 h-3" /> {alarm.syncWith}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAlarm(alarm.id);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      alarm.enabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${
                        alarm.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {expandedId === alarm.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                      {/* Draggable clock dial */}
                      <TimeDial
                        hour={alarm.hour}
                        minute={alarm.minute}
                        onChange={(h, m) => updateTime(alarm.id, h, m)}
                      />

                      {/* Days */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Repeat</p>
                        <div className="flex gap-1.5">
                          {dayList.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => toggleDay(alarm.id, d.id)}
                              className={`w-9 h-9 rounded-full text-xs font-bold transition-colors ${
                                alarm.days.includes(d.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              aria-label={d.id}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Draggable Buffer slider */}
                      <BufferSlider
                        value={alarm.buffer}
                        onChange={(v) => updateBuffer(alarm.id, v)}
                      />

                      {/* Sync info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {alarm.syncWith ? `Synced with ${alarm.syncWith}` : "Solo alarm"}
                          </p>
                        </div>
                        <button onClick={() => deleteAlarm(alarm.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlarmPage;
