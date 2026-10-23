"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Info, MapPin, Users } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { placeText } from "@/components/place-card";
import { placeDetails } from "@/data/place-details";
import type { Place } from "@/types";

export function PlaceDetailRich({ place, onReserve }: { place: Place; onReserve: () => void }) {
  const { t, language } = useApp();
  const text = placeText(place, language);
  const story = placeDetails[place.id];
  return <div className="rich-detail">
    <div className={`rich-detail__photo place-visual--${place.visual}`} role="img" aria-label={text.name} />
    <div className="rich-detail__intro"><span className="place-card__meta"><MapPin size={15} />{text.region} · {text.category}</span><p>{story.overview[language]}</p></div>
    <div className="rich-detail__facts"><span><Clock3 size={18} /><small>{t("duration")}</small><strong>{text.duration}</strong></span><span><Users size={18} /><small>{t("capacity")}</small><strong>{place.capacity}</strong></span><span><CalendarDays size={18} /><small>{t("price")}</small><strong>{place.price} AZN</strong></span></div>
    <div className="rich-detail__sections"><section><h3>{t("detailHighlights")}</h3><ul>{story.highlights.map((item) => <li key={item.az}><Check size={16} />{item[language]}</li>)}</ul></section><aside><h3>{t("detailGoodToKnow")}</h3><p>{story.tip[language]}</p><div className="rich-detail__notice"><Info size={17} /><span>{t("detailDisclaimer")}</span></div></aside></div>
    <div className="rich-detail__actions"><button className="button button--primary" onClick={onReserve}>{t("reserve")} <ArrowRight size={16} /></button><Link href={`/map?place=${place.id}`} className="button button--soft"><MapPin size={16} />{t("showOnMap")}</Link></div>
  </div>;
}
