"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPinned, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { useMarketplace } from "@/components/marketplace-provider";
import { AppShell } from "@/components/app-shell";
import { MapView } from "@/components/map-view";
import { placeText } from "@/components/place-card";
import type { Place } from "@/types";

export function MapClient() {
  const {t,language}=useApp();
  const {publicPlaces}=useMarketplace();
  const [region,setRegion]=useState("all");
  const [selected,setSelected]=useState<Place|null>(null);
  useEffect(()=>{
    const id=new URLSearchParams(window.location.search).get("place");
    const match=publicPlaces.find(place=>place.id===id);
    if(match)setSelected(match);
  },[publicPlaces]);
  const visible=useMemo(()=>publicPlaces.filter(place=>region==="all"||place.region.az===region),[publicPlaces,region]);
  const active=selected&&visible.some(place=>place.id===selected.id)?selected:visible[0];
  const selectPlace=useCallback((place:Place)=>setSelected(place),[]);
  if(!active)return <AppShell><div className="empty-card">Xəritədə məkan yoxdur.</div></AppShell>;
  const text=placeText(active,language);
  return <AppShell><div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow"><MapPinned size={14}/>{t("mapInfo")}</span><h1>{t("navMap")}</h1><p>{t("mapBody")}</p></div><label className="select-with-icon"><SlidersHorizontal size={16}/><select value={region} onChange={event=>setRegion(event.target.value)} aria-label={t("allRegions")}><option value="all">{t("allRegions")}</option>{[...new Set(publicPlaces.map(place=>place.region.az))].map(item=><option key={item} value={item}>{item}</option>)}</select></label></section>
    <section className="map-layout"><div className="map-panel"><MapView places={visible} language={language} selectedId={active.id} onSelect={selectPlace}/></div><aside className="map-detail"><span className="section-kicker">{t("selectedPlace")}</span><div className={`detail-visual detail-visual--small place-visual--${active.visual}`} style={active.imageUrl?{backgroundImage:`url("${active.imageUrl}")`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}/><div className="place-card__meta"><span>{text.region}</span><span>{text.category}</span></div><h2>{text.name}</h2><p>{text.description}</p><div className="detail-facts"><span><strong>{t("duration")}</strong>{active.duration[language]}</span><span><strong>{t("price")}</strong>{active.price} AZN</span></div><div className="detail-actions"><Link href={`/places?detail=${active.id}`} className="button button--soft">{t("details")}</Link><Link href={`/checkout?place=${active.id}`} className="button button--primary">{t("reserve")}</Link></div></aside></section>
  </div></AppShell>;
}
