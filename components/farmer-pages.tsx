"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Bell, CalendarDays, CalendarPlus, CheckCircle2, ClipboardList, Edit3, Package, PlusCircle, ShoppingBag, UserRound, Wallet } from "lucide-react";
import { FarmerShell } from "@/components/farmer-shell";
import { useMarketplace } from "@/components/marketplace-provider";
import { Modal } from "@/components/modal";
import { Input, Select } from "@/components/farmer-entry";
import { listingText, orderText, reviewText, regions, type ListingStatus, type ReviewStatus } from "@/lib/marketplace";

const actions = [
  {href:"/farmer/products/new",label:"Məhsul əlavə et",description:"Yeni məhsulu addım-addım yazın",icon:PlusCircle},
  {href:"/farmer/events/new",label:"Tədbir yarat",description:"Ferma tədbiri hazırlayın",icon:CalendarPlus},
  {href:"/farmer/products",label:"Məhsullarım",description:"Elanlarınıza baxın",icon:Package},
  {href:"/farmer/orders",label:"Sifarişlərim",description:"Gələn sifarişləri izləyin",icon:ShoppingBag},
  {href:"/farmer/events",label:"Tədbirlərim",description:"Tədbirlərinizi idarə edin",icon:CalendarDays},
  {href:"/farmer/profile",label:"Profilim",description:"Təsərrüfat məlumatlarınız",icon:UserRound}
];
export function FarmerDashboard() {
  const {currentFarmer,products,orders,events}=useMarketplace();
  const ownProducts=products.filter(p=>p.farmerId===currentFarmer?.id);
  const ownOrders=orders.filter(o=>o.farmerId===currentFarmer?.id);
  const ownEvents=events.filter(e=>e.farmerId===currentFarmer?.id);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">FERMER ANA SƏHİFƏSİ</span><h1>Salam, {currentFarmer?.firstName}</h1><p>Bu gün nə etmək istəyirsiniz?</p></div><section className="farmer-status"><div><span>Təsdiq statusu</span><strong>{currentFarmer?reviewText[currentFarmer.status]:"Yoxlanılır"}</strong><p>{currentFarmer?.status==="approved"?"Məhsul və tədbirlər təsdiqdən sonra alıcılara görünür.":"Profiliniz yoxlanılır. Elanlarınızı indidən hazırlaya bilərsiniz."}</p></div><Link href="/farmer/profile" className="button button--soft">Profilimə bax <ArrowRight size={17}/></Link></section><div className="farmer-metrics"><div><Package size={22}/><strong>{ownProducts.filter(p=>p.status==="approved").length}</strong><span>Aktiv məhsullar</span></div><div><ShoppingBag size={22}/><strong>{ownOrders.filter(o=>o.status==="new").length}</strong><span>Gözləyən sifarişlər</span></div><div><CalendarDays size={22}/><strong>{ownEvents.filter(e=>e.status==="approved").length}</strong><span>Aktiv tədbirlər</span></div></div><h2>Tez keçidlər</h2><div className="farmer-action-grid">{actions.map(({href,label,description,icon:Icon})=><Link href={href} key={href} className="farmer-action"><span><Icon size={26}/></span><strong>{label}</strong><small>{description}</small><ArrowRight className="farmer-action__arrow" size={20}/></Link>)}</div></div></FarmerShell>;
}

export function FarmerProducts() {
  const {currentFarmer,products,updateProductStatus}=useMarketplace();
  const [archiveId,setArchiveId]=useState<string|null>(null);
  const own=products.filter(p=>p.farmerId===currentFarmer?.id&&p.status!=="archived");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading farmer-heading--row"><div><span className="section-kicker">ELANLAR</span><h1>Məhsullarım</h1><p>Məhsullarınızın vəziyyətini buradan izləyin.</p></div><Link href="/farmer/products/new" className="button button--primary"><PlusCircle size={19}/> Məhsul əlavə et</Link></div>{own.length===0?<div className="farmer-empty"><Package size={30}/><strong>Hələ məhsul yoxdur</strong><p>İlk məhsulunuzu əlavə edin.</p><Link href="/farmer/products/new" className="button button--primary">Məhsul əlavə et</Link></div>:<div className="farmer-list">{own.map(p=><article className="farmer-list-card" key={p.id}><div className={`farmer-list-card__photo ${!p.image?"image-placeholder":""}`} style={p.image?{backgroundImage:`url("${p.image}")`}:undefined}/><div><span className="market-status">{listingText[p.status]}</span><h2>{p.name||"Adsız qaralama"}</h2><p>{p.price>0?`${p.price} AZN / ${p.unit} · ${p.quantity} ${p.unit} mövcuddur`:"Məlumatlar tamamlanmayıb"}</p><small>{p.region}</small></div><div className="farmer-list-card__actions"><Link href={`/farmer/products/new?edit=${p.id}`} className="button button--soft"><Edit3 size={15}/> Düzəliş et</Link>{p.status==="approved"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"paused")}>Satışı dayandır</button>}{p.status==="paused"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"approved")}>Satışı davam et</button>}{p.status==="pending"&&currentFarmer?.status==="approved"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"approved")}>Nümayiş təsdiqi</button>}<button className="button button--danger-outline" onClick={()=>setArchiveId(p.id)}>Arxivlə</button></div></article>)}</div>}<p className="farmer-help">“Nümayiş təsdiqi” yalnız bu frontend prototipində yoxlama nəticəsini göstərir; real təsdiq prosesi deyil.</p></div>{archiveId&&<Modal title="Məhsulu arxivlə" onClose={()=>setArchiveId(null)}><div className="confirm-panel"><p>Məhsul ictimai kataloqdan gizlənəcək. Davam etmək istəyirsiniz?</p><div className="form-actions"><button className="button button--soft" onClick={()=>setArchiveId(null)}>Geri</button><button className="button button--danger" onClick={()=>{updateProductStatus(archiveId,"archived");setArchiveId(null);}}>Arxivlə</button></div></div></Modal>}</FarmerShell>;
}

export function FarmerEvents() {
  const {currentFarmer,events,updateEventStatus}=useMarketplace();
  const [archiveId,setArchiveId]=useState<string|null>(null);
  const own=events.filter(e=>e.farmerId===currentFarmer?.id&&e.status!=="archived");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading farmer-heading--row"><div><span className="section-kicker">TƏDBİRLƏR</span><h1>Tədbirlərim</h1><p>Tədbirlərinizin tarixini və vəziyyətini izləyin.</p></div><Link href="/farmer/events/new" className="button button--primary"><CalendarPlus size={19}/> Tədbir yarat</Link></div>{own.length===0?<div className="farmer-empty"><CalendarDays size={30}/><strong>Hələ tədbir yoxdur</strong><Link href="/farmer/events/new" className="button button--primary">Tədbir yarat</Link></div>:<div className="farmer-list">{own.map(e=><article className="farmer-list-card" key={e.id}><div className={`farmer-list-card__photo ${!e.image?"image-placeholder":""}`} style={e.image?{backgroundImage:`url("${e.image}")`}:undefined}/><div><span className="market-status">{listingText[e.status]}</span><h2>{e.name}</h2><p>{e.date} · {e.time} · {e.region}</p><small>{e.capacity} yer · {e.price} AZN</small></div><div className="farmer-list-card__actions"><Link href={`/farmer/events/new?edit=${e.id}`} className="button button--soft"><Edit3 size={15}/> Düzəliş et</Link>{e.status==="pending"&&currentFarmer?.status==="approved"&&<button className="button button--soft" onClick={()=>updateEventStatus(e.id,"approved")}>Nümayiş təsdiqi</button>}<button className="button button--danger-outline" onClick={()=>setArchiveId(e.id)}>Arxivlə</button></div></article>)}</div>}<p className="farmer-help">Yalnız təsdiqlənmiş tədbirlər məkanlar siyahısında görünür. Nümayiş təsdiqi real yoxlama deyil.</p></div>{archiveId&&<Modal title="Tədbiri arxivlə" onClose={()=>setArchiveId(null)}><div className="confirm-panel"><p>Tədbir məkanlar siyahısından gizlənəcək.</p><div className="form-actions"><button className="button button--soft" onClick={()=>setArchiveId(null)}>Geri</button><button className="button button--danger" onClick={()=>{updateEventStatus(archiveId,"archived");setArchiveId(null);}}>Arxivlə</button></div></div></Modal>}</FarmerShell>;
}

export function FarmerOrders() {
  const {currentFarmer,orders,products,privateContacts,updateOrderStatus}=useMarketplace();
  const own=orders.filter(o=>o.farmerId===currentFarmer?.id);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">SİFARİŞLƏR</span><h1>Sifarişlərim</h1><p>Alıcılardan gələn məhsul istəkləri burada görünür.</p></div>{own.length===0?<div className="farmer-empty"><ShoppingBag size={30}/><strong>Hələ sifariş yoxdur</strong><p>Yeni sifariş gələndə burada görünəcək.</p></div>:<div className="farmer-list">{own.map(o=>{const product=products.find(p=>p.id===o.productId);const contact=privateContacts[o.id];return <article className="farmer-order" key={o.id}><div><span className="market-status">{orderText[o.status]}</span><h2>{product?.name??"Məhsul"}</h2><p>{o.buyerName} · {o.quantity} {product?.unit} · {o.total} AZN</p><small>Əlaqə: {contact?.phone??o.phoneHint} · {new Date(o.createdAt).toLocaleDateString("az-AZ")}</small>{o.delivery==="delivery"&&<small>Çatdırılma: {contact?.address??o.region}</small>}</div><label className="market-field"><span>Vəziyyəti dəyiş</span><select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value as typeof o.status)}><option value="new">Yeni sifariş</option><option value="accepted">Qəbul edildi</option><option value="preparing">Hazırlanır</option><option value="delivered">Təhvil verildi</option><option value="cancelled">Ləğv edildi</option></select></label></article>;})}</div>}<p className="farmer-help">Alıcının tam telefon və ünvanı yalnız cari baxışda görünür; brauzer yaddaşına yazılmır.</p></div></FarmerShell>;
}

export function FarmerProfile() {
  const {currentFarmer,updateFarmer,reviewFarmer}=useMarketplace();
  const [farmName,setFarmName]=useState(currentFarmer?.farmName??"");
  const [region,setRegion]=useState(currentFarmer?.region??"");
  const [description,setDescription]=useState(currentFarmer?.description??"");
  const [status,setStatus]=useState<ReviewStatus>(currentFarmer?.status??"pending");
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    if (!currentFarmer) return;
    setFarmName(currentFarmer.farmName);
    setRegion(currentFarmer.region);
    setDescription(currentFarmer.description);
    setStatus(currentFarmer.status);
  },[currentFarmer?.id]);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">PROFİL</span><h1>Profilim</h1><p>Təsərrüfatınız haqqında məlumatları yeniləyin.</p></div><section className="farmer-status"><div><span>Təsdiq statusu</span><strong>{reviewText[currentFarmer?.status??"pending"]}</strong><p>Profil və elan təsdiqləri bu prototipdə nümunə vəziyyətləridir.</p></div><CheckCircle2 size={28}/></section><div className="farmer-panel"><h2>Təsərrüfat məlumatları</h2><div className="market-form-grid"><Input label="Təsərrüfatın adı" value={farmName} onChange={setFarmName}/><Select label="Region / rayon" value={region} options={regions} onChange={setRegion}/><label className="market-field market-field--full"><span>Qısa məlumat</span><textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)}/></label></div><button className="button button--primary" onClick={()=>{if(!farmName.trim()||!region)return;updateFarmer({farmName:farmName.trim(),region,description:description.trim()});setSaved(true);}}>Yadda saxla</button>{saved&&<span className="saved-message">Məlumatlar yeniləndi.</span>}</div><details className="farmer-demo-review"><summary>Nümayiş üçün yoxlama vəziyyətini dəyiş</summary><p>Bu seçim yalnız yerli frontend vəziyyətini dəyişir. Real təsdiq aparılmır.</p><div><select value={status} onChange={e=>setStatus(e.target.value as ReviewStatus)}><option value="pending">Yoxlanılır</option><option value="approved">Təsdiqlənib</option><option value="changes">Düzəliş tələb olunur</option><option value="rejected">Rədd edilib</option></select><button className="button button--soft" onClick={()=>reviewFarmer(status)}>Nəticəni göstər</button></div></details></div></FarmerShell>;
}

export function FarmerNotifications() {
  const {currentFarmer,products,orders,events}=useMarketplace();
  const pendingProducts=products.filter(p=>p.farmerId===currentFarmer?.id&&p.status==="pending");
  const pendingEvents=events.filter(e=>e.farmerId===currentFarmer?.id&&e.status==="pending");
  const newOrders=orders.filter(o=>o.farmerId===currentFarmer?.id&&o.status==="new");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">BİLDİRİŞLƏR</span><h1>Bildirişlər</h1><p>Yoxlama və sifariş xəbərdarlıqlarınız.</p></div><div className="farmer-list"><article className="farmer-order"><Bell size={22}/><div><h2>Profil vəziyyəti: {reviewText[currentFarmer?.status??"pending"]}</h2><p>Profil məlumatlarınızı “Profilim” bölməsində görə bilərsiniz.</p></div></article>{pendingProducts.map(p=><article className="farmer-order" key={p.id}><Package size={22}/><div><h2>{p.name} yoxlanılır</h2><p>Təsdiqdən sonra Aqro Bazarda görünəcək.</p></div></article>)}{pendingEvents.map(e=><article className="farmer-order" key={e.id}><CalendarDays size={22}/><div><h2>{e.name} yoxlanılır</h2><p>Təsdiqdən sonra Məkanlar bölməsində görünəcək.</p></div></article>)}{newOrders.map(o=><article className="farmer-order" key={o.id}><ShoppingBag size={22}/><div><h2>Yeni sifariş</h2><p>{o.buyerName} tərəfindən {o.quantity} ədəd məhsul istəyi.</p></div></article>)}</div></div></FarmerShell>;
}
