import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-md bg-muted overflow-hidden", className)} {...props}>
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-full w-full"
      />
    </div>
  )
}

export { Skeleton }
