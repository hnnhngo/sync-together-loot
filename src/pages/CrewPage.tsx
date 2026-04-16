import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, HandMetal, UserPlus, Search, BookOpen, Zap, Circle, MessageCircle,
  Crown, Star, Sparkles, Flame, X, ChevronRight
} from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import synMascot from "@/assets/syn-mascot.png";

interface FriendCosmetic {
  aura: string;
  frame: string;
  accessory: string;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: "studying" | "idle" | "offline";
  streak: number;
  level: number;
  studyHours: number;
  cosmetics: FriendCosmetic;
  bio: string;
}

interface StudyGroup {
  id: number;
  name: string;
  members: string[];
  active: boolean;
  multiplier: number;
  subject: string;
}

const friends: Friend[] = [
  {
    id: 1, name: "Alex", avatar: "🧑‍🎓", status: "studying", streak: 12, level: 24,
    studyHours: 156, cosmetics: { aura: "Ember Aura 🔥", frame: "Phoenix Frame", accessory: "Neon Halo 💜" },
    bio: "Math major grinding for finals"
  },
  {
    id: 2, name: "Jordan", avatar: "👩‍💻", status: "idle", streak: 5, level: 18,
    studyHours: 89, cosmetics: { aura: "Blossom Aura 🌸", frame: "—", accessory: "Petal Crown 🌺" },
    bio: "CS student. Always debugging."
  },
  {
    id: 3, name: "Sam", avatar: "🧑‍🔬", status: "studying", streak: 8, level: 21,
    studyHours: 134, cosmetics: { aura: "—", frame: "Vine Frame 🌿", accessory: "Pixel Shades 🟪" },
    bio: "Bio major & coffee addict ☕"
  },
  {
    id: 4, name: "Taylor", avatar: "👨‍🎨", status: "offline", streak: 2, level: 12,
    studyHours: 45, cosmetics: { aura: "—", frame: "—", accessory: "—" },
    bio: "Art student vibing"
  },
  {
    id: 5, name: "Morgan", avatar: "🧑‍🏫", status: "idle", streak: 15, level: 30,
    studyHours: 210, cosmetics: { aura: "Neon Halo 💜", frame: "Phoenix Frame 🦅", accessory: "Inferno Crown 👑" },
    bio: "Top of the leaderboard 👑"
  },
];

const studyGroups: StudyGroup[] = [
  { id: 1, name: "Math Squad", members: ["Alex", "Sam", "Morgan", "You"], active: true, multiplier: 2.5, subject: "Calculus II" },
  { id: 2, name: "Essay Club", members: ["Jordan", "Taylor", "You"], active: false, multiplier: 1.0, subject: "English 201" },
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
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleNudge = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
        <MascotBubble message="Tap a friend to see their profile & cosmetics! Nudge the idle ones to earn bonus coins 🤝" />
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
                  onClick={() => setSelectedFriend(friend)}
                  className="flex items-center justify-between bg-card rounded-2xl border border-border p-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                        {friend.avatar}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[friend.status]}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground">{friend.name}</p>
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 rounded">Lv.{friend.level}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {statusLabels[friend.status]} · 🔥 {friend.streak}d
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {friend.status === "idle" && (
                      <button
                        onClick={(e) => handleNudge(friend.id, e)}
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
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-foreground">{group.name}</h3>
                    {group.active && (
                      <span className="flex items-center gap-1 bg-primary/15 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Zap className="w-3 h-3" /> x{group.multiplier} Multiplier
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{group.subject}</p>

                  {/* Member avatars */}
                  <div className="flex items-center gap-1 mb-3">
                    {group.members.map((m, i) => (
                      <span
                        key={m}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px] font-bold text-foreground border-2 border-card -ml-1 first:ml-0"
                      >
                        {m[0]}
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">{group.members.length} members</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
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

      {/* Friend profile modal */}
      <AnimatePresence>
        {selectedFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedFriend(null)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-3xl w-full max-w-md p-6 pb-10"
            >
              {/* Close */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
                <button onClick={() => setSelectedFriend(null)} className="absolute right-6">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Profile header */}
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-4xl mx-auto border-4 border-card shadow-lg">
                    {selectedFriend.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-3 border-card ${statusColors[selectedFriend.status]}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-2">{selectedFriend.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedFriend.bio}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Level {selectedFriend.level}
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Flame className="w-4 h-4 text-coral mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{selectedFriend.streak}</p>
                  <p className="text-[10px] text-muted-foreground">Day Streak</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Star className="w-4 h-4 text-warm-gold mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{selectedFriend.studyHours}h</p>
                  <p className="text-[10px] text-muted-foreground">Study Hours</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Crown className="w-4 h-4 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">#{selectedFriend.id}</p>
                  <p className="text-[10px] text-muted-foreground">Crew Rank</p>
                </div>
              </div>

              {/* Equipped cosmetics */}
              <div className="mb-5">
                <h4 className="text-sm font-bold text-foreground mb-2">Equipped Cosmetics</h4>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(selectedFriend.cosmetics).map(([type, val]) => (
                    <div key={type} className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground capitalize">{type}</span>
                      <span className={`text-xs font-bold ${val === "—" ? "text-muted-foreground" : "text-foreground"}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {selectedFriend.status === "idle" && (
                  <button
                    onClick={(e) => {
                      handleNudge(selectedFriend.id, e);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-warm-gold/20 text-foreground text-sm font-bold flex items-center justify-center gap-1.5"
                  >
                    <HandMetal className="w-4 h-4" /> Nudge
                  </button>
                )}
                <button className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                  Invite to Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrewPage;
