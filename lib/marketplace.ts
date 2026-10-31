import type { Place } from "@/types";

export type ReviewStatus = "pending" | "approved" | "changes" | "rejected";
export type ListingStatus = ReviewStatus | "draft" | "paused" | "archived";
export type DeliveryMethod = "pickup" | "delivery" | "both";
export type OrderStatus = "new" | "accepted" | "preparing" | "delivered" | "cancelled";

export type Farmer = {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  farmName: string; region: string; farmType: string; mainProducts: string;
  description: string; image: string; status: ReviewStatus; createdAt: string;
  soilType?: string; irrigation?: string; previousExperience?: string;
};
export type Product = {
  id: string; farmerId: string; name: string; category: string; price: number;
  unit: string; quantity: number; region: string; description: string;
  harvestDate: string; delivery: DeliveryMethod; contact: string;
  image: string; status: ListingStatus; createdAt: string; updatedAt?: string;
  soilFertility?: string; irrigation?: string; plantingDate?: string; previousExperience?: string;
};
export type FarmEvent = {
  id: string; farmerId: string; name: string; image: string; kind: string;
  location: string; region: string; date: string; time: string; duration: string;
  capacity: number; price: number; description: string; included: string;
  contact: string; status: ListingStatus; createdAt: string;
};
export type MarketOrder = {
  id: string; productId: string; farmerId: string; buyerId: string;
  buyerName: string; phoneHint: string; quantity: number; total: number;
  delivery: "pickup" | "delivery"; region: string; note: string;
  status: OrderStatus; createdAt: string;
};
export type PrivateOrderContact = { phone: string; address: string; note: string };

export const reviewText: Record<ReviewStatus, string> = {
  pending: "Yoxlanılır", approved: "Təsdiqlənib",
  changes: "Düzəliş tələb olunur", rejected: "Rədd edilib"
};
export const listingText: Record<ListingStatus, string> = {
  ...reviewText, draft: "Qaralama", paused: "Satış dayandırılıb", archived: "Arxivdə"
};
export const orderText: Record<OrderStatus, string> = {
  new: "Yeni sifariş", accepted: "Qəbul edildi", preparing: "Hazırlanır",
  delivered: "Təhvil verildi", cancelled: "Ləğv edildi"
};
export const deliveryText: Record<DeliveryMethod, string> = {
  pickup: "Fermadan götürmə", delivery: "Çatdırılma", both: "Hər ikisi"
};
export const categories = ["Meyvə", "Tərəvəz", "Bal", "Süd məhsulları", "Taxıl", "Ting və toxum", "Digər"];
export const farmTypes = ["Bitkiçilik", "Heyvandarlıq", "Arıçılıq", "Bağçılıq", "Digər"];
export const regions = ["Quba", "Şəki", "Lənkəran", "Şamaxı", "Qəbələ", "Zaqatala", "İsmayıllı", "Bakı", "Digər"];

const image = {
  apple: "/images/orchard.jpg", honey: "/images/honey.jpg", citrus: "/images/tea.jpg",
  grape: "/images/vineyard.jpg", eggs: "/images/village-breakfast.jpg",
  dairy: "/images/village-breakfast.jpg", vegetables: "/images/hero-village.jpg",
  seedlings: "/images/ismayilli.jpg"
};
export const productImages = Object.values(image);

export const seedFarmers: Farmer[] = [
  { id:"farm-quba", firstName:"Nümunə", lastName:"Fermer", email:"quba@aqroqr.local", phone:"", farmName:"Quba bağ evi", region:"Quba", farmType:"Bağçılıq", mainProducts:"Alma", description:"Quba bağlarından mövsümi məhsullar.", image:image.apple, status:"approved", createdAt:"2026-10-01" },
  { id:"farm-sheki", firstName:"Nümunə", lastName:"Arıçı", email:"sheki@aqroqr.local", phone:"", farmName:"Şəki arı təsərrüfatı", region:"Şəki", farmType:"Arıçılıq", mainProducts:"Bal", description:"Dağ çiçəkləri mövsümündən bal.", image:image.honey, status:"approved", createdAt:"2026-10-01" },
  { id:"farm-lankaran", firstName:"Nümunə", lastName:"Bağban", email:"lankaran@aqroqr.local", phone:"", farmName:"Cənub bağı", region:"Lənkəran", farmType:"Bağçılıq", mainProducts:"Sitrus, tərəvəz", description:"Cənub bölgəsinin mövsümi məhsulları.", image:image.citrus, status:"approved", createdAt:"2026-10-01" },
  { id:"farm-shamakhi", firstName:"Nümunə", lastName:"Üzümçü", email:"shamakhi@aqroqr.local", phone:"", farmName:"Şamaxı üzüm bağı", region:"Şamaxı", farmType:"Bağçılıq", mainProducts:"Üzüm, ting", description:"Üzüm bağından seçilmiş məhsullar.", image:image.grape, status:"approved", createdAt:"2026-10-01" }
];
const makeProduct = (id:string,farmerId:string,name:string,category:string,price:number,unit:string,quantity:number,region:string,description:string,picture:string):Product =>
  ({id,farmerId,name,category,price,unit,quantity,region,description,harvestDate:"2026-10-20",delivery:"both",contact:"Satıcı ilə sifariş vasitəsilə əlaqə",image:picture,status:"approved",createdAt:"2026-10-22"});
export const seedProducts: Product[] = [
  makeProduct("apple","farm-quba","Quba təzə alması","Meyvə",3.5,"kq",140,"Quba","Mövsümün təzə almaları, bağdan seçilərək hazırlanır.",image.apple),
  makeProduct("honey","farm-sheki","Şəki təbii balı","Bal",24,"qutu",32,"Şəki","Dağ çiçəkləri mövsümündən süzülmüş bal.",image.honey),
  makeProduct("citrus","farm-lankaran","Lənkəran sitrus səbəti","Meyvə",12,"qutu",48,"Lənkəran","Mövsümi sitrus meyvələrindən qarışıq səbət.",image.citrus),
  makeProduct("grapes","farm-shamakhi","Şamaxı üzümü","Meyvə",4.2,"kq",75,"Şamaxı","Üzüm bağından mövsümi məhsul.",image.grape),
  makeProduct("eggs","farm-quba","Yerli kənd yumurtası","Digər",7,"qutu",60,"Quba","Bir qutuda 10 kənd yumurtası.",image.eggs),
  makeProduct("dairy","farm-lankaran","Təzə kənd pendiri","Süd məhsulları",9,"kq",25,"Lənkəran","Kənd üsulu ilə hazırlanmış təzə pendir.",image.dairy),
  makeProduct("vegetables","farm-lankaran","Mövsümi tərəvəz səbəti","Tərəvəz",16,"qutu",35,"Lənkəran","Mövsümə uyğun qarışıq tərəvəz seçimi.",image.vegetables),
  makeProduct("seedlings","farm-shamakhi","Bağ üçün tinglər","Ting və toxum",5,"ədəd",90,"Şamaxı","Mövsümə uyğun bağ tingləri.",image.seedlings)
];
export const seedEvents: FarmEvent[] = [{
  id:"event-harvest",farmerId:"farm-quba",name:"Quba bağında məhsul yığımı",image:image.apple,
  kind:"Məhsul yığımı",location:"Quba bağ evi",region:"Quba",date:"2026-11-15",
  time:"10:00",duration:"2 saat",capacity:12,price:20,
  description:"Alma bağında mövsümi yığım və bağ gəzintisi.",
  included:"Bağ bələdçisi, yığım alətləri",contact:"Sifariş vasitəsilə əlaqə",
  status:"approved",createdAt:"2026-10-22"
}];

const regionCoordinates: Record<string,[number,number]> = {
  Quba:[41.36,48.51],Şəki:[41.2,47.17],Lənkəran:[38.75,48.85],
  Şamaxı:[40.63,48.64],Qəbələ:[40.98,47.85],Zaqatala:[41.63,46.64],
  İsmayıllı:[40.79,48.15],Bakı:[40.4,49.85],Digər:[40.4,47.7]
};
const localized = (value:string) => ({az:value,en:value,ru:value});
export function eventToPlace(event:FarmEvent):Place {
  return {id:event.id,name:localized(event.name),region:localized(event.region),
    category:localized(event.kind),description:localized(event.description),
    activity:localized(event.kind),duration:localized(event.duration),
    capacity:event.capacity,price:event.price,coordinates:regionCoordinates[event.region]??regionCoordinates.Digər,
    visual:"market-event",imageUrl:event.image,eventDate:event.date,eventTime:event.time,demo:true};
}
export function maskPhone(value:string) {
  const digits=value.replace(/\D/g,"");
  return digits.length<4 ? "Əlaqə qeyd olunmayıb" : `*** *** ${digits.slice(-4)}`;
}
