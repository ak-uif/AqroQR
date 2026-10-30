"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarPlus, ClipboardList, Home, LogOut, Package, PlusCircle, ShoppingBag, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useMarketplace } from "@/components/marketplace-provider";
import type { ReactNode } from "react";

const navigation = [
  {href:"/farmer/dashboard",label:"Ana səhifə",icon:Home},
  {href:"/farmer/products/new",label:"Məhsul əlavə et",icon:PlusCircle},
  {href:"/farmer/products",label:"Məhsullarım",icon:Package},
  {href:"/farmer/events/new",label:"Tədbir yarat",icon:CalendarPlus},
  {href:"/farmer/orders",label:"Sifarişlərim",icon:ShoppingBag},
  {href:"/farmer/events",label:"Tədbirlərim",icon:ClipboardList},
  {href:"/farmer/notifications",label:"Bildirişlər",icon:Bell},
  {href:"/farmer/profile",label:"Profilim",icon:UserRound}
];
export function FarmerShell({children}: {children:ReactNode}) {
  const {ready,currentFarmer,leaveFarmer}=useMarketplace();
  const path=usePathname();
  const router=useRouter();
  if(!ready)return <div className="loading-screen"><p>AqroQR</p></div>;
  if(!currentFarmer)return <main className="farmer-entry"><div className="farmer-entry-form"><BrandLogo /><h1>Fermer girişi lazımdır</h1><p>Davam etmək üçün fermer profilinizə daxil olun.</p><Link href="/farmer/login" className="button button--primary">Daxil ol</Link></div></main>;
  return <div className="farmer-layout"><aside className="farmer-sidebar"><Link href="/farmer/dashboard"><BrandLogo compact /></Link><span className="farmer-sidebar__title">Fermer sahəsi</span><nav aria-label="Fermer menyusu">{navigation.map(({href,label,icon:Icon})=><Link key={href} href={href} className={path===href?"is-active":""}><Icon size={20}/><span>{label}</span></Link>)}</nav><div className="farmer-sidebar__bottom"><strong>{currentFarmer.farmName}</strong><small>{currentFarmer.region}</small><button type="button" onClick={()=>{leaveFarmer();router.push("/farmer");}}><LogOut size={16}/> Çıxış</button></div></aside><div className="farmer-main"><header className="farmer-topbar"><Link href="/farmer/dashboard" className="farmer-topbar__brand"><BrandLogo compact /><strong>Fermer sahəsi</strong></Link><span>{currentFarmer.farmName}</span><LanguageSwitcher /></header><nav className="farmer-mobile-nav" aria-label="Fermer menyusu">{navigation.map(({href,label,icon:Icon})=><Link key={href} href={href} className={path===href?"is-active":""}><Icon size={18}/>{label}</Link>)}</nav><main className="farmer-content">{children}</main></div></div>;
}
