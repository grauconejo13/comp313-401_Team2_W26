import { useState } from "react";
import type { GhostSuggestion } from "../../types/dashboard.types";
import "../../styles/ghost.css";

interface GhostSignalOrbsProps {
  suggestions: GhostSuggestion[];
}

export function GhostSignalOrbs({ suggestions }: GhostSignalOrbsProps) {
  const [active, setActive] = useState<number | null>(null);

  if (suggestions.length === 0) return null;

  return (
    <div className="ghost-signals">
      <div className="ghost-signals__label">Week & month cutback cues — hover an orb</div>
      <div className="ghost-signals__orbs">
        {suggestions.map((s, idx) => (
          <div
            key={`${s.title}-${idx}`}
            className={`ghost-orb-wrap ${active === idx ? "is-lit" : ""}`}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(idx)}
            onBlur={() => setActive(null)}
            tabIndex={0}
          >
            <button type="button" className="ghost-orb" aria-label={s.title}>
              <span className="ghost-orb__glow" />
            </button>
            <span className="ghost-orb__title">{s.title}</span>
          </div>
        ))}
      </div>
      <div className={`ghost-signals__panel ${active !== null ? "is-visible" : ""}`} aria-live="polite">
        {active !== null && (
          <div key={active} className="ghost-signals__panel-inner">
            <strong className="d-block text-light mb-1 opacity-90">{suggestions[active].title}</strong>
            <p className="mb-0 small text-white-50">{suggestions[active].detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
