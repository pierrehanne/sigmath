export function angleGeometry(angle: number) {
  const radians = angle * Math.PI / 180;
  // Both rays fit in a 320 × 190 viewBox for the full 0–180° range.
  return { x: 160 + 130 * Math.cos(radians), y: 160 - 130 * Math.sin(radians), arcX: 160 + 45 * Math.cos(radians), arcY: 160 - 45 * Math.sin(radians) };
}

export function angleFamily(angle: number) {
  return angle === 0 ? "zero" : angle < 90 ? "acute" : angle === 90 ? "right" : angle < 180 ? "obtuse" : "straight";
}

export type RobotInstruction = "forward" | "left" | "right";
export type RobotState = { x: number; y: number; direction: number; blocked: boolean };
export const initialRobot: RobotState = { x: 0, y: 3, direction: 0, blocked: false };
const deltas = [[0, -1], [1, 0], [0, 1], [-1, 0]] as const;

export function robotStep(state: RobotState, instruction: RobotInstruction): RobotState {
  if (instruction === "left") return { ...state, direction: (state.direction + 3) % 4, blocked: false };
  if (instruction === "right") return { ...state, direction: (state.direction + 1) % 4, blocked: false };
  const x = state.x + deltas[state.direction][0];
  const y = state.y + deltas[state.direction][1];
  if (x < 0 || x > 3 || y < 0 || y > 3) return { ...state, blocked: true };
  return { ...state, x, y, blocked: false };
}

export function triangleAngles(x: number, height: number) {
  const a = Math.round(Math.atan2(height, x) * 1800 / Math.PI) / 10;
  const b = Math.round(Math.atan2(height, 100 - x) * 1800 / Math.PI) / 10;
  return [a, b, Math.round((180 - a - b) * 10) / 10];
}

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value);
}

export function moneyAmount(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}
