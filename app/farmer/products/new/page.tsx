import { Suspense } from "react";
import { FarmerProductForm } from "@/components/farmer-forms";
export default function Page(){return <Suspense fallback={<div className="loading-screen">AqroQR</div>}><FarmerProductForm/></Suspense>;}
