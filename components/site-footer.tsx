"use client";

import Link from "next/link";
import { ArrowRight, Instagram, Linkedin, Facebook, Music2, Mail, Phone } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { BrandLogo } from "@/components/brand-logo";

const socialChannels = [
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "Facebook", icon: Facebook },
  { label: "TikTok", icon: Music2 }
];

export function SiteFooter() {
  const { t } = useApp();
  return <footer className="site-footer">
    <div className="site-footer__feature">
      <div className="site-footer__message">
        <span className="site-footer__eyebrow">AqroQR · {t("contactTitle")}</span>
        <h2>{t("footerHeadline")}</h2>
        <p>{t("footerIntro")}</p>
        <div className="site-footer__contact-actions">
          <a href="mailto:aqroqr@gmail.com" className="site-footer__mail"><Mail size={18} />aqroqr@gmail.com <ArrowRight size={17} /></a>
          <a href="tel:+994773100313" className="site-footer__phone"><Phone size={17} />+994 77 310 03 13</a>
        </div>
      </div>
      <div className="site-footer__photo" role="img" aria-label={t("footerPhotoAlt")}><span>{t("brandTagline")}</span></div>
    </div>
    <div className="site-footer__navigation">
      <div className="site-footer__identity"><div className="site-footer__lockup"><BrandLogo compact /><strong>AqroQR</strong></div><span>{t("footerTagline")}</span></div>
      <nav aria-label={t("footerExplore")}><Link href="/dashboard">{t("navDashboard")}</Link><Link href="/places">{t("navPlaces")}</Link><Link href="/map">{t("navMap")}</Link><Link href="/about">{t("navAbout")}</Link></nav>
      <div className="site-footer__social-area"><span className="site-footer__social-title">{t("footerSocial")}</span><div className="site-footer__socials">{socialChannels.map(({ label, icon: Icon }) => <span key={label} title={`${label}: ${t("socialUnavailable")}`} aria-label={`${label}: ${t("socialUnavailable")}`}><Icon size={17} /><span>{label}</span></span>)}</div><small>{t("socialUnavailable")}</small></div>
    </div>
    <div className="site-footer__bottom"><span>{t("footer")}</span><span><a href="https://commons.wikimedia.org/wiki/File:Ismailli_Azerbaijan_00.jpg" target="_blank" rel="noopener noreferrer">{t("photoCredit")}</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a></span></div>
  </footer>;
}
