"use client";

import { Compass, HeartHandshake, Mail, Phone, Sprout, Target, ArrowUpRight, Instagram, Linkedin, Facebook, Music2 } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export function AboutRedesign() {
  const { t } = useApp();
  return <AppShell><div className="page-stack">
    <section className="about-hero"><div><span className="eyebrow"><Sprout size={14} />{t("aboutBadge")}</span><h1>{t("aboutTitle")}</h1><p>{t("aboutBody")}</p></div></section>
    <section className="about-grid"><InfoCard icon={<Target />} title={t("goalTitle")} body={t("goalBody")} /><InfoCard icon={<Compass />} title={t("howTitle")} body={t("howBody")} /><InfoCard icon={<HeartHandshake />} title={t("benefitsTitle")} body={t("benefitsBody")} /></section>
    <section className="contact-section"><div className="contact-section__intro"><span className="section-kicker">AqroQR</span><h2>{t("contactTitle")}</h2><p>{t("contactBody")}</p><div className="contact-section__image" role="img" aria-label={t("contactTitle")} /></div><div className="contact-section__content"><div className="contact-methods"><a href="tel:+994773100313"><span><Phone size={22} /></span><div><small>{t("phone")}</small><strong>+994 77 310 03 13</strong></div><ArrowUpRight size={18} /></a><a href="mailto:aqroqr@gmail.com"><span><Mail size={22} /></span><div><small>{t("email")}</small><strong>aqroqr@gmail.com</strong></div><ArrowUpRight size={18} /></a></div><div className="contact-socials"><h3>{t("footerSocial")}</h3><div><span title={t("socialUnavailable")}><Instagram size={18} />Instagram</span><span title={t("socialUnavailable")}><Linkedin size={18} />LinkedIn</span><span title={t("socialUnavailable")}><Facebook size={18} />Facebook</span><span title={t("socialUnavailable")}><Music2 size={18} />TikTok</span></div><p>{t("socialUnavailable")}</p></div></div></section>
  </div></AppShell>;
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) { return <article className="info-card"><span className="info-icon">{icon}</span><h2>{title}</h2><p>{body}</p></article>; }
