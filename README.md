# AqroQR

AqroQR Azərbaycanın regionlarını, kənd həyatını və aqroturizm ideyalarını kəşf etmək üçün hazırlanmış interaktiv frontend layihəsidir. Sayt Azərbaycan, ingilis və rus dillərində işləyir və telefon, planşet, kompüter ekranlarına uyğunlaşır.

## Başlamaq

Node.js quraşdırıldıqdan sonra:

```bash
npm ci
npm run dev
```

Sayt `http://localhost:3000` ünvanında açılır. Yoxlama və istehsal yığımı üçün:

```bash
npm run lint
npm run build
```

## Nələr var?

- Qonaq və Azərbaycan vətəndaşı üçün tanışlıq axını;
- regionlara görə axtarış və süzgəcli məkan kataloqu;
- ətraflı məkan məlumatı və rezervasiya müraciəti;
- OpenStreetMap xəritəsi, yaxınlaşdırma və region markerləri;
- müraciətlər, bildirişlər, profil seçimləri və dil dəyişimi.

Əsas səhifələr: `/`, `/dashboard`, `/places`, `/map`, `/requests`, `/notifications`, `/about`, `/profile`.

## Vacib qeyd

Bu, frontend prototipidir. Məkanlar, rezervasiya müraciətləri və xəritədəki region işarələri nümayiş məqsədlidir; real obyektlərin təsdiqlənmiş ünvanları və ya aktiv rezervasiya xidməti deyil. Məlumatlar brauzerin `localStorage` yaddaşında saxlanılır. Real autentifikasiya, myGov inteqrasiyası, server, ödəniş və GPS izləmə yoxdur.

İstifadə olunan şəkillərin mənbələri və müəlliflik qeydləri [PHOTO-SOURCES.md](PHOTO-SOURCES.md) faylındadır. Xəritə məlumatları © OpenStreetMap contributors.

## Texnologiyalar

Next.js App Router, React, TypeScript, Leaflet və OpenStreetMap.
