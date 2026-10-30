"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Package, Save } from "lucide-react";
import { FarmerShell } from "@/components/farmer-shell";
import { Input, Select } from "@/components/farmer-entry";
import { useMarketplace } from "@/components/marketplace-provider";
import { categories, deliveryText, productImages, regions, type FarmEvent, type Product } from "@/lib/marketplace";

type ProductFormState=Omit<Product,"id"|"farmerId"|"status"|"createdAt">;
type EventFormState=Omit<FarmEvent,"id"|"farmerId"|"status"|"createdAt">;
const initialProduct:ProductFormState={name:"",category:"",price:0,unit:"kq",quantity:0,region:"",description:"",harvestDate:"",delivery:"pickup",contact:"",image:"/images/orchard.jpg"};
const initialEvent:EventFormState={name:"",image:"/images/orchard.jpg",kind:"",location:"",region:"",date:"",time:"10:00",duration:"",capacity:0,price:0,description:"",included:"",contact:""};
const pictures=["Bağ","Bal","Kənd süfrəsi","Üzüm bağı","Çay bağı","Dağ kəndi"];
const picturePaths=["/images/orchard.jpg","/images/honey.jpg","/images/village-breakfast.jpg","/images/vineyard.jpg","/images/tea.jpg","/images/ismayilli.jpg"];
function StepLine({step,labels}:{step:number;labels:string[]}) {
  return <ol className="farmer-steps">{labels.map((label,index)=><li key={label} className={index+1===step?"is-active":index+1<step?"is-done":""}><span>{index+1}</span>{label}</li>)}</ol>;
}
function FormActions({step,setStep,submit,max}:{step:number;setStep:(step:number)=>void;submit:(status:"draft"|"pending")=>void;max:number}) {
  return <div className="farmer-form-actions">{step>1&&<button className="button button--soft" type="button" onClick={()=>setStep(step-1)}><ArrowLeft size={17}/> Geri</button>}<button className="button button--soft" type="button" onClick={()=>submit("draft")}><Save size={17}/> Qaralama kimi saxla</button>{step<max?<button className="button button--primary" type="button" onClick={()=>setStep(step+1)}>Davam et <ArrowRight size={17}/></button>:<button className="button button--primary" type="button" onClick={()=>submit("pending")}>Yoxlamaya göndər <ArrowRight size={17}/></button>}</div>;
}

export function FarmerProductForm() {
  const params=useSearchParams();
  const {currentFarmer,products,saveProduct}=useMarketplace();
  const editId=params.get("edit");
  const editing=products.find(p=>p.id===editId&&p.farmerId===currentFarmer?.id);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<ProductFormState>(initialProduct);
  const [error,setError]=useState("");
  const [result,setResult]=useState<"draft"|"pending"|null>(null);
  useEffect(()=>{if(editing){const {id,farmerId,status,createdAt,...rest}=editing;setForm(rest);}},[editing?.id]);
  const update=<K extends keyof ProductFormState>(key:K,value:ProductFormState[K])=>{setForm(current=>({...current,[key]:value}));setError("");};
  const go=(next:number)=>{
    if(step===1&&next>1&&(!form.name.trim()||!form.category||form.price<=0||form.quantity<=0)){setError("Ad, kateqoriya, qiymət və miqdarı doldurun.");return;}
    if(step===2&&next>2&&(!form.region||!form.description.trim()||!form.contact.trim())){setError("Region, məlumat və əlaqə sahələrini doldurun.");return;}
    setError("");setStep(next);window.scrollTo(0,0);
  };
  const submit=(status:"draft"|"pending")=>{
    if(status==="pending"&&(!form.name.trim()||!form.category||form.price<=0||form.quantity<=0||!form.region||!form.description.trim()||!form.contact.trim())){setError("Vacib sahələri tamamlayın.");return;}
    saveProduct(form,status,editing?.id);setResult(status);window.scrollTo(0,0);
  };
  return <FarmerShell><div className="farmer-page farmer-form-page"><Link href="/farmer/products" className="farmer-back"><ArrowLeft size={16}/> Məhsullarıma qayıt</Link>{result?<div className="farmer-result"><CheckCircle2 size={46}/><h1>{result==="pending"?"Məhsulunuz yoxlamaya göndərildi.":"Qaralama yadda saxlanıldı."}</h1><p>{result==="pending"?"Məhsulunuz təsdiqdən sonra Aqro Bazarda görünəcək.":"Məhsulu sonra tamamlayıb yoxlamaya göndərə bilərsiniz."}</p><Link href="/farmer/products" className="button button--primary">Məhsullarıma bax</Link></div>:<><div className="farmer-heading"><span className="section-kicker">MƏHSUL ELANI</span><h1>{editing?"Məhsulu düzəlt":"Məhsul əlavə et"}</h1><p>Qısa məlumatları yazın, sonra görünüşünü yoxlayın.</p></div><StepLine step={step} labels={["Məhsul","Təhvil","Yoxla"]}/><section className="farmer-panel">{step===1&&<><h2>Məhsul məlumatları</h2><div className="market-form-grid"><Input label="Məhsul adı" value={form.name} onChange={v=>update("name",v)}/><Select label="Kateqoriya" value={form.category} options={categories} onChange={v=>update("category",v)}/><Input label="Qiymət (AZN)" type="number" min={0} step="0.01" value={form.price||""} onChange={v=>update("price",Number(v))}/><Select label="Ölçü vahidi" value={form.unit} options={["kq","litr","ədəd","qutu"]} onChange={v=>update("unit",v)}/><Input label="Mövcud miqdar" type="number" min={0} value={form.quantity||""} onChange={v=>update("quantity",Number(v))}/><Select label="Məhsul şəkli" value={form.image} options={picturePaths} labels={pictures} onChange={v=>update("image",v)}/></div><div className="market-photo-preview" style={{backgroundImage:`url("${form.image}")`}} role="img" aria-label="Seçilmiş məhsul görünüşü"/></>}
  {step===2&&<><h2>Təhvil və məlumat</h2><div className="market-form-grid"><Select label="Region" value={form.region} options={regions} onChange={v=>update("region",v)}/><Input label="Yığım tarixi" type="date" value={form.harvestDate} onChange={v=>update("harvestDate",v)}/><Select label="Təhvil üsulu" value={form.delivery} options={["pickup","delivery","both"]} labels={[deliveryText.pickup,deliveryText.delivery,deliveryText.both]} onChange={v=>update("delivery",v as ProductFormState["delivery"])}/><Input label="Əlaqə məlumatı" value={form.contact} onChange={v=>update("contact",v)}/><label className="market-field market-field--full"><span>Məhsul haqqında qısa məlumat</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)}/></label></div></>}
  {step===3&&<><h2>Elanınızı yoxlayın</h2><div className="farmer-preview"><div className="farmer-preview__photo" style={{backgroundImage:`url("${form.image}")`}}/><div><span className="section-kicker">{form.category||"Kateqoriya"}</span><h3>{form.name||"Məhsul adı"}</h3><strong>{form.price} AZN / {form.unit}</strong><p>{form.region} · {form.quantity} {form.unit}</p><p>{form.description}</p><small>{deliveryText[form.delivery]} · {form.contact}</small></div></div><p className="farmer-help">Yoxlamaya göndərilən məhsul əvvəlcə “Yoxlanılır” vəziyyətində olacaq.</p></>}
  {error&&<p className="market-error" role="alert">{error}</p>}<FormActions step={step} setStep={go} submit={submit} max={3}/></section></>}</div></FarmerShell>;
}

export function FarmerEventForm() {
  const params=useSearchParams();
  const {currentFarmer,events,saveEvent}=useMarketplace();
  const editId=params.get("edit");
  const editing=events.find(e=>e.id===editId&&e.farmerId===currentFarmer?.id);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<EventFormState>(initialEvent);
  const [error,setError]=useState("");
  const [result,setResult]=useState<"draft"|"pending"|null>(null);
  useEffect(()=>{if(editing){const {id,farmerId,status,createdAt,...rest}=editing;setForm(rest);}},[editing?.id]);
  const update=<K extends keyof EventFormState>(key:K,value:EventFormState[K])=>{setForm(current=>({...current,[key]:value}));setError("");};
  const missing=()=>[
    !form.name.trim()&&"Tədbirin adı",!form.kind&&"Tədbir növü",
    !form.location.trim()&&"Məkan",!form.region&&"Region",
    !form.date&&"Tarix",!form.time&&"Başlama saatı",
    !form.duration.trim()&&"Müddət",form.capacity<=0&&"İştirakçı limiti",
    form.price<0&&"Qiymət",!form.description.trim()&&"Tədbir haqqında məlumat",
    !form.included.trim()&&"Daxil olanlar",!form.contact.trim()&&"Əlaqə məlumatı"
  ].filter((value):value is string=>typeof value==="string");
  const go=(next:number)=>{const absent=missing();if(next>1&&absent.length){setError(`Bu sahələri doldurun: ${absent.join(", ")}.`);return;}setError("");setStep(next);window.scrollTo(0,0);};
  const submit=(status:"draft"|"pending")=>{const absent=missing();if(status==="pending"&&absent.length){setError(`Bu sahələri doldurun: ${absent.join(", ")}.`);return;}saveEvent(form,status,editing?.id);setResult(status);window.scrollTo(0,0);};
  return <FarmerShell><div className="farmer-page farmer-form-page"><Link href="/farmer/events" className="farmer-back"><ArrowLeft size={16}/> Tədbirlərimə qayıt</Link>{result?<div className="farmer-result"><CheckCircle2 size={46}/><h1>{result==="pending"?"Tədbiriniz yoxlamaya göndərildi.":"Tədbiriniz yadda saxlanıldı."}</h1><p>Təsdiqdən sonra tədbiriniz Məkanlar bölməsində görünəcək.</p><Link href="/farmer/events" className="button button--primary">Tədbirlərimə bax</Link></div>:<><div className="farmer-heading"><span className="section-kicker">FERMA TƏDBİRİ</span><h1>{editing?"Tədbiri düzəlt":"Tədbir yarat"}</h1><p>Sadə məlumatları yazın və tədbiri yoxlayın.</p></div><StepLine step={step} labels={["Məlumat","Yoxla"]}/><section className="farmer-panel">{step===1&&<><h2>Tədbir məlumatları</h2><div className="market-form-grid"><Input label="Tədbirin adı" value={form.name} onChange={v=>update("name",v)}/><Select label="Tədbir növü" value={form.kind} options={["Bağ gəzintisi","Məhsul yığımı","Ferma ziyarəti","Arıçılıq təcrübəsi","Üzüm bağı turu","Digər"]} onChange={v=>update("kind",v)}/><Select label="Tədbir şəkli" value={form.image} options={picturePaths} labels={pictures} onChange={v=>update("image",v)}/><Input label="Məkan" value={form.location} onChange={v=>update("location",v)}/><Select label="Region" value={form.region} options={regions} onChange={v=>update("region",v)}/><Input label="Tarix" type="date" value={form.date} onChange={v=>update("date",v)}/><Input label="Başlama saatı" type="time" value={form.time} onChange={v=>update("time",v)}/><Input label="Müddət" value={form.duration} onChange={v=>update("duration",v)}/><Input label="İştirakçı limiti" type="number" min={1} value={form.capacity||""} onChange={v=>update("capacity",Number(v))}/><Input label="Qiymət (AZN)" type="number" min={0} step="0.01" value={form.price||""} onChange={v=>update("price",Number(v))}/><Input label="Əlaqə məlumatı" value={form.contact} onChange={v=>update("contact",v)}/><label className="market-field market-field--full"><span>Tədbir haqqında məlumat</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)}/></label><label className="market-field market-field--full"><span>Tədbirə nələr daxildir?</span><textarea rows={3} value={form.included} onChange={e=>update("included",e.target.value)}/></label></div></>}
  {step===2&&<><h2>Tədbirə baxış</h2><div className="farmer-preview"><div className="farmer-preview__photo" style={{backgroundImage:`url("${form.image}")`}}/><div><span className="section-kicker">{form.kind}</span><h3>{form.name}</h3><strong>{form.price} AZN / nəfər</strong><p>{form.date} · {form.time} · {form.duration}</p><p>{form.location}, {form.region} · {form.capacity} yer</p><p>{form.description}</p><small>Daxildir: {form.included}</small></div></div><p className="farmer-help">Yalnız təsdiqlənmiş tədbirlər ictimai məkan siyahısına əlavə olunur.</p></>}
  {error&&<p className="market-error" role="alert">{error}</p>}<FormActions step={step} setStep={go} submit={submit} max={2}/></section></>}</div></FarmerShell>;
}
