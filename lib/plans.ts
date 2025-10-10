export const PLANS = {
  FREE: { id: "FREE", name: "Free", price: 0 },
  PLUS: { id: "PLUS", name: "Plus", price: 1000 },
  PRO:  { id: "PRO",  name: "Pro",  price: 3000 },
} as const;

export type PlanKey = keyof typeof PLANS;

export function asPlanKey(v: unknown): PlanKey {
  return (v === "PLUS" || v === "PRO" || v === "FREE") ? v : "FREE";
}
