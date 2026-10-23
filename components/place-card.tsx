"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { useApp } from "@/components/app-provider";
import type { Place } from "@/types";

export function placeText(place: Place, language: "az" | "en" | "ru") {
  return { name: place.name[language], region: place.region[language], category: place.category[language], description: place.description[language], activity: place.activity[language], duration: place.duration[language] };
}

export function PlaceCard({ place, featured = false }: { place: Place; featured?: boolean }) {
  const { language, t } = useApp();
  const text = placeText(place, language);
  return (
    <article className={`place-card ${featured ? "place-card--featured" : ""}`}>
      <div className={`place-visual place-visual--${place.visual}`} role="img" aria-label={`${text.category}: ${text.name}`} />
      <div className="place-card__body">
        <div className="place-card__meta"><span><MapPin size={14} />{text.region}</span><span>{text.category}</span></div>
        <h3>{text.name}</h3><p>{text.description}</p>
        <div className="place-card__actions"><Link href={`/places?detail=${place.id}`} className="text-link">{t("details")} <ArrowUpRight size={15} /></Link><Link href={`/places?reserve=${place.id}`} className="button button--small button--primary">{t("reserve")}</Link></div>
      </div>
    </article>
  );
}

export function DemoBadge() {
  const { t } = useApp();
  return <span className="eyebrow"><Sparkles size={14} />{t("demoLabel")}</span>;
}
