import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { MarketplaceProvider } from "@/components/marketplace-provider";

export const metadata: Metadata = {
  title: "AqroQR | Aqro dünyanı kəşf et",
  description: "Azərbaycandakı aqrar məkanları və kənd təcrübələrini kəşf edən frontend demo."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" data-scroll-behavior="smooth">
      <body>
        <AppProvider><MarketplaceProvider>{children}</MarketplaceProvider></AppProvider>
      </body>
    </html>
  );
}
