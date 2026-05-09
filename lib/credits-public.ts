export const CREDIT_NAME = "CV Credits";
export const ANALYSIS_CREDIT_COST = 1;

export type WalletSummary = {
  balance: number;
  lifetimeCredits: number;
  spentCredits: number;
};

export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  amountUsdCents: number;
  description: string;
  badge?: string;
};

export const creditPackages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 5,
    amountUsdCents: 500,
    description: "For quick resume checks before several applications.",
  },
  {
    id: "focused",
    name: "Focused",
    credits: 15,
    amountUsdCents: 1500,
    description: "Best for focused job search sprints and role tailoring.",
    badge: "Most popular",
  },
  {
    id: "career",
    name: "Career",
    credits: 30,
    amountUsdCents: 3000,
    description: "For repeated iterations across multiple roles and resumes.",
  },
];

export function formatUsdCents(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 100 === 0 ? 0 : 2,
  }).format(value / 100);
}
