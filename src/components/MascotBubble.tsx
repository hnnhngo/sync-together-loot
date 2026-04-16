import { motion } from "framer-motion";
import synMascot from "@/assets/syn-mascot.png";

interface MascotBubbleProps {
  message: string;
  direction?: "left" | "right";
}

const MascotBubble = ({ message, direction = "left" }: MascotBubbleProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5 }}
    className={`flex items-end gap-3 ${direction === "right" ? "flex-row-reverse" : ""}`}
  >
    <img src={synMascot} alt="Syn the capybara" width={56} height={56} className="w-14 h-14 flex-shrink-0" />
    <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-border max-w-[75%]">
      <p className="text-sm text-foreground leading-relaxed">{message}</p>
    </div>
  </motion.div>
);

export default MascotBubble;
