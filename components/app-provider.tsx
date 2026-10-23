"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedNotifications } from "@/data/mock-places";
import { translate } from "@/lib/i18n";
import type { Notification, ProfilePreferences, ReservationRequest, SessionUser, SupportedLanguage } from "@/types";

type AppContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
  session: SessionUser | null;
  ready: boolean;
  login: (user: SessionUser) => void;
  logout: () => void;
  requests: ReservationRequest[];
  addRequest: (request: Omit<ReservationRequest, "id" | "createdAt" | "status">) => void;
  cancelRequest: (id: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  preferences: ProfilePreferences;
  updateProfile: (profile: Partial<SessionUser>) => void;
  updatePreferences: (preferences: Partial<ProfilePreferences>) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const initialPreferences: ProfilePreferences = { emailUpdates: true, travelReminders: true, recommendations: true };

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("az");
  const [session, setSession] = useState<SessionUser | null>(null);
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [preferences, setPreferences] = useState<ProfilePreferences>(initialPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguageState(readStorage<SupportedLanguage>("aqroqr:language", "az"));
    setSession(readStorage<SessionUser | null>("aqroqr:session", null));
    setRequests(readStorage<ReservationRequest[]>("aqroqr:requests", []));
    setNotifications(readStorage<Notification[]>("aqroqr:notifications", seedNotifications));
    setPreferences(readStorage<ProfilePreferences>("aqroqr:preferences", initialPreferences));
    setReady(true);
  }, []);

  const setLanguage = (next: SupportedLanguage) => {
    setLanguageState(next);
    window.localStorage.setItem("aqroqr:language", JSON.stringify(next));
    document.documentElement.lang = next === "az" ? "az" : next;
  };

  const login = (user: SessionUser) => {
    setSession(user);
    window.localStorage.setItem("aqroqr:session", JSON.stringify(user));
  };

  const logout = () => {
    setSession(null);
    window.localStorage.removeItem("aqroqr:session");
  };

  const addRequest = (input: Omit<ReservationRequest, "id" | "createdAt" | "status">) => {
    const request: ReservationRequest = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "pending" };
    setRequests((current) => {
      const next = [request, ...current];
      window.localStorage.setItem("aqroqr:requests", JSON.stringify(next));
      return next;
    });
  };

  const cancelRequest = (id: string) => {
    setRequests((current) => {
      const next = current.map((request) => request.id === id ? { ...request, status: "cancelled" as const } : request);
      window.localStorage.setItem("aqroqr:requests", JSON.stringify(next));
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((current) => {
      const next = current.map((notification) => notification.id === id ? { ...notification, read: true } : notification);
      window.localStorage.setItem("aqroqr:notifications", JSON.stringify(next));
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => {
      const next = current.map((notification) => ({ ...notification, read: true }));
      window.localStorage.setItem("aqroqr:notifications", JSON.stringify(next));
      return next;
    });
  };

  const updateProfile = (profile: Partial<SessionUser>) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, ...profile };
      window.localStorage.setItem("aqroqr:session", JSON.stringify(next));
      return next;
    });
  };

  const updatePreferences = (nextPreferences: Partial<ProfilePreferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...nextPreferences };
      window.localStorage.setItem("aqroqr:preferences", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<AppContextValue>(() => ({
    language, setLanguage, t: (key) => translate(language, key), session, ready, login, logout, requests, addRequest, cancelRequest,
    notifications, markNotificationRead, markAllNotificationsRead, preferences, updateProfile, updatePreferences
  }), [language, session, ready, requests, notifications, preferences]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
