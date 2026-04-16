import { motion } from "framer-motion";

const apps = [
  { name: "Notion", emoji: "📝", color: "bg-cream-dark", strength: "Highly organized.", weakness: "Lacks social accountability and persistent alarm systems." },
  { name: "Habitica", emoji: "⚔️", color: "bg-lavender/20", strength: "Fun RPG elements.", weakness: "Complex interface that can become a distraction itself." },
  { name: "Forest", emoji: "🌲", color: "bg-sage/20", strength: "Good for focus.", weakness: "Rewards are primarily solo and lack the excitement of a rotating economy." },
];

const SlideExistingApps = () => (
  <div className="flex flex-col h-full px-16 py-16">
    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-serif text-foreground mb-12">
      Existing Apps
    </motion.h2>
    <div className="grid grid-cols-3 gap-8 flex-1">
      {apps.map((app, i) => (
        <motion.div
          key={app.name}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
          className={`${app.color} rounded-3xl p-8 flex flex-col`}
        >
          <span className="text-4xl mb-4">{app.emoji}</span>
          <h3 className="text-2xl font-serif text-foreground mb-6">{app.name}</h3>
          <div className="space-y-4 text-base">
            <div>
              <span className="font-semibold text-primary">Strength:</span>
              <span className="text-muted-foreground ml-2">{app.strength}</span>
            </div>
            <div>
              <span className="font-semibold text-coral">Weakness:</span>
              <span className="text-muted-foreground ml-2">{app.weakness}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SlideExistingApps;
