"use client";

import { Info, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useApp } from "@/components/app-provider";
import { calculateHarvestAI, type HarvestFactor, type HarvestMessage } from "@/lib/harvest-ai";
import { localeFor, marketTranslate } from "@/lib/market-i18n";
import type { Farmer, Product } from "@/lib/marketplace";

const factorKeys: Array<[HarvestFactor,string]> = [
  ["soil","harvestSoil"],["weather","harvestWeather"],["compatibility","harvestCompatibility"],
  ["irrigation","harvestIrrigation"],["season","harvestSeason"],["reliability","harvestReliability"],["completeness","harvestCompleteness"]
];

export function HarvestBadge({product,farmer}:{product:Product;farmer?:Farmer|null}) {
  const {language}=useApp();
  const result=calculateHarvestAI(product,farmer);
  const mt=(key:string,vars?:Record<string,string|number>)=>marketTranslate(language,key,vars);
  return <span className="harvest-badge" title={mt("harvestTooltip")}><Sparkles size={13}/>{mt("harvestBadge",{score:result.overallScore})}</span>;
}

export function HarvestAICard({product,farmer,compact=false}:{product:Product;farmer?:Farmer|null;compact?:boolean}) {
  const {language}=useApp();
  const result=calculateHarvestAI(product,farmer);
  const mt=(key:string,vars?:Record<string,string|number>)=>marketTranslate(language,key,vars);
  const label=mt(result.label==="high"?"harvestHigh":result.label==="medium"?"harvestMedium":"harvestLow");
  const messages=(items:HarvestMessage[])=>items.map(item=><li key={item}>{mt(item)}</li>);
  return <section className={`harvest-card ${compact?"harvest-card--compact":""}`} aria-label={mt("harvestTitle")}>
    <header className="harvest-card__head"><div><span className="section-kicker"><Sparkles size={14}/>{mt("harvestTitle")}</span><h2>{mt("harvestEstimate")}</h2></div><span className="harvest-info" title={mt("harvestTooltip")} aria-label={mt("harvestTooltip")}><Info size={17}/></span></header>
    <div className="harvest-card__score"><div className="harvest-ring" style={{"--score":`${result.overallScore*3.6}deg`} as CSSProperties}><strong>{result.overallScore}%</strong></div><div><strong>{label}</strong><p>{mt("harvestShort")}</p>{result.preliminary&&<small>{mt("harvestPreliminary")}</small>}</div></div>
    {compact?<details className="harvest-card__details"><summary>{mt("harvestDetails")}</summary><div className="harvest-columns"><MessageGroup title={mt("harvestPositive")} items={messages(result.positiveFactors.slice(0,3))}/><MessageGroup title={mt("harvestRisks")} items={messages(result.riskFactors.slice(0,2))}/></div><FactorGrid factors={result.factors} mt={mt}/></details>:<><FactorGrid factors={result.factors} mt={mt}/><div className="harvest-columns"><MessageGroup title={mt("harvestPositive")} items={messages(result.positiveFactors)}/><MessageGroup title={mt("harvestRisks")} items={messages(result.riskFactors)}/><MessageGroup title={mt("harvestRecommendations")} items={messages(result.recommendations)}/></div></>}
    <footer>{mt("harvestUpdated")}: {new Date(result.lastUpdated).toLocaleDateString(localeFor(language))}</footer>
  </section>;
}

function FactorGrid({factors,mt}:{factors:Record<HarvestFactor,number>;mt:(key:string)=>string}) {
  return <div className="harvest-factors">{factorKeys.map(([factor,key])=><div key={factor}><span>{mt(key)}<b>{factors[factor]}%</b></span><i><em style={{width:`${factors[factor]}%`}}/></i></div>)}</div>;
}
function MessageGroup({title,items}:{title:string;items:ReactNode[]}) { return <div><strong>{title}</strong><ul>{items}</ul></div>; }
