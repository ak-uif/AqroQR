"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Filter, MapPin, Minus, Package, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Truck, UserRound, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/components/app-provider";
import { useMarketplace } from "@/components/marketplace-provider";
import { Modal } from "@/components/modal";
import { HarvestAICard, HarvestBadge } from "@/components/harvest-ai-card";
import { useMarketTranslation } from "@/components/use-market-translation";
import { categories, regions, type Product } from "@/lib/marketplace";

function ProductCard({product}: {product:Product}) {
  const {farmers}=useMarketplace();
  const {mt,money,option}=useMarketTranslation();
  const farmer=farmers.find(f=>f.id===product.farmerId);
  return <article className="market-card"><Link href={`/marketplace/${product.id}`} className={`market-card__image ${!product.image?"image-placeholder":""}`} style={product.image?{backgroundImage:`url("${product.image}")`}:undefined} aria-label={mt("productDetailsLabel",{name:product.name})}><span>{option(product.category)}</span></Link><div className="market-card__body"><div className="market-card__meta"><span><MapPin size={14}/>{option(product.region)}</span><span>{mt(product.quantity>0?"inStock":"outOfStock")}</span></div><HarvestBadge product={product} farmer={farmer}/><h2>{product.name}</h2><p>{product.description}</p><div className="market-card__seller"><span><UserRound size={15}/>{farmer?.farmName??mt("farmFallback")}</span><small><ShieldCheck size={14}/> {mt("verifiedFarmer")}</small></div><div className="market-card__bottom"><strong>{money(product.price)} AZN <small>/ {option(product.unit)}</small></strong><div><Link href={`/marketplace/${product.id}`} className="text-link">{mt("details")}</Link>{product.quantity>0?<Link href={`/marketplace/${product.id}?order=1`} className="button button--primary">{mt("order")}</Link>:<span className="button button--soft" aria-disabled="true">{mt("outOfStock")}</span>}</div></div><Link href={`/marketplace/${product.id}?contact=1`} className="market-contact-link">{mt("contactFarmer")} <ArrowRight size={14}/></Link></div></article>;
}
export function MarketplaceClient() {
  const {publicProducts}=useMarketplace();
  const {mt}=useMarketTranslation();
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const [region,setRegion]=useState("all");
  const [maxPrice,setMaxPrice]=useState("all");
  const [available,setAvailable]=useState(false);
  const [delivery,setDelivery]=useState("all");
  const filtered=useMemo(()=>publicProducts.filter(p=>{
    const text=`${p.name} ${p.description} ${p.region}`.toLocaleLowerCase("az");
    return (!query||text.includes(query.toLocaleLowerCase("az"))) &&
      (category==="all"||p.category===category) &&
      (region==="all"||p.region===region) &&
      (maxPrice==="all"||p.price<=Number(maxPrice)) &&
      (!available||p.quantity>0) &&
      (delivery==="all"||p.delivery===delivery||p.delivery==="both");
  }),[publicProducts,query,category,region,maxPrice,available,delivery]);
  const active=!!query||category!=="all"||region!=="all"||maxPrice!=="all"||available||delivery!=="all";
  const priceOptions=[{label:mt("allPrices"),value:"all"},{label:mt("upTo",{value:10}),value:"10"},{label:mt("upTo",{value:25}),value:"25"},{label:mt("upTo",{value:50}),value:"50"}];
  const reset=()=>{setQuery("");setCategory("all");setRegion("all");setMaxPrice("all");setAvailable(false);setDelivery("all");};
  return <AppShell><div className="market-page"><section className="market-hero"><div><span className="section-kicker">{mt("marketLocal")}</span><h1>{mt("marketTitle")}</h1><p>{mt("marketBody")}</p><div className="market-hero__actions"><a className="button button--light" href="#mehsullar">{mt("viewProductsCta")} <ArrowRight size={17}/></a><Link className="market-hero__orders" href="/marketplace/orders">{mt("myOrders")}</Link></div></div><span className="market-hero__leaf">✳</span></section><p className="market-disclaimer">{mt("catalogDisclaimer")}</p><section id="mehsullar" className="market-section"><div className="market-section__heading"><div><span className="section-kicker">{mt("discover")}</span><h2>{mt("products")}</h2></div><span>{mt("productCount",{count:filtered.length})}</span></div><div className="market-filters" aria-label={mt("productFilters")}><label className="market-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={mt("searchProduct")} aria-label={mt("searchProduct")}/></label><label className="market-filter"><span>{mt("category")}</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{mt("all")}</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label className="market-filter"><span>{mt("region")}</span><select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">{mt("allRegions")}</option>{regions.map(r=><option key={r}>{r}</option>)}</select></label><label className="market-filter"><span>{mt("price")}</span><select value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}>{priceOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="market-filter"><span>{mt("delivery")}</span><select value={delivery} onChange={e=>setDelivery(e.target.value)}><option value="all">{mt("allMethods")}</option><option value="pickup">{mt("pickup")}</option><option value="delivery">{mt("deliveryOption")}</option></select></label><label className="market-availability"><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/><span>{mt("onlyAvailable")}</span></label><button type="button" className="filter-reset" onClick={reset} disabled={!active}>{mt("resetFilters")}</button></div>{filtered.length?<div className="market-grid">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="farmer-empty"><Search size={28}/><strong>{mt("noMatching")}</strong><p>{mt("changeFilters")}</p><button type="button" className="button button--soft" onClick={reset}>{mt("resetFilters")}</button></div>}</section></div></AppShell>;
}

export function ProductDetailClient() {
  const params=useParams<{id:string}>();
  const search=useSearchParams();
  const router=useRouter();
  const {session}=useApp();
  const {publicProducts,farmers,createOrder}=useMarketplace();
  const {mt,money,delivery:deliveryLabel}=useMarketTranslation();
  const product=publicProducts.find(p=>p.id===params.id);
  const farmer=product?farmers.find(f=>f.id===product.farmerId):null;
  const [gallery,setGallery]=useState(0);
  const [quantity,setQuantity]=useState(1);
  const [delivery,setDelivery]=useState<"pickup"|"delivery">("pickup");
  const [buyerName,setBuyerName]=useState(session?`${session.firstName} ${session.lastName}`:"");
  const [phone,setPhone]=useState(session?.phone??"");
  const [address,setAddress]=useState("");
  const [note,setNote]=useState("");
  const [error,setError]=useState("");
  const [done,setDone]=useState<string|null>(null);
  const [orderOpen,setOrderOpen]=useState(search.get("order")==="1"&&!!product?.quantity);
  const [contactOpen,setContactOpen]=useState(search.get("contact")==="1");
  if(!product)return <AppShell><div className="farmer-empty"><Package size={30}/><h1>{mt("productNotFound")}</h1><p>{mt("productNotFoundBody")}</p><Link href="/marketplace" className="button button--primary">{mt("backMarket")}</Link></div></AppShell>;
  const images=[...new Set([product.image,farmer?.image??product.image,"/images/hero-village.jpg"])];
  const maxQuantity=Math.max(1,product.quantity);
  const total=Math.round(product.price*quantity*100)/100;
  const others=publicProducts.filter(p=>p.farmerId===product.farmerId&&p.id!==product.id).slice(0,3);
  const submit=()=>{
    if(!buyerName.trim()||phone.replace(/\D/g,"").length<7){setError(mt("invalidOrderContact"));return;}
    if(delivery==="delivery"&&!address.trim()){setError(mt("addressRequired"));return;}
    if(quantity<1||quantity>product.quantity){setError(mt("quantityError"));return;}
    const order=createOrder({productId:product.id,farmerId:product.farmerId,buyerId:session?.id??"qonaq",buyerName:buyerName.trim(),phone,quantity,total,delivery,region:product.region,address,note});
    setDone(order.id);setError("");
  };
  return <AppShell><div className="market-page market-detail"><Link className="farmer-back" href="/marketplace"><ArrowLeft size={16}/> {mt("backMarket")}</Link><div className="market-detail__layout"><div className="market-gallery"><div className={`market-gallery__main ${!images[gallery]?"image-placeholder":""}`} style={images[gallery]?{backgroundImage:`url("${images[gallery]}")`}:undefined} role="img" aria-label={product.name}><button type="button" aria-label={mt("previousImage")} onClick={()=>setGallery((gallery+images.length-1)%images.length)}><ChevronLeft size={21}/></button><button type="button" aria-label={mt("nextImage")} onClick={()=>setGallery((gallery+1)%images.length)}><ChevronRight size={21}/></button></div><div className="market-gallery__thumbs">{images.map((src,index)=><button key={`${src}-${index}`} type="button" onClick={()=>setGallery(index)} className={`${gallery===index?"is-active":""} ${!src?"image-placeholder":""}`} aria-label={mt("imageNumber",{count:index+1})} style={src?{backgroundImage:`url("${src}")`}:undefined}/>)}</div></div><div className="market-detail__info"><span className="section-kicker">{product.category} · {product.region}</span><h1>{product.name}</h1><p>{product.description}</p><strong className="market-detail__price">{money(product.price)} AZN <small>/ {product.unit}</small></strong><div className="market-detail__facts"><span><Package size={17}/> {product.quantity} {product.unit} {mt("available")}</span><span><MapPin size={17}/> {product.region}</span><span><Truck size={17}/> {deliveryLabel(product.delivery)}</span><span>{mt("harvestDate")}: {product.harvestDate||mt("notSpecified")}</span></div><div className="market-detail__actions"><button className="button button--primary" disabled={product.quantity<=0} onClick={()=>setOrderOpen(true)}><ShoppingBag size={18}/> {mt("order")}</button><button className="button button--soft" onClick={()=>setContactOpen(true)}>{mt("contactFarmer")}</button></div><div className="market-farmer-card"><span><UserRound size={20}/></span><div><small>{mt("farmerProfile")}</small><strong>{farmer?.farmName??mt("farmFallback")}</strong><p>{farmer?.firstName} {farmer?.lastName} · {farmer?.region}</p><em><ShieldCheck size={15}/> {mt("verifiedFarmer")}</em></div></div></div></div><HarvestAICard product={product} farmer={farmer} compact/>{others.length>0&&<section className="market-section"><div className="market-section__heading"><h2>{mt("otherProducts")}</h2></div><div className="market-grid">{others.map(p=><ProductCard product={p} key={p.id}/>)}</div></section>}</div>
  {contactOpen&&<Modal title={mt("contactFarmer")} onClose={()=>setContactOpen(false)}><div className="market-contact"><div className="market-farmer-card"><UserRound size={21}/><div><strong>{farmer?.farmName}</strong><p>{farmer?.region}</p></div></div><p>{product.contact}</p>{farmer?.phone&&<p>{mt("phone")}: {farmer.phone}</p>}<p className="farmer-help">{mt("contactDemo")}</p><button className="button button--primary" onClick={()=>{setContactOpen(false);setOrderOpen(true);}}>{mt("sendOrder")}</button></div></Modal>}
  {orderOpen&&<Modal title={mt(done?"orderSent":"productOrder")} onClose={()=>{setOrderOpen(false);setDone(null);router.replace(`/marketplace/${product.id}`);}}>{done?<div className="market-order-success"><CheckCircle2 size={43}/><h3>{mt("orderSuccess")}</h3><p>{mt("orderSuccessBody")}</p><strong>№ {done.slice(0,8).toUpperCase()}</strong><Link href="/marketplace/orders" className="button button--primary">{mt("myOrders")}</Link></div>:<div className="market-order-form"><div className="market-order-product"><div className={!product.image?"image-placeholder":""} style={product.image?{backgroundImage:`url("${product.image}")`}:undefined}/><strong>{product.name}</strong><span>{money(product.price)} AZN / {product.unit}</span></div><label className="market-field"><span>{mt("quantityLabel",{unit:product.unit})}</span><div className="market-counter"><button type="button" aria-label={mt("decrease")} disabled={quantity<=1} onClick={()=>setQuantity(quantity-1)}><Minus size={17}/></button><output>{quantity}</output><button type="button" aria-label={mt("increase")} disabled={quantity>=maxQuantity} onClick={()=>setQuantity(quantity+1)}><Plus size={17}/></button></div></label><label className="market-field"><span>{mt("deliveryMethod")}</span><select value={delivery} onChange={e=>setDelivery(e.target.value as "pickup"|"delivery")}><option value="pickup">{mt("pickup")}</option>{product.delivery!=="pickup"&&<option value="delivery">{mt("deliveryOption")}</option>}</select></label><label className="market-field"><span>{mt("fullName")}</span><input value={buyerName} onChange={e=>setBuyerName(e.target.value)} autoComplete="name"/></label><label className="market-field"><span>{mt("phone")}</span><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel"/></label>{delivery==="delivery"&&<label className="market-field"><span>{mt("address")}</span><input value={address} onChange={e=>setAddress(e.target.value)} autoComplete="street-address"/></label>}<label className="market-field"><span>{mt("optionalNote")}</span><textarea rows={2} value={note} onChange={e=>setNote(e.target.value)}/></label><div className="market-order-total"><span>{mt("total")}</span><strong>{money(total)} AZN</strong></div>{error&&<p className="market-error" role="alert">{error}</p>}<p className="farmer-help">{mt("privateOrderHelp")}</p><button type="button" className="button button--primary button--full" onClick={submit}>{mt("sendOrder")}</button></div>}</Modal>}
  </AppShell>;
}

export function MarketOrdersClient() {
  const {session}=useApp();
  const {orders,products}=useMarketplace();
  const {mt,money,order,date}=useMarketTranslation();
  const own=orders.filter(o=>o.buyerId===session?.id);
  return <AppShell><div className="market-page"><div className="farmer-heading"><Link href="/marketplace" className="farmer-back"><ArrowLeft size={16}/> {mt("backMarket")}</Link><span className="section-kicker">{mt("marketTitle").toLocaleUpperCase()}</span><h1>{mt("myOrders")}</h1><p>{mt("buyerOrdersBody")}</p></div>{own.length===0?<div className="farmer-empty"><ShoppingBag size={30}/><strong>{mt("noOrders")}</strong><p>{mt("buyerNoOrdersBody")}</p><Link href="/marketplace" className="button button--primary">{mt("viewProductsCta")}</Link></div>:<div className="farmer-list">{own.map(o=>{const p=products.find(item=>item.id===o.productId);return <article className="farmer-order" key={o.id}><ShoppingBag size={25}/><div><span className="market-status">{order(o.status)}</span><h2>{p?.name??mt("product")}</h2><p>{o.quantity} {p?.unit} · {money(o.total)} AZN</p><small>{mt(o.delivery==="delivery"?"deliveryOption":"pickup")} · {date(o.createdAt)} · № {o.id.slice(0,8).toUpperCase()}</small></div></article>;})}</div>}</div></AppShell>;
}
