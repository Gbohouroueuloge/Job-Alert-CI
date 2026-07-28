
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

/** Barre de progression de lecture, fixée tout en haut de la page. */
const BarreProgression = ({ hex = "#F5A623", className = "h-1" }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX, backgroundColor: hex }}
      className={cn("fixed inset-x-0 top-0 z-50 origin-left", className)}
      aria-hidden
    />
  )
}
export default BarreProgression