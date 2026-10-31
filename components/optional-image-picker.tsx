"use client";

import { ImageOff, RefreshCcw, Trash2, UploadCloud } from "lucide-react";
import { useId, useRef, useState, type DragEvent } from "react";
import { useMarketTranslation } from "@/components/use-market-translation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const suggestedImages = [
  { label: "Bağ", path: "/images/orchard.jpg" },
  { label: "Bal", path: "/images/honey.jpg" },
  { label: "Kənd süfrəsi", path: "/images/village-breakfast.jpg" },
  { label: "Üzüm bağı", path: "/images/vineyard.jpg" },
  { label: "Çay bağı", path: "/images/tea.jpg" },
  { label: "Dağ kəndi", path: "/images/ismayilli.jpg" }
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  title: string;
};

export function OptionalImagePicker({ value, onChange, title }: Props) {
  const {mt}=useMarketTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const uploaded = value.startsWith("blob:");

  const chooseFile = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setError(mt("invalidImageType"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(mt("imageTooLarge"));
      return;
    }
    if (uploaded) URL.revokeObjectURL(value);
    onChange(URL.createObjectURL(file));
    setFileName(file.name);
    setError("");
  };

  const removeImage = () => {
    if (uploaded) URL.revokeObjectURL(value);
    onChange("");
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  };

  return <section className="optional-image" aria-labelledby={`${inputId}-title`}>
    <div className="optional-image__head"><div><strong id={`${inputId}-title`}>{title}</strong><span>{mt("optional")}</span></div><button type="button" className={`no-image-choice ${!value ? "is-active" : ""}`} onClick={removeImage}><ImageOff size={16}/> {mt("continueNoImage")}</button></div>
    <div className="suggested-image-grid" aria-label={mt("suggestedImages")}>{suggestedImages.map((item,index)=><button type="button" key={item.path} className={value===item.path?"is-active":""} aria-pressed={value===item.path} onClick={()=>{if(uploaded)URL.revokeObjectURL(value);onChange(item.path);setFileName("");setError("");}}><span style={{backgroundImage:`url("${item.path}")`}}/><small>{mt(["garden","honey","villageTable","vineyard","teaGarden","mountainVillage"][index])}</small></button>)}</div>
    <input ref={inputRef} id={inputId} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event)=>chooseFile(event.target.files?.[0])}/>
    {uploaded?<div className="upload-selected"><div className="upload-selected__preview" style={{backgroundImage:`url("${value}")`}} role="img" aria-label={mt("uploadedPreview")}/><div><strong>{fileName||mt("personalImage")}</strong><span>{mt("sessionImage")}</span><div><button type="button" className="button button--soft" onClick={()=>inputRef.current?.click()}><RefreshCcw size={15}/> {mt("replaceImage")}</button><button type="button" className="button button--danger-outline" onClick={removeImage}><Trash2 size={15}/> {mt("removeImage")}</button></div></div></div>:<div className={`image-dropzone ${dragging?"is-dragging":""}`} onDragEnter={(event)=>{event.preventDefault();setDragging(true);}} onDragOver={(event)=>event.preventDefault()} onDragLeave={()=>setDragging(false)} onDrop={drop}><span className="image-dropzone__icon"><UploadCloud size={27}/></span><div><strong>{mt("uploadImage")}</strong><p>{mt("uploadHelp")}</p><small>{mt("uploadFormats")}</small></div><button type="button" className="button button--soft" onClick={()=>inputRef.current?.click()}>{mt("chooseDevice")}</button></div>}
    {error&&<p className="market-error" role="alert">{error}</p>}
  </section>;
}
