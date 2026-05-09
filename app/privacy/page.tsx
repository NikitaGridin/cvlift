import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy | CVlift",
  description:
    "How CVlift handles account information, resume content, vacancy text, analysis history, and user choices.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={l("Privacy Policy", "Политика приватности")}
      description={l(
        "This policy explains what CVlift collects, why it is used, and how users can manage their information.",
        "Эта политика объясняет, что CVlift собирает, зачем это используется и как пользователи могут управлять своей информацией.",
      )}
      sections={[
        {
          title: l("Information you provide", "Информация, которую вы предоставляете"),
          text: l(
            "CVlift works with the information you choose to submit while using the product.",
            "CVlift работает с информацией, которую вы сами передаете при использовании продукта.",
          ),
          bullets: [
            l(
              "Account details from Google sign-in, such as name and email.",
              "Данные аккаунта из входа через Google, например имя и email.",
            ),
            l("Resume files and extracted resume text.", "Файлы резюме и извлеченный текст резюме."),
            l(
              "Vacancy text that you provide for role matching.",
              "Текст вакансии, который вы добавляете для сопоставления с ролью.",
            ),
            l(
              "Generated scores, recommendations, improved resumes, cover letters, and analysis history.",
              "Сгенерированные оценки, рекомендации, улучшенные резюме, сопроводительные письма и история анализа.",
            ),
          ],
        },
        {
          title: l("How the information is used", "Как используется информация"),
          text: l(
            "The information is used to run resume analysis, show results, keep user history, and improve the product experience.",
            "Информация используется для анализа резюме, показа результатов, хранения истории и улучшения продукта.",
          ),
          bullets: [
            l(
              "Generate resume scores, weak points, strong points, and recommended fixes.",
              "Генерировать оценки резюме, слабые и сильные стороны, а также рекомендованные правки.",
            ),
            l(
              "Compare a resume with a vacancy when you choose vacancy mode.",
              "Сравнивать резюме с вакансией, когда выбран режим вакансии.",
            ),
            l(
              "Let signed-in users reopen previous analyses.",
              "Позволять авторизованным пользователям открывать прошлые анализы.",
            ),
            l(
              "Maintain product security and prevent abuse.",
              "Поддерживать безопасность продукта и предотвращать злоупотребления.",
            ),
          ],
        },
        {
          title: l("AI processing", "AI-обработка"),
          text: l(
            "Resume and vacancy content may be processed by AI systems to produce analysis results. You should review generated content before using it in a real application.",
            "Контент резюме и вакансии может обрабатываться AI-системами для создания результата анализа. Перед использованием в реальном отклике нужно проверить сгенерированный контент.",
          ),
          bullets: [
            l(
              "Do not upload information you are not allowed to share.",
              "Не загружайте информацию, которой вы не имеете права делиться.",
            ),
            l(
              "Verify all generated claims, numbers, and placeholders before applying.",
              "Проверяйте все сгенерированные утверждения, цифры и плейсхолдеры перед откликом.",
            ),
            l(
              "Remove sensitive details from a resume if they are not needed for analysis.",
              "Удаляйте чувствительные данные из резюме, если они не нужны для анализа.",
            ),
          ],
        },
        {
          title: l("Cookies and sign-in", "Cookie и вход"),
          text: l(
            "CVlift uses cookies to support sign-in, session security, product preferences, and service improvement. By continuing to use the website, you agree to this cookie use.",
            "CVlift использует cookie для входа, безопасности сессии, настроек продукта и улучшения сервиса. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie.",
          ),
          bullets: [
            l(
              "Essential cookies keep you signed in and protect account access.",
              "Обязательные cookie помогают оставаться в аккаунте и защищают доступ.",
            ),
            l(
              "Notice cookies remember that the cookie banner has already been shown.",
              "Cookie уведомления запоминают, что баннер о cookie уже был показан.",
            ),
            l(
              "You can control or block cookies in your browser settings.",
              "Вы можете управлять cookie или блокировать их в настройках браузера.",
            ),
          ],
        },
        {
          title: l("Data choices", "Управление данными"),
          text: l(
            "Users should be able to request access, correction, or deletion of their account-related information where applicable.",
            "Пользователи могут запрашивать доступ, исправление или удаление информации аккаунта, где это применимо.",
          ),
          bullets: [
            l(
              "You can sign out from the product sidebar.",
              "Вы можете выйти через боковую панель продукта.",
            ),
            l(
              "You can request deletion of stored resume analyses.",
              "Вы можете запросить удаление сохраненных анализов резюме.",
            ),
            l(
              "You can contact CVlift at support@cvlift.app for privacy requests.",
              "По вопросам приватности можно связаться с CVlift: support@cvlift.app.",
            ),
          ],
        },
      ]}
    />
  );
}
