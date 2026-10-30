import { Suspense } from "react";
import { ProductDetailClient } from "@/components/marketplace-client";
export default function Page(){return <Suspense fallback={<div className="loading-screen">AqroQR</div>}><ProductDetailClient/></Suspense>;}
