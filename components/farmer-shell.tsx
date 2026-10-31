"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarPlus, ClipboardList, Home, LogOut, Package, PlusCircle, ShoppingBag, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useMarketplace } from "@/components/marketplace-provider";
import { useMarketTranslation } from "@/components/use-market-translation";
import type { ReactNode } from "react";

const navigation = [
  {href:"/farmer/dashboard",key:"home",icon:Home},
  {href:"/farmer/products/new",key:"addProduct",icon:PlusCircle},
  {href:"/farmer/products",key:"myProducts",icon:Package},
  {href:"/farmer/events/new",key:"createEvent",icon:CalendarPlus},
  {href:"/farmer/orders",key:"myOrders",icon:ShoppingBag},
  {href:"/farmer/events",key:"myEvents",icon:ClipboardList},
  {href:"/farmer/notifications",key:"notifications",icon:Bell},
  {href:"/farmer/profile",key:"profile",icon:UserRound}
];
export function FarmerShell({children}: {children:ReactNode}) {
  const {ready,currentFarmer,leaveFarmer}=useMarketplace();
  const {mt}=useMarketTranslation();
  const path=usePathname();
  const router=useRouter();
  if(!ready)return <div className="loading-screen"><p>AqroQR</p></div>;
  if(!currentFarmer)return <main className="farmer-entry"><div className="farmer-entry-form"><BrandLogo /><h1>{mt("loginRequired")}</h1><p>{mt("loginRequiredBody")}</p><Link href="/farmer/login" className="button button--primary">{mt("login")}</Link></div></main>;
  return <div className="farmer-layout"><aside className="farmer-sidebar"><Link href="/farmer/dashboard"><BrandLogo compact /></Link><span className="farmer-sidebar__title">{mt("farmerArea")}</span><nav aria-label={mt("farmerMenu")}>{navigation.map(({href,key,icon:Icon})=><Link key={href} href={href} className={path===href?"is-active":""}><Icon size={20}/><span>{mt(key)}</span></Link>)}</nav><div className="farmer-sidebar__bottom"><strong>{currentFarmer.farmName}</strong><small>{currentFarmer.region}</small><button type="button" onClick={()=>{leaveFarmer();router.push("/farmer");}}><LogOut size={16}/> {mt("logout")}</button></div></aside><div className="farmer-main"><header className="farmer-topbar"><Link href="/farmer/dashboard" className="farmer-topbar__brand"><BrandLogo compact /><strong>{mt("farmerArea")}</strong></Link><span>{currentFarmer.farmName}</span><LanguageSwitcher /></header><nav className="farmer-mobile-nav" aria-label={mt("farmerMenu")}>{navigation.map(({href,key,icon:Icon})=><Link key={href} href={href} className={path===href?"is-active":""}><Icon size={18}/>{mt(key)}</Link>)}</nav><main className="farmer-content">{children}</main></div></div>;
}
