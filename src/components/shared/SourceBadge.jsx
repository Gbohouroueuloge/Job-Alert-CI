
import { FaLinkedin } from "react-icons/fa6"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SOURCES } from "@/lib/referentiels"
import { getImgSource } from "@/utils/utilsSource"

export const SourceLogo = ({ code, className = "size-4" }) => {
  const s = SOURCES.find((x) => x.code === code)
  if (!s) return null
  return (
    <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded", className)}>
      {s.linkedin
        ? <FaLinkedin className="size-full text-[#0A66C2]" />
        : <img src={getImgSource(code)} alt={code} className="size-full object-contain" />}
    </span>
  )
}

export const ChipSource = ({ source, tooltip, className, logoClassName = "size-4" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={cn(
        "inline-flex cursor-default items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-low/60 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant",
        className
      )}>
        <SourceLogo code={source} className={logoClassName} />
        {source}
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">{tooltip ?? `Collectée sur ${source} ce matin`}</TooltipContent>
  </Tooltip>
)