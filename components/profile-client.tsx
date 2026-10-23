"use client";

import { useEffect, useState } from "react";
import { Check, LogOut, Save, Settings2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export function ProfileClient() {
  const { t, session, preferences, updateProfile, updatePreferences, logout } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", country: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (session) setForm({ firstName: session.firstName, lastName: session.lastName, email: session.email, phone: session.phone, city: session.city, country: session.country }); }, [session]);
  if (!session) return null;
  const save = (event: React.FormEvent) => { event.preventDefault(); updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 2200); };
  return <AppShell><div className="page-stack"><section className="page-heading"><div><span className="eyebrow"><UserRound size={14} />{t("navProfile")}</span><h1>{t("profileTitle")}</h1><p>{t("planTripBody")}</p></div><button className="button button--danger-outline" onClick={() => { logout(); router.push("/"); }}><LogOut size={17} />{t("logout")}</button></section><section className="profile-layout"><form className="profile-panel" onSubmit={save}><div className="panel-head"><div><span className="section-kicker">{t("editProfile")}</span><h2>{t("editProfile")}</h2></div><span className="large-avatar">{session.firstName.slice(0, 1).toUpperCase()}</span></div><div className="form-grid">{(["firstName", "lastName", "email", "phone", "city", "country"] as const).map((key) => <label className="field" key={key}><span>{t(key)}</span><input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} /></label>)}</div><button className="button button--primary" type="submit"><Save size={17} />{t("save")}</button>{saved && <span className="saved-message"><Check size={16} />{t("profileSaved")}</span>}</form><section className="profile-panel"><div className="panel-head"><div><span className="section-kicker">{t("notificationSettings")}</span><h2>{t("notificationSettings")}</h2></div><Settings2 size={22} /></div><div className="toggle-list"><Toggle label={t("emailUpdates")} value={preferences.emailUpdates} onChange={(value) => updatePreferences({ emailUpdates: value })} /><Toggle label={t("travelReminders")} value={preferences.travelReminders} onChange={(value) => updatePreferences({ travelReminders: value })} /><Toggle label={t("recommendations")} value={preferences.recommendations} onChange={(value) => updatePreferences({ recommendations: value })} /></div><div className="password-demo"><strong>{t("passwordDemo")}</strong><input type="password" placeholder="••••••••" disabled /><button className="button button--soft" type="button">{t("save")}</button></div></section></section></div></AppShell>;
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) { return <label className="toggle-row"><span>{label}</span><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>; }
