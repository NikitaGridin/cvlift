import type { LocalizedValue } from "@/lib/i18n";
import { localized as l } from "@/lib/i18n";

export type PopularItRole = {
  value: string;
  label: LocalizedValue<string>;
};

export const popularItRoles: PopularItRole[] = [
  { value: "Frontend Developer", label: l("Frontend Developer", "Frontend-разработчик") },
  { value: "Backend Developer", label: l("Backend Developer", "Backend-разработчик") },
  { value: "Full-Stack Developer", label: l("Full-Stack Developer", "Full-stack разработчик") },
  { value: "Mobile Developer", label: l("Mobile Developer", "Mobile-разработчик") },
  { value: "DevOps Engineer", label: l("DevOps Engineer", "DevOps-инженер") },
  { value: "QA Automation Engineer", label: l("QA Automation Engineer", "QA Automation инженер") },
  { value: "Data Analyst", label: l("Data Analyst", "Дата-аналитик") },
  { value: "Data Scientist", label: l("Data Scientist", "Data Scientist") },
  { value: "Machine Learning Engineer", label: l("Machine Learning Engineer", "ML-инженер") },
  { value: "Product Manager", label: l("Product Manager", "Product-менеджер") },
  { value: "Project Manager", label: l("Project Manager", "Project-менеджер") },
  { value: "UI/UX Designer", label: l("UI/UX Designer", "UI/UX-дизайнер") },
  { value: "System Analyst", label: l("System Analyst", "Системный аналитик") },
  { value: "Business Analyst", label: l("Business Analyst", "Бизнес-аналитик") },
  { value: "Security Engineer", label: l("Security Engineer", "Инженер по безопасности") },
  { value: "Cloud Engineer", label: l("Cloud Engineer", "Cloud-инженер") },
  { value: "Solution Architect", label: l("Solution Architect", "Solution Architect") },
  { value: "Technical Lead", label: l("Technical Lead", "Technical Lead") },
];

export const defaultItRole = popularItRoles[0].value;
