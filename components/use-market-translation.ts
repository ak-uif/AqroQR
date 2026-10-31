"use client";

import { useApp } from "@/components/app-provider";
import { localeFor, marketOption, marketTranslate } from "@/lib/market-i18n";
import type { DeliveryMethod, ListingStatus, OrderStatus, ReviewStatus } from "@/lib/marketplace";

export function useMarketTranslation() {
  const {language}=useApp();
  const mt=(key:string,vars?:Record<string,string|number>)=>marketTranslate(language,key,vars);
  const review=(status:ReviewStatus)=>mt({pending:"statusPending",approved:"statusApproved",changes:"statusChanges",rejected:"statusRejected"}[status]);
  const listing=(status:ListingStatus)=>status==="draft"?mt("statusDraft"):status==="paused"?mt("statusPaused"):status==="archived"?mt("statusArchived"):review(status);
  const order=(status:OrderStatus)=>mt({new:"orderNew",accepted:"orderAccepted",preparing:"orderPreparing",delivered:"orderDelivered",cancelled:"orderCancelled"}[status]);
  const delivery=(method:DeliveryMethod)=>mt(method==="pickup"?"pickup":method==="delivery"?"deliveryOption":"both");
  const money=(value:number)=>new Intl.NumberFormat(localeFor(language),{maximumFractionDigits:2}).format(value);
  const date=(value:string)=>new Date(value).toLocaleDateString(localeFor(language));
  const option=(value:string)=>marketOption(language,value);
  return {language,locale:localeFor(language),mt,review,listing,order,delivery,money,date,option};
}
