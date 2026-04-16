import { motion } from "framer-motion";
import MascotBubble from "@/components/MascotBubble";

const apps = [
  { name: "Notion", strength: "Highly organized", weakness: "No social accountability or persistent alarms", color: "bg-foreground/5" },
  { name: "Habitica", strength: "Fun RPG elements", weakness: "Complex interface that becomes a distraction", color: "bg-accent/15" },
  { name: "Forest", strength: "Good for focus", weakness: "Solo rewards, no rotating economy", color: "bg-sage/15" },
];

const CompetitorSection = () => (
  <section className="px-6 py-10">
    <MascotBubble message="Other apps are cool, but none combine social studying with rewards like we do! 🌟" direction="right" />

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-foreground mt-8 mb-5"
    >
      Why Not These?
    </motion.h2>

    <div className="flex flex-col gap-3">
      {apps.map((app, i) => (
        <motion.div
          key={app.name}
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`${app.color} rounded-2xl p-4`}
        >
          <h3 className="font-bold text-foreground mb-1">{app.name}</h3>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">✓</span> {app.strength}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive font-semibold">✗</span> {app.weakness}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CompetitorSection;
