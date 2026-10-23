import { Suspense } from "react";
import { PlacesClient } from "@/components/places-client";
export default function PlacesPage() { return <Suspense fallback={<div className="loading-screen"><p>AqroQR</p></div>}><PlacesClient /></Suspense>; }
