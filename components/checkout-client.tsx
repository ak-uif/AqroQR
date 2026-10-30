"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, CreditCard, LockKeyhole, MapPin, Minus, Plus, RotateCcw, ShieldCheck, Users, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/components/app-provider";
import { useMarketplace } from "@/components/marketplace-provider";
import { activityLabel, calculateCheckout, cardNetwork, CHECKOUT_TIMES, DECLINED_TEST_CARD, formatCardNumber, formatExpiry, PROMO_CODE, reservationNumber, todayLocal, validateCard, type ActivityChoice } from "@/lib/checkout";
import type { ReservationRequest } from "@/types";

type Details = { date: string; time: string; participants: number; activity: ActivityChoice; note: string };
type Guest = { firstName: string; lastName: string; email: string; phone: string; city: string; note: string };
type Card = { holder: string; number: string; expiry: string; cvv: string };
type PaymentMethod = "card" | "onsite";
type CheckoutState = "idle" | "processing" | "success" | "failed";

const emptyCard: Card = { holder: "", number: "", expiry: "", cvv: "" };
const steps = ["Rezervasiya", "Qonaq", "Ödəniş", "Yoxlama"];

function dateLabel(date: string) {
  if (!date) return "Tarix seçilməyib";
  const [year, month, day] = date.split("-").map(Number);
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
  return `${day} ${months[month - 1]} ${year}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="checkout-error" id={id} role="alert">{message}</span> : null;
}

export function CheckoutClient() {
  const params = useSearchParams();
  const { session, addRequest } = useApp();
  const { publicPlaces } = useMarketplace();
  const place = publicPlaces.find((item) => item.id === params.get("place"));
  const topRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefilledRef = useRef(false);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Details>({ date: "", time: "09:00", participants: 2, activity: "standard", note: "" });
  const [guest, setGuest] = useState<Guest>({ firstName: "", lastName: "", email: "", phone: "", city: "", note: "" });
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState<Card>(emptyCard);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [createdRequest, setCreatedRequest] = useState<ReservationRequest | null>(null);
  const [lastFour, setLastFour] = useState("");

  useEffect(() => {
    if (!session || prefilledRef.current) return;
    prefilledRef.current = true;
    setGuest((current) => ({
      ...current,
      firstName: session.firstName || "",
      lastName: session.lastName || "",
      email: session.email.endsWith(".local") ? "" : session.email,
      phone: session.phone || "",
      city: session.city || session.country || ""
    }));
  }, [session]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  useEffect(() => {
    if (!place?.eventDate) return;
    setDetails((current) => ({ ...current, date: place.eventDate ?? "", time: place.eventTime ?? "09:00", participants: 1 }));
  }, [place?.id, place?.eventDate, place?.eventTime]);

  if (!place) {
    return <AppShell><div className="empty-card empty-card--large"><strong>Məkan tapılmadı</strong><p>Rezervasiyaya başlamaq üçün məkan seçin.</p><Link className="button button--primary" href="/places">Məkanlara bax</Link></div></AppShell>;
  }

  const price = calculateCheckout(place, details.participants, details.date, details.activity, promoApplied);
  const activity = activityLabel(place, details.activity);
  const cardDigits = card.number.replace(/\D/g, "");
  const cardLastFour = cardDigits.slice(-4);

  const scrollToTop = () => topRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  const focusStep = () => requestAnimationFrame(() => {
    scrollToTop();
    topRef.current?.querySelector<HTMLElement>(".checkout-card")?.focus();
  });
  const focusFirstError = () => requestAnimationFrame(() => {
    topRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
  const updateDetails = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const updateGuest = (key: keyof Guest, value: string) => {
    setGuest((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const updateCard = (key: keyof Card, value: string) => {
    setCard((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validateDetails = () => {
    const next: Record<string, string> = {};
    if (!details.date) next.date = "Tarix seçin";
    else if (details.date < todayLocal()) next.date = "Keçmiş tarix seçilə bilməz";
    else if (place.eventDate && details.date !== place.eventDate) next.date = "Tədbirin tarixini seçin";
    if (place.eventTime ? details.time !== place.eventTime : !CHECKOUT_TIMES.includes(details.time as typeof CHECKOUT_TIMES[number])) next.time = "Saat seçin";
    if (!Number.isInteger(details.participants) || details.participants < 1 || details.participants > place.capacity) next.participants = `1–${place.capacity} iştirakçı seçin`;
    return next;
  };
  const validateGuest = () => {
    const next: Record<string, string> = {};
    if (!guest.firstName.trim()) next.firstName = "Bu sahə doldurulmalıdır";
    if (!guest.lastName.trim()) next.lastName = "Bu sahə doldurulmalıdır";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) next.email = "Düzgün e-poçt ünvanı daxil edin";
    if (guest.phone.replace(/\D/g, "").length < 7 || !/^\+?[\d\s()\-]{7,20}$/.test(guest.phone.trim())) next.phone = "Telefon nömrəsini düzgün daxil edin";
    if (!guest.city.trim()) next.city = "Bu sahə doldurulmalıdır";
    return next;
  };
  const validatePayment = () => method === "card" ? validateCard(card) : {};

  const nextStep = () => {
    const next = step === 1 ? validateDetails() : step === 2 ? validateGuest() : validatePayment();
    setErrors(next);
    if (Object.keys(next).length) { focusFirstError(); return; }
    setStep((current) => Math.min(current + 1, 4));
    focusStep();
  };
  const previousStep = () => { setStep((current) => Math.max(current - 1, 1)); setErrors({}); focusStep(); };

  const applyPromo = (event: React.FormEvent) => {
    event.preventDefault();
    if (promoCode.trim().toUpperCase() === PROMO_CODE) { setPromoApplied(true); setPromoError(""); }
    else { setPromoApplied(false); setPromoError("Kod düzgün deyil"); }
  };

  const finish = () => {
    if (checkoutState !== "idle" || !session) return;
    const checks = [validateDetails(), validateGuest(), validatePayment()];
    const firstInvalid = checks.findIndex((item) => Object.keys(item).length > 0);
    if (firstInvalid !== -1) { setStep(firstInvalid + 1); setErrors(checks[firstInvalid]); focusFirstError(); return; }
    setCheckoutState("processing");
    const enteredDigits = cardDigits;
    const selectedMethod = method;
    timeoutRef.current = setTimeout(() => {
      if (selectedMethod === "card" && enteredDigits === DECLINED_TEST_CARD) {
        setCheckoutState("failed");
        return;
      }
      const request = addRequest({
        userId: session.id,
        placeId: place.id,
        placeName: place.name.az,
        activity,
        date: details.date,
        participants: details.participants,
        totalAmount: price.total,
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === "card" ? "paid" : "pending"
      });
      setLastFour(selectedMethod === "card" ? enteredDigits.slice(-4) : "");
      setCard(emptyCard);
      setCreatedRequest(request);
      setCheckoutState("success");
      scrollToTop();
    }, 1400);
  };

  return <AppShell><div className="checkout-page" ref={topRef}>
    <div className="checkout-heading"><div><Link href="/places" className="checkout-back"><ArrowLeft size={16} />Məkanlara qayıt</Link><span className="section-kicker">SƏYAHƏTİNİ PLANLAŞDIR</span><h1>Rezervasiyanı tamamla</h1><p>Məlumatlarını yoxla və sənə uyğun ödəniş üsulunu seç.</p></div><span className="checkout-trust"><ShieldCheck size={18} /> Təhlükəsiz təqdimat axını</span></div>

    {checkoutState === "success" && createdRequest ? <div className="checkout-result checkout-result--success" role="status">
      <span className="checkout-result__icon"><CheckCircle2 size={35} /></span>
      <span className="section-kicker">REZERVASİYA HAZIRDIR</span>
      <h2>{method === "card" ? "Ödəniş uğurla tamamlandı" : "Rezervasiyanız yaradıldı"}</h2>
      <p>{method === "card" ? "Rezervasiyanız yaradıldı və müraciətlər siyahısına əlavə edildi." : "Rezervasiya təsdiq üçün göndərildi. Ödənişi məkanda həyata keçirə bilərsiniz."}</p>
      <div className="checkout-result__facts"><span><small>Rezervasiya nömrəsi</small><strong>{reservationNumber(createdRequest.id)}</strong></span><span><small>Məkan</small><strong>{place.name.az}</strong></span><span><small>Tarix</small><strong>{dateLabel(details.date)}</strong></span><span><small>İştirakçı sayı</small><strong>{details.participants} nəfər</strong></span><span><small>Ödəniş statusu</small><strong>{method === "card" ? "Ödənilib" : "Ödəniş gözlənilir"}</strong></span>{lastFour && <span><small>Kart</small><strong>•••• {lastFour}</strong></span>}</div>
      <div className="checkout-result__actions"><Link href="/requests" className="button button--primary">Müraciətlərimə keç <ArrowRight size={17} /></Link><Link href="/dashboard" className="button button--soft">Əsas səhifəyə qayıt</Link></div>
    </div> : checkoutState === "failed" ? <div className="checkout-result checkout-result--failed" role="alert">
      <span className="checkout-result__icon"><RotateCcw size={32} /></span><span className="section-kicker">YENİDƏN CƏHD ET</span><h2>Ödəniş zamanı problem yarandı</h2><p>Bu sınaq əməliyyatı tamamlanmadı. Məlumatlarınız saxlanılıb; yenidən cəhd edə və ya ödəniş üsulunu dəyişə bilərsiniz. Heç bir məbləğ tutulmayıb.</p><div className="checkout-result__actions"><button type="button" className="button button--primary" onClick={() => setCheckoutState("idle")}>Yenidən cəhd et</button><button type="button" className="button button--soft" onClick={() => { setCheckoutState("idle"); setStep(3); scrollToTop(); }}>Ödəniş üsulunu dəyiş</button></div>
    </div> : <div className="checkout-layout">
      <div className="checkout-main">
        <ol className="checkout-progress" aria-label="Rezervasiya addımları">{steps.map((label, index) => <li key={label} className={step === index + 1 ? "is-current" : step > index + 1 ? "is-done" : ""} aria-current={step === index + 1 ? "step" : undefined}><span>{step > index + 1 ? <Check size={15} /> : index + 1}</span><small>{label}</small></li>)}</ol>
        <section className="checkout-card" aria-live="polite" tabIndex={-1}>
          {step === 1 && <><div className="checkout-card__head"><span className="section-kicker">01 / 04 · REZERVASİYA</span><h2>Rezervasiya məlumatları</h2><p>Səfərin üçün uyğun tarix, saat və iştirakçı sayını seç.</p></div><div className="checkout-place"><div className={`checkout-place__image place-visual--${place.visual}`} style={place.imageUrl ? { backgroundImage: "url(" + place.imageUrl + ")" } : undefined} role="img" aria-label={place.name.az} /><div><span><MapPin size={14} />{place.region.az}</span><strong>{place.name.az}</strong><small><Clock3 size={14} />{place.duration.az} · {place.price} AZN / nəfər</small></div></div><div className="checkout-fields">
            <label className="checkout-field"><span>Tarix</span><input type="date" min={place.eventDate ?? todayLocal()} max={place.eventDate} value={details.date} onChange={(event) => updateDetails("date", event.target.value)} readOnly={Boolean(place.eventDate)} required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "checkout-date-error" : undefined} /><FieldError id="checkout-date-error" message={errors.date} /></label>
            <label className="checkout-field"><span>Saat</span><select value={details.time} onChange={(event) => updateDetails("time", event.target.value)} required aria-invalid={Boolean(errors.time)}>{(place.eventTime ? [place.eventTime] : CHECKOUT_TIMES).map((time) => <option key={time} value={time}>{time}</option>)}</select><FieldError id="checkout-time-error" message={errors.time} /></label>
            <div className="checkout-field"><span>İştirakçı sayı</span><div className="checkout-counter"><button type="button" aria-label="İştirakçı sayını azalt" disabled={details.participants <= 1} onClick={() => updateDetails("participants", details.participants - 1)}><Minus size={17} /></button><output aria-live="polite">{details.participants} nəfər</output><button type="button" aria-label="İştirakçı sayını artır" disabled={details.participants >= place.capacity} onClick={() => updateDetails("participants", details.participants + 1)}><Plus size={17} /></button></div><FieldError id="checkout-participants-error" message={errors.participants} /></div>
            <label className="checkout-field"><span>Fəaliyyət</span><select value={details.activity} onChange={(event) => updateDetails("activity", event.target.value as ActivityChoice)}><option value="standard">{place.activity.az}</option><option value="guided">Bələdçili təcrübə (+8 AZN / nəfər)</option></select></label>
            <label className="checkout-field checkout-field--full"><span>Əlavə qeyd <small>(istəyə bağlı)</small></span><textarea rows={3} value={details.note} onChange={(event) => updateDetails("note", event.target.value)} placeholder="İstəyinizi burada yaza bilərsiniz" /></label>
          </div></>}
          {step === 2 && <><div className="checkout-card__head"><span className="section-kicker">02 / 04 · QONAQ</span><h2>Qonaq məlumatları</h2><p>Əlaqə məlumatları yalnız bu rezervasiya axınında istifadə olunur; ayrıca yaddaşa yazılmır.</p></div><div className="checkout-fields">
            <label className="checkout-field"><span>Ad</span><input value={guest.firstName} onChange={(event) => updateGuest("firstName", event.target.value)} autoComplete="given-name" required aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "checkout-first-error" : undefined} /><FieldError id="checkout-first-error" message={errors.firstName} /></label>
            <label className="checkout-field"><span>Soyad</span><input value={guest.lastName} onChange={(event) => updateGuest("lastName", event.target.value)} autoComplete="family-name" required aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "checkout-last-error" : undefined} /><FieldError id="checkout-last-error" message={errors.lastName} /></label>
            <label className="checkout-field"><span>E-poçt</span><input type="email" value={guest.email} onChange={(event) => updateGuest("email", event.target.value)} autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "checkout-email-error" : undefined} /><FieldError id="checkout-email-error" message={errors.email} /></label>
            <label className="checkout-field"><span>Telefon</span><input type="tel" value={guest.phone} onChange={(event) => updateGuest("phone", event.target.value)} autoComplete="tel" inputMode="tel" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "checkout-phone-error" : undefined} /><FieldError id="checkout-phone-error" message={errors.phone} /></label>
            <label className="checkout-field checkout-field--full"><span>Ölkə və ya şəhər</span><input value={guest.city} onChange={(event) => updateGuest("city", event.target.value)} autoComplete="address-level2" required aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "checkout-city-error" : undefined} /><FieldError id="checkout-city-error" message={errors.city} /></label>
            <label className="checkout-field checkout-field--full"><span>Əlavə qeyd <small>(istəyə bağlı)</small></span><textarea rows={3} value={guest.note} onChange={(event) => updateGuest("note", event.target.value)} placeholder="Əlavə məlumatınız varsa yazın" /></label>
          </div></>}
          {step === 3 && <><div className="checkout-card__head"><span className="section-kicker">03 / 04 · ÖDƏNİŞ</span><h2>Ödəniş üsulu</h2><p>Özünə uyğun üsulu seç. Bu səhifədə real ödəniş aparılmır.</p></div><fieldset className="checkout-methods"><legend className="sr-only">Ödəniş üsulunu seçin</legend><label className={method === "card" ? "checkout-method is-selected" : "checkout-method"}><input type="radio" name="payment-method" value="card" checked={method === "card"} onChange={() => { setMethod("card"); setErrors({}); }} /><span className="checkout-method__icon"><CreditCard size={21} /></span><span><strong>Kartla ödə</strong><small>Kart məlumatlarını daxil edin</small></span><span className="checkout-method__check"><Check size={16} /></span></label><label className={method === "onsite" ? "checkout-method is-selected" : "checkout-method"}><input type="radio" name="payment-method" value="onsite" checked={method === "onsite"} onChange={() => { setMethod("onsite"); setCard(emptyCard); setErrors({}); }} /><span className="checkout-method__icon"><Wallet size={21} /></span><span><strong>Məkanda ödə</strong><small>Ödənişi səfər zamanı edin</small></span><span className="checkout-method__check"><Check size={16} /></span></label></fieldset>
            {method === "card" ? <div className="checkout-card-payment"><div className="checkout-bank-card" aria-hidden="true"><div className="checkout-bank-card__top"><span>AqroQR</span><span>{cardNetwork(card.number)}</span></div><span className="checkout-bank-card__number">•••• •••• •••• {cardLastFour || "••••"}</span><div className="checkout-bank-card__bottom"><span>{card.holder.trim().toUpperCase() || "KART SAHİBİ"}</span><span>{card.expiry || "AA/İİ"}</span></div></div><div className="checkout-fields">
              <label className="checkout-field checkout-field--full"><span>Kart sahibinin adı</span><input value={card.holder} onChange={(event) => updateCard("holder", event.target.value)} placeholder="Ad Soyad" autoComplete="off" required aria-invalid={Boolean(errors.holder)} aria-describedby={errors.holder ? "checkout-holder-error" : undefined} /><FieldError id="checkout-holder-error" message={errors.holder} /></label>
              <label className="checkout-field checkout-field--full"><span>Kart nömrəsi</span><input value={card.number} onChange={(event) => updateCard("number", formatCardNumber(event.target.value))} placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="off" maxLength={23} required aria-invalid={Boolean(errors.number)} aria-describedby={errors.number ? "checkout-number-error" : undefined} /><FieldError id="checkout-number-error" message={errors.number} /></label>
              <label className="checkout-field"><span>Bitmə tarixi</span><input value={card.expiry} onChange={(event) => updateCard("expiry", formatExpiry(event.target.value))} placeholder="AA/İİ" inputMode="numeric" autoComplete="off" maxLength={5} required aria-invalid={Boolean(errors.expiry)} aria-describedby={errors.expiry ? "checkout-expiry-error" : undefined} /><FieldError id="checkout-expiry-error" message={errors.expiry} /></label>
              <label className="checkout-field"><span>CVV</span><input type="password" value={card.cvv} onChange={(event) => updateCard("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" inputMode="numeric" autoComplete="off" maxLength={4} required aria-invalid={Boolean(errors.cvv)} aria-describedby={errors.cvv ? "checkout-cvv-error" : undefined} /><FieldError id="checkout-cvv-error" message={errors.cvv} /></label>
            </div><p className="checkout-safety"><LockKeyhole size={16} /> Kart məlumatları saxlanılmır və heç yerə göndərilmir.</p></div> : <div className="checkout-onsite"><Wallet size={26} /><div><strong>Ödənişi məkanda həyata keçirə bilərsiniz.</strong><p>Rezervasiya təsdiq üçün göndəriləcək. Ödəniş statusu “Ödəniş gözlənilir” olacaq.</p></div></div>}
          </>}
          {step === 4 && <><div className="checkout-card__head"><span className="section-kicker">04 / 04 · YOXLA</span><h2>Rezervasiyanı yoxla</h2><p>Tamamlamazdan əvvəl bütün məlumatları nəzərdən keçir.</p></div><div className="checkout-review"><div><span>Rezervasiya</span><strong>{place.name.az}</strong><p>{dateLabel(details.date)} · {details.time} · {details.participants} nəfər</p><p>{activity}</p><button type="button" className="checkout-edit" onClick={() => { setStep(1); scrollToTop(); }}>Düzəliş et <ArrowRight size={14} /></button></div><div><span>Qonaq</span><strong>{guest.firstName} {guest.lastName}</strong><p>{guest.email} · {guest.phone}</p><p>{guest.city}</p><button type="button" className="checkout-edit" onClick={() => { setStep(2); scrollToTop(); }}>Düzəliş et <ArrowRight size={14} /></button></div><div><span>Ödəniş</span><strong>{method === "card" ? "Kartla ödə" : "Məkanda ödə"}</strong><p>{method === "card" ? `•••• ${cardLastFour}` : "Ödəniş gözlənilir"}</p><button type="button" className="checkout-edit" onClick={() => { setStep(3); scrollToTop(); }}>Düzəliş et <ArrowRight size={14} /></button></div></div><p className="checkout-safety"><ShieldCheck size={16} /> Bu prototipdə real ödəniş tutulmur və kart məlumatları saxlanılmır.</p></>}
        </section>
        <div className="checkout-navigation">{step > 1 ? <button type="button" className="button button--soft" onClick={previousStep}><ArrowLeft size={17} /> Geri</button> : <span />}{step < 4 ? <button type="button" className="button button--primary" onClick={nextStep}>{step === 3 ? "Rezervasiyanı yoxla" : "Davam et"} <ArrowRight size={17} /></button> : <button type="button" className="button button--primary" onClick={finish} disabled={checkoutState === "processing"}>{checkoutState === "processing" ? <><span className="checkout-spinner" /> Yoxlanılır…</> : method === "card" ? "Ödənişi tamamla" : "Rezervasiyanı tamamla"}</button>}</div>
      </div>
      <aside className="checkout-summary-wrap"><details className="checkout-summary" open><summary><span><small>SİFARİŞİN</small><strong>Rezervasiya xülasəsi</strong></span><span className="checkout-summary__total">{price.total} AZN <ChevronDown size={17} /></span></summary><div className="checkout-summary__body"><div className={`checkout-summary__image place-visual--${place.visual}`} style={place.imageUrl ? { backgroundImage: "url(" + place.imageUrl + ")" } : undefined} role="img" aria-label={place.name.az} /><div className="checkout-summary__place"><strong>{place.name.az}</strong><span><MapPin size={14} />{place.region.az}</span></div><div className="checkout-summary__details"><span><CalendarDays size={15} />{dateLabel(details.date)}</span><span><Clock3 size={15} />{details.time} · {place.duration.az}</span><span><Users size={15} />{details.participants} nəfər</span><span><Check size={15} />{activity}</span></div><div className="checkout-summary__prices"><h3>Məbləğə baxış</h3><span><span>Əsas qiymət</span><strong>{price.base} AZN</strong></span>{price.activityExtra > 0 && <span><span>Fəaliyyət əlavəsi</span><strong>{price.activityExtra} AZN</strong></span>}{price.weekendExtra > 0 && <span><span>Həftəsonu əlavəsi</span><strong>{price.weekendExtra} AZN</strong></span>}<span><span>Xidmət haqqı</span><strong>{price.serviceFee} AZN</strong></span>{price.discount > 0 && <span className="checkout-summary__discount"><span>Endirim</span><strong>−{price.discount} AZN</strong></span>}</div><form className="checkout-promo" onSubmit={applyPromo}><label htmlFor="checkout-promo-code">Endirim kodu</label><div><input id="checkout-promo-code" value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoError(""); }} placeholder="Kodu daxil et" autoComplete="off" /><button type="submit" disabled={promoApplied}>Tətbiq et</button></div>{promoError && <span className="checkout-error" role="alert">{promoError}</span>}{promoApplied ? <button type="button" className="checkout-promo__clear" onClick={() => { setPromoApplied(false); setPromoCode(""); }}>AQRO10 tətbiq olundu · Sil</button> : <small>Sınaq endirimi: AQRO10</small>}</form><div className="checkout-summary__grand"><span>Yekun məbləğ</span><strong>{price.total} AZN</strong></div><p>Məbləğlər təqdimat xarakterlidir. Real ödəniş tutulmur.</p></div></details></aside>
    </div>}
  </div></AppShell>;
}
