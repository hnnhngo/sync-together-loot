import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlarmClock, Plus, Trash2, Users, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import MascotBubble from "@/components/MascotBubble";

interface Alarm {
  id: number;
  label: string;
  time: string;
  buffer: number;
  syncWith: string | null;
  enabled: boolean;
  days: string[];
}

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const initialAlarms: Alarm[] = [
  { id: 1, label: "Math Exam Prep", time: "08:00", buffer: 60, syncWith: "Alex", enabled: true, days: ["M", "W", "F"] },
  { id: 2, label: "Essay Deadline", time: "14:30", buffer: 30, syncWith: null, enabled: true, days: ["T"] },
  { id: 3, label: "Study Group", time: "19:00", buffer: 45, syncWith: "Crew", enabled: false, days: ["M", "T", "W", "T", "F"] },
];

const AlarmPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);

  const toggleAlarm = (id: number) =>
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));

  const updateBuffer = (id: number, delta: number) =>
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, buffer: Math.max(5, Math.min(120, a.buffer + delta)) } : a
      )
    );

  const deleteAlarm = (id: number) => setAlarms((prev) => prev.filter((a) => a.id !== id));

  const addAlarm = () => {
    const newId = Math.max(0, ...alarms.map((a) => a.id)) + 1;
    setAlarms((prev) => [
      ...prev,
      { id: newId, label: "New Alarm", time: "12:00", buffer: 60, syncWith: null, enabled: true, days: [] },
    ]);
    setExpandedId(newId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Alarms</h1>
        <button onClick={addAlarm} className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg shadow-primary/25">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Set your alarms and I'll make sure you AND your friends wake up on time! ⏰" />
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
              <div className="bg-card rounded-2xl border border-border shadow-sm p-2">
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
      <div className="px-6 mt-5 pb-28 flex flex-col gap-3">
        <AnimatePresence>
          {alarms.map((alarm) => (
            <motion.div
              key={alarm.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-colors ${
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
                    <p className="text-2xl font-bold text-foreground leading-tight">{alarm.time}</p>
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
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      {/* Days */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Repeat</p>
                        <div className="flex gap-1.5">
                          {dayLabels.map((d, i) => (
                            <button
                              key={i}
                              className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                                alarm.days.includes(d)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Buffer */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                          Adaptive Buffer: <span className="text-foreground">{alarm.buffer} min before deadline</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBuffer(alarm.id, -5)}
                            className="w-8 h-8 rounded-full bg-muted text-foreground font-bold text-sm"
                          >
                            −
                          </button>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(alarm.buffer / 120) * 100}%` }}
                            />
                          </div>
                          <button
                            onClick={() => updateBuffer(alarm.id, 5)}
                            className="w-8 h-8 rounded-full bg-muted text-foreground font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

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
