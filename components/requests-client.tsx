"use client";

import { useState } from "react";
import { CalendarDays, ClipboardList, X } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { Modal } from "@/components/modal";
import { mockPlaces } from "@/data/mock-places";

export function RequestsClient() {
  const { t, requests, cancelRequest, language } = useApp();
  const [cancelId, setCancelId] = useState<string | null>(null);
  return <AppShell><div className="page-stack"><section className="page-heading"><div><span className="eyebrow"><ClipboardList size={14} />{t("navRequests")}</span><h1>{t("navRequests")}</h1><p>{t("planTripBody")}</p></div><span className="result-count">{requests.length} {t("filterResults")}</span></section>{requests.length === 0 ? <div className="empty-card empty-card--large"><CalendarDays size={28} /><strong>{t("noRequests")}</strong><p>{t("createFirst")}</p></div> : <div className="request-list">{requests.map((request) => { const place = mockPlaces.find((item) => item.id === request.placeId); return <article className="request-card" key={request.id}><div className={`mini-visual place-visual--${place?.visual ?? "orchard"}`}><CalendarDays size={22} /></div><div className="request-card__main"><div className="place-card__meta"><span>{place?.region[language]}</span><span>{request.date}</span></div><h2>{place?.name[language]}</h2><p>{request.activity} · {request.participants} nəfər</p><span className={`status status--${request.status}`}>{t(request.status)}</span></div><div className="request-card__actions"><button className="icon-button" aria-label={t("cancel")} disabled={request.status === "cancelled"} onClick={() => setCancelId(request.id)}><X size={18} /></button></div></article>; })}</div>}</div>{cancelId && <Modal title={t("confirmCancel")} onClose={() => setCancelId(null)}><div className="confirm-panel"><span className="confirm-icon"><X size={22} /></span><p>{t("confirmCancel")}</p><div className="form-actions"><button className="button button--soft" onClick={() => setCancelId(null)}>{t("keepRequest")}</button><button className="button button--danger" onClick={() => { cancelRequest(cancelId); setCancelId(null); }}>{t("confirm")}</button></div></div></Modal>}</AppShell>;
}
