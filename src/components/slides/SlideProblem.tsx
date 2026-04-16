import { motion } from "framer-motion";
import { BellOff, UserX } from "lucide-react";

const item = {
  hidden: { y: 30, opacity: 0 },
  show: (i: number) => ({ y: 0, opacity: 1, transition: { delay: i * 0.25, duration: 0.5 } }),
};

const SlideProblem = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 variants={item} custom={0} initial="hidden" animate="show" className="text-5xl font-serif text-foreground mb-2">
      The Problem
    </motion.h2>
    <motion.p variants={item} custom={0.5} initial="hidden" animate="show" className="text-lg text-muted-foreground mb-12">
      Deadline Panic & Isolation
    </motion.p>

    <div className="grid grid-cols-2 gap-10 flex-1">
      <motion.div variants={item} custom={1} initial="hidden" animate="show" className="bg-coral/15 rounded-3xl p-10 flex flex-col">
        <div className="w-14 h-14 rounded-2xl bg-coral/30 flex items-center justify-center mb-6">
          <BellOff className="w-7 h-7 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">The "Silent" Deadline</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Students miss tasks because standard notifications are too easy to dismiss.
        </p>
      </motion.div>

      <motion.div variants={item} custom={1.5} initial="hidden" animate="show" className="bg-dusty-blue/15 rounded-3xl p-10 flex flex-col">
        <div className="w-14 h-14 rounded-2xl bg-dusty-blue/30 flex items-center justify-center mb-6">
          <UserX className="w-7 h-7 text-foreground" />
        </div>
        <h3 className="text-2xl font-serif text-foreground mb-4">Social Isolation</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Studying alone makes it easy to procrastinate, leading to academic burnout.
        </p>
      </motion.div>
    </div>
  </div>
);

export default SlideProblem;
