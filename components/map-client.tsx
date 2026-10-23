"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPinned, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { MapView } from "@/components/map-view";
import { mockPlaces } from "@/data/mock-places";
import { placeText } from "@/components/place-card";
import type { Place } from "@/types";

export function MapClient() {
  const { t, language } = useApp();
  const [region, setRegion] = useState("all");
  const [selected, setSelected] = useState<Place>(mockPlaces[0]);
  useEffect(() => { const id = new URLSearchParams(window.location.search).get("place"); const match = mockPlaces.find((place) => place.id === id); if (match) setSelected(match); }, []);
  const visible = useMemo(() => mockPlaces.filter((place) => region === "all" || place.region.az === region), [region]);
  useEffect(() => { if (region !== "all" && selected.region.az !== region) { const match = mockPlaces.find((place) => place.region.az === region); if (match) setSelected(match); } }, [region, selected.region.az]);
  const selectPlace = useCallback((place: Place) => setSelected(place), []);
  const text = placeText(selected, language);
  return <AppShell><div className="page-stack"><section className="page-heading"><div><span className="eyebrow"><MapPinned size={14} />{t("mapInfo")}</span><h1>{t("navMap")}</h1><p>{t("mapBody")}</p></div><label className="select-with-icon"><SlidersHorizontal size={16} /><select value={region} onChange={(event) => setRegion(event.target.value)} aria-label={t("allRegions")}><option value="all">{t("allRegions")}</option>{[...new Set(mockPlaces.map((place) => place.region.az))].map((item) => <option key={item} value={item}>{item}</option>)}</select></label></section><section className="map-layout"><div className="map-panel"><MapView places={visible} language={language} selectedId={selected.id} onSelect={selectPlace} /></div><aside className="map-detail"><span className="section-kicker">{t("selectedPlace")}</span><div className={`detail-visual detail-visual--small place-visual--${selected.visual}`}><span className="demo-chip">{t("demoLabel")}</span></div><div className="place-card__meta"><span>{text.region}</span><span>{text.category}</span></div><h2>{text.name}</h2><p>{text.description}</p><div className="detail-facts"><span><strong>{t("duration")}</strong>{selected.duration[language]}</span><span><strong>{t("price")}</strong>{selected.price} AZN</span></div><div className="detail-actions"><Link href={`/places?detail=${selected.id}`} className="button button--soft">{t("details")}</Link><Link href={`/places?reserve=${selected.id}`} className="button button--primary">{t("reserve")}</Link></div></aside></section></div></AppShell>;
}
