import { motion } from "framer-motion";
import BlobChar, { Mood } from "@/components/BlobChar";

interface MascotBubbleProps {
  message: string;
  direction?: "left" | "right";
  mood?: Mood;
}

const MascotBubble = ({ message, direction = "left", mood = "happy" }: MascotBubbleProps) => (
  <motion.div
    initial={{ y: 16, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5 }}
    className={`flex items-end gap-2 ${direction === "right" ? "flex-row-reverse" : ""}`}
  >
    <div className="relative flex-shrink-0">
      <div className="absolute inset-0 bg-blob-pink/40 blob-shape -z-10 scale-110" aria-hidden />
      <BlobChar isSyn mood={mood} size={60} />
    </div>
    <div
      className={`bg-card rounded-3xl px-4 py-3 shadow-soft border border-border max-w-[78%] ${
        direction === "right" ? "rounded-br-md" : "rounded-bl-md"
      }`}
    >
      <p className="text-sm text-foreground leading-relaxed font-medium">{message}</p>
    </div>
  </motion.div>
);

export default MascotBubble;
