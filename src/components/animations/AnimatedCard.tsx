import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { forwardRef, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { fadeUpVariants } from "@/lib/animations";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  hoverScale?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, delay = 0, hoverScale = true, className, ...props }, ref) => {
    const [cardRef, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        transition={{ delay }}
        whileHover={hoverScale ? { scale: 1.03, y: -5 } : undefined}
        className="h-full"
      >
        <Card ref={ref} className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
