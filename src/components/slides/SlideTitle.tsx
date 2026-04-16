import { motion } from "framer-motion";

const SlideTitle = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-8">
        <span className="text-5xl">🔗</span>
      </div>
    </motion.div>
    <motion.h1
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-8xl font-serif tracking-tight text-foreground"
    >
      Sync
    </motion.h1>
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="text-2xl text-muted-foreground mt-6 font-light"
    >
      Study together. Stay in Sync.
    </motion.p>
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="w-32 h-1 bg-coral rounded-full mt-8"
    />
  </div>
);

export default SlideTitle;
