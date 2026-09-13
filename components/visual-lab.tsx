import type { ReactNode } from "react";

export function VisualLab({ title, instruction, children }: { title: string; instruction: string; children: ReactNode }) {
  return <section className="visual-lab" aria-label={title}><header><span>Laboratoire visuel</span><h3>{title}</h3><p>{instruction}</p></header>{children}</section>;
}

export function LabSlider({ label, value, min, max, step = 1, display, onChange }: { label: string; value: number; min: number; max: number; step?: number; display?: string; onChange: (value: number) => void }) {
  return <label className="visual-slider"><span>{label}<strong>{display ?? value}</strong></span><input type="range" min={min} max={max} step={step} value={value} aria-valuetext={display ?? String(value)} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
