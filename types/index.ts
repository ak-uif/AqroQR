export type SupportedLanguage = "az" | "en" | "ru";

export type LocalizedText = Record<SupportedLanguage, string>;

export type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  userType: "citizen" | "guest";
  interests: string[];
  registeredAt: string;
};

export type Place = {
  id: string;
  name: LocalizedText;
  region: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  activity: LocalizedText;
  duration: LocalizedText;
  capacity: number;
  price: number;
  coordinates: [number, number];
  visual: string;
  demo: boolean;
};

export type ReservationRequest = {
  id: string;
  placeId: string;
  date: string;
  participants: number;
  activity: string;
  note: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

export type Notification = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  createdAt: string;
  read: boolean;
};

export type ProfilePreferences = {
  emailUpdates: boolean;
  travelReminders: boolean;
  recommendations: boolean;
};
