import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, HandMetal, UserPlus, Search, BookOpen, Zap, Circle, MessageCircle } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: "studying" | "idle" | "offline";
  streak: number;
}

interface StudyGroup {
  id: number;
  name: string;
  members: number;
  active: boolean;
  multiplier: number;
}

const friends: Friend[] = [
  { id: 1, name: "Alex", avatar: "🧑‍🎓", status: "studying", streak: 12 },
  { id: 2, name: "Jordan", avatar: "👩‍💻", status: "idle", streak: 5 },
  { id: 3, name: "Sam", avatar: "🧑‍🔬", status: "studying", streak: 8 },
  { id: 4, name: "Taylor", avatar: "👨‍🎨", status: "offline", streak: 2 },
  { id: 5, name: "Morgan", avatar: "🧑‍🏫", status: "idle", streak: 15 },
];

const studyGroups: StudyGroup[] = [
  { id: 1, name: "Math Squad", members: 4, active: true, multiplier: 2.5 },
  { id: 2, name: "Essay Club", members: 3, active: false, multiplier: 1.0 },
];

const statusColors = {
  studying: "bg-sage",
  idle: "bg-warm-gold",
  offline: "bg-muted-foreground/40",
};

const statusLabels = {
  studying: "Studying",
  idle: "Idle",
  offline: "Offline",
};

const CrewPage = () => {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [nudgedIds, setNudgedIds] = useState<number[]>([]);

  const handleNudge = (id: number) => {
    setNudgedIds((prev) => [...prev, id]);
    setTimeout(() => setNudgedIds((prev) => prev.filter((nid) => nid !== id)), 3000);
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Crew</h1>
        <button className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg shadow-primary/25">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Your crew is your study squad! Nudge idle friends and earn bonus coins together 🤝" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mt-4">
        <button
          onClick={() => setTab("friends")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
            tab === "friends" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline mr-1" /> Friends
        </button>
        <button
          onClick={() => setTab("groups")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
            tab === "groups" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1" /> Study Groups
        </button>
      </div>

      {/* Search */}
      {tab === "friends" && (
        <div className="px-6 mt-3">
          <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>
        </div>
      )}

      <div className="px-6 mt-4 pb-28">
        <AnimatePresence mode="wait">
          {tab === "friends" ? (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-2"
            >
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.id}
                  layout
                  className="flex items-center justify-between bg-card rounded-2xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-2xl">{friend.avatar}</span>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[friend.status]}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{friend.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {statusLabels[friend.status]} · 🔥 {friend.streak}d
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {friend.status === "idle" && (
                      <button
                        onClick={() => handleNudge(friend.id)}
                        disabled={nudgedIds.includes(friend.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          nudgedIds.includes(friend.id)
                            ? "bg-sage/20 text-sage"
                            : "bg-warm-gold/20 text-foreground"
                        }`}
                      >
                        <HandMetal className="w-3.5 h-3.5" />
                        {nudgedIds.includes(friend.id) ? "Sent!" : "Nudge"}
                      </button>
                    )}
                    {friend.status === "studying" && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sage/15 text-sage text-xs font-bold">
                        <Circle className="w-2 h-2 fill-current" /> Live
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              {studyGroups.map((group) => (
                <div
                  key={group.id}
                  className={`bg-card rounded-2xl border border-border p-5 ${
                    group.active ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-foreground">{group.name}</h3>
                    {group.active && (
                      <span className="flex items-center gap-1 bg-primary/15 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Zap className="w-3 h-3" /> x{group.multiplier} Multiplier
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {group.members} members · {group.active ? "Session active" : "No active session"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                        group.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {group.active ? "Join Session" : "Start Session"}
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-muted text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground">
                + Create Study Group
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CrewPage;
