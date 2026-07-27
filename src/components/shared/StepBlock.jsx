
import { motion } from "framer-motion"
import { Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Bloc texte d'une étape (numéro fantôme + horaire + points clés),
 * en vis-à-vis 2 colonnes avec un visuel passé en children.
 * reverse → inverse texte/visuel (zigzag).
 */
const StepBlock = ({ num, time, icon: Icon, title, intro, points = [], reverse = false, children }) => (
  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
    <motion.div
      initial={{ opacity: 0, x: reverse ? 28 : -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(reverse && "lg:order-2")}
    >
      <div className="flex items-center gap-3">
        <span className="font-heading text-5xl font-black leading-none text-brand-navy/10">{num}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 font-heading text-sm font-black tracking-tight text-brand-orange">
          <Clock className="size-3.5" />
          {time}
        </span>
      </div>
      <h3 className="mt-4 flex items-center gap-3 font-heading text-2xl font-extrabold tracking-tight text-brand-navy sm:text-[1.7rem]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-brand-orange">
          <Icon className="size-5" strokeWidth={2} />
        </span>
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-on-surface-variant">{intro}</p>
      {points.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                <Check className="size-2.5 text-brand-orange" strokeWidth={3.5} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: reverse ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn(reverse && "lg:order-1")}
    >
      {children}
    </motion.div>
  </div>
)
export default StepBlock