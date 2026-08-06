
import { cn } from "@/lib/utils"

const StickyFilterBar = ({ children, className, innerClassName }) => (
  <div className={cn("sticky top-1/10 z-40 border-b border-outline-variant/40 bg-background/85 backdrop-blur-md", className)}>
    <div className={cn("mx-auto max-w-7xl px-6 py-3 md:px-12", innerClassName)}>{children}</div>
  </div>
)
export default StickyFilterBar