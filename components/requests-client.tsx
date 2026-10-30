"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, ClipboardList, CreditCard, MapPin, Users, Wallet, X } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { Modal } from "@/components/modal";
import { mockPlaces } from "@/data/mock-places";
import { reservationNumber } from "@/lib/checkout";

const statusLabel = { pending: "Gözləyir", confirmed: "Təsdiqlənib", completed: "Tamamlanıb", cancelled: "Ləğv edilib" };

export function RequestsClient() {
  const { requests, cancelRequest } = useApp();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const selected = requests.find((request) => request.id === detailId);
  const selectedPlace = selected ? mockPlaces.find((place) => place.id === selected.placeId) : null;

  return <AppShell><div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow"><ClipboardList size={14} />MÜRACİƏTLƏRİM</span><h1>Müraciətlərim</h1><p>Rezervasiyalarınızın tarixini, ödəniş vəziyyətini və digər məlumatlarını burada izləyin.</p></div><span className="result-count">{requests.length} rezervasiya</span></section>
    {requests.length === 0 ? <div className="empty-card empty-card--large"><CalendarDays size={28} /><strong>Hələ müraciətiniz yoxdur</strong><p>İlk səfərinizi seçib rezervasiyaya başlayın.</p><Link className="button button--primary" href="/places">Məkanlara bax <ArrowRight size={16} /></Link></div> : <div className="request-list">{requests.map((request) => {
      const place = mockPlaces.find((item) => item.id === request.placeId);
      const name = request.placeName || place?.name.az || "Məkan";
      return <article className="request-card" key={request.id}>
        <div className={`mini-visual place-visual--${place?.visual ?? "orchard"}`}><CalendarDays size={22} /></div>
        <div className="request-card__main"><div className="place-card__meta"><span><MapPin size={13} />{place?.region.az || "Azərbaycan"}</span><span>{request.date}</span></div><h2>{name}</h2><p className="request-card__number">{reservationNumber(request.id)}</p><p>{request.activity} · {request.participants} nəfər{request.totalAmount != null ? ` · ${request.totalAmount} AZN` : ""}</p><div className="request-card__badges"><span className={`status status--${request.status}`}>{statusLabel[request.status]}</span>{request.paymentMethod && <span className="request-payment-badge">{request.paymentStatus === "paid" ? "Ödənilib" : "Ödəniş gözlənilir"}</span>}</div></div>
        <div className="request-card__actions"><button type="button" className="button button--soft" onClick={() => setDetailId(request.id)}>Ətraflı bax</button>{request.status !== "cancelled" && <button type="button" className="button button--danger-outline" onClick={() => setCancelId(request.id)}>Ləğv et</button>}</div>
      </article>;
    })}</div>}
  </div>
  {selected && <Modal title="Rezervasiya məlumatları" onClose={() => setDetailId(null)}>
    <div className="request-detail"><span className="request-detail__number">{reservationNumber(selected.id)}</span><h3>{selected.placeName || selectedPlace?.name.az || "Məkan"}</h3><div className="request-detail__rows">
      <span><MapPin size={17} /><small>Məkan</small><strong>{selectedPlace?.region.az || "Azərbaycan"}</strong></span>
      <span><CalendarDays size={17} /><small>Tarix</small><strong>{selected.date}</strong></span>
      <span><Users size={17} /><small>İştirakçı sayı</small><strong>{selected.participants} nəfər</strong></span>
      <span><ClipboardList size={17} /><small>Fəaliyyət</small><strong>{selected.activity}</strong></span>
      <span><ClipboardList size={17} /><small>Rezervasiya statusu</small><strong>{statusLabel[selected.status]}</strong></span>
      {selected.paymentMethod && <><span>{selected.paymentMethod === "card" ? <CreditCard size={17} /> : <Wallet size={17} />}<small>Ödəniş üsulu</small><strong>{selected.paymentMethod === "card" ? "Kartla ödəniş" : "Məkanda ödəniş"}</strong></span><span><Wallet size={17} /><small>Ödəniş statusu</small><strong>{selected.paymentStatus === "paid" ? "Ödənilib" : "Ödəniş gözlənilir"}</strong></span></>}
      {selected.totalAmount != null && <span><Wallet size={17} /><small>Yekun məbləğ</small><strong>{selected.totalAmount} AZN</strong></span>}
    </div><p className="request-detail__note">Bu rezervasiya və ödəniş məlumatları təqdimat xarakterlidir. Real ödəniş aparılmayıb.</p><div className="request-detail__actions">{selected.status !== "cancelled" && <button type="button" className="button button--danger-outline" onClick={() => { setDetailId(null); setCancelId(selected.id); }}>Rezervasiyanı ləğv et</button>}<button type="button" className="button button--soft" onClick={() => setDetailId(null)}>Bağla</button></div></div>
  </Modal>}
  {cancelId && <Modal title="Rezervasiyanı ləğv et" onClose={() => setCancelId(null)}><div className="confirm-panel"><span className="confirm-icon"><X size={22} /></span><p>Bu rezervasiyanı ləğv etmək istədiyinizə əminsiniz?</p><div className="form-actions"><button type="button" className="button button--soft" onClick={() => setCancelId(null)}>Rezervasiyanı saxla</button><button type="button" className="button button--danger" onClick={() => { cancelRequest(cancelId); setCancelId(null); }}>Ləğv et</button></div></div></Modal>}
  </AppShell>;
}
