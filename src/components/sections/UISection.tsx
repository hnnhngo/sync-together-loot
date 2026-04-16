import { motion } from "framer-motion";
import { Palette, Backpack } from "lucide-react";
import MascotBubble from "@/components/MascotBubble";
import FeatureCard from "@/components/FeatureCard";

const UISection = () => (
  <section className="px-6 py-10 pb-32">
    <MascotBubble message="Customize everything! Your Locker, your Crew tab, even the app colors shift as you level up. 🎨" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      UI & Customization
    </motion.h2>

    <div className="flex flex-col gap-4">
      <FeatureCard
        icon={Backpack}
        title="Your Locker"
        description="Manage your Gacha wins. See your Crew's live status from a clean, minimalist interface."
        color="bg-secondary/10"
      />
      <FeatureCard
        icon={Palette}
        title="Dynamic Visuals"
        description="App colors shift from cool blues to vibrant neons as your Friendship multiplier increases."
        color="bg-accent/15"
      />
    </div>
  </section>
);

export default UISection;
