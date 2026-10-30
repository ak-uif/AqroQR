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
  imageUrl?: string;
  eventDate?: string;
  eventTime?: string;
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
  userId?: string;
  placeName?: string;
  totalAmount?: number;
  paymentMethod?: "card" | "onsite";
  paymentStatus?: "paid" | "pending";
};

export type NewReservationInput = Pick<ReservationRequest, "placeId" | "date" | "participants" | "activity"> & {
  userId: string;
  placeName: string;
  totalAmount: number;
  paymentMethod: "card" | "onsite";
  paymentStatus: "paid" | "pending";
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
