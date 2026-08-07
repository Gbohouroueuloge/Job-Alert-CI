
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * items → ["Gratuit pour toujours", …]
 * tone  → "light" (pages claires) | "dark" (bandeaux navy, ex. BandeauAlerte)
 */
const ReassuranceList = ({ items, tone = "light", className }) => (
  <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
    {items.map((item) => {
      const label = typeof item === "string" ? item : item.label
      return (
        <li key={label} className={cn(
          "flex items-center gap-1.5 text-xs font-medium",
          tone === "dark" ? "text-white/70" : "text-on-surface-variant"
        )}>
          <span className={cn("flex size-4 items-center justify-center rounded-full", tone === "dark" ? "bg-emerald-400/15" : "bg-emerald-500/10")}>
            <Check className={cn("size-2.5", tone === "dark" ? "text-emerald-400" : "text-emerald-600")} strokeWidth={3} />
          </span>
          {label}
        </li>
      )
    })}
  </ul>
)
export default ReassuranceList