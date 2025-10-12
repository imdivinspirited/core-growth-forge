import { motion } from "framer-motion";

interface GradientOrbProps {
  className?: string;
  color1?: string;
  color2?: string;
}

export const GradientOrb = ({
  className = "",
  color1 = "hsl(var(--primary))",
  color2 = "hsl(var(--primary-glow))",
}: GradientOrbProps) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
