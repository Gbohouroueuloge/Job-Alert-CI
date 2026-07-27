
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

const ViewToggle = ({ view, onChange, className = "hidden md:flex" }) => (
  <div className={cn("shrink-0 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-0.5", className)}>
    {[{ k: "list", I: List }, { k: "grid", I: LayoutGrid }].map(({ k, I }) => (
      <button
        key={k}
        onClick={() => onChange(k)}
        aria-label={k === "list" ? "Vue liste" : "Vue grille"}
        className={cn(
          "rounded-md p-1.5 transition-all duration-200",
          view === k ? "bg-brand-navy text-white shadow-soft" : "text-muted-foreground hover:text-brand-navy"
        )}
      >
        <I className="size-4" />
      </button>
    ))}
  </div>
)
export default ViewToggle