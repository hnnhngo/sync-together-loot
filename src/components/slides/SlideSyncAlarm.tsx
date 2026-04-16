import { motion } from "framer-motion";
import { AlarmClock, Users } from "lucide-react";

const SlideSyncAlarm = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-3">
      The Sync Alarm
    </motion.h2>
    <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-12">Feature Focus</motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="bg-warm-gold/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-warm-gold/30 flex items-center justify-center mb-6">
          <AlarmClock className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Adaptive Buffer</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Automatically sets a persistent alarm 1 hour before a deadline. Fully user-adjustable to match your workflow.
        </p>
      </motion.div>

      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="bg-primary/10 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Sync Mode</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          If you and a friend share the same task, your alarms trigger simultaneously — creating a shared "call to action."
        </p>
      </motion.div>
    </div>
  </div>
);

export default SlideSyncAlarm;
