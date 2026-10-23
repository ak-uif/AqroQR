"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Filter, Search, CalendarDays, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { Modal } from "@/components/modal";
import { PlaceCard, placeText } from "@/components/place-card";
import { PlaceDetailRich } from "@/components/place-detail-rich";
import { mockPlaces } from "@/data/mock-places";
import type { Place } from "@/types";

export function PlacesClient() {
  const { t, language, addRequest } = useApp();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [category, setCategory] = useState("all");
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [reservePlace, setReservePlace] = useState<Place | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reservation, setReservation] = useState({ date: "", participants: "2", activity: "", note: "" });

  useEffect(() => { const detail = params.get("detail"); const reserve = params.get("reserve"); if (detail) setDetailPlace(mockPlaces.find((place) => place.id === detail) ?? null); if (reserve) setReservePlace(mockPlaces.find((place) => place.id === reserve) ?? null); }, [params]);
  const regions = [...new Set(mockPlaces.map((place) => place.region.az))];
  const categories = [...new Set(mockPlaces.map((place) => place.category.az))];
  const visiblePlaces = useMemo(() => mockPlaces.filter((place) => { const text = placeText(place, language); return (!query || `${text.name} ${text.region} ${text.category}`.toLowerCase().includes(query.toLowerCase())) && (region === "all" || place.region.az === region) && (category === "all" || place.category.az === category); }), [query, region, category, language]);
  const close = () => { setDetailPlace(null); setReservePlace(null); setSubmitted(false); };
  const submitReservation = (event: React.FormEvent) => { event.preventDefault(); if (!reservePlace || !reservation.date || !reservation.activity) return; addRequest({ placeId: reservePlace.id, date: reservation.date, participants: Number(reservation.participants), activity: reservation.activity, note: reservation.note }); setSubmitted(true); setReservation({ date: "", participants: "2", activity: "", note: "" }); };

  return <AppShell><div className="page-stack"><section className="page-heading"><div><span className="eyebrow"><Filter size={14} />{t("recommendation")}</span><h1>{t("navPlaces")}</h1><p>{t("exploreBody")}</p></div><span className="result-count">{visiblePlaces.length} {t("filterResults")}</span></section><section className="filter-panel"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} aria-label={t("search")} /></label><select value={region} onChange={(event) => setRegion(event.target.value)} aria-label={t("allRegions")}><option value="all">{t("allRegions")}</option>{regions.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={t("allCategories")}><option value="all">{t("allCategories")}</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></section>{visiblePlaces.length ? <div className="place-grid">{visiblePlaces.map((place) => <PlaceCard key={place.id} place={place} />)}</div> : <div className="empty-card empty-card--large"><Search size={26} /><strong>{t("noResults")}</strong></div>}</div>{detailPlace && <Modal title={placeText(detailPlace, language).name} onClose={close} wide><PlaceDetailRich place={detailPlace} onReserve={() => { setDetailPlace(null); setReservePlace(detailPlace); }} /></Modal>}{reservePlace && <Modal title={t("reserveTitle")} onClose={close}><div className="modal-place-summary"><div className={`mini-visual place-visual--${reservePlace.visual}`} /><div><strong>{placeText(reservePlace, language).name}</strong><span>{placeText(reservePlace, language).region}</span></div></div>{submitted ? <div className="success-panel"><CheckCircle2 size={30} /><strong>{t("reservationSent")}</strong><p>{t("reservationSentBody")}</p><button className="button button--primary" onClick={close}>{t("close")}</button></div> : <form className="reservation-form" onSubmit={submitReservation}><label className="field"><span>{t("date")}</span><input type="date" value={reservation.date} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setReservation({ ...reservation, date: event.target.value })} required /></label><label className="field"><span>{t("participants")}</span><input type="number" min="1" max={reservePlace.capacity} value={reservation.participants} onChange={(event) => setReservation({ ...reservation, participants: event.target.value })} required /></label><label className="field"><span>{t("activity")}</span><select value={reservation.activity} onChange={(event) => setReservation({ ...reservation, activity: event.target.value })} required><option value="">—</option><option value={reservePlace.activity[language]}>{reservePlace.activity[language]}</option></select></label><label className="field"><span>{t("note")}</span><textarea rows={3} value={reservation.note} onChange={(event) => setReservation({ ...reservation, note: event.target.value })} /></label><button className="button button--primary button--full" type="submit">{t("reserve")}</button></form>}</Modal>}</AppShell>;
}

