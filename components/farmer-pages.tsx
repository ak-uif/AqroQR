"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Bell, CalendarDays, CalendarPlus, CheckCircle2, ClipboardList, Edit3, Package, PlusCircle, ShoppingBag, UserRound, Wallet } from "lucide-react";
import { FarmerShell } from "@/components/farmer-shell";
import { useMarketplace } from "@/components/marketplace-provider";
import { Modal } from "@/components/modal";
import { Input, Select } from "@/components/farmer-entry";
import { HarvestAICard } from "@/components/harvest-ai-card";
import { useMarketTranslation } from "@/components/use-market-translation";
import { regions, type ReviewStatus } from "@/lib/marketplace";

const actions = [
  {href:"/farmer/products/new",label:"addProduct",description:"addProductDesc",icon:PlusCircle},
  {href:"/farmer/events/new",label:"createEvent",description:"createEventDesc",icon:CalendarPlus},
  {href:"/farmer/products",label:"myProducts",description:"myProductsDesc",icon:Package},
  {href:"/farmer/orders",label:"myOrders",description:"myOrdersDesc",icon:ShoppingBag},
  {href:"/farmer/events",label:"myEvents",description:"myEventsDesc",icon:CalendarDays},
  {href:"/farmer/profile",label:"profile",description:"profileDesc",icon:UserRound}
];
export function FarmerDashboard() {
  const {currentFarmer,products,orders,events}=useMarketplace();
  const {mt,review}=useMarketTranslation();
  const ownProducts=products.filter(p=>p.farmerId===currentFarmer?.id);
  const ownOrders=orders.filter(o=>o.farmerId===currentFarmer?.id);
  const ownEvents=events.filter(e=>e.farmerId===currentFarmer?.id);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">{mt("dashboardKicker")}</span><h1>{mt("hello",{name:currentFarmer?.firstName??""})}</h1><p>{mt("todayQuestion")}</p></div><section className="farmer-status"><div><span>{mt("verificationStatus")}</span><strong>{currentFarmer?review(currentFarmer.status):review("pending")}</strong><p>{mt(currentFarmer?.status==="approved"?"approvedHelp":"pendingHelp")}</p></div><Link href="/farmer/profile" className="button button--soft">{mt("viewProfile")} <ArrowRight size={17}/></Link></section><div className="farmer-metrics"><div><Package size={22}/><strong>{ownProducts.filter(p=>p.status==="approved").length}</strong><span>{mt("activeProducts")}</span></div><div><ShoppingBag size={22}/><strong>{ownOrders.filter(o=>o.status==="new").length}</strong><span>{mt("pendingOrders")}</span></div><div><CalendarDays size={22}/><strong>{ownEvents.filter(e=>e.status==="approved").length}</strong><span>{mt("activeEvents")}</span></div></div>{ownProducts[0]&&<HarvestAICard product={ownProducts[0]} farmer={currentFarmer}/>}<h2>{mt("quickLinks")}</h2><div className="farmer-action-grid">{actions.map(({href,label,description,icon:Icon})=><Link href={href} key={href} className="farmer-action"><span><Icon size={26}/></span><strong>{mt(label)}</strong><small>{mt(description)}</small><ArrowRight className="farmer-action__arrow" size={20}/></Link>)}</div></div></FarmerShell>;
}

export function FarmerProducts() {
  const {currentFarmer,products,updateProductStatus}=useMarketplace();
  const {mt,listing}=useMarketTranslation();
  const [archiveId,setArchiveId]=useState<string|null>(null);
  const own=products.filter(p=>p.farmerId===currentFarmer?.id&&p.status!=="archived");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading farmer-heading--row"><div><span className="section-kicker">{mt("listings")}</span><h1>{mt("myProducts")}</h1><p>{mt("productsTrack")}</p></div><Link href="/farmer/products/new" className="button button--primary"><PlusCircle size={19}/> {mt("addProduct")}</Link></div>{own.length===0?<div className="farmer-empty"><Package size={30}/><strong>{mt("noProducts")}</strong><p>{mt("addFirstProduct")}</p><Link href="/farmer/products/new" className="button button--primary">{mt("addProduct")}</Link></div>:<div className="farmer-list">{own.map(p=><article className="farmer-list-card" key={p.id}><div className={`farmer-list-card__photo ${!p.image?"image-placeholder":""}`} style={p.image?{backgroundImage:`url("${p.image}")`}:undefined}/><div><span className="market-status">{listing(p.status)}</span><h2>{p.name||mt("unnamedDraft")}</h2><p>{p.price>0?`${p.price} AZN / ${p.unit} · ${p.quantity} ${p.unit} ${mt("available")}`:mt("incomplete")}</p><small>{p.region}</small></div><div className="farmer-list-card__actions"><Link href={`/farmer/products/new?edit=${p.id}`} className="button button--soft"><Edit3 size={15}/> {mt("edit")}</Link>{p.status==="approved"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"paused")}>{mt("pauseSale")}</button>}{p.status==="paused"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"approved")}>{mt("resumeSale")}</button>}{p.status==="pending"&&currentFarmer?.status==="approved"&&<button className="button button--soft" onClick={()=>updateProductStatus(p.id,"approved")}>{mt("demoApprove")}</button>}<button className="button button--danger-outline" onClick={()=>setArchiveId(p.id)}>{mt("archive")}</button></div></article>)}</div>}<p className="farmer-help">{mt("demoApprovalHelp")}</p></div>{archiveId&&<Modal title={mt("archiveProduct")} onClose={()=>setArchiveId(null)}><div className="confirm-panel"><p>{mt("archiveProductBody")}</p><div className="form-actions"><button className="button button--soft" onClick={()=>setArchiveId(null)}>{mt("back")}</button><button className="button button--danger" onClick={()=>{updateProductStatus(archiveId,"archived");setArchiveId(null);}}>{mt("archive")}</button></div></div></Modal>}</FarmerShell>;
}

export function FarmerEvents() {
  const {currentFarmer,events,updateEventStatus}=useMarketplace();
  const {mt,listing}=useMarketTranslation();
  const [archiveId,setArchiveId]=useState<string|null>(null);
  const own=events.filter(e=>e.farmerId===currentFarmer?.id&&e.status!=="archived");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading farmer-heading--row"><div><span className="section-kicker">{mt("eventsKicker")}</span><h1>{mt("myEvents")}</h1><p>{mt("eventsTrack")}</p></div><Link href="/farmer/events/new" className="button button--primary"><CalendarPlus size={19}/> {mt("createEvent")}</Link></div>{own.length===0?<div className="farmer-empty"><CalendarDays size={30}/><strong>{mt("noEvents")}</strong><Link href="/farmer/events/new" className="button button--primary">{mt("createEvent")}</Link></div>:<div className="farmer-list">{own.map(e=><article className="farmer-list-card" key={e.id}><div className={`farmer-list-card__photo ${!e.image?"image-placeholder":""}`} style={e.image?{backgroundImage:`url("${e.image}")`}:undefined}/><div><span className="market-status">{listing(e.status)}</span><h2>{e.name}</h2><p>{e.date} · {e.time} · {e.region}</p><small>{mt("placesCount",{count:e.capacity})} · {e.price} AZN</small></div><div className="farmer-list-card__actions"><Link href={`/farmer/events/new?edit=${e.id}`} className="button button--soft"><Edit3 size={15}/> {mt("edit")}</Link>{e.status==="pending"&&currentFarmer?.status==="approved"&&<button className="button button--soft" onClick={()=>updateEventStatus(e.id,"approved")}>{mt("demoApprove")}</button>}<button className="button button--danger-outline" onClick={()=>setArchiveId(e.id)}>{mt("archive")}</button></div></article>)}</div>}<p className="farmer-help">{mt("eventApprovalHelp")}</p></div>{archiveId&&<Modal title={mt("archiveEvent")} onClose={()=>setArchiveId(null)}><div className="confirm-panel"><p>{mt("archiveEventBody")}</p><div className="form-actions"><button className="button button--soft" onClick={()=>setArchiveId(null)}>{mt("back")}</button><button className="button button--danger" onClick={()=>{updateEventStatus(archiveId,"archived");setArchiveId(null);}}>{mt("archive")}</button></div></div></Modal>}</FarmerShell>;
}

export function FarmerOrders() {
  const {currentFarmer,orders,products,privateContacts,updateOrderStatus}=useMarketplace();
  const {mt,order,date}=useMarketTranslation();
  const own=orders.filter(o=>o.farmerId===currentFarmer?.id);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">{mt("ordersKicker")}</span><h1>{mt("myOrders")}</h1><p>{mt("farmerOrdersBody")}</p></div>{own.length===0?<div className="farmer-empty"><ShoppingBag size={30}/><strong>{mt("noOrders")}</strong><p>{mt("newOrderHelp")}</p></div>:<div className="farmer-list">{own.map(o=>{const product=products.find(p=>p.id===o.productId);const contact=privateContacts[o.id];return <article className="farmer-order" key={o.id}><div><span className="market-status">{order(o.status)}</span><h2>{product?.name??mt("product")}</h2><p>{o.buyerName} · {o.quantity} {product?.unit} · {o.total} AZN</p><small>{mt("contact")}: {contact?.phone??o.phoneHint} · {date(o.createdAt)}</small>{o.delivery==="delivery"&&<small>{mt("deliveryAddress")}: {contact?.address??o.region}</small>}</div><label className="market-field"><span>{mt("changeStatus")}</span><select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value as typeof o.status)}><option value="new">{mt("orderNew")}</option><option value="accepted">{mt("orderAccepted")}</option><option value="preparing">{mt("orderPreparing")}</option><option value="delivered">{mt("orderDelivered")}</option><option value="cancelled">{mt("orderCancelled")}</option></select></label></article>;})}</div>}<p className="farmer-help">{mt("privateContactHelp")}</p></div></FarmerShell>;
}

export function FarmerProfile() {
  const {currentFarmer,updateFarmer,reviewFarmer}=useMarketplace();
  const {mt,review}=useMarketTranslation();
  const [farmName,setFarmName]=useState(currentFarmer?.farmName??"");
  const [region,setRegion]=useState(currentFarmer?.region??"");
  const [description,setDescription]=useState(currentFarmer?.description??"");
  const [soilType,setSoilType]=useState(currentFarmer?.soilType??"");
  const [irrigation,setIrrigation]=useState(currentFarmer?.irrigation??"");
  const [previousExperience,setPreviousExperience]=useState(currentFarmer?.previousExperience??"");
  const [status,setStatus]=useState<ReviewStatus>(currentFarmer?.status??"pending");
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    if (!currentFarmer) return;
    setFarmName(currentFarmer.farmName);
    setRegion(currentFarmer.region);
    setDescription(currentFarmer.description);
    setSoilType(currentFarmer.soilType??"");
    setIrrigation(currentFarmer.irrigation??"");
    setPreviousExperience(currentFarmer.previousExperience??"");
    setStatus(currentFarmer.status);
  },[currentFarmer?.id]);
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">{mt("profileKicker")}</span><h1>{mt("profile")}</h1><p>{mt("profileBody")}</p></div><section className="farmer-status"><div><span>{mt("verificationStatus")}</span><strong>{review(currentFarmer?.status??"pending")}</strong><p>{mt("prototypeStatus")}</p></div><CheckCircle2 size={28}/></section><div className="farmer-panel"><h2>{mt("farmInfo")}</h2><div className="market-form-grid"><Input label={mt("farmName")} value={farmName} onChange={setFarmName}/><Select label={mt("regionDistrict")} value={region} options={regions} onChange={setRegion} selectLabel={mt("select")}/><Input label={mt("soilFertility")} value={soilType} onChange={setSoilType}/><Select label={mt("irrigation")} value={irrigation} options={["available","partial","none"]} labels={[mt("availableWater"),mt("partialWater"),mt("noWater")]} onChange={setIrrigation} selectLabel={mt("select")}/><Input label={mt("previousExperience")} value={previousExperience} onChange={setPreviousExperience}/><label className="market-field market-field--full"><span>{mt("shortInfo")}</span><textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)}/></label></div><button className="button button--primary" onClick={()=>{if(!farmName.trim()||!region)return;updateFarmer({farmName:farmName.trim(),region,description:description.trim(),soilType,irrigation,previousExperience});setSaved(true);}}>{mt("save")}</button>{saved&&<span className="saved-message">{mt("saved")}</span>}</div><details className="farmer-demo-review"><summary>{mt("demoReview")}</summary><p>{mt("demoReviewBody")}</p><div><select value={status} onChange={e=>setStatus(e.target.value as ReviewStatus)}><option value="pending">{mt("statusPending")}</option><option value="approved">{mt("statusApproved")}</option><option value="changes">{mt("statusChanges")}</option><option value="rejected">{mt("statusRejected")}</option></select><button className="button button--soft" onClick={()=>reviewFarmer(status)}>{mt("showResult")}</button></div></details></div></FarmerShell>;
}

export function FarmerNotifications() {
  const {currentFarmer,products,orders,events}=useMarketplace();
  const {mt,review}=useMarketTranslation();
  const pendingProducts=products.filter(p=>p.farmerId===currentFarmer?.id&&p.status==="pending");
  const pendingEvents=events.filter(e=>e.farmerId===currentFarmer?.id&&e.status==="pending");
  const newOrders=orders.filter(o=>o.farmerId===currentFarmer?.id&&o.status==="new");
  return <FarmerShell><div className="farmer-page"><div className="farmer-heading"><span className="section-kicker">{mt("notifications").toLocaleUpperCase()}</span><h1>{mt("notifications")}</h1><p>{mt("notificationsBody")}</p></div><div className="farmer-list"><article className="farmer-order"><Bell size={22}/><div><h2>{mt("profileStatus",{status:review(currentFarmer?.status??"pending")})}</h2><p>{mt("profileStatusBody")}</p></div></article>{pendingProducts.map(p=><article className="farmer-order" key={p.id}><Package size={22}/><div><h2>{mt("underReview",{name:p.name})}</h2><p>{mt("afterMarket")}</p></div></article>)}{pendingEvents.map(e=><article className="farmer-order" key={e.id}><CalendarDays size={22}/><div><h2>{mt("underReview",{name:e.name})}</h2><p>{mt("afterPlaces")}</p></div></article>)}{newOrders.map(o=><article className="farmer-order" key={o.id}><ShoppingBag size={22}/><div><h2>{mt("newOrder")}</h2><p>{mt("orderFrom",{name:o.buyerName,count:o.quantity})}</p></div></article>)}</div></div></FarmerShell>;
}
