import { Suspense } from "react";
import { FarmerEventForm } from "@/components/farmer-forms";
export default function Page(){return <Suspense fallback={<div className="loading-screen">AqroQR</div>}><FarmerEventForm/></Suspense>;}
