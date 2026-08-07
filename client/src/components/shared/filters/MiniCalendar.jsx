
import { useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { BRAND_HUE } from "@/lib/hues"
import { addDays, fmtDay, sameDay, startOfDay } from "@/lib/dates"

const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const JOURS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]

const MiniCalendar = ({ range, onChange, hue = BRAND_HUE }) => {
  const today = startOfDay(new Date())
  const [view, setView] = useState(() => new Date((range.end || range.start || today).getFullYear(), (range.end || range.start || today).getMonth(), 1))
  const year = view.getFullYear()
  const month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  const { start, end } = range
  const inRange = (d) => start && end && d > start && d < end
  const atBound = (d) => sameDay(d, start) || sameDay(d, end)
  const monthStart = new Date(year, month, 1)
  const canPrev = monthStart <= addDays(today, -today.getDate() + 1) && !sameDay(monthStart, new Date(today.getFullYear(), today.getMonth(), 1))
  const canNext = monthStart < new Date(today.getFullYear(), today.getMonth(), 1)

  const pick = (d) => {
    if (!start || (start && end)) return onChange({ start: d, end: null })
    if (d < start) return onChange({ start: d, end: start })
    onChange({ start, end: d })
  }

  const presets = [
    { l: "Aujourd'hui", r: { start: today, end: today } },
    { l: "3 jours", r: { start: addDays(today, -2), end: today } },
    { l: "7 jours", r: { start: addDays(today, -6), end: today } },
    { l: "30 jours", r: { start: addDays(today, -29), end: today } },
  ]

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <button onClick={() => setView(new Date(year, month - 1, 1))} disabled={!canPrev} aria-label="Mois précédent"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-brand-navy disabled:pointer-events-none disabled:opacity-30">
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-heading text-[13px] font-bold text-brand-navy">
          {MOIS_FR[month]} <span className="font-medium text-muted-foreground">{year}</span>
        </p>
        <button onClick={() => setView(new Date(year, month + 1, 1))} disabled={!canNext} aria-label="Mois suivant"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-brand-navy disabled:pointer-events-none disabled:opacity-30">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-0.5 text-center">
        {JOURS_FR.map((d) => (
          <span key={d} className="py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{d}</span>
        ))}
        {cells.map((d, i) =>
          !d ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={d.toISOString()}
              onClick={() => pick(d)}
              disabled={d > today}
              className={cn(
                "relative mx-auto grid size-8 place-items-center rounded-full text-xs font-semibold transition-all duration-150",
                atBound(d) ? cn("text-white shadow-sm", hue.solid)
                  : inRange(d) ? "bg-surface-container-high text-brand-navy"
                  : "text-on-surface hover:bg-surface-container-low",
                d > today && "pointer-events-none opacity-25",
                sameDay(d, today) && !atBound(d) && "ring-1 ring-brand-orange"
              )}
            >
              {d.getDate()}
            </button>
          )
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-outline-variant/40 pt-3">
        {presets.map((p) => (
          <button key={p.l} onClick={() => onChange(p.r)}
            className="rounded-full border border-outline-variant/60 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant transition-colors hover:border-brand-navy hover:text-brand-navy">
            {p.l}
          </button>
        ))}
        {(start || end) && (
          <button onClick={() => onChange({ start: null, end: null })}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-brand-orange transition-colors hover:bg-brand-orange/10">
            <X className="size-3" /> Effacer
          </button>
        )}
      </div>
      <p className="mt-2.5 rounded-lg bg-surface-container-low px-3 py-2 text-[11px] font-semibold text-on-surface-variant">
        <CalendarDays className="mr-1.5 inline size-3.5 -translate-y-px text-brand-orange" />
        {start && end ? `Du ${fmtDay(start)} au ${fmtDay(end)}`
          : start ? `À partir du ${fmtDay(start)} — choisissez une fin`
          : "Toutes les dates"}
      </p>
    </div>
  )
}
export default MiniCalendar