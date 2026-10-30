"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { mockPlaces } from "@/data/mock-places";
import { eventToPlace, maskPhone, seedEvents, seedFarmers, seedProducts, type Farmer, type FarmEvent, type ListingStatus, type MarketOrder, type OrderStatus, type PrivateOrderContact, type Product, type ReviewStatus } from "@/lib/marketplace";

type FarmerInput = Omit<Farmer, "id" | "status" | "createdAt">;
type ProductInput = Omit<Product, "id" | "farmerId" | "status" | "createdAt">;
type EventInput = Omit<FarmEvent, "id" | "farmerId" | "status" | "createdAt">;
type OrderInput = Omit<MarketOrder, "id" | "status" | "createdAt" | "phoneHint"> & PrivateOrderContact;

type MarketContext = {
  ready: boolean; farmers: Farmer[]; products: Product[]; events: FarmEvent[];
  orders: MarketOrder[]; farmerId: string | null; currentFarmer: Farmer | null;
  publicProducts: Product[]; publicPlaces: typeof mockPlaces;
  privateContacts: Record<string, PrivateOrderContact>;
  registerFarmer: (input: FarmerInput) => Farmer;
  enterFarmer: (email: string) => boolean; leaveFarmer: () => void;
  updateFarmer: (input: Partial<FarmerInput>) => void;
  reviewFarmer: (status: ReviewStatus) => void;
  saveProduct: (input: ProductInput, status: "draft" | "pending", id?: string) => Product | null;
  updateProductStatus: (id: string, status: ListingStatus) => void;
  saveEvent: (input: EventInput, status: "draft" | "pending", id?: string) => FarmEvent | null;
  updateEventStatus: (id: string, status: ListingStatus) => void;
  createOrder: (input: OrderInput) => MarketOrder;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};
const Market = createContext<MarketContext | null>(null);
const key = (name: string) => `aqroqr:marketplace:${name}`;
function read<T>(name: string, fallback: T): T {
  try { const raw = localStorage.getItem(key(name)); return raw ? JSON.parse(raw) as T : fallback; }
  catch { return fallback; }
}
export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [farmers, setFarmers] = useState<Farmer[]>(seedFarmers);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [events, setEvents] = useState<FarmEvent[]>(seedEvents);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [privateContacts, setPrivateContacts] = useState<Record<string, PrivateOrderContact>>({});

  useEffect(() => {
    setFarmers(read("farmers", seedFarmers));
    setProducts(read("products", seedProducts));
    setEvents(read("events", seedEvents));
    setOrders(read("orders", []));
    setFarmerId(read("farmer", null));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(key("farmers"), JSON.stringify(farmers)); }, [farmers, ready]);
  useEffect(() => { if (ready) localStorage.setItem(key("products"), JSON.stringify(products)); }, [products, ready]);
  useEffect(() => { if (ready) localStorage.setItem(key("events"), JSON.stringify(events)); }, [events, ready]);
  useEffect(() => { if (ready) localStorage.setItem(key("orders"), JSON.stringify(orders)); }, [orders, ready]);
  useEffect(() => { if (ready) localStorage.setItem(key("farmer"), JSON.stringify(farmerId)); }, [farmerId, ready]);

  const currentFarmer = farmers.find((item) => item.id === farmerId) ?? null;
  const publicProducts = products.filter((item) => item.status === "approved" && farmers.some((farmer) => farmer.id === item.farmerId && farmer.status === "approved"));
  const publicPlaces = useMemo(() => [...mockPlaces, ...events.filter((item) => item.status === "approved" && farmers.some((farmer) => farmer.id === item.farmerId && farmer.status === "approved")).map(eventToPlace)], [events, farmers]);
  const registerFarmer = (input: FarmerInput) => {
    const farmer: Farmer = { ...input, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
    setFarmers((current) => [farmer, ...current]);
    setFarmerId(farmer.id);
    return farmer;
  };
  const enterFarmer = (email: string) => {
    const farmer = farmers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!farmer) return false;
    setFarmerId(farmer.id);
    return true;
  };
  const leaveFarmer = () => setFarmerId(null);
  const updateFarmer = (input: Partial<FarmerInput>) => {
    if (!farmerId) return;
    setFarmers((current) => current.map((item) => item.id === farmerId ? { ...item, ...input } : item));
  };
  const reviewFarmer = (status: ReviewStatus) => {
    if (!farmerId) return;
    setFarmers((current) => current.map((item) => item.id === farmerId ? { ...item, status } : item));
  };
  const saveProduct = (input: ProductInput, status: "draft" | "pending", id?: string) => {
    if (!farmerId) return null;
    const previous = products.find((item) => item.id === id && item.farmerId === farmerId);
    const item: Product = { ...input, id: previous?.id ?? crypto.randomUUID(), farmerId, status, createdAt: previous?.createdAt ?? new Date().toISOString() };
    setProducts((current) => previous ? current.map((product) => product.id === item.id ? item : product) : [item, ...current]);
    return item;
  };
  const updateProductStatus = (id: string, status: ListingStatus) => {
    setProducts((current) => current.map((item) => item.id === id && item.farmerId === farmerId ? { ...item, status } : item));
  };
  const saveEvent = (input: EventInput, status: "draft" | "pending", id?: string) => {
    if (!farmerId) return null;
    const previous = events.find((item) => item.id === id && item.farmerId === farmerId);
    const item: FarmEvent = { ...input, id: previous?.id ?? crypto.randomUUID(), farmerId, status, createdAt: previous?.createdAt ?? new Date().toISOString() };
    setEvents((current) => previous ? current.map((event) => event.id === item.id ? item : event) : [item, ...current]);
    return item;
  };
  const updateEventStatus = (id: string, status: ListingStatus) => {
    setEvents((current) => current.map((item) => item.id === id && item.farmerId === farmerId ? { ...item, status } : item));
  };
  const createOrder = (input: OrderInput) => {
    const { phone, address, note, ...safe } = input;
    const item: MarketOrder = { ...safe, note: "", id: crypto.randomUUID(), phoneHint: maskPhone(phone), status: "new", createdAt: new Date().toISOString() };
    setPrivateContacts((current) => ({ ...current, [item.id]: { phone, address, note } }));
    setOrders((current) => [item, ...current]);
    return item;
  };
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((item) => item.id === id && item.farmerId === farmerId ? { ...item, status } : item));
  };
  const value = { ready, farmers, products, events, orders, farmerId, currentFarmer, publicProducts, publicPlaces, privateContacts,
    registerFarmer, enterFarmer, leaveFarmer, updateFarmer, reviewFarmer, saveProduct, updateProductStatus, saveEvent, updateEventStatus, createOrder, updateOrderStatus };
  return <Market.Provider value={value}>{children}</Market.Provider>;
}
export function useMarketplace() {
  const value = useContext(Market);
  if (!value) throw new Error("MarketplaceProvider tələb olunur");
  return value;
}
