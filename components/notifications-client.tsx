"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export function NotificationsClient() {
  const { t, notifications, language, markNotificationRead, markAllNotificationsRead } = useApp();
  return <AppShell><div className="page-stack"><section className="page-heading"><div><span className="eyebrow"><Bell size={14} />{t("navNotifications")}</span><h1>{t("notificationsTitle")}</h1><p>{t("planTripBody")}</p></div>{notifications.some((item) => !item.read) && <button className="button button--soft" onClick={markAllNotificationsRead}><CheckCheck size={17} />{t("markAll")}</button>}</section>{notifications.length === 0 ? <div className="empty-card empty-card--large"><Bell size={27} /><strong>{t("noNotifications")}</strong></div> : <div className="notification-list">{notifications.map((notification) => <article className={`notification-card ${notification.read ? "is-read" : ""}`} key={notification.id} onClick={() => markNotificationRead(notification.id)}><span className="notification-icon"><Bell size={18} /></span><div><div className="notification-card__head"><h2>{notification.title[language]}</h2><time>{new Date(notification.createdAt).toLocaleDateString(language === "az" ? "az-AZ" : language)}</time></div><p>{notification.body[language]}</p>{!notification.read && <button className="text-link" onClick={(event) => { event.stopPropagation(); markNotificationRead(notification.id); }}>{t("markRead")}</button>}</div></article>)}</div>}</div></AppShell>;
}
