import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export const FadeInWhenVisible = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInWhenVisibleProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getDirectionOffset = (dir: string) => {
    switch (dir) {
      case "up":
        return { x: 0, y: 30 };
      case "down":
        return { x: 0, y: -30 };
      case "left":
        return { x: 30, y: 0 };
      case "right":
        return { x: -30, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset(direction);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...offset,
      }}
      animate={{
        opacity: inView ? 1 : 0,
        x: inView ? 0 : offset.x,
        y: inView ? 0 : offset.y,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
