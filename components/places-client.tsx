"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { Modal } from "@/components/modal";
import { PlaceCard, placeText } from "@/components/place-card";
import { PlaceDetailRich } from "@/components/place-detail-rich";
import { mockPlaces } from "@/data/mock-places";
import type { Place } from "@/types";

export function PlacesClient() {
  const { t, language } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [category, setCategory] = useState("all");
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);

  useEffect(() => {
    const detail = params.get("detail");
    const reserve = params.get("reserve");
    if (detail) setDetailPlace(mockPlaces.find((place) => place.id === detail) ?? null);
    if (reserve && mockPlaces.some((place) => place.id === reserve)) router.replace(`/checkout?place=${reserve}`);
  }, [params, router]);

  const regions = [...new Set(mockPlaces.map((place) => place.region.az))];
  const categories = [...new Set(mockPlaces.map((place) => place.category.az))];
  const hasActiveFilters = query !== "" || region !== "all" || category !== "all";
  const resetFilters = () => { setQuery(""); setRegion("all"); setCategory("all"); };
  const visiblePlaces = useMemo(() => mockPlaces.filter((place) => {
    const text = placeText(place, language);
    return (!query || `${text.name} ${text.region} ${text.category}`.toLowerCase().includes(query.toLowerCase()))
      && (region === "all" || place.region.az === region)
      && (category === "all" || place.category.az === category);
  }), [query, region, category, language]);

  return <AppShell>
    <div className="page-stack">
      <section className="page-heading"><div><span className="eyebrow"><Filter size={14} />{t("recommendation")}</span><h1>{t("navPlaces")}</h1><p>{t("exploreBody")}</p></div><span className="result-count">{visiblePlaces.length} {t("filterResults")}</span></section>
      <section className="filter-panel" aria-label="Məkan filtrləri">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} aria-label={t("search")} /></label>
        <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label={t("allRegions")}><option value="all">{t("allRegions")}</option>{regions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={t("allCategories")}><option value="all">{t("allCategories")}</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <button type="button" className="filter-reset" onClick={resetFilters} disabled={!hasActiveFilters}>Filtrləri sıfırla</button>
      </section>
      {visiblePlaces.length ? <div className="place-grid">{visiblePlaces.map((place) => <PlaceCard key={place.id} place={place} />)}</div> : <div className="empty-card empty-card--large"><Search size={26} /><strong>{t("noResults")}</strong></div>}
    </div>
    {detailPlace && <Modal title={placeText(detailPlace, language).name} onClose={() => setDetailPlace(null)} wide><PlaceDetailRich place={detailPlace} onReserve={() => router.push(`/checkout?place=${detailPlace.id}`)} /></Modal>}
  </AppShell>;
}
