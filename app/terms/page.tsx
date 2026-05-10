import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Условия сервиса | OfferLyra",
  description:
    "Условия использования AI-платформы OfferLyra для подготовки к собеседованию, анализа резюме, HR-скрининга и технических интервью.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={l("Terms of Service", "Условия сервиса")}
      description={l(
        "These terms describe the basic rules for using OfferLyra and the responsibilities that come with interview preparation.",
        "Эти условия описывают базовые правила использования OfferLyra и ответственность, связанную с подготовкой к собеседованиям.",
      )}
      sections={[
        {
          title: l("Using OfferLyra", "Использование OfferLyra"),
          text: l(
            "OfferLyra helps users create and analyze resumes, compare resumes with vacancies, practice interview questions, run AI screening, and prepare for technical interviews.",
            "OfferLyra помогает создавать и анализировать резюме, сравнивать их с вакансиями, тренировать вопросы, проходить AI-скрининг и готовиться к техническим интервью.",
          ),
          bullets: [
            l(
              "You must sign in before using saved preparation scenarios.",
              "Перед запуском сохраненных сценариев подготовки нужно войти в аккаунт.",
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
              "Review every generated resume, answer draft, and recommendation before using it.",
              "Проверяйте каждое сгенерированное резюме, черновик ответа и рекомендацию перед использованием.",
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
            "OfferLyra can improve preparation quality, resume clarity, and interview readiness, but it cannot guarantee interviews, job offers, salary outcomes, or employer decisions.",
            "OfferLyra может улучшить качество подготовки, ясность резюме и готовность к интервью, но не гарантирует приглашения, офферы, зарплатные результаты или решения работодателей.",
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
            "OfferLyra may update product features, content, policies, and terms over time to improve the service and comply with operational needs.",
            "OfferLyra может обновлять функции, контент, политики и условия, чтобы улучшать сервис и соответствовать операционным требованиям.",
          ),
        },
      ]}
    />
  );
}
