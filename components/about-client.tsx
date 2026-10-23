"use client";

import { ArrowRight, Compass, HeartHandshake, Mail, Mountain, Sprout, Target } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export function AboutClient() { const { t } = useApp(); return <AppShell><div className="page-stack"><section className="about-hero"><div><span className="eyebrow"><Sprout size={14} />{t("aboutBadge")}</span><h1>{t("aboutTitle")}</h1><p>{t("aboutBody")}</p></div><div className="about-symbol"><Mountain size={44} /><span>AQ</span></div></section><section className="about-grid"><InfoCard icon={<Target />} title={t("goalTitle")} body={t("goalBody")} /><InfoCard icon={<Compass />} title={t("howTitle")} body={t("howBody")} /><InfoCard icon={<HeartHandshake />} title={t("benefitsTitle")} body={t("benefitsBody")} /></section><section className="contact-card"><div><span className="section-kicker">{t("contactTitle")}</span><h2>{t("contactTitle")}</h2><p>{t("contactBody")}</p></div><a className="button button--light" href="mailto:aqroqr@gmail.com"><Mail size={17} />aqroqr@gmail.com <ArrowRight size={16} /></a></section></div></AppShell>; }
function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) { return <article className="info-card"><span className="info-icon">{icon}</span><h2>{title}</h2><p>{body}</p></article>; }
