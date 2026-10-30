"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Sprout, Tractor } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useMarketplace } from "@/components/marketplace-provider";
import { farmTypes, regions } from "@/lib/marketplace";

type Registration = {
  firstName:string;lastName:string;phone:string;email:string;password:string;
  farmName:string;region:string;farmType:string;mainProducts:string;description:string;image:string;
  identityConfirmed:boolean;vat:string;familyFarm:string;land:string;certificate:string;
};
const initial:Registration = {firstName:"",lastName:"",phone:"",email:"",password:"",farmName:"",region:"",farmType:"",mainProducts:"",description:"",image:"/images/orchard.jpg",identityConfirmed:false,vat:"",familyFarm:"",land:"",certificate:""};

function Header() { return <header className="farmer-entry-head"><Link href="/"><BrandLogo /></Link><LanguageSwitcher /></header>; }
export function FarmerLanding() {
  return <main className="farmer-entry"><Header /><div className="farmer-entry-hero"><div><span className="section-kicker"><Tractor size={17} /> FERMERLƏR ÜÇÜN</span><h1>Təsərrüfatınızı AqroQR-də tanıdın</h1><p>Məhsullarınızı və tədbirlərinizi bir neçə sadə addımla hazırlayın. Yoxlamadan sonra Aqro Bazarda görünəcəklər.</p><div className="farmer-entry-actions"><Link href="/farmer/login" className="button button--primary">Hesabım var — Daxil ol <ArrowRight size={18} /></Link><Link href="/farmer/register" className="button button--soft">Yeni fermerəm — Qeydiyyatdan keç</Link></div><Link href="/" className="farmer-back"><ArrowLeft size={16} /> İstifadəçi girişinə qayıt</Link></div><div className="farmer-entry-photo" role="img" aria-label="Azərbaycan bağ təsərrüfatı"><span>Bağdan bazara, sadə yolla.</span></div></div></main>;
}

export function FarmerLogin() {
  const router=useRouter();
  const { enterFarmer, farmers }=useMarketplace();
  const [email,setEmail]=useState("");
  const [error,setError]=useState("");
  const submit=(event:FormEvent)=>{event.preventDefault(); if(!enterFarmer(email)){setError("Bu e-poçtla fermer profili tapılmadı");return;} router.push("/farmer/dashboard");};
  return <main className="farmer-entry"><Header /><div className="farmer-entry-form"><Link href="/farmer" className="farmer-back"><ArrowLeft size={16} /> Geri qayıt</Link><span className="section-kicker">FERMER GİRİŞİ</span><h1>Hesabınıza daxil olun</h1><p>Qeydiyyatda istifadə etdiyiniz e-poçt ünvanını yazın.</p><form onSubmit={submit} className="farmer-simple-form"><label className="market-field"><span>E-poçt</span><input type="email" autoComplete="email" value={email} onChange={(event)=>{setEmail(event.target.value);setError("");}} required placeholder="ad@numune.az" />{error&&<small role="alert">{error}</small>}</label><button className="button button--primary" type="submit">Daxil ol <ArrowRight size={18} /></button></form><p className="farmer-help">Bu, frontend təqdimat girişidir; real şifrə yoxlaması aparılmır.</p><p className="farmer-help">Nümunə fermer hesabı: <strong>{farmers[0]?.email}</strong></p><Link href="/farmer/register" className="text-link">Hələ hesabınız yoxdur? Qeydiyyatdan keçin</Link></div></main>;
}

export function FarmerRegister() {
  const router=useRouter();
  const { registerFarmer, farmers }=useMarketplace();
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<Registration>(initial);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const update=(key:keyof Registration,value:string|boolean)=>{setForm(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:""}));};
  const next=()=>{
    const error:Record<string,string>={};
    const fields=step===1?["firstName","lastName","phone","email","password"]:step===2?["farmName","region","farmType","mainProducts","description"]:[];
    fields.forEach((key)=>{if(!String(form[key as keyof Registration]).trim())error[key]="Bu sahəni doldurun";});
    if(step===1){
      if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))error.email="Düzgün e-poçt yazın";
      if(farmers.some(f=>f.email.toLowerCase()===form.email.trim().toLowerCase()))error.email="Bu e-poçt artıq qeydiyyatdan keçib";
      if(form.phone.replace(/\D/g,"").length<7)error.phone="Telefon nömrəsini düzgün yazın";
      if(form.password.length<8)error.password="Şifrə ən azı 8 simvol olmalıdır";
    }
    if(step===3&&!form.identityConfirmed)error.identityConfirmed="Təsdiq məlumatını işarələyin";
    setErrors(error);
    if(Object.keys(error).length)return;
    if(step<3){setStep(step+1);window.scrollTo(0,0);return;}
    registerFarmer({firstName:form.firstName.trim(),lastName:form.lastName.trim(),phone:form.phone.trim(),email:form.email.trim(),farmName:form.farmName.trim(),region:form.region,farmType:form.farmType,mainProducts:form.mainProducts.trim(),description:form.description.trim(),image:form.image});
    router.push("/farmer/dashboard");
  };
  return <main className="farmer-entry"><Header /><div className="farmer-entry-form farmer-entry-form--wide"><Link href="/farmer" className="farmer-back"><ArrowLeft size={16} /> Fermer girişinə qayıt</Link><span className="section-kicker">YENİ FERMER HESABI</span><h1>Sadə qeydiyyat</h1><p>Üç addımı tamamlayın. Profiliniz əvvəlcə yoxlanılacaq.</p><ol className="farmer-steps">{["Hesab","Təsərrüfat","Yoxlama"].map((label,index)=><li key={label} className={step===index+1?"is-active":step>index+1?"is-done":""}><span>{index+1}</span>{label}</li>)}</ol>
    {step===1&&<div className="market-form-grid"><Input label="Ad" value={form.firstName} onChange={v=>update("firstName",v)} error={errors.firstName} /><Input label="Soyad" value={form.lastName} onChange={v=>update("lastName",v)} error={errors.lastName} /><Input label="Telefon" type="tel" value={form.phone} onChange={v=>update("phone",v)} error={errors.phone} /><Input label="E-poçt" type="email" value={form.email} onChange={v=>update("email",v)} error={errors.email} /><Input label="Şifrə" type="password" value={form.password} onChange={v=>update("password",v)} error={errors.password} hint="Ən azı 8 simvol. Şifrə yadda saxlanmır." /></div>}
    {step===2&&<div className="market-form-grid"><Input label="Təsərrüfatın adı" value={form.farmName} onChange={v=>update("farmName",v)} error={errors.farmName} /><Select label="Region / rayon" value={form.region} options={regions} onChange={v=>update("region",v)} error={errors.region} /><Select label="Təsərrüfat növü" value={form.farmType} options={farmTypes} onChange={v=>update("farmType",v)} error={errors.farmType} /><Input label="Əsas məhsullar" value={form.mainProducts} onChange={v=>update("mainProducts",v)} error={errors.mainProducts} /><label className="market-field market-field--full"><span>Qısa təsərrüfat məlumatı</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)} />{errors.description&&<small role="alert">{errors.description}</small>}</label><Select label="Təsərrüfat şəkli" value={form.image} options={["/images/orchard.jpg","/images/honey.jpg","/images/tea.jpg","/images/vineyard.jpg","/images/hero-village.jpg"]} labels={["Bağ","Arıçılıq","Yaşıl təsərrüfat","Üzüm bağı","Kənd mənzərəsi"]} onChange={v=>update("image",v)} /></div>}
    {step===3&&<div className="farmer-verification"><div className="farmer-notice"><ClipboardCheck size={27} /><div><strong>Yoxlama məlumatları</strong><p>Bu təqdimatda sənəd yüklənmir və saxlanmır. Təsdiq üçün müraciət etdiyinizi işarələyin; digər məlumatlar istəyə bağlıdır və yalnız bu səhifədə qalır.</p></div></div><label className="farmer-check"><input type="checkbox" checked={form.identityConfirmed} onChange={e=>update("identityConfirmed",e.target.checked)} /><span>Şəxsiyyət təsdiqi üçün məlumat təqdim edəcəyəm <b>(vacib)</b></span></label>{errors.identityConfirmed&&<small className="market-error" role="alert">{errors.identityConfirmed}</small>}<div className="market-form-grid"><Input label="VÖEN (varsa)" value={form.vat} onChange={v=>update("vat",v)} /><Input label="Ailə kəndli təsərrüfatı (varsa)" value={form.familyFarm} onChange={v=>update("familyFarm",v)} /><Input label="Torpaq mülkiyyəti və ya icarə (varsa)" value={form.land} onChange={v=>update("land",v)} /><Input label="Məhsul sertifikatı (varsa)" value={form.certificate} onChange={v=>update("certificate",v)} /></div><p className="farmer-help">Bu dörd əlavə sahə qeydiyyatdan sonra yadda saxlanmır.</p></div>}
    <div className="farmer-form-actions">{step>1&&<button type="button" className="button button--soft" onClick={()=>{setStep(step-1);setErrors({});}}>Geri</button>}<button type="button" className="button button--primary" onClick={next}>{step===3?"Qeydiyyatı tamamla":"Davam et"} <ArrowRight size={17} /></button></div>
  </div></main>;
}

export function Input({label,value,onChange,type="text",error,hint,min,step}: {label:string;value:string|number;onChange:(value:string)=>void;type?:string;error?:string;hint?:string;min?:number;step?:string}) {
  return <label className="market-field"><span>{label}</span><input type={type} value={value} min={min} step={step} onChange={e=>onChange(e.target.value)} onInput={type==="date"||type==="time"?e=>onChange(e.currentTarget.value):undefined} aria-invalid={!!error} required={!!error} />{hint&&<em>{hint}</em>}{error&&<small role="alert">{error}</small>}</label>;
}
export function Select({label,value,options,labels,onChange,error}: {label:string;value:string;options:string[];labels?:string[];onChange:(value:string)=>void;error?:string}) {
  return <label className="market-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)} aria-invalid={!!error}><option value="">Seçin</option>{options.map((option,index)=><option value={option} key={option}>{labels?.[index]??option}</option>)}</select>{error&&<small role="alert">{error}</small>}</label>;
}
