import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, HandMetal, UserPlus, Search, BookOpen, Zap, Circle, MessageCircle,
  Crown, Star, Flame, X, ChevronRight, Copy, Check, AlarmClock, Send, LogIn,
} from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar, { BlobShape, BlobColor, Mood } from "@/components/BlobChar";
import { toast } from "@/hooks/use-toast";

interface FriendCosmetic {
  aura: string;
  frame: string;
  accessory: string;
}

interface Friend {
  id: number;
  name: string;
  shape: BlobShape;
  color: BlobColor;
  mood: Mood;
  status: "studying" | "idle" | "offline";
  streak: number;
  level: number;
  studyHours: number;
  cosmetics: FriendCosmetic;
  bio: string;
}

interface GroupMember { name: string; shape: BlobShape; color: BlobColor }
interface StudyGroup {
  id: number;
  name: string;
  members: GroupMember[];
  active: boolean;
  multiplier: number;
  subject: string;
  joinable: boolean;
  joined: boolean;
  requested?: boolean;
  invited?: boolean;
}

const friends: Friend[] = [
  { id: 1, name: "Alex", shape: "fox", color: "pink", mood: "excited", status: "studying", streak: 12, level: 24, studyHours: 156, cosmetics: { aura: "Ember Streak", frame: "Phoenix Frame", accessory: "Crown Hat" }, bio: "Math major grinding for finals" },
  { id: 2, name: "Jordan", shape: "bunny", color: "lavender", mood: "sleepy", status: "idle", streak: 5, level: 18, studyHours: 89, cosmetics: { aura: "Rose Streak", frame: "—", accessory: "Flower Crown" }, bio: "CS student. Always debugging." },
  { id: 3, name: "Sam", shape: "frog", color: "mint", mood: "happy", status: "studying", streak: 8, level: 21, studyHours: 134, cosmetics: { aura: "Emerald Streak", frame: "Vine Frame", accessory: "Round Glasses" }, bio: "Bio major & coffee addict" },
  { id: 4, name: "Taylor", shape: "chick", color: "yellow", mood: "wink", status: "offline", streak: 2, level: 12, studyHours: 45, cosmetics: { aura: "—", frame: "—", accessory: "Bowtie" }, bio: "Art student vibing" },
  { id: 5, name: "Morgan", shape: "panda", color: "orange", mood: "happy", status: "idle", streak: 15, level: 30, studyHours: 210, cosmetics: { aura: "Gold Streak", frame: "Phoenix Frame", accessory: "Top Hat" }, bio: "Top of the leaderboard" },
];

const initialGroups: StudyGroup[] = [
  { id: 1, name: "Math Squad", active: true, multiplier: 2.5, subject: "Calculus II", joinable: true, joined: true,
    members: [
      { name: "Alex", shape: "fox", color: "pink" },
      { name: "Sam", shape: "frog", color: "mint" },
      { name: "Morgan", shape: "panda", color: "orange" },
      { name: "You", shape: "capybara", color: "blue" },
    ],
  },
  { id: 2, name: "Essay Club", active: false, multiplier: 1.0, subject: "English 201", joinable: true, joined: true,
    members: [
      { name: "Jordan", shape: "bunny", color: "lavender" },
      { name: "Taylor", shape: "chick", color: "yellow" },
      { name: "You", shape: "capybara", color: "blue" },
    ],
  },
  { id: 3, name: "Physics Lab Crew", active: false, multiplier: 1.5, subject: "Physics 102", joinable: true, joined: false, invited: true,
    members: [
      { name: "Riley", shape: "bear", color: "coral" },
      { name: "Casey", shape: "cat", color: "lavender" },
    ],
  },
  { id: 4, name: "CS Night Owls", active: false, multiplier: 1.8, subject: "Algorithms", joinable: true, joined: false,
    members: [
      { name: "Sky", shape: "fox", color: "yellow" },
      { name: "Dev", shape: "panda", color: "blue" },
    ],
  },
];

const MY_FRIEND_CODE = "SYN-9F3K-2X7Q";

const statusColors = { studying: "bg-blob-sage", idle: "bg-warm-gold", offline: "bg-muted-foreground/40" };
const statusLabels = { studying: "Studying", idle: "Idle", offline: "Offline" };

const CrewPage = () => {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [nudgedIds, setNudgedIds] = useState<number[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [suggestForGroup, setSuggestForGroup] = useState<StudyGroup | null>(null);
  const [suggestTime, setSuggestTime] = useState("19:00");
  const [suggestLabel, setSuggestLabel] = useState("Study Session");

  const handleNudge = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNudgedIds((prev) => [...prev, id]);
    setTimeout(() => setNudgedIds((prev) => prev.filter((nid) => nid !== id)), 3000);
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(MY_FRIEND_CODE); } catch {}
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  const addFriendByCode = () => {
    if (!friendCodeInput.trim()) return;
    toast({ title: "Friend request sent!", description: `Code ${friendCodeInput.toUpperCase()} — they'll be notified.` });
    setFriendCodeInput("");
  };

  const requestJoin = (id: number) => {
    setGroups((prev) => prev.map((g) => g.id === id ? { ...g, requested: true } : g));
    toast({ title: "Request sent", description: "We'll let you know when they accept!" });
  };

  const acceptInvite = (id: number) => {
    setGroups((prev) => prev.map((g) => g.id === id ? {
      ...g, joined: true, invited: false,
      members: [...g.members, { name: "You", shape: "capybara" as BlobShape, color: "blue" as BlobColor }],
    } : g));
    toast({ title: "Joined!", description: "Welcome to the group 🎉" });
  };

  const sendSuggestedAlarm = () => {
    if (!suggestForGroup) return;
    toast({
      title: `Alarm suggested to ${suggestForGroup.name}`,
      description: `${suggestLabel} at ${suggestTime} — members will get a notification to vote.`,
    });
    setSuggestForGroup(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Crew</h1>
        <button onClick={() => setShowAddFriend(true)} className="bg-primary text-primary-foreground rounded-full p-2 shadow-pop">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2">
        <MascotBubble message="Tap a friend for their profile! Share your friend code to add new buddies, and join study groups to grind together 🤝" />
      </div>

      {/* Friend code card */}
      <div className="mx-6 mt-3 bg-gradient-to-br from-blob-pink/15 to-blob-blue/15 border border-border rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Your friend code</p>
          <p className="text-base font-bold text-foreground tabular-nums">{MY_FRIEND_CODE}</p>
        </div>
        <button onClick={copyCode} className="flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-bold text-foreground">
          {codeCopied ? <Check className="w-3.5 h-3.5 text-blob-sage" /> : <Copy className="w-3.5 h-3.5" />}
          {codeCopied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mt-4">
        <button
          onClick={() => setTab("friends")}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
            tab === "friends" ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline mr-1" /> Friends
        </button>
        <button
          onClick={() => setTab("groups")}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
            tab === "groups" ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1" /> Groups
        </button>
      </div>

      {/* Search */}
      {tab === "friends" && (
        <div className="px-6 mt-3">
          <div className="flex items-center gap-2 bg-card rounded-full border border-border px-4 py-2.5 shadow-soft">
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

      <div className="px-6 mt-4 pb-32">
        <AnimatePresence mode="wait">
          {tab === "friends" ? (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-2.5"
            >
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.id}
                  layout
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFriend(friend)}
                  className="flex items-center justify-between bg-card rounded-3xl border border-border p-3 cursor-pointer shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <BlobChar shape={friend.shape} color={friend.color} mood={friend.mood} size={52} bounce={false} />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card ${statusColors[friend.status]}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground">{friend.name}</p>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 rounded-full">Lv.{friend.level}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-semibold">
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
                            ? "bg-blob-sage/30 text-blob-sage"
                            : "bg-blob-yellow/40 text-foreground"
                        }`}
                      >
                        <HandMetal className="w-3.5 h-3.5" />
                        {nudgedIds.includes(friend.id) ? "Sent!" : "Nudge"}
                      </button>
                    )}
                    {friend.status === "studying" && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blob-sage/20 text-blob-sage text-xs font-bold">
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
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`bg-card rounded-3xl border border-border p-5 shadow-soft ${
                    group.active ? "ring-2 ring-primary/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-foreground">{group.name}</h3>
                    <div className="flex items-center gap-1">
                      {group.invited && !group.joined && (
                        <span className="text-[10px] font-bold bg-warm-gold/20 text-warm-gold px-2 py-0.5 rounded-full">Invited</span>
                      )}
                      {group.requested && (
                        <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Requested</span>
                      )}
                      {group.active && (
                        <span className="flex items-center gap-1 bg-primary/15 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Zap className="w-3 h-3" /> x{group.multiplier}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{group.subject}</p>

                  <div className="flex items-center gap-1 mb-3">
                    {group.members.map((m, i) => (
                      <div key={m.name} className="-ml-2 first:ml-0" style={{ zIndex: group.members.length - i }}>
                        <div className="rounded-full border-2 border-card bg-cream">
                          <BlobChar shape={m.shape} color={m.color} mood="happy" size={36} bounce={false} />
                        </div>
                      </div>
                    ))}
                    <span className="text-[10px] text-muted-foreground font-semibold ml-2">{group.members.length} members</span>
                  </div>

                  {group.joined ? (
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2.5 rounded-full text-xs font-bold ${
                          group.active ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-foreground"
                        }`}
                      >
                        {group.active ? "Join Session" : "Start Session"}
                      </button>
                      <button
                        onClick={() => setSuggestForGroup(group)}
                        className="flex items-center gap-1 px-3 py-2 rounded-full bg-blob-yellow/40 text-foreground text-xs font-bold"
                        aria-label="Suggest alarm"
                      >
                        <AlarmClock className="w-4 h-4" /> Suggest
                      </button>
                      <button className="px-3 py-2 rounded-full bg-muted text-muted-foreground" aria-label="Chat">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : group.invited ? (
                    <button
                      onClick={() => acceptInvite(group.id)}
                      className="w-full py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-pop flex items-center justify-center gap-1"
                    >
                      <LogIn className="w-4 h-4" /> Accept invite
                    </button>
                  ) : (
                    <button
                      onClick={() => requestJoin(group.id)}
                      disabled={group.requested}
                      className={`w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1 ${
                        group.requested ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground shadow-pop"
                      }`}
                    >
                      <Send className="w-4 h-4" /> {group.requested ? "Request pending" : "Request to join"}
                    </button>
                  )}
                </div>
              ))}

              <button className="w-full py-3 rounded-3xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground">
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
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end justify-center"
            onClick={() => setSelectedFriend(null)}
          >
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-[2rem] w-full max-w-md p-6 pb-10 relative"
            >
              <div className="w-10 h-1.5 rounded-full bg-muted mx-auto mb-3" />
              <button onClick={() => setSelectedFriend(null)} className="absolute right-5 top-5 bg-muted rounded-full p-1.5">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blob-pink/30 to-blob-blue/30 flex items-center justify-center mx-auto blob-shape">
                    <BlobChar shape={selectedFriend.shape} color={selectedFriend.color} mood={selectedFriend.mood} size={96} />
                  </div>
                  <span
                    className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-card ${statusColors[selectedFriend.status]}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-2">{selectedFriend.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedFriend.bio}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Level {selectedFriend.level} · {statusLabels[selectedFriend.status]}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-blob-coral/15 rounded-2xl p-3 text-center">
                  <Flame className="w-4 h-4 text-coral mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{selectedFriend.streak}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Streak</p>
                </div>
                <div className="bg-blob-yellow/25 rounded-2xl p-3 text-center">
                  <Star className="w-4 h-4 text-warm-gold mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{selectedFriend.studyHours}h</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Study</p>
                </div>
                <div className="bg-blob-lavender/25 rounded-2xl p-3 text-center">
                  <Crown className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">#{selectedFriend.id}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Rank</p>
                </div>
              </div>

              {/* Cosmetics */}
              <div className="mb-5">
                <h4 className="text-sm font-bold text-foreground mb-2">Equipped Cosmetics</h4>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(selectedFriend.cosmetics).map(([type, val]) => (
                    <div key={type} className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground capitalize">{type}</span>
                      <span className={`text-xs font-bold ${val === "—" ? "text-muted-foreground" : "text-foreground"}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {selectedFriend.status === "idle" && (
                  <button
                    onClick={(e) => handleNudge(selectedFriend.id, e)}
                    className="flex-1 py-3 rounded-full bg-blob-yellow/40 text-foreground text-sm font-bold flex items-center justify-center gap-1.5"
                  >
                    <HandMetal className="w-4 h-4" /> Nudge
                  </button>
                )}
                <button className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-pop">
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
