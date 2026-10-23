"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowRight, CalendarDays, Compass, Map, MapPinned, Sparkles, Users, WalletCards } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { MapView } from "@/components/map-view";
import { PlaceCard, placeText } from "@/components/place-card";
import { mockPlaces } from "@/data/mock-places";
import type { Place } from "@/types";

export function DashboardRedesign() {
  const { t, session, language, requests, notifications } = useApp();
  const [selected, setSelected] = useState<Place>(mockPlaces[0]);
  const selectPlace = useCallback((place: Place) => setSelected(place), []);
  const user = session?.firstName || "AqroQR";
  const selectedText = placeText(selected, language);
  const unread = notifications.filter((item) => !item.read).length;

  return <AppShell><div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow"><Sparkles size={14} />{t("recommendation")}</span><h1>{t("hello")}, {user}.</h1><p>{t("planTripBody")}</p></div><Link href="/places" className="button button--primary">{t("browsePlaces")} <ArrowRight size={17} /></Link></section>
    <section className="dashboard-hero"><div><span className="eyebrow"><Compass size={14} />AqroQR</span><h2>{t("planTrip")}</h2><p>{t("planTripBody")}</p><div className="hero-actions"><Link href="/places" className="button button--light">{t("browsePlaces")}</Link><a href="#explore-map" className="text-link text-link--light"><Map size={16} />{t("openMap")}</a></div></div></section>
    <section className="stat-grid"><Stat icon={<Map />} value={`${mockPlaces.length}`} label={t("totalPlaces")} /><Stat icon={<CalendarDays />} value={`${requests.length}`} label={t("navRequests")} /><Stat icon={<Users />} value={`${unread}`} label={t("unread")} /><Stat icon={<WalletCards />} value={language.toUpperCase()} label={t("language")} /></section>
    <section className="section-block"><div className="section-head"><div><span className="section-kicker">{t("recommendation")}</span><h2>{t("featured")}</h2></div><Link href="/places" className="text-link">{t("seeAll")} <ArrowRight size={15} /></Link></div><div className="place-grid place-grid--featured">{mockPlaces.slice(0, 3).map((place) => <PlaceCard key={place.id} place={place} featured />)}</div></section>
    <section className="section-block dashboard-map-section" id="explore-map"><div className="section-head"><div><span className="section-kicker">{t("navMap")}</span><h2>{t("mapExploreTitle")}</h2><p>{t("mapExploreBody")}</p></div><Link href="/map" className="text-link">{t("openMap")} <ArrowRight size={15} /></Link></div><div className="dashboard-map-layout"><div className="dashboard-map-canvas"><MapView places={mockPlaces} language={language} selectedId={selected.id} onSelect={selectPlace} /></div><div className="dashboard-map-place"><span className="map-place-eyebrow"><MapPinned size={15} />{selectedText.region} · {selectedText.category}</span><div className={`dashboard-map-photo place-visual--${selected.visual}`} role="img" aria-label={selectedText.name} /><h3>{selectedText.name}</h3><p>{selectedText.description}</p><div className="map-place-facts"><span>{selectedText.duration}</span><span>{selected.price} AZN</span></div><div className="dashboard-map-links"><Link href={`/places?detail=${selected.id}`} className="button button--primary">{t("details")} <ArrowRight size={16} /></Link><Link href={`/places?reserve=${selected.id}`} className="text-link">{t("reserve")}</Link></div></div></div><p className="map-disclaimer">{t("mapDisclaimer")}</p></section>
    <section className="section-block"><div className="section-head"><div><span className="section-kicker">{t("navRequests")}</span><h2>{t("requestsPreview")}</h2></div><Link href="/requests" className="text-link">{t("seeAll")} <ArrowRight size={15} /></Link></div>{requests.length === 0 ? <div className="empty-card"><CalendarDays size={22} /><div><strong>{t("noRequests")}</strong><p>{t("createFirst")}</p></div><Link href="/places" className="button button--soft">{t("browsePlaces")}</Link></div> : <div className="request-preview">{requests.slice(0, 3).map((request) => <div className="request-row" key={request.id}><span className="request-icon"><CalendarDays size={18} /></span><div><strong>{mockPlaces.find((place) => place.id === request.placeId)?.name[language]}</strong><small>{request.date}</small></div><span className={`status status--${request.status}`}>{t(request.status)}</span><Link href="/requests" className="icon-button" aria-label={t("view")}><ArrowRight size={17} /></Link></div>)}</div>}</section>
  </div></AppShell>;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <div className="stat-card"><span className="stat-icon">{icon}</span><strong>{value}</strong><span>{label}</span></div>; }
