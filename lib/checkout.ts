import type { Place } from "@/types";

export type ActivityChoice = "standard" | "guided";

export const CHECKOUT_TIMES = ["09:00", "11:00", "14:00", "16:00"] as const;
export const PROMO_CODE = "AQRO10";
export const DECLINED_TEST_CARD = "4000000000000002";

export function todayLocal() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function activityLabel(place: Place, choice: ActivityChoice) {
  return choice === "guided" ? "Bələdçili təcrübə" : place.activity.az;
}

export function calculateCheckout(place: Place, participants: number, date: string, activity: ActivityChoice, promoApplied: boolean) {
  const count = Number.isInteger(participants) && participants > 0 ? participants : 1;
  const base = place.price * count;
  const activityExtra = activity === "guided" ? 8 * count : 0;
  const day = date ? new Date(`${date}T12:00:00`) : null;
  const weekendExtra = day && (day.getDay() === 0 || day.getDay() === 6) ? 4 * count : 0;
  const serviceFee = 2;
  const subtotal = base + activityExtra + weekendExtra + serviceFee;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  return { base, activityExtra, weekendExtra, serviceFee, discount, total: subtotal - discount };
}

export function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function cardNetwork(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  return "Kart";
}

function passesLuhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index--) {
    let digit = Number(digits[index]);
    if (double) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function validateCard(card: { holder: string; number: string; expiry: string; cvv: string }) {
  const errors: Record<string, string> = {};
  const digits = card.number.replace(/\D/g, "");
  if (card.holder.trim().length < 3) errors.holder = "Kart sahibinin adını daxil edin";
  if (!/^\d{16,19}$/.test(digits) || !passesLuhn(digits)) errors.number = "Kart nömrəsini düzgün daxil edin";
  const expiry = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(card.expiry);
  if (!expiry) {
    errors.expiry = "Bitmə tarixini AA/İİ formatında daxil edin";
  } else {
    const year = 2000 + Number(expiry[2]);
    const month = Number(expiry[1]);
    const now = new Date();
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiry = "Kartın istifadə müddəti bitib";
    }
  }
  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = "CVV 3 və ya 4 rəqəm olmalıdır";
  return errors;
}

export function reservationNumber(id: string) {
  return `AQ-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
