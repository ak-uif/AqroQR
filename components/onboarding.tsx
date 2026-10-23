"use client";

import { ArrowRight, Check, ChevronLeft, Compass, Leaf, LockKeyhole, Sprout, Tractor, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/app-provider";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { SessionUser } from "@/types";

type Step = "welcome" | "type" | "citizen" | "citizen-form" | "foreign";
type FormState = Record<string, string>;

const emptyCitizen: FormState = { firstName: "", lastName: "", email: "", phone: "", fin: "", city: "", interest: "", password: "" };
const emptyGuest: FormState = { firstName: "", lastName: "", email: "", phone: "", country: "", purpose: "", activity: "", arrival: "", departure: "", preferredLanguage: "en" };

export function Onboarding() {
  const { t, login } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [citizen, setCitizen] = useState<FormState>(emptyCitizen);
  const [guest, setGuest] = useState<FormState>(emptyGuest);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const goNext = () => { setErrors({}); setStep(step === "welcome" ? "type" : step); };
  const createUser = (data: FormState, userType: "citizen" | "guest"): SessionUser => ({ id: crypto.randomUUID(), firstName: data.firstName || "AqroQR", lastName: data.lastName || "Guest", email: data.email || "demo@aqroqr.local", phone: data.phone || "", country: data.country || "Azərbaycan", city: data.city || data.country || "Azərbaycan", userType, interests: [data.interest || data.activity || "Təbiət"], registeredAt: new Date().toISOString() });
  const validate = (data: FormState, type: "citizen" | "guest") => {
    const next: Record<string, string> = {};
    const required = type === "citizen" ? ["firstName", "lastName", "email", "phone", "fin", "city", "interest", "password"] : ["firstName", "lastName", "country", "email", "phone", "purpose", "activity", "arrival", "departure", "preferredLanguage"];
    required.forEach((key) => { if (!data[key]?.trim()) next[key] = t("required"); });
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) next.email = t("invalidEmail");
    if (data.phone && !/^[+\d\s()-]{7,}$/.test(data.phone)) next.phone = t("invalidPhone");
    if (type === "citizen" && data.fin && !/^[A-Za-z0-9]{7}$/.test(data.fin)) next.fin = t("invalidFin");
    if (type === "guest" && data.arrival && data.departure && data.departure < data.arrival) next.departure = t("invalidDates");
    return next;
  };
  const submit = (event: FormEvent, data: FormState, type: "citizen" | "guest") => { event.preventDefault(); const next = validate(data, type); if (Object.keys(next).length) { setErrors(next); return; } login(createUser(data, type)); setSuccess(true); setTimeout(() => router.push("/dashboard"), 500); };
  const update = (type: "citizen" | "guest", key: string, value: string) => { const setter = type === "citizen" ? setCitizen : setGuest; setter((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); };

  return (
    <main className="onboarding-page">
      <header className="onboarding-head"><BrandLogo /><LanguageSwitcher /></header>
      <div className="onboarding-content"><div className="onboarding-copy"><span className="eyebrow"><Sprout size={14} />{t("welcomeEyebrow")}</span><h1>{step === "welcome" ? t("welcomeTitle") : step === "type" ? t("explore") : step === "citizen" ? t("citizen") : step === "foreign" ? t("guest") : t("otherRegister")}</h1><p>{step === "welcome" ? t("welcomeBody") : step === "type" ? t("exploreBody") : step === "citizen" ? t("myGovBody") : t("reserveBody")}</p><div className="onboarding-steps"><span className={step !== "welcome" ? "is-done" : "is-current"}>1</span><i /><span className={step === "type" ? "is-current" : step === "welcome" ? "" : "is-done"}>2</span><i /><span className={step === "citizen-form" || step === "foreign" ? "is-current" : ""}>3</span></div></div>
        <div className="onboarding-panel">
          {step === "welcome" && <div className="choice-grid"><button className="choice-card choice-card--primary" onClick={goNext}><span className="choice-icon"><Compass size={22} /></span><span><strong>{t("explore")}</strong><small>{t("exploreBody")}</small></span><ArrowRight size={20} /></button><button className="choice-card choice-card--disabled" disabled><span className="choice-icon"><Tractor size={22} /></span><span><strong>{t("farmer")}</strong><small>{t("soon")}</small></span><LockKeyhole size={18} /></button></div>}
          {step === "type" && <div className="choice-grid"><button className="choice-card" onClick={() => setStep("citizen")}><span className="choice-icon"><UserRound size={22} /></span><span><strong>{t("citizen")}</strong><small>{t("myGovBody")}</small></span><ArrowRight size={20} /></button><button className="choice-card" onClick={() => setStep("foreign")}><span className="choice-icon"><Leaf size={22} /></span><span><strong>{t("guest")}</strong><small>{t("exploreBody")}</small></span><ArrowRight size={20} /></button><BackButton onClick={() => setStep("welcome")} /></div>}
          {step === "citizen" && <div className="method-stack"><button className="method-card" onClick={() => { login(createUser({ firstName: "Aqro", lastName: "Qonaq", email: "demo@aqroqr.local", city: "Bakı" }, "citizen")); setSuccess(true); setTimeout(() => router.push("/dashboard"), 500); }}><span className="method-icon"><LockKeyhole size={19} /></span><span><strong>{t("myGov")}</strong><small>{t("myGovBody")}</small></span><ArrowRight size={20} /></button><button className="method-card" onClick={() => setStep("citizen-form")}><span className="method-icon"><UserRound size={19} /></span><span><strong>{t("otherRegister")}</strong><small>{t("fin")}, {t("email")} və şəhər məlumatlarını doldur.</small></span><ArrowRight size={20} /></button><BackButton onClick={() => setStep("type")} /></div>}
          {step === "citizen-form" && <FormCard data={citizen} type="citizen" update={update} errors={errors} onSubmit={submit} onBack={() => setStep("citizen")} />}
          {step === "foreign" && <FormCard data={guest} type="guest" update={update} errors={errors} onSubmit={submit} onBack={() => setStep("type")} />}
          {success && <div className="success-toast"><span><Check size={18} /></span>{t("success")}</div>}
        </div>
      </div>
      <footer className="onboarding-footer"><span>{t("footer")}</span></footer>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) { const { t } = useApp(); return <button className="back-button" onClick={onClick}><ChevronLeft size={17} />{t("back")}</button>; }

function FormCard({ data, type, update, errors, onSubmit, onBack }: { data: FormState; type: "citizen" | "guest"; update: (type: "citizen" | "guest", key: string, value: string) => void; errors: Record<string, string>; onSubmit: (event: FormEvent, data: FormState, type: "citizen" | "guest") => void; onBack: () => void }) {
  const { t } = useApp();
  const fields = type === "citizen" ? [["firstName", "firstName", "text"], ["lastName", "lastName", "text"], ["email", "email", "email"], ["phone", "phone", "tel"], ["fin", "fin", "text"], ["city", "city", "text"], ["interest", "interest", "text"], ["password", "password", "password"]] : [["firstName", "firstName", "text"], ["lastName", "lastName", "text"], ["country", "country", "text"], ["email", "email", "email"], ["phone", "phone", "tel"], ["purpose", "purpose", "text"], ["activity", "activity", "text"], ["arrival", "arrival", "date"], ["departure", "departure", "date"], ["preferredLanguage", "preferredLanguage", "text"]];
  return <form className="demo-form" onSubmit={(event) => onSubmit(event, data, type)}><div className="form-grid">{fields.map(([key, label, inputType]) => <label key={key} className="field"><span>{t(label)}</span><input type={inputType} value={data[key]} onChange={(event) => update(type, key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <em>{errors[key]}</em>}</label>)}</div><div className="form-actions"><button type="button" className="back-button" onClick={onBack}><ChevronLeft size={17} />{t("back")}</button><button className="button button--primary" type="submit">{t("submit")} <ArrowRight size={17} /></button></div></form>;
}
