"use client";

import { useApp } from "@/components/app-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useApp();
  return (
    <label className="language-select">
      <span className="sr-only">{t("language")}</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={t("language")}>
        <option value="az">AZ</option>
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
    </label>
  );
}
