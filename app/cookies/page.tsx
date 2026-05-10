import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Политика cookie | OfferLyra",
  description:
    "Как OfferLyra использует cookie для входа, безопасности, настроек и улучшения продукта.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title={l("Cookie Policy", "Политика cookie")}
      description={l(
        "This policy explains how OfferLyra uses cookies. By continuing to use the website, you agree to this cookie use.",
        "Эта политика объясняет, как OfferLyra использует cookie. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie.",
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
            "Essential cookies are required for core product behavior and cannot be turned off inside OfferLyra.",
            "Обязательные cookie нужны для основной работы продукта и не отключаются внутри OfferLyra.",
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
              "Cookie notice storage so the banner does not reappear every visit.",
              "Хранение отметки о показе уведомления, чтобы баннер не появлялся при каждом визите.",
            ),
          ],
        },
        {
          title: l("Product and preference cookies", "Cookie продукта и настроек"),
          text: l(
            "OfferLyra may use cookies to remember product preferences, understand usage, improve public pages, and make the service more stable.",
            "OfferLyra может использовать cookie, чтобы запоминать настройки продукта, понимать использование, улучшать публичные страницы и делать сервис стабильнее.",
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
          title: l("How to control cookies", "Как управлять cookie"),
          text: l(
            "You can clear or block site cookies in your browser settings. If you block essential cookies, sign-in and preparation history may not work correctly.",
            "Вы можете очистить или заблокировать cookie сайта в настройках браузера. Если заблокировать обязательные cookie, вход и история подготовки могут работать некорректно.",
          ),
        },
        {
          title: l("Website use means agreement", "Использование сайта означает согласие"),
          text: l(
            "The banner is informational. OfferLyra stores a technical cookie named offerlyra_cookie_notice only to remember that the notice has already been shown.",
            "Баннер носит информационный характер. OfferLyra хранит техническую cookie offerlyra_cookie_notice только для того, чтобы помнить, что уведомление уже было показано.",
          ),
        },
      ]}
    />
  );
}
