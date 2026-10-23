import type { LocalizedText } from "@/types";

type PlaceStory = { overview: LocalizedText; highlights: [LocalizedText, LocalizedText, LocalizedText]; tip: LocalizedText };

export const placeDetails: Record<string, PlaceStory> = {
  "quba-orchard": {
    overview: { az: "Qubanın meyvəçilik ənənəsini bağ yolları boyunca hiss edin. Bu marşrut alma ağaclarının mövsümə görə dəyişən görünüşünü, məhsulun yetişmə yolunu və kənd mühitində sakit gəzintini birləşdirir.", en: "Explore Quba's fruit-growing tradition along orchard paths. This route combines seasonal apple trees, the story of the harvest and a relaxed walk in a rural setting.", ru: "Познакомьтесь с традициями садоводства Губы. Маршрут объединяет сезонные яблоневые сады, историю урожая и спокойную прогулку в сельской местности." },
    highlights: [
      { az: "Bağ yollarında sərbəst gəzinti", en: "A walk through orchard paths", ru: "Прогулка по садовым дорожкам" },
      { az: "Almanın becərilməsi ilə tanışlıq", en: "Learn how apples are grown", ru: "Знакомство с выращиванием яблок" },
      { az: "Mövsüm uyğun olarsa yığım təcrübəsi", en: "Seasonal picking when available", ru: "Сезонный сбор при наличии урожая" }
    ],
    tip: { az: "Rahat ayaqqabı seçin; yığım mövsümə bağlıdır.", en: "Wear comfortable shoes; picking depends on the season.", ru: "Наденьте удобную обувь; сбор зависит от сезона." }
  },
  "gabala-breakfast": {
    overview: { az: "Kənd səhərinin yavaş ritmini yerli süfrə ətrafında təsəvvür edin. Bu təcrübə Qəbələnin təbiət mənzərəsini, regional dadları və birlikdə keçirilən səhər vaxtını ön plana çıxarır.", en: "Imagine a slower village morning around a local table. The experience brings together Gabala scenery, regional flavors and time spent sharing breakfast.", ru: "Представьте неспешное сельское утро за местным столом. Здесь сочетаются пейзажи Габалы, региональные вкусы и совместный завтрак." },
    highlights: [
      { az: "Kənd mühitində səhər gəzintisi", en: "A morning village walk", ru: "Утренняя прогулка по селу" },
      { az: "Yerli səhər yeməyi ənənələri", en: "Local breakfast traditions", ru: "Традиции местного завтрака" },
      { az: "Təbiət mənzərəsi və istirahət", en: "Scenery and unhurried time", ru: "Пейзажи и спокойный отдых" }
    ],
    tip: { az: "Qida həssaslığınız varsa bunu müraciət qeydində bildirin.", en: "Mention any dietary needs in your request note.", ru: "Укажите пищевые ограничения в комментарии к заявке." }
  },
  "shamakhi-vineyard": {
    overview: { az: "Şamaxının üzümçülük mənzərəsinə yaxından baxın. Üzüm sıraları arasındakı gəzinti mövsümi əkin işlərini, bağın gündəlik ritmini və açıq havada vaxt keçirməyi bir araya gətirir.", en: "Take a closer look at Shamakhi's vineyard landscape. Walking between the vines brings together seasonal field work, the rhythm of the vineyard and time outdoors.", ru: "Присмотритесь к виноградникам Шемахи. Прогулка между рядами объединяет сезонные работы, ритм виноградника и отдых на свежем воздухе." },
    highlights: [
      { az: "Üzüm sıraları ilə piyada marşrut", en: "A walking route between vines", ru: "Пеший маршрут между лозами" },
      { az: "Üzümün yetişmə mərhələləri", en: "The grape-growing cycle", ru: "Этапы выращивания винограда" },
      { az: "Mənzərə və foto dayanacaqları", en: "Scenic photo stops", ru: "Остановки для фотографий" }
    ],
    tip: { az: "Açıq hava marşrutu üçün su və günəşdən qorunma vasitəsi götürün.", en: "Bring water and sun protection for the outdoor route.", ru: "Возьмите воду и защиту от солнца для прогулки." }
  },
  "lankaran-tea": {
    overview: { az: "Cənubun rütubətli yaşıllığı və çayçılıq mədəniyyəti ilə tanış olun. Marşrut çay kollarının yetişdiyi mühiti, yarpağın emalına dair ümumi hekayəni və bölgənin təbiətini təqdim edir.", en: "Discover the lush southern landscape and tea culture. The route introduces the tea-growing environment, the broad story of leaf processing and the region's nature.", ru: "Откройте зелёные пейзажи юга и культуру чая. Маршрут знакомит с условиями выращивания, общей историей обработки листа и природой региона." },
    highlights: [
      { az: "Çay kolları arasında gəzinti", en: "Walk among tea bushes", ru: "Прогулка среди чайных кустов" },
      { az: "Çayçılıq prosesi ilə tanışlıq", en: "Introduction to tea growing", ru: "Знакомство с чаеводством" },
      { az: "Yerli çay dadlarına nəzər", en: "A look at local tea flavors", ru: "Знакомство с местными вкусами чая" }
    ],
    tip: { az: "Yağış ehtimalına görə yüngül üst geyimi faydalıdır.", en: "A light rain layer can be useful in this region.", ru: "В этом регионе пригодится лёгкая одежда от дождя." }
  },
  "zagatala-honey": {
    overview: { az: "Arıçılığın kənd təsərrüfatındakı rolunu Zaqatala təbiəti fonunda kəşf edin. Bu tanışlıq pətək həyatının əsasları, arıların bitkilərlə əlaqəsi və balın yaranma hekayəsi üzərində qurulur.", en: "Discover the role of beekeeping against Zagatala's natural backdrop. This introduction explores hive life, the link between bees and plants, and how honey is produced.", ru: "Узнайте о роли пчеловодства на фоне природы Закаталы. Знакомство посвящено жизни улья, связи пчёл с растениями и происхождению мёда." },
    highlights: [
      { az: "Arı ailəsinin quruluşu", en: "How a bee colony works", ru: "Устройство пчелиной семьи" },
      { az: "Balın hazırlanma mərhələləri", en: "Stages of honey production", ru: "Этапы производства мёда" },
      { az: "Təbiət və tozlanma haqqında söhbət", en: "Nature and pollination", ru: "Природа и опыление" }
    ],
    tip: { az: "Arı sancmasına allergiyanız varsa bunu müraciətdə qeyd edin.", en: "Mention a bee-sting allergy in your request.", ru: "Укажите аллергию на укусы пчёл в заявке." }
  },
  "ismayilli-village": {
    overview: { az: "İsmayıllının dağ kəndi atmosferini piyada marşrutla hiss edin. Mənzərə dayanacaqları, kənd yolları və yerli həyatın gündəlik ritmi şəhərdən uzaq, yavaş bir gün üçün çərçivə yaradır.", en: "Experience the atmosphere of an Ismayilli mountain village on foot. Scenic stops, village paths and the pace of local life frame a slower day away from the city.", ru: "Почувствуйте атмосферу горного села Исмаиллы во время пешей прогулки. Видовые остановки, сельские тропы и местный ритм создают условия для неспешного дня." },
    highlights: [
      { az: "Kənd yollarında piyada gəzinti", en: "Walk village paths", ru: "Прогулка по сельским тропам" },
      { az: "Dağ mənzərəsi üçün dayanacaqlar", en: "Mountain viewpoint stops", ru: "Остановки с видом на горы" },
      { az: "Yerli həyatla tanışlıq", en: "A glimpse of local life", ru: "Знакомство с местной жизнью" }
    ],
    tip: { az: "Marşrut üçün rahat ayaqqabı və dəyişkən hava şəraitinə uyğun geyim seçin.", en: "Choose sturdy shoes and clothing for changing weather.", ru: "Выберите удобную обувь и одежду для переменчивой погоды." }
  }
};
