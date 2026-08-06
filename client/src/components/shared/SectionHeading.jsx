
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const SectionHeading = ({ eyebrow, title, sub, align = "left", className }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
  >
    <p className={cn(
      "flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange",
      align === "center" && "justify-center"
    )}>
      <span className="h-px w-6 bg-brand-orange" aria-hidden />
      {eyebrow}
      {align === "center" && <span className="h-px w-6 bg-brand-orange" aria-hidden />}
    </p>
    <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
      {title}
    </h2>
    {sub && <p className="mt-3 text-base leading-relaxed text-on-surface-variant sm:text-lg">{sub}</p>}
  </motion.div>
)
export default SectionHeading