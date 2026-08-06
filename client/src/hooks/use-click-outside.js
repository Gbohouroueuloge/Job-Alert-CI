import { useEffect } from "react"

const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onOutside() }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [ref, onOutside])
}
export default useClickOutside