import { useEffect, useRef, useState } from "react";
import "./boot-loader.css";

const EXIT_D = 1700; // durée de la sortie : flash → panneaux → blanc

export default function BootLoader({ minDurationMs = 3200, onFinish }) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const exitD = reduced ? 500 : EXIT_D;
  const holdD = reduced ? 300 : Math.max(500, minDurationMs - EXIT_D);

  // eslint-disable-next-line react-hooks/purity
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  /* Horloge globale */
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 50);
    return () => clearInterval(id);
  }, []);

  const progress = Math.min(1, elapsed / holdD);
  const isExit = elapsed >= holdD;

  /* Fin : callback une fois la transition terminée */
  useEffect(() => {
    if (isExit) {
      const t = setTimeout(() => onFinish?.(), exitD - 80);
      return () => clearTimeout(t);
    }
  }, [isExit, exitD, onFinish]);

  /* Verrouillage du scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className={`bl-root ${isExit ? "is-exit" : ""}`} aria-hidden={isExit}>
      {/* Écran blanc révélé par l'ouverture des panneaux */}
      <div className="bl-white" />

      {/* Panneaux navy — s'ouvrent comme une enveloppe */}
      <div className="bl-panel bl-panel--top" />
      <div className="bl-panel bl-panel--bottom" />

      {/* Décor ambiant subtil (fondu à la sortie) */}
      <div className="bl-bg">
        <div className="bl-glow bl-glow--orange" />
        <div className="bl-glow bl-glow--blue" />
        <div className="bl-pattern" />
      </div>

      {/* Couture orange : se charge pendant l'attente, s'embrase à la sortie */}
      <div
        className="bl-seam"
        style={
          isExit
            ? undefined
            : {
                transform: `scaleX(${progress})`,
                opacity: 0.12 + progress * 0.55,
                boxShadow: `0 0 ${8 + progress * 30}px ${progress * 5}px rgba(245,166,35,${0.15 + progress * 0.35})`,
              }
        }
      />
    </div>
  );
}