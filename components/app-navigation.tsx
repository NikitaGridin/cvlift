"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Coins, History, ScanSearch } from "lucide-react";
import { useI18n } from "@/components/preferences-provider";
import type { TranslationKey } from "@/lib/i18n";

const navigation = [
  { href: "/upload", labelKey: "common.analysis", icon: ScanSearch },
  { href: "/agent", labelKey: "common.agent", icon: Bot },
  { href: "/history", labelKey: "common.history", icon: History },
  { href: "/credits", labelKey: "common.creditsPage", icon: Coins },
].map((item) => ({ ...item, labelKey: item.labelKey as TranslationKey }));

export function AppNavigation() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 py-3 lg:mx-0 lg:flex-col lg:items-stretch lg:gap-2 lg:overflow-visible lg:px-0 lg:py-0 lg:pt-8">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition duration-200 lg:w-full ${
              active
                ? "bg-[#6366F1] text-white shadow-[0_14px_34px_rgba(99,102,241,0.26)]"
                : "text-[#64748B] hover:bg-[#F3F5FB] hover:text-[#0F172A]"
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`size-4 shrink-0 transition duration-200 ${
                active ? "text-[#050605]" : "text-[#94A3B8] group-hover:text-[#6366F1]"
              }`}
            />
            <span className="hidden lg:inline">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
