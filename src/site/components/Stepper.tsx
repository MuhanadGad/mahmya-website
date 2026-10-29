import { Minus, Plus } from 'lucide-react';

/** Labelled − / + counter. Steps apply to the latest value so fast clicks all count. */
export function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div className="s-stepper">
      <div className="s-stepper-text">
        <span className="s-stepper-label">{label}</span>
        {hint && <span className="s-stepper-hint">{hint}</span>}
      </div>
      <div className="s-stepper-controls" role="group" aria-label={label}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>
          <Minus size={16} />
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
