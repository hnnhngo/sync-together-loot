import { motion } from "framer-motion";
import { AlarmClock, Users } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import FeatureCard from "@/components/FeatureCard";

const SyncAlarmSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="This is my favorite feature! Your alarm goes off at the same time as your friend's. No more excuses! ⏰" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      The Sync Alarm
    </motion.h2>

    <div className="flex flex-col gap-4">
      <FeatureCard
        icon={AlarmClock}
        title="Adaptive Buffer"
        description="Automatically sets a persistent alarm 1 hour before your deadline. Fully adjustable."
        color="bg-primary/10"
      />
      <FeatureCard
        icon={Users}
        title="Sync Mode"
        description="Share a task with a friend and your alarms trigger simultaneously — a shared call to action."
        color="bg-secondary/10"
      />
    </div>
  </section>
);

export default SyncAlarmSection;
