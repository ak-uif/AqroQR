"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit3, Package } from "lucide-react";
import { FarmerShell } from "@/components/farmer-shell";
import { HarvestAICard } from "@/components/harvest-ai-card";
import { useMarketplace } from "@/components/marketplace-provider";
import { useMarketTranslation } from "@/components/use-market-translation";

export function FarmerProductDetail() {
  const params=useParams<{id:string}>();
  const {currentFarmer,products}=useMarketplace();
  const {mt,listing,delivery,money,option}=useMarketTranslation();
  const product=products.find(item=>item.id===params.id&&item.farmerId===currentFarmer?.id);
  if(!product)return <FarmerShell><div className="farmer-empty"><Package size={30}/><h1>{mt("productNotFound")}</h1><Link href="/farmer/products" className="button button--primary">{mt("backProducts")}</Link></div></FarmerShell>;
  return <FarmerShell><div className="farmer-page"><Link href="/farmer/products" className="farmer-back"><ArrowLeft size={16}/>{mt("backProducts")}</Link><div className="farmer-heading farmer-heading--row"><div><span className="section-kicker">{listing(product.status)}</span><h1>{product.name||mt("unnamedDraft")}</h1><p>{option(product.category)} · {option(product.region)}</p></div><Link href={`/farmer/products/new?edit=${product.id}`} className="button button--soft"><Edit3 size={16}/>{mt("edit")}</Link></div><section className="farmer-panel farmer-product-summary"><div className={`farmer-preview__photo ${!product.image?"image-placeholder":""}`} style={product.image?{backgroundImage:`url("${product.image}")`}:undefined}/><div><strong>{money(product.price)} AZN / {option(product.unit)}</strong><p>{product.quantity} {option(product.unit)} · {delivery(product.delivery)}</p><p>{product.description}</p><small>{mt("plantingDate")}: {product.plantingDate||mt("notSpecified")} · {mt("harvestDate")}: {product.harvestDate||mt("notSpecified")}</small></div></section><HarvestAICard product={product} farmer={currentFarmer}/></div></FarmerShell>;
}
