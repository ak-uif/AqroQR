"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from "lucide-react";
import { FarmerShell } from "@/components/farmer-shell";
import { Input, Select } from "@/components/farmer-entry";
import { useMarketplace } from "@/components/marketplace-provider";
import { OptionalImagePicker } from "@/components/optional-image-picker";
import { HarvestAICard } from "@/components/harvest-ai-card";
import { useMarketTranslation } from "@/components/use-market-translation";
import { categories, regions, type FarmEvent, type Product } from "@/lib/marketplace";

type ProductFormState=Omit<Product,"id"|"farmerId"|"status"|"createdAt">;
type EventFormState=Omit<FarmEvent,"id"|"farmerId"|"status"|"createdAt">;
const initialProduct:ProductFormState={name:"",category:"",price:0,unit:"kq",quantity:0,region:"",description:"",harvestDate:"",plantingDate:"",soilFertility:"",irrigation:"",previousExperience:"",delivery:"pickup",contact:"",image:""};
const initialEvent:EventFormState={name:"",image:"",kind:"",location:"",region:"",date:"",time:"10:00",duration:"",capacity:0,price:0,description:"",included:"",contact:""};
function StepLine({step,labels}:{step:number;labels:string[]}) {
  return <ol className="farmer-steps">{labels.map((label,index)=><li key={label} className={index+1===step?"is-active":index+1<step?"is-done":""}><span>{index+1}</span>{label}</li>)}</ol>;
}
function FormActions({step,setStep,submit,max}:{step:number;setStep:(step:number)=>void;submit:(status:"draft"|"pending")=>void;max:number}) {
  const {mt}=useMarketTranslation();
  return <div className="farmer-form-actions">{step>1&&<button className="button button--soft" type="button" onClick={()=>setStep(step-1)}><ArrowLeft size={17}/> {mt("back")}</button>}<button className="button button--soft" type="button" onClick={()=>submit("draft")}><Save size={17}/> {mt("saveDraft")}</button>{step<max?<button className="button button--primary" type="button" onClick={()=>setStep(step+1)}>{mt("continue")} <ArrowRight size={17}/></button>:<button className="button button--primary" type="button" onClick={()=>submit("pending")}>{mt("sendReview")} <ArrowRight size={17}/></button>}</div>;
}

export function FarmerProductForm() {
  const params=useSearchParams();
  const {currentFarmer,products,saveProduct}=useMarketplace();
  const {mt,delivery}=useMarketTranslation();
  const editId=params.get("edit");
  const editing=products.find(p=>p.id===editId&&p.farmerId===currentFarmer?.id);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<ProductFormState>(initialProduct);
  const [error,setError]=useState("");
  const [result,setResult]=useState<"draft"|"pending"|null>(null);
  useEffect(()=>{if(editing){const {id,farmerId,status,createdAt,...rest}=editing;setForm(rest);}},[editing?.id]);
  const update=<K extends keyof ProductFormState>(key:K,value:ProductFormState[K])=>{setForm(current=>({...current,[key]:value}));setError("");};
  const go=(next:number)=>{
    if(step===1&&next>1&&(!form.name.trim()||!form.category||form.price<=0||form.quantity<=0)){setError(mt("requiredProduct"));return;}
    if(step===2&&next>2&&(!form.region||!form.description.trim()||!form.contact.trim())){setError(mt("requiredDelivery"));return;}
    setError("");setStep(next);window.scrollTo(0,0);
  };
  const submit=(status:"draft"|"pending")=>{
    if(status==="pending"&&(!form.name.trim()||!form.category||form.price<=0||form.quantity<=0||!form.region||!form.description.trim()||!form.contact.trim())){setError(mt("requiredImportant"));return;}
    saveProduct(form,status,editing?.id);setResult(status);window.scrollTo(0,0);
  };
  return <FarmerShell><div className="farmer-page farmer-form-page"><Link href="/farmer/products" className="farmer-back"><ArrowLeft size={16}/> {mt("backProducts")}</Link>{result?<div className="farmer-result"><CheckCircle2 size={46}/><h1>{mt(result==="pending"?"productSent":"draftSaved")}</h1><p>{mt(result==="pending"?"productSentBody":"draftSavedBody")}</p><Link href="/farmer/products" className="button button--primary">{mt("viewProducts")}</Link></div>:<><div className="farmer-heading"><span className="section-kicker">{mt("productListing")}</span><h1>{mt(editing?"editProduct":"addProduct")}</h1><p>{mt("productFormBody")}</p></div><StepLine step={step} labels={[mt("product"),mt("delivery"),mt("review")]}/><section className="farmer-panel">{step===1&&<><h2>{mt("productInfo")}</h2><div className="market-form-grid"><Input label={mt("productName")} value={form.name} onChange={v=>update("name",v)}/><Select label={mt("category")} value={form.category} options={categories} onChange={v=>update("category",v)} selectLabel={mt("select")}/><Input label={mt("priceAzn")} type="number" min={0} step="0.01" value={form.price||""} onChange={v=>update("price",Number(v))}/><Select label={mt("unit")} value={form.unit} options={["kq","litr","ədəd","qutu"]} onChange={v=>update("unit",v)} selectLabel={mt("select")}/><Input label={mt("quantity")} type="number" min={0} value={form.quantity||""} onChange={v=>update("quantity",Number(v))}/></div><OptionalImagePicker title={mt("productImage")} value={form.image} onChange={v=>update("image",v)}/></>}
  {step===2&&<><h2>{mt("deliveryInfo")}</h2><div className="market-form-grid"><Select label={mt("region")} value={form.region} options={regions} onChange={v=>update("region",v)} selectLabel={mt("select")}/><Input label={mt("plantingDate")} type="date" value={form.plantingDate??""} onChange={v=>update("plantingDate",v)}/><Input label={mt("harvestDate")} type="date" value={form.harvestDate} onChange={v=>update("harvestDate",v)}/><Select label={mt("soilFertility")} value={form.soilFertility??""} options={["high","medium","low"]} labels={[mt("high"),mt("medium"),mt("low")]} onChange={v=>update("soilFertility",v)} selectLabel={mt("select")}/><Select label={mt("irrigation")} value={form.irrigation??""} options={["available","partial","none"]} labels={[mt("availableWater"),mt("partialWater"),mt("noWater")]} onChange={v=>update("irrigation",v)} selectLabel={mt("select")}/><Select label={mt("deliveryMethod")} value={form.delivery} options={["pickup","delivery","both"]} labels={[delivery("pickup"),delivery("delivery"),delivery("both")]} onChange={v=>update("delivery",v as ProductFormState["delivery"])} selectLabel={mt("select")}/><Input label={mt("contactInfo")} value={form.contact} onChange={v=>update("contact",v)}/><Input label={mt("previousExperience")} value={form.previousExperience??""} onChange={v=>update("previousExperience",v)}/><label className="market-field market-field--full"><span>{mt("productDescription")}</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)}/></label></div></>}
  {step===3&&<><h2>{mt("previewListing")}</h2><div className="farmer-preview"><div className={`farmer-preview__photo ${!form.image?"image-placeholder":""}`} style={form.image?{backgroundImage:`url("${form.image}")`}:undefined}/><div><span className="section-kicker">{form.category||mt("category")}</span><h3>{form.name||mt("productName")}</h3><strong>{form.price} AZN / {form.unit}</strong><p>{form.region} · {form.quantity} {form.unit}</p><p>{form.description}</p><small>{delivery(form.delivery)} · {form.contact}</small></div></div><HarvestAICard product={{...form,id:editing?.id??"preview",farmerId:currentFarmer?.id??"preview",status:editing?.status??"draft",createdAt:editing?.createdAt??new Date().toISOString()}} farmer={currentFarmer}/><p className="farmer-help">{mt("reviewPendingHelp")}</p></>}
  {error&&<p className="market-error" role="alert">{error}</p>}<FormActions step={step} setStep={go} submit={submit} max={3}/></section></>}</div></FarmerShell>;
}

export function FarmerEventForm() {
  const params=useSearchParams();
  const {currentFarmer,events,saveEvent}=useMarketplace();
  const {mt}=useMarketTranslation();
  const editId=params.get("edit");
  const editing=events.find(e=>e.id===editId&&e.farmerId===currentFarmer?.id);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<EventFormState>(initialEvent);
  const [error,setError]=useState("");
  const [result,setResult]=useState<"draft"|"pending"|null>(null);
  useEffect(()=>{if(editing){const {id,farmerId,status,createdAt,...rest}=editing;setForm(rest);}},[editing?.id]);
  const update=<K extends keyof EventFormState>(key:K,value:EventFormState[K])=>{setForm(current=>({...current,[key]:value}));setError("");};
  const missing=()=>[
    !form.name.trim()&&mt("eventName"),!form.kind&&mt("eventType"),
    !form.location.trim()&&mt("location"),!form.region&&mt("region"),
    !form.date&&mt("date"),!form.time&&mt("startTime"),
    !form.duration.trim()&&mt("duration"),form.capacity<=0&&mt("capacity"),
    form.price<0&&mt("price"),!form.description.trim()&&mt("eventDescription"),
    !form.included.trim()&&mt("included"),!form.contact.trim()&&mt("contactInfo")
  ].filter((value):value is string=>typeof value==="string");
  const go=(next:number)=>{const absent=missing();if(next>1&&absent.length){setError(mt("fillFields",{fields:absent.join(", ")}));return;}setError("");setStep(next);window.scrollTo(0,0);};
  const submit=(status:"draft"|"pending")=>{const absent=missing();if(status==="pending"&&absent.length){setError(mt("fillFields",{fields:absent.join(", ")}));return;}saveEvent(form,status,editing?.id);setResult(status);window.scrollTo(0,0);};
  return <FarmerShell><div className="farmer-page farmer-form-page"><Link href="/farmer/events" className="farmer-back"><ArrowLeft size={16}/> {mt("backEvents")}</Link>{result?<div className="farmer-result"><CheckCircle2 size={46}/><h1>{mt(result==="pending"?"eventSent":"eventSaved")}</h1><p>{mt("eventSentBody")}</p><Link href="/farmer/events" className="button button--primary">{mt("viewEvents")}</Link></div>:<><div className="farmer-heading"><span className="section-kicker">{mt("farmEvent")}</span><h1>{mt(editing?"editEvent":"createEvent")}</h1><p>{mt("eventFormBody")}</p></div><StepLine step={step} labels={[mt("information"),mt("review")]}/><section className="farmer-panel">{step===1&&<><h2>{mt("eventInfo")}</h2><div className="market-form-grid"><Input label={mt("eventName")} value={form.name} onChange={v=>update("name",v)}/><Select label={mt("eventType")} value={form.kind} options={["Bağ gəzintisi","Məhsul yığımı","Ferma ziyarəti","Arıçılıq təcrübəsi","Üzüm bağı turu","Digər"]} onChange={v=>update("kind",v)} selectLabel={mt("select")}/><Input label={mt("location")} value={form.location} onChange={v=>update("location",v)}/><Select label={mt("region")} value={form.region} options={regions} onChange={v=>update("region",v)} selectLabel={mt("select")}/><Input label={mt("date")} type="date" value={form.date} onChange={v=>update("date",v)}/><Input label={mt("startTime")} type="time" value={form.time} onChange={v=>update("time",v)}/><Input label={mt("duration")} value={form.duration} onChange={v=>update("duration",v)}/><Input label={mt("capacity")} type="number" min={1} value={form.capacity||""} onChange={v=>update("capacity",Number(v))}/><Input label={mt("priceAzn")} type="number" min={0} step="0.01" value={form.price||""} onChange={v=>update("price",Number(v))}/><Input label={mt("contactInfo")} value={form.contact} onChange={v=>update("contact",v)}/><label className="market-field market-field--full"><span>{mt("eventDescription")}</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)}/></label><label className="market-field market-field--full"><span>{mt("included")}</span><textarea rows={3} value={form.included} onChange={e=>update("included",e.target.value)}/></label></div><OptionalImagePicker title={mt("eventImage")} value={form.image} onChange={v=>update("image",v)}/></>}
  {step===2&&<><h2>{mt("eventPreview")}</h2><div className="farmer-preview"><div className={`farmer-preview__photo ${!form.image?"image-placeholder":""}`} style={form.image?{backgroundImage:`url("${form.image}")`}:undefined}/><div><span className="section-kicker">{form.kind}</span><h3>{form.name}</h3><strong>{form.price} AZN / {mt("perPerson")}</strong><p>{form.date} · {form.time} · {form.duration}</p><p>{form.location}, {form.region} · {mt("placesCount",{count:form.capacity})}</p><p>{form.description}</p><small>{mt("includedLabel")}: {form.included}</small></div></div><p className="farmer-help">{mt("approvedEventsHelp")}</p></>}
  {error&&<p className="market-error" role="alert">{error}</p>}<FormActions step={step} setStep={go} submit={submit} max={2}/></section></>}</div></FarmerShell>;
}
