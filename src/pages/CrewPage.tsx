import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Search, BookOpen, Zap, MessageCircle,
  X, Copy, Check, AlarmClock, Send, LogIn, RefreshCw, Trash2, Plus,
} from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import BlobChar, { BlobShape, BlobColor } from "@/components/BlobChar";
import { toast } from "@/hooks/use-toast";
import { profileStore, useProfile } from "@/lib/profile-store";
import { friendsStore, useFriends, type FriendEntry } from "@/lib/friends-store";
import { groupsStore, useGroups, type GroupEntry } from "@/lib/groups-store";

// Deterministic blob avatar for a given user id (so each friend looks consistent).
const shapes: BlobShape[] = ["fox", "bunny", "frog", "chick", "panda", "bear", "cat", "capybara"];
const colors: BlobColor[] = ["pink", "lavender", "mint", "yellow", "orange", "coral", "blue"];
const hashId = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
};
const avatarFor = (id: string) => {
  const h = hashId(id);
  return { shape: shapes[h % shapes.length], color: colors[(h >> 4) % colors.length] };
};

const CrewPage = () => {
  const { profile } = useProfile();
  const { friends } = useFriends();
  const { groups } = useGroups();
  const myFriendCode = profile?.friend_code ?? "SYN-----";

  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<FriendEntry | null>(null);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSubject, setGroupSubject] = useState("");
  const [suggestForGroup, setSuggestForGroup] = useState<GroupEntry | null>(null);
  const [suggestTime, setSuggestTime] = useState("19:00");
  const [suggestLabel, setSuggestLabel] = useState("Study Session");

  const accepted = friends.filter((f) => f.status === "accepted");
  const incoming = friends.filter((f) => f.incoming);
  const outgoing = friends.filter((f) => f.status === "pending" && !f.incoming);

  const filteredAccepted = accepted.filter((f) =>
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(myFriendCode); } catch {}
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  const addFriendByCode = async () => {
    const res = await friendsStore.addByCode(friendCodeInput);
    toast({ title: res.ok ? "Sent!" : "Couldn't add", description: res.message });
    if (res.ok) {
      setFriendCodeInput("");
      setShowAddFriend(false);
    }
  };

  const acceptFriend = async (id: string) => {
    await friendsStore.accept(id);
    toast({ title: "Friend added 🎉" });
  };

  const removeFriend = async (id: string) => {
    await friendsStore.remove(id);
  };

  const createGroup = async () => {
    const res = await groupsStore.create(groupName, groupSubject);
    toast({ title: res.ok ? "Group created" : "Couldn't create", description: res.message });
    if (res.ok) {
      setGroupName("");
      setGroupSubject("");
      setShowCreateGroup(false);
    }
  };

  const leaveGroup = async (id: string) => {
    await groupsStore.leave(id);
    toast({ title: "Left group" });
  };

  const sendSuggestedAlarm = () => {
    if (!suggestForGroup) return;
    toast({
      title: `Alarm suggested to ${suggestForGroup.name}`,
      description: `${suggestLabel} at ${suggestTime} — members will vote.`,
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
        <MascotBubble message="Share your friend code to add buddies, then form study groups to grind together 🤝" />
      </div>

      {/* Friend code card */}
      <div className="mx-6 mt-3 bg-gradient-to-br from-blob-pink/15 to-blob-blue/15 border border-border rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Your friend code</p>
          <p className="text-base font-bold text-foreground tabular-nums">{myFriendCode}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={async () => {
              const code = await profileStore.regenerateFriendCode();
              if (code) toast({ title: "New friend code generated!", description: code });
            }}
            className="flex items-center justify-center bg-card border border-border rounded-full p-1.5 text-foreground"
            aria-label="Regenerate friend code"
            title="Generate new code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={copyCode} className="flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-bold text-foreground">
            {codeCopied ? <Check className="w-3.5 h-3.5 text-blob-sage" /> : <Copy className="w-3.5 h-3.5" />}
            {codeCopied ? "Copied!" : "Copy"}
          </button>
        </div>
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
              className="flex flex-col gap-3"
            >
              {/* Incoming requests */}
              {incoming.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Friend requests
                  </p>
                  <div className="flex flex-col gap-2">
                    {incoming.map((f) => {
                      const av = avatarFor(f.friendUserId);
                      return (
                        <div key={f.id} className="flex items-center justify-between bg-card rounded-3xl border border-border p-3 shadow-soft">
                          <div className="flex items-center gap-3">
                            <BlobChar shape={av.shape} color={av.color} mood="happy" size={48} bounce={false} />
                            <div>
                              <p className="text-sm font-bold text-foreground">{f.displayName}</p>
                              <p className="text-[11px] text-muted-foreground font-semibold">Wants to be friends</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => acceptFriend(f.id)}
                              className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-pop"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => removeFriend(f.id)}
                              className="p-1.5 rounded-full bg-muted text-muted-foreground"
                              aria-label="Decline"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Outgoing pending */}
              {outgoing.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Pending
                  </p>
                  <div className="flex flex-col gap-2">
                    {outgoing.map((f) => {
                      const av = avatarFor(f.friendUserId);
                      return (
                        <div key={f.id} className="flex items-center justify-between bg-card/60 rounded-3xl border border-border p-3">
                          <div className="flex items-center gap-3">
                            <BlobChar shape={av.shape} color={av.color} mood="sleepy" size={44} bounce={false} />
                            <div>
                              <p className="text-sm font-bold text-foreground">{f.displayName}</p>
                              <p className="text-[11px] text-muted-foreground font-semibold">Waiting for them to accept</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFriend(f.id)}
                            className="text-xs font-bold text-muted-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Accepted friends */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                  My friends ({accepted.length})
                </p>
                {filteredAccepted.length === 0 ? (
                  <div className="bg-card rounded-3xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-semibold text-foreground">No friends yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tap the + button and share friend codes to connect.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {filteredAccepted.map((f) => {
                      const av = avatarFor(f.friendUserId);
                      return (
                        <motion.div
                          key={f.id}
                          layout
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFriend(f)}
                          className="flex items-center justify-between bg-card rounded-3xl border border-border p-3 cursor-pointer shadow-soft"
                        >
                          <div className="flex items-center gap-3">
                            <BlobChar shape={av.shape} color={av.color} mood="happy" size={52} bounce={false} />
                            <div>
                              <p className="text-sm font-bold text-foreground">{f.displayName}</p>
                              <p className="text-[11px] text-muted-foreground font-semibold tabular-nums">
                                {f.friendCode}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFriend(f.id); }}
                            className="p-2 rounded-full text-muted-foreground hover:text-destructive"
                            aria-label="Remove friend"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              {groups.length === 0 ? (
                <div className="bg-card rounded-3xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-semibold text-foreground">No groups yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create a study group to grind with friends.
                  </p>
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-card rounded-3xl border border-border p-5 shadow-soft"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-foreground">{group.name}</h3>
                      <span className="flex items-center gap-1 bg-primary/15 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Zap className="w-3 h-3" /> x{group.multiplier}
                      </span>
                    </div>
                    {group.subject && (
                      <p className="text-xs text-muted-foreground mb-3">{group.subject}</p>
                    )}

                    <div className="flex items-center gap-1 mb-3">
                      {group.memberIds.slice(0, 5).map((uid, i) => {
                        const av = avatarFor(uid);
                        return (
                          <div key={uid} className="-ml-2 first:ml-0" style={{ zIndex: group.memberIds.length - i }}>
                            <div className="rounded-full border-2 border-card bg-cream">
                              <BlobChar shape={av.shape} color={av.color} mood="happy" size={36} bounce={false} />
                            </div>
                          </div>
                        );
                      })}
                      <span className="text-[10px] text-muted-foreground font-semibold ml-2">
                        {group.memberCount} member{group.memberCount === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-soft">
                        Start Session
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
                      {group.ownerId !== profile?.id && (
                        <button
                          onClick={() => leaveGroup(group.id)}
                          className="px-3 py-2 rounded-full bg-muted text-muted-foreground"
                          aria-label="Leave group"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-full py-3 rounded-3xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Study Group
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Friend mini-profile modal */}
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
              <div className="text-center">
                {(() => {
                  const av = avatarFor(selectedFriend.friendUserId);
                  return <BlobChar shape={av.shape} color={av.color} mood="excited" size={96} />;
                })()}
                <h3 className="text-xl font-bold text-foreground mt-2">{selectedFriend.displayName}</h3>
                <p className="text-xs text-muted-foreground tabular-nums">{selectedFriend.friendCode}</p>
              </div>
              <button
                onClick={() => { removeFriend(selectedFriend.id); setSelectedFriend(null); }}
                className="w-full mt-5 py-3 rounded-full bg-muted text-foreground text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Remove friend
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Friend modal */}
      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center"
            onClick={() => setShowAddFriend(false)}
          >
            <motion.div
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 pb-10 relative"
            >
              <div className="w-10 h-1.5 rounded-full bg-muted mx-auto mb-3 sm:hidden" />
              <button
                onClick={() => setShowAddFriend(false)}
                className="absolute right-5 top-5 bg-muted rounded-full p-1.5"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blob-pink/30 to-blob-blue/30 flex items-center justify-center mb-2">
                  <UserPlus className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Add a friend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Enter their friend code or share yours</p>
              </div>

              <div className="bg-gradient-to-br from-blob-lavender/25 to-blob-blue/20 border border-border rounded-2xl p-3 mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Your code</p>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-foreground tabular-nums">{myFriendCode}</p>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-bold text-foreground"
                  >
                    {codeCopied ? <Check className="w-3.5 h-3.5 text-blob-sage" /> : <Copy className="w-3.5 h-3.5" />}
                    {codeCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <label className="block text-xs font-bold text-foreground mb-1.5">Friend's code</label>
              <input
                type="text"
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                placeholder="SYN-XXXX-XXXX"
                maxLength={14}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-base font-bold tabular-nums text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="text-[10px] text-muted-foreground mt-1.5">Format: SYN-XXXX-XXXX</p>

              <button
                onClick={addFriendByCode}
                disabled={!friendCodeInput.trim()}
                className="w-full mt-4 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-pop disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send friend request
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 pb-10 relative"
            >
              <div className="w-10 h-1.5 rounded-full bg-muted mx-auto mb-3 sm:hidden" />
              <button
                onClick={() => setShowCreateGroup(false)}
                className="absolute right-5 top-5 bg-muted rounded-full p-1.5"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-foreground">Create a study group</h3>
              </div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Group name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Math Squad"
                maxLength={40}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
              <label className="block text-xs font-bold text-foreground mt-3 mb-1.5">Subject (optional)</label>
              <input
                type="text"
                value={groupSubject}
                onChange={(e) => setGroupSubject(e.target.value)}
                placeholder="Calculus II"
                maxLength={60}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={createGroup}
                disabled={!groupName.trim()}
                className="w-full mt-4 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-pop disabled:opacity-50 disabled:shadow-none"
              >
                Create group
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggest Alarm modal */}
      <AnimatePresence>
        {suggestForGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center"
            onClick={() => setSuggestForGroup(null)}
          >
            <motion.div
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 pb-10 relative"
            >
              <div className="w-10 h-1.5 rounded-full bg-muted mx-auto mb-3 sm:hidden" />
              <button
                onClick={() => setSuggestForGroup(null)}
                className="absolute right-5 top-5 bg-muted rounded-full p-1.5"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blob-yellow/40 to-blob-coral/30 flex items-center justify-center mb-2">
                  <AlarmClock className="w-7 h-7 text-warm-gold" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Suggest an alarm</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  to <span className="font-bold text-foreground">{suggestForGroup.name}</span> · {suggestForGroup.memberCount} members
                </p>
              </div>

              <label className="block text-xs font-bold text-foreground mb-1.5">What for?</label>
              <input
                type="text"
                value={suggestLabel}
                onChange={(e) => setSuggestLabel(e.target.value)}
                placeholder="e.g. Calc review, Essay sprint…"
                maxLength={40}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/40"
              />
              <label className="block text-xs font-bold text-foreground mt-3 mb-1.5">Time</label>
              <input
                type="time"
                value={suggestTime}
                onChange={(e) => setSuggestTime(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-base font-bold tabular-nums text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={sendSuggestedAlarm}
                disabled={!suggestLabel.trim() || !suggestTime}
                className="w-full mt-4 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-pop disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send suggestion
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating "+" for creating a group in groups tab */}
      {tab === "groups" && groups.length > 0 && (
        <button
          onClick={() => setShowCreateGroup(true)}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-secondary text-secondary-foreground shadow-pop flex items-center justify-center"
          aria-label="Create group"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CrewPage;
