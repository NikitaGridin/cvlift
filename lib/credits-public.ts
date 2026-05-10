export const CREDIT_NAME = "Токены";
export const ANALYSIS_CREDIT_COST = 1;
export const TOKEN_PRICE_RUB = 99;

export type WalletSummary = {
  balance: number;
  lifetimeCredits: number;
  spentCredits: number;
};

export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  amountRubles: number;
  description: string;
  badge?: string;
};

export const creditPackages: CreditPackage[] = [
  {
    id: "starter",
    name: "1 токен",
    credits: 1,
    amountRubles: TOKEN_PRICE_RUB,
    description: "Для одного анализа резюме или сценария подготовки.",
  },
  {
    id: "focused",
    name: "5 токенов",
    credits: 5,
    amountRubles: 399,
    description: "Для HR-скрининга, вопросов и нескольких итераций резюме.",
    badge: "Популярно",
  },
  {
    id: "career",
    name: "10 токенов",
    credits: 10,
    amountRubles: 799,
    description: "Для полного цикла подготовки к нескольким вакансиям.",
  },
];

export function formatRubles(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}
