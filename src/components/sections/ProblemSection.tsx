import { motion } from "framer-motion";
import { BellOff, UserX } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import FeatureCard from "@/components/FeatureCard";

const ProblemSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="Sound familiar? Deadlines sneak up and studying alone is tough. Let me show you how Sync fixes this! 💪" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      The Problem
    </motion.h2>

    <div className="flex flex-col gap-4">
      <FeatureCard
        icon={BellOff}
        title="The Silent Deadline"
        description="Students miss tasks because standard notifications are too easy to dismiss."
        color="bg-primary/10"
      />
      <FeatureCard
        icon={UserX}
        title="Social Isolation"
        description="Studying alone makes it easy to procrastinate, leading to academic burnout."
        color="bg-secondary/10"
      />
    </div>
  </section>
);

export default ProblemSection;
