import { Suspense } from "react";
import { CheckoutClient } from "@/components/checkout-client";

export default function CheckoutPage() {
  return <Suspense fallback={<div className="loading-screen"><p>AqroQR</p></div>}><CheckoutClient /></Suspense>;
}
