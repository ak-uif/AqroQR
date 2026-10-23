"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Place, SupportedLanguage } from "@/types";

const areaLabels = {
  az: { zoom: "Yaxınlaşdırın: rəngli bölgə vurğuları görünəcək", area: "Rəngli nöqtələr təxmini bölgəni göstərir" },
  en: { zoom: "Zoom in to reveal the colored regional area", area: "Colored dots show an approximate regional area" },
  ru: { zoom: "Приблизьте карту, чтобы увидеть цветную область", area: "Цветные точки обозначают примерную область" }
};

function areaPoints([latitude, longitude]: [number, number]) {
  const points: [number, number][] = [];
  const latitudeRadius = 26 / 111;
  const longitudeRadius = 26 / (111 * Math.cos(latitude * Math.PI / 180));
  for (let row = -6; row <= 6; row++) {
    for (let column = -6; column <= 6; column++) {
      const x = column / 6;
      const y = row / 6;
      const boundary = 0.94 + 0.06 * Math.sin(row * 1.8 + column * 0.7);
      if (x * x + y * y > boundary * boundary) continue;
      const nudge = Math.sin(row * 13 + column * 7) * 0.008;
      points.push([latitude + y * latitudeRadius + nudge, longitude + x * longitudeRadius - nudge]);
    }
  }
  return points;
}

export function MapView({ places, language, selectedId, onSelect }: { places: Place[]; language: SupportedLanguage; selectedId?: string; onSelect: (place: Place) => void }) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const previousSelectedIdRef = useRef(selectedId);
  const [zoomLevel, setZoomLevel] = useState(6.5);

  useEffect(() => {
    let cancelled = false;
    let activeMap: import("leaflet").Map | null = null;
    let onZoom: (() => void) | null = null;
    let markers: import("leaflet").CircleMarker[] = [];
    let areaLayer: import("leaflet").LayerGroup | null = null;
    import("leaflet").then((L) => {
      if (cancelled || !elementRef.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(elementRef.current, { zoomControl: true, scrollWheelZoom: true, doubleClickZoom: true, touchZoom: true, minZoom: 6, maxZoom: 13 }).setView([40.35, 47.7], 6.5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 18 }).addTo(mapRef.current);
      }
      const map = mapRef.current;
      activeMap = map;
      areaLayer = L.layerGroup().addTo(map);
      const colors = ["#3f8867", "#4c91a5", "#a47742", "#639b61", "#8a78a8", "#4b8c8e"];
      markers = places.map((place, placeIndex) => {
        const selected = place.id === selectedId;
        const marker = L.circleMarker(place.coordinates, { radius: selected ? 9 : 6.5, color: "#fffdf7", weight: 2.5, fillColor: selected ? "#d48a2e" : colors[placeIndex % colors.length], fillOpacity: 1 });
        marker.bindPopup(`<strong>${place.name[language]}</strong><br/><span>${place.region[language]}</span>`);
        marker.on("click", () => onSelect(place));
        marker.addTo(map);
        const element = marker.getElement();
        element?.setAttribute("tabindex", "0");
        element?.setAttribute("role", "button");
        element?.setAttribute("aria-label", place.name[language]);
        element?.addEventListener("keydown", (event) => {
          if (event instanceof KeyboardEvent && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); marker.fire("click"); marker.openPopup(); }
        });
        return marker;
      });
      const renderArea = () => {
        areaLayer?.clearLayers();
        setZoomLevel(map.getZoom());
        if (map.getZoom() < 8 || !areaLayer) return;
        const bounds = map.getBounds().pad(0.35);
        places.forEach((place, placeIndex) => {
          if (!bounds.contains(place.coordinates)) return;
          const selected = place.id === selectedId;
          const color = selected ? "#ce812c" : colors[placeIndex % colors.length];
          L.circle(place.coordinates, { radius: 26000, color, weight: 2, dashArray: "2 8", fillColor: color, fillOpacity: selected ? 0.09 : 0.05, interactive: false }).addTo(areaLayer!);
          areaPoints(place.coordinates).forEach((point) => {
            L.circleMarker(point, { radius: map.getZoom() >= 10 ? 2.6 : 1.9, stroke: false, fillColor: color, fillOpacity: selected ? 0.82 : 0.65, interactive: false }).addTo(areaLayer!);
          });
        });
        markers.forEach((marker) => marker.bringToFront());
      };
      onZoom = renderArea;
      map.on("zoomend", renderArea);
      map.on("moveend", renderArea);
      renderArea();
      const selected = places.find((place) => place.id === selectedId);
      if (selected && previousSelectedIdRef.current !== selectedId) map.flyTo(selected.coordinates, Math.max(map.getZoom(), 9), { duration: 0.8 });
      previousSelectedIdRef.current = selectedId;
      requestAnimationFrame(() => { if (!cancelled) map.invalidateSize(); });
    });
    return () => {
      cancelled = true;
      if (activeMap && onZoom) { activeMap.off("zoomend", onZoom); activeMap.off("moveend", onZoom); }
      markers.forEach((marker) => marker.remove());
      areaLayer?.remove();
    };
  }, [places, language, selectedId, onSelect]);

  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);
  return <><div ref={elementRef} className="map-canvas" aria-label="Azərbaycan xəritəsi" /><div className="map-zoom-hint" aria-live="polite"><span className={`map-zoom-hint__dot ${zoomLevel >= 8 ? "is-active" : ""}`} />{zoomLevel >= 8 ? areaLabels[language].area : areaLabels[language].zoom}</div></>;
}
