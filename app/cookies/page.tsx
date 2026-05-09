import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Cookie Policy | CVlift",
  description:
    "How CVlift uses essential cookies, preference cookies, and optional product improvement cookies.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title={l("Cookie Policy", "Политика cookie")}
      description={l(
        "This policy explains the cookie categories CVlift may use and how your choice is stored.",
        "Эта политика объясняет, какие категории cookie может использовать CVlift и как сохраняется ваш выбор.",
      )}
      sections={[
        {
          title: l("What cookies are", "Что такое cookie"),
          text: l(
            "Cookies are small pieces of data stored by your browser. They help websites remember sessions, preferences, and basic product choices.",
            "Cookie — это небольшие данные, которые хранит браузер. Они помогают сайтам помнить сессии, предпочтения и базовые настройки продукта.",
          ),
        },
        {
          title: l("Essential cookies", "Обязательные cookie"),
          text: l(
            "Essential cookies are required for core product behavior and cannot be turned off inside CVlift.",
            "Обязательные cookie нужны для основной работы продукта и не отключаются внутри CVlift.",
          ),
          bullets: [
            l(
              "Authentication and session cookies for sign-in.",
              "Cookie аутентификации и сессии для входа.",
            ),
            l(
              "Security cookies that protect account access.",
              "Cookie безопасности, которые защищают доступ к аккаунту.",
            ),
            l(
              "Cookie preference storage so the banner does not reappear every visit.",
              "Хранение выбора cookie, чтобы баннер не появлялся при каждом визите.",
            ),
          ],
        },
        {
          title: l("Optional cookies", "Необязательные cookie"),
          text: l(
            "Optional cookies may be used to understand product usage and improve the user experience, but only after you accept them.",
            "Необязательные cookie могут использоваться для понимания использования продукта и улучшения опыта, но только после вашего согласия.",
          ),
          bullets: [
            l(
              "Product improvement and usage measurement.",
              "Улучшение продукта и измерение использования.",
            ),
            l(
              "Experience personalization where available.",
              "Персонализация опыта там, где она доступна.",
            ),
            l(
              "Performance insights for public pages.",
              "Аналитика производительности публичных страниц.",
            ),
          ],
        },
        {
          title: l("How to change your choice", "Как изменить выбор"),
          text: l(
            "You can clear site cookies in your browser settings to reset the banner and choose again. If you block essential cookies, sign-in and analysis history may not work correctly.",
            "Можно очистить cookie сайта в настройках браузера, чтобы сбросить баннер и выбрать заново. Если заблокировать обязательные cookie, вход и история анализа могут работать некорректно.",
          ),
        },
        {
          title: l("Current consent choices", "Текущие варианты согласия"),
          text: l(
            "The banner lets you choose Necessary only or Accept all. CVlift stores that choice in a cookie named cvlift_cookie_consent.",
            "Баннер позволяет выбрать только необходимые cookie или принять все. CVlift хранит этот выбор в cookie cvlift_cookie_consent.",
          ),
        },
      ]}
    />
  );
}
