"use client";

import Link from "next/link";
import { Bell, Compass, Home, Info, Map, Menu, Mountain, UserRound, X, ClipboardList } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useApp } from "@/components/app-provider";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";

const navigation = [
  { href: "/dashboard", key: "navDashboard", icon: Home }, { href: "/places", key: "navPlaces", icon: Compass }, { href: "/map", key: "navMap", icon: Map },
  { href: "/requests", key: "navRequests", icon: ClipboardList }, { href: "/notifications", key: "navNotifications", icon: Bell }, { href: "/about", key: "navAbout", icon: Info }
];

export function AppShell({ children }: { children: ReactNode }) {
  const { ready, session, t, notifications, logout } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((notification) => !notification.read).length;

  if (!ready) return <div className="loading-screen"><div className="loading-mark">AQ</div><p>{t("brandName")}</p></div>;
  if (!session) return <div className="empty-shell"><BrandLogo /><h1>{t("explore")}</h1><p>{t("myGovBody")}</p><Link href="/" className="button button--primary">{t("continue")}</Link></div>;

  const firstName = session.firstName || (session.userType === "guest" ? "Guest" : "AqroQR");
  return (
    <div className="app-layout">
      <aside className={`app-sidebar ${open ? "app-sidebar--open" : ""}`}>
        <div className="sidebar-head"><BrandLogo compact /><span className="sidebar-brand">AqroQR</span><button className="icon-button sidebar-close" onClick={() => setOpen(false)} aria-label={t("menu")}><X size={20} /></button></div>
        <nav className="sidebar-nav" aria-label={t("menu")}>{navigation.map(({ href, key, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "is-active" : ""} onClick={() => setOpen(false)}><Icon size={19} /><span>{t(key)}</span>{key === "navNotifications" && unread > 0 && <b className="nav-badge">{unread}</b>}</Link>)}</nav>
        <div className="sidebar-bottom"><Link href="/profile" className="profile-mini"><span className="avatar">{firstName.slice(0, 1).toUpperCase()}</span><span><strong>{firstName} {session.lastName}</strong><small>{session.userType === "guest" ? t("guest") : t("citizen")}</small></span><UserRound size={16} /></Link><button className="logout-link" onClick={() => { logout(); window.location.href = "/"; }}>{t("logout")}</button></div>
      </aside>
      {open && <button className="sidebar-overlay" aria-label={t("close")} onClick={() => setOpen(false)} />}
      <div className="app-main"><header className="app-topbar"><button className="mobile-menu-button" onClick={() => setOpen(true)} aria-label={t("menu")}><Menu size={22} /></button><div className="topbar-title"><span className="topbar-kicker">{t("brandTagline")}</span><strong>{session.city || session.country}</strong></div><div className="topbar-actions"><LanguageSwitcher /><Link href="/notifications" className="icon-button notification-button" aria-label={t("navNotifications")}><Bell size={19} />{unread > 0 && <b className="notification-dot">{unread}</b>}</Link><Link href="/profile" className="avatar avatar--small" aria-label={t("navProfile")}>{firstName.slice(0, 1).toUpperCase()}</Link></div></header><main className="app-content">{children}</main>{pathname === "/dashboard" && <SiteFooter />}</div>
      <nav className="mobile-nav" aria-label={t("menu")}>{navigation.slice(0, 4).map(({ href, key, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "is-active" : ""}><Icon size={18} /><span>{t(key)}</span></Link>)}</nav>
    </div>
  );
}
