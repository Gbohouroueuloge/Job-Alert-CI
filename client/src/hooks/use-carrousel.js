
import { useEffect, useState } from "react"
import { animate, useMotionValue } from "framer-motion"

/**
 * Rotation automatique partagée (CarteUne, ConseilDuJour…).
 * Retourne idx, setIdx, progression (MotionValue 0→1), pause/reprendre.
 */
const useCarrousel = ({ count, duree = 6500 }) => {
  const [idx, setIdx] = useState(0)
  const [enPause, setEnPause] = useState(false)
  const progression = useMotionValue(0)

  /* Remise à zéro de la barre à chaque changement d'élément */
  useEffect(() => { progression.set(0) }, [idx, progression])

  /* Minuteur lié à la barre — reprend au temps restant après une pause */
  useEffect(() => {
    if (enPause) return
    const controles = animate(progression, 1, {
      duration: (duree / 1000) * (1 - progression.get()),
      ease: "linear",
      onComplete: () => setIdx((i) => (i + 1) % count),
    })
    return () => controles.stop()
  }, [idx, enPause, progression, count, duree])

  return {
    idx, setIdx, progression, enPause,
    pause: () => setEnPause(true),
    reprendre: () => setEnPause(false),
  }
}
export default useCarrousel