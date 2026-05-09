import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service | CVlift",
  description:
    "Terms for using CVlift resume analysis, resume improvement, and cover letter generation.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={l("Terms of Service", "Условия сервиса")}
      description={l(
        "These terms describe the basic rules for using CVlift and the responsibilities that come with resume analysis.",
        "Эти условия описывают базовые правила использования CVlift и ответственность, связанную с анализом резюме.",
      )}
      sections={[
        {
          title: l("Using CVlift", "Использование CVlift"),
          text: l(
            "CVlift helps users analyze resumes, compare resumes with vacancies, generate improved resume drafts, and create cover letters.",
            "CVlift помогает анализировать резюме, сравнивать их с вакансиями, создавать улучшенные черновики и сопроводительные письма.",
          ),
          bullets: [
            l(
              "You must sign in before running resume analysis.",
              "Перед запуском анализа резюме нужно войти в аккаунт.",
            ),
            l(
              "You are responsible for the files and text you submit.",
              "Вы отвечаете за файлы и текст, которые отправляете.",
            ),
            l(
              "You should use the product only for lawful job search and career purposes.",
              "Продукт следует использовать только для законного поиска работы и карьерных целей.",
            ),
          ],
        },
        {
          title: l("Generated content", "Сгенерированный контент"),
          text: l(
            "AI-generated recommendations and documents are drafts. They may contain placeholders, errors, or suggestions that require human review.",
            "AI-рекомендации и документы являются черновиками. Они могут содержать плейсхолдеры, ошибки или предложения, требующие проверки человеком.",
          ),
          bullets: [
            l(
              "Review every generated resume and cover letter before sending it.",
              "Проверяйте каждое сгенерированное резюме и письмо перед отправкой.",
            ),
            l(
              "Replace bracketed placeholders with verified details.",
              "Заменяйте плейсхолдеры в скобках проверенными деталями.",
            ),
            l(
              "Do not use unsupported claims, fake credentials, or inaccurate employment details.",
              "Не используйте неподтвержденные утверждения, фиктивные квалификации или неточные данные о работе.",
            ),
          ],
        },
        {
          title: l("No job guarantee", "Нет гарантии трудоустройства"),
          text: l(
            "CVlift can improve resume clarity and application quality, but it cannot guarantee interviews, job offers, salary outcomes, or employer decisions.",
            "CVlift может улучшить ясность резюме и качество отклика, но не гарантирует интервью, офферы, зарплатные результаты или решения работодателей.",
          ),
        },
        {
          title: l("Account security", "Безопасность аккаунта"),
          text: l(
            "Users are responsible for keeping access to their Google account secure and signing out on shared devices.",
            "Пользователи отвечают за безопасность доступа к своему Google-аккаунту и выход из аккаунта на общих устройствах.",
          ),
        },
        {
          title: l("Changes to the service", "Изменения сервиса"),
          text: l(
            "CVlift may update product features, content, policies, and terms over time to improve the service and comply with operational needs.",
            "CVlift может обновлять функции, контент, политики и условия, чтобы улучшать сервис и соответствовать операционным требованиям.",
          ),
        },
      ]}
    />
  );
}
