"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useI18n } from "@/components/preferences-provider";

const legacyPreferencePrefix = "cv" + "pilot";
const noticeCookieName = "offerlyra_cookie_notice";
const consentCookieName = "offerlyra_cookie_consent";
const legacyConsentCookieName = `${legacyPreferencePrefix}_cookie_consent`;
const noticeMaxAge = 60 * 60 * 24 * 180;
const noticeChangeEvent = "offerlyra-cookie-notice-change";

export function CookieConsent() {
  const { t } = useI18n();
  const hasSeenNotice = useSyncExternalStore(
    subscribeToNotice,
    getNoticeSnapshot,
    getServerNoticeSnapshot,
  );

  function dismissNotice() {
    document.cookie = `${noticeCookieName}=seen; Max-Age=${noticeMaxAge}; Path=/; SameSite=Lax`;
    window.dispatchEvent(new Event(noticeChangeEvent));
  }

  if (hasSeenNotice) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 sm:pb-6">
      <section className="pointer-events-auto max-w-2xl rounded-[24px] border border-black/[0.06] bg-white/90 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
          <span className="flex size-11 items-center justify-center rounded-[18px] bg-[#6366F1]/10 text-[#6366F1]">
            <Cookie aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">{t("cookie.title")}</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
              {t("cookie.text")} {t("cookie.read")}{" "}
              <Link href="/cookies" className="font-bold text-[#6366F1] hover:text-[#4F46E5]">
                {t("cookie.policy")}
              </Link>
              .
            </p>
          </div>
          <div className="sm:col-start-2">
            <button
              type="button"
              onClick={dismissNotice}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#6366F1] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(99,102,241,0.24)] transition duration-200 hover:bg-[#4F46E5]"
            >
              {t("cookie.dismiss")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function subscribeToNotice(callback: () => void) {
  window.addEventListener(noticeChangeEvent, callback);
  return () => window.removeEventListener(noticeChangeEvent, callback);
}

function getNoticeSnapshot() {
  return (
    document.cookie.includes(`${noticeCookieName}=`) ||
    document.cookie.includes(`${consentCookieName}=`) ||
    document.cookie.includes(`${legacyConsentCookieName}=`)
  );
}

function getServerNoticeSnapshot() {
  return true;
}
