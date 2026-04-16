import { motion } from "framer-motion";
import { Palette, Layout } from "lucide-react";

const SlideUI = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-3">
      UI & Customization
    </motion.h2>
    <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-12">Beautiful by Design</motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-dusty-blue/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-dusty-blue/30 flex items-center justify-center mb-6">
          <Layout className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Clean Minimalist Interface</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A "Locker" to manage your Gacha wins and a "Crew" tab to see your friends' live status.
        </p>
        <div className="flex gap-3">
          {["Locker", "Crew", "Station"].map((tab) => (
            <span key={tab} className="px-5 py-2 rounded-full bg-background text-sm font-medium text-foreground border border-border">{tab}</span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-lavender/15 rounded-3xl p-10">
        <div className="w-16 h-16 rounded-2xl bg-lavender/30 flex items-center justify-center mb-6">
          <Palette className="w-8 h-8 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Dynamic Visuals</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          App colors shift from cool blues to vibrant neons as your "Power of Friendship" multiplier increases.
        </p>
        <div className="flex gap-2">
          {["bg-dusty-blue", "bg-sage", "bg-warm-gold", "bg-coral", "bg-lavender"].map((c) => (
            <div key={c} className={`w-10 h-10 rounded-xl ${c}`} />
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default SlideUI;
