import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"

const CountUp = ({ to, prefix = "", suffix = "", duration = 1.3, format = true, className }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: "some" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{format ? value.toLocaleString("fr-FR") : value}{suffix}
    </span>
  )
}
export default CountUp