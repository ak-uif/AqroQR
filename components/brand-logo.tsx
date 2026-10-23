import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`}>
      <Image src="/brand/aqro-logo.png" alt="AqroQR" width={compact ? 44 : 58} height={compact ? 44 : 58} priority className="brand-logo" />
      {!compact && <span><strong>AqroQR</strong><small>Aqro dünyanı kəşf et</small></span>}
    </div>
  );
}
