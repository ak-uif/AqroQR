"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck, LogIn, Sprout, UserPlus } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useMarketplace } from "@/components/marketplace-provider";
import { useMarketTranslation } from "@/components/use-market-translation";
import { farmTypes, regions } from "@/lib/marketplace";

type Registration = {
  firstName:string;lastName:string;phone:string;email:string;password:string;
  farmName:string;region:string;farmType:string;mainProducts:string;description:string;image:string;
  identityConfirmed:boolean;vat:string;familyFarm:string;land:string;certificate:string;
};
const initial:Registration = {firstName:"",lastName:"",phone:"",email:"",password:"",farmName:"",region:"",farmType:"",mainProducts:"",description:"",image:"/images/orchard.jpg",identityConfirmed:false,vat:"",familyFarm:"",land:"",certificate:""};

function FarmerEntryFrame({title,body,children,wide=false}:{title:string;body:string;children:ReactNode;wide?:boolean}) {
  const {mt}=useMarketTranslation();
  return <main className="onboarding-page farmer-onboarding"><header className="onboarding-head"><Link href="/"><BrandLogo /></Link><LanguageSwitcher /></header><div className={`onboarding-content farmer-onboarding__content ${wide?"farmer-onboarding__content--wide":""}`}><div className="onboarding-copy"><span className="eyebrow"><Sprout size={14}/> {mt("farmerFor")}</span><h1>{title}</h1><p>{body}</p><div className="onboarding-steps" aria-hidden="true"><span className="is-done">1</span><i/><span className="is-current">2</span><i/><span>3</span></div></div><div className={`onboarding-panel farmer-onboarding__panel ${wide?"farmer-onboarding__panel--wide":""}`}>{children}</div></div><footer className="onboarding-footer"><span>{mt("footerPreview")}</span></footer></main>;
}
export function FarmerLanding() {
  const {mt}=useMarketTranslation();
  return <FarmerEntryFrame title={mt("farmerLandingTitle")} body={mt("farmerLandingBody")}><div className="choice-grid farmer-entry-choices"><Link href="/farmer/login" className="choice-card choice-card--primary"><span className="choice-icon"><LogIn size={22}/></span><span><strong>{mt("haveAccount")}</strong><small>{mt("haveAccountBody")}</small></span><ArrowRight size={20}/></Link><Link href="/farmer/register" className="choice-card"><span className="choice-icon"><UserPlus size={22}/></span><span><strong>{mt("newFarmer")}</strong><small>{mt("newFarmerBody")}</small></span><ArrowRight size={20}/></Link><Link href="/" className="back-button"><ArrowLeft size={16}/> {mt("backUser")}</Link></div></FarmerEntryFrame>;
}

export function FarmerLogin() {
  const router=useRouter();
  const { enterFarmer, farmers }=useMarketplace();
  const {mt}=useMarketTranslation();
  const [email,setEmail]=useState("");
  const [error,setError]=useState("");
  const submit=(event:FormEvent)=>{event.preventDefault(); if(!enterFarmer(email)){setError(mt("emailNotFound"));return;} router.push("/farmer/dashboard");};
  return <FarmerEntryFrame title={mt("farmerLoginTitle")} body={mt("farmerLoginBody")}><div className="farmer-entry-form farmer-entry-form--embedded"><Link href="/farmer" className="farmer-back"><ArrowLeft size={16}/> {mt("back")}</Link><span className="section-kicker">{mt("farmerLogin")}</span><h2>{mt("accountLogin")}</h2><form onSubmit={submit} className="farmer-simple-form"><label className="market-field"><span>{mt("email")}</span><input type="email" autoComplete="email" value={email} onChange={(event)=>{setEmail(event.target.value);setError("");}} required placeholder="ad@numune.az" />{error&&<small role="alert">{error}</small>}</label><button className="button button--primary" type="submit">{mt("login")} <ArrowRight size={18}/></button></form><p className="farmer-help">{mt("loginDemo")}</p><p className="farmer-help">{mt("sampleAccount")} <strong>{farmers[0]?.email}</strong></p><Link href="/farmer/register" className="text-link">{mt("noAccount")}</Link></div></FarmerEntryFrame>;
}

export function FarmerRegister() {
  const router=useRouter();
  const { registerFarmer, farmers }=useMarketplace();
  const {mt,option}=useMarketTranslation();
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<Registration>(initial);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const update=(key:keyof Registration,value:string|boolean)=>{setForm(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:""}));};
  const next=()=>{
    const error:Record<string,string>={};
    const fields=step===1?["firstName","lastName","phone","email","password"]:step===2?["farmName","region","farmType","mainProducts","description"]:[];
    fields.forEach((key)=>{if(!String(form[key as keyof Registration]).trim())error[key]=mt("required");});
    if(step===1){
      if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))error.email=mt("invalidEmail");
      if(farmers.some(f=>f.email.toLowerCase()===form.email.trim().toLowerCase()))error.email=mt("emailExists");
      if(form.phone.replace(/\D/g,"").length<7)error.phone=mt("invalidPhone");
      if(form.password.length<8)error.password=mt("shortPassword");
    }
    if(step===3&&!form.identityConfirmed)error.identityConfirmed=mt("confirmRequired");
    setErrors(error);
    if(Object.keys(error).length)return;
    if(step<3){setStep(step+1);window.scrollTo(0,0);return;}
    registerFarmer({firstName:form.firstName.trim(),lastName:form.lastName.trim(),phone:form.phone.trim(),email:form.email.trim(),farmName:form.farmName.trim(),region:form.region,farmType:form.farmType,mainProducts:form.mainProducts.trim(),description:form.description.trim(),image:form.image});
    router.push("/farmer/dashboard");
  };
  return <FarmerEntryFrame wide title={mt("registerTitle")} body={mt("registerBody")}><div className="farmer-entry-form farmer-entry-form--embedded farmer-entry-form--wide"><Link href="/farmer" className="farmer-back"><ArrowLeft size={16}/> {mt("backFarmer")}</Link><span className="section-kicker">{mt("newFarmerAccount")}</span><h2>{mt("registrationInfo")}</h2><ol className="farmer-steps">{[mt("account"),mt("farm"),mt("verification")].map((label,index)=><li key={label} className={step===index+1?"is-active":step>index+1?"is-done":""}><span>{index+1}</span>{label}</li>)}</ol>
    {step===1&&<div className="market-form-grid"><Input label={mt("firstName")} value={form.firstName} onChange={v=>update("firstName",v)} error={errors.firstName} /><Input label={mt("lastName")} value={form.lastName} onChange={v=>update("lastName",v)} error={errors.lastName} /><Input label={mt("phone")} type="tel" value={form.phone} onChange={v=>update("phone",v)} error={errors.phone} /><Input label={mt("email")} type="email" value={form.email} onChange={v=>update("email",v)} error={errors.email} /><Input label={mt("password")} type="password" value={form.password} onChange={v=>update("password",v)} error={errors.password} hint={mt("passwordHint")} /></div>}
    {step===2&&<div className="market-form-grid"><Input label={mt("farmName")} value={form.farmName} onChange={v=>update("farmName",v)} error={errors.farmName} /><Select label={mt("regionDistrict")} value={form.region} options={regions} labels={regions.map(option)} onChange={v=>update("region",v)} error={errors.region} selectLabel={mt("select")} /><Select label={mt("farmType")} value={form.farmType} options={farmTypes} labels={farmTypes.map(option)} onChange={v=>update("farmType",v)} error={errors.farmType} selectLabel={mt("select")} /><Input label={mt("mainProducts")} value={form.mainProducts} onChange={v=>update("mainProducts",v)} error={errors.mainProducts} /><label className="market-field market-field--full"><span>{mt("farmDescription")}</span><textarea rows={4} value={form.description} onChange={e=>update("description",e.target.value)} />{errors.description&&<small role="alert">{errors.description}</small>}</label><Select label={mt("farmImage")} value={form.image} options={["/images/orchard.jpg","/images/honey.jpg","/images/tea.jpg","/images/vineyard.jpg","/images/hero-village.jpg"]} labels={[mt("garden"),mt("honey"),mt("teaGarden"),mt("vineyard"),mt("mountainVillage")]} onChange={v=>update("image",v)} selectLabel={mt("select")} /></div>}
    {step===3&&<div className="farmer-verification"><div className="farmer-notice"><ClipboardCheck size={27} /><div><strong>{mt("verificationInfo")}</strong><p>{mt("verificationBody")}</p></div></div><label className="farmer-check"><input type="checkbox" checked={form.identityConfirmed} onChange={e=>update("identityConfirmed",e.target.checked)} /><span>{mt("identityConfirm")} <b>({mt("important")})</b></span></label>{errors.identityConfirmed&&<small className="market-error" role="alert">{errors.identityConfirmed}</small>}<div className="market-form-grid"><Input label={mt("vat")} value={form.vat} onChange={v=>update("vat",v)} /><Input label={mt("familyFarm")} value={form.familyFarm} onChange={v=>update("familyFarm",v)} /><Input label={mt("land")} value={form.land} onChange={v=>update("land",v)} /><Input label={mt("certificate")} value={form.certificate} onChange={v=>update("certificate",v)} /></div><p className="farmer-help">{mt("optionalFieldsNote")}</p></div>}
    <div className="farmer-form-actions">{step>1&&<button type="button" className="button button--soft" onClick={()=>{setStep(step-1);setErrors({});}}>{mt("back")}</button>}<button type="button" className="button button--primary" onClick={next}>{step===3?mt("completeRegistration"):mt("continue")} <ArrowRight size={17} /></button></div>
  </div></FarmerEntryFrame>;
}

export function Input({label,value,onChange,type="text",error,hint,min,step}: {label:string;value:string|number;onChange:(value:string)=>void;type?:string;error?:string;hint?:string;min?:number;step?:string}) {
  return <label className="market-field"><span>{label}</span><input type={type} value={value} min={min} step={step} onChange={e=>onChange(e.target.value)} onInput={type==="date"||type==="time"?e=>onChange(e.currentTarget.value):undefined} aria-invalid={!!error} required={!!error} />{hint&&<em>{hint}</em>}{error&&<small role="alert">{error}</small>}</label>;
}
export function Select({label,value,options,labels,onChange,error,selectLabel="—"}: {label:string;value:string;options:string[];labels?:string[];onChange:(value:string)=>void;error?:string;selectLabel?:string}) {
  const {option:translateOption}=useMarketTranslation();
  return <label className="market-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)} aria-invalid={!!error}><option value="">{selectLabel}</option>{options.map((option,index)=><option value={option} key={option}>{labels?.[index]??translateOption(option)}</option>)}</select>{error&&<small role="alert">{error}</small>}</label>;
}
