
import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

/* ════════════════════════════════════════════════════════════════════
FILTRES ↔ URL — la query string est la source de vérité.
Aucun rechargement : lecture réactive via useSearchParams,
écriture en replace (pas de pollution de l'historique).

Config (constante de module, jamais inline dans le composant) :
  sets    → [{ key, param }]          ex. { key: "filieres", param: "fil" }
  scalars → [{ key, param, defaut }]  ex. { key: "sort", param: "tri", defaut: "recent" }
  period  → { debut, fin }            ex. { debut: "du", fin: "au" }
════════════════════════════════════════════════════════════════════ */
const parseSet = (v) => new Set(v ? v.split(",").filter(Boolean) : [])
const serialSet = (s) => [...s].join(",")

const parseDate = (v) => {
  if (!v) return null
  const d = new Date(`${v}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}
const serialDate = (d) => {
  if (!d) return null
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const j = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${j}`
}

export const useUrlFilters = ({ sets = [], scalars = [], period = null }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  /* ── URL → état (sets + période) ── */
  const filters = useMemo(() => {
    const f = {}
    sets.forEach(({ key, param }) => { f[key] = parseSet(searchParams.get(param)) })
    if (period) {
      f.period = {
        start: parseDate(searchParams.get(period.debut)),
        end: parseDate(searchParams.get(period.fin)),
      }
    }
    return f
  }, [searchParams, sets, period])

  /* ── URL → état (scalaires : tri, vue, recherche…) ── */
  const valeurs = useMemo(() => {
    const v = {}
    scalars.forEach(({ key, param, defaut = "" }) => { v[key] = searchParams.get(param) ?? defaut })
    return v
  }, [searchParams, scalars])

  /* ── état → URL ── */
  const toggle = useCallback((key, value) => {
    const def = sets.find((s) => s.key === key)
    if (!def) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const current = parseSet(next.get(def.param))
      current.has(value) ? current.delete(value) : current.add(value)
      current.size ? next.set(def.param, serialSet(current)) : next.delete(def.param)
      return next
    }, { replace: true })
  }, [sets, setSearchParams])

  const setScalar = useCallback((key, value) => {
    const def = scalars.find((s) => s.key === key)
    if (!def) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      value && value !== def.defaut ? next.set(def.param, value) : next.delete(def.param)
      return next
    }, { replace: true })
  }, [scalars, setSearchParams])

  const setPeriod = useCallback((range) => {
    if (!period) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const debut = serialDate(range?.start)
      const fin = serialDate(range?.end)
      debut ? next.set(period.debut, debut) : next.delete(period.debut)
      fin ? next.set(period.fin, fin) : next.delete(period.fin)
      return next
    }, { replace: true })
  }, [period, setSearchParams])

  const reset = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      sets.forEach(({ param }) => next.delete(param))
      scalars.forEach(({ param }) => next.delete(param))
      if (period) { next.delete(period.debut); next.delete(period.fin) }
      return next
    }, { replace: true })
  }, [sets, scalars, period, setSearchParams])

  return { filters, valeurs, toggle, setScalar, setPeriod, reset }
}