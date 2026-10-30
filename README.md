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
- ətraflı məkan məlumatı və dörd addımlı rezervasiya/ödəniş axını;
- OpenStreetMap xəritəsi, yaxınlaşdırma və region markerləri;
- müraciətlər, bildirişlər, profil seçimləri və dil dəyişimi.
- ayrı fermer paneli: qeydiyyat, təsərrüfat profili, məhsul və tədbir elanları, gələn sifarişlər;
- Aqro Bazar: məhsul filtrləri, ətraflı məlumat, fermerlə əlaqə və sifariş istəyi;
- təsdiqlənmiş fermer tədbirlərinin Məkanlar və rezervasiya axınında göstərilməsi.

Əsas səhifələr: `/`, `/dashboard`, `/places`, `/map`, `/checkout?place=quba-orchard`, `/requests`, `/notifications`, `/about`, `/profile`.

Fermer səhifələri: `/farmer`, `/farmer/register`, `/farmer/login`, `/farmer/dashboard`, `/farmer/products`, `/farmer/products/new`, `/farmer/events`, `/farmer/events/new`, `/farmer/orders`, `/farmer/notifications`, `/farmer/profile`.

Aqro Bazar səhifələri: `/marketplace`, `/marketplace/[id]`, `/marketplace/orders`.

## Fermer və Aqro Bazar sınağı

Başlanğıc səhifəsində “Fermerlər üçün” seçib üç addımlı qeydiyyatı tamamlayın. Sənəd yüklənmir, qeydiyyat şifrəsi və əlavə yoxlama sahələri yadda saxlanmır. Hazır nümunə hesabı ilə daxil olmaq üçün `/farmer/login` səhifəsində göstərilən e-poçtu yazmaq kifayətdir; bu, real autentifikasiya deyil.

Fermer məhsulu və ya tədbiri qaralama kimi saxlayıb sonradan düzəldə, yaxud yoxlamaya göndərə bilər. Profil səhifəsindəki “Nümayiş üçün yoxlama vəziyyətini dəyiş” idarəsi və elan siyahısındakı “Nümayiş təsdiqi” düymələri yalnız yerli status simulyasiyasıdır. Profil və elan təsdiqlənəndə məhsul Aqro Bazarda, tədbir isə Məkanlar bölməsində görünür. Admin paneli və real təsdiq xidməti yoxdur.

Aqro Bazar sifarişi yalnız istək yaradır; real ödəniş və çatdırılma təşkil olunmur. Sifarişin tam telefon nömrəsi, ünvanı və qeydi yalnız cari baxışın yaddaşındadır; `localStorage`-da maskalanmış telefon və sifariş xülasəsi saxlanılır. Səhifə yeniləndikdə tam əlaqə məlumatı itir. Fermer profili, elanlar və sifariş xülasələri yalnız brauzerin yerli yaddaşında qalır. Nümunə məhsul və satıcı məlumatları real ticarət təklifi deyil.

## Rezervasiya sınağı

“Rezerv et” düyməsi tarix, qonaq məlumatları, ödəniş üsulu və yekun yoxlama addımlarını açır. `AQRO10` kodu sınaq endirimi verir. Kart axınında yalnız test nömrələrindən istifadə edin: `4242 4242 4242 4242` uğurlu, `4000 0000 0000 0002` uğursuz nəticə göstərir. Hər iki nəticə yalnız brauzerdə simulyasiya olunur; real ödəniş tutulmur. Kart nömrəsi, bitmə tarixi və CVV yaddaşa yazılmır. Uğurlu rezervasiyanın yalnız təhlükəsiz xülasəsi `aqroqr:requests` açarında saxlanılır və “Müraciətlərim” bölməsində görünür.

## Vacib qeyd

Bu, frontend prototipidir. Məkanlar, rezervasiya müraciətləri və xəritədəki region işarələri nümayiş məqsədlidir; real obyektlərin təsdiqlənmiş ünvanları və ya aktiv rezervasiya xidməti deyil. Məlumatlar brauzerin `localStorage` yaddaşında saxlanılır. Real autentifikasiya, myGov inteqrasiyası, server, ödəniş və GPS izləmə yoxdur.

İstifadə olunan şəkillərin mənbələri və müəlliflik qeydləri [PHOTO-SOURCES.md](PHOTO-SOURCES.md) faylındadır. Xəritə məlumatları © OpenStreetMap contributors.

## Texnologiyalar

Next.js App Router, React, TypeScript, Leaflet və OpenStreetMap.
