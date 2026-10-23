import type { Notification, Place } from "@/types";

export const mockPlaces: Place[] = [
  {
    id: "quba-orchard",
    name: { az: "Quba alma bağları", en: "Quba apple orchards", ru: "Яблоневые сады Кубы" },
    region: { az: "Quba", en: "Quba", ru: "Губа" },
    category: { az: "Meyvəçilik", en: "Orchard", ru: "Садоводство" },
    description: { az: "Alma ağacları arasında gəzin, bağ həyatını və mövsümün dadını kəşf edin.", en: "Wander among apple trees and discover the rhythm of orchard life.", ru: "Прогуляйтесь среди яблонь и познакомьтесь с жизнью сада." },
    activity: { az: "Alma yığımı", en: "Apple picking", ru: "Сбор яблок" },
    duration: { az: "3 saat", en: "3 hours", ru: "3 часа" },
    capacity: 12,
    price: 18,
    coordinates: [41.36, 48.51],
    visual: "orchard",
    demo: true
  },
  {
    id: "gabala-breakfast",
    name: { az: "Qəbələ kənd səhər yeməyi", en: "Gabala village breakfast", ru: "Деревенский завтрак в Габале" },
    region: { az: "Qəbələ", en: "Gabala", ru: "Габала" },
    category: { az: "Kənd həyatı", en: "Village life", ru: "Сельская жизнь" },
    description: { az: "Yerli dadlar və sakit kənd səhəri ilə günə fərqli başlayın.", en: "Begin the day with local flavors and the calm of a village morning.", ru: "Начните день с местных вкусов и спокойного сельского утра." },
    activity: { az: "Kənd səhər yeməyi", en: "Village breakfast", ru: "Деревенский завтрак" },
    duration: { az: "2 saat", en: "2 hours", ru: "2 часа" },
    capacity: 8,
    price: 22,
    coordinates: [40.98, 47.85],
    visual: "village",
    demo: true
  },
  {
    id: "shamakhi-vineyard",
    name: { az: "Şamaxı üzüm yolu", en: "Shamakhi vineyard route", ru: "Виноградный маршрут Шемахи" },
    region: { az: "Şamaxı", en: "Shamakhi", ru: "Шемаха" },
    category: { az: "Üzümçülük", en: "Vineyard", ru: "Виноградники" },
    description: { az: "Üzüm sıraları boyunca gəzərək bağçılığın mövsümi hekayəsini dinləyin.", en: "Follow the vine rows and explore the seasonal story of grape growing.", ru: "Пройдите вдоль виноградных рядов и узнайте историю урожая." },
    activity: { az: "Üzüm bağında gəzinti", en: "Vineyard walk", ru: "Прогулка по винограднику" },
    duration: { az: "4 saat", en: "4 hours", ru: "4 часа" },
    capacity: 16,
    price: 28,
    coordinates: [40.63, 48.64],
    visual: "vineyard",
    demo: true
  },
  {
    id: "lankaran-tea",
    name: { az: "Lənkəran çay bağları", en: "Lankaran tea gardens", ru: "Чайные сады Ленкорани" },
    region: { az: "Lənkəran", en: "Lankaran", ru: "Ленкорань" },
    category: { az: "Çayçılıq", en: "Tea garden", ru: "Чайные плантации" },
    description: { az: "Yaşıl çay kolları, cənub təbiəti və çay mədəniyyətinin izində.", en: "Explore lush tea fields and the traditions of the southern region.", ru: "Познакомьтесь с зелёными чайными полями и традициями юга." },
    activity: { az: "Çay dequstasiyası", en: "Tea tasting", ru: "Чайная дегустация" },
    duration: { az: "3.5 saat", en: "3.5 hours", ru: "3,5 часа" },
    capacity: 10,
    price: 24,
    coordinates: [38.75, 48.85],
    visual: "tea",
    demo: true
  },
  {
    id: "zagatala-honey",
    name: { az: "Zaqatala bal təsərrüfatı", en: "Zagatala honey farm", ru: "Медовая ферма Закаталы" },
    region: { az: "Zaqatala", en: "Zagatala", ru: "Закатала" },
    category: { az: "Arıçılıq", en: "Beekeeping", ru: "Пчеловодство" },
    description: { az: "Arı pətəkləri və balın hazırlanma yolu ilə yaxından tanış olun.", en: "Get a closer look at beehives and the craft behind local honey.", ru: "Узнайте больше об ульях и традициях производства мёда." },
    activity: { az: "Arıçılıq tanıtımı", en: "Beekeeping visit", ru: "Знакомство с пчеловодством" },
    duration: { az: "2.5 saat", en: "2.5 hours", ru: "2,5 часа" },
    capacity: 10,
    price: 20,
    coordinates: [41.63, 46.64],
    visual: "honey",
    demo: true
  },
  {
    id: "ismayilli-village",
    name: { az: "İsmayıllı dağ kəndi", en: "Ismayilli mountain village", ru: "Горное село Исмаиллы" },
    region: { az: "İsmayıllı", en: "Ismayilli", ru: "Исмаиллы" },
    category: { az: "Ekoturizm", en: "Eco travel", ru: "Экотуризм" },
    description: { az: "Dağ mənzərələri, kənd yolları və yerli həyatın sakit ritmi bir arada.", en: "Mountain views, village paths, and the unhurried pace of local life.", ru: "Горные виды, сельские тропы и неспешный ритм местной жизни." },
    activity: { az: "Dağ kəndi gəzintisi", en: "Mountain village walk", ru: "Прогулка по горному селу" },
    duration: { az: "5 saat", en: "5 hours", ru: "5 часов" },
    capacity: 14,
    price: 26,
    coordinates: [40.79, 48.15],
    visual: "mountain",
    demo: true
  }
];

export const seedNotifications: Notification[] = [
  { id: "n1", title: { az: "AqroQR-ə xoş gəlmisiniz", en: "Welcome to AqroQR", ru: "Добро пожаловать в AqroQR" }, body: { az: "Sizə uyğun aqrar məkanları kəşf etməyə hazırsınız.", en: "You are ready to discover places curated for your journey.", ru: "Вы готовы открывать места, подобранные для вашей поездки." }, createdAt: "2026-10-23T09:00:00.000Z", read: false },
  { id: "n2", title: { az: "Yeni məkan əlavə edildi", en: "A new place was added", ru: "Добавлено новое место" }, body: { az: "İsmayıllı dağ kəndi siyahıya əlavə olundu.", en: "Ismayilli mountain village is now in the collection.", ru: "Горное село Исмаиллы добавлено в коллекцию." }, createdAt: "2026-10-22T14:30:00.000Z", read: false },
  { id: "n3", title: { az: "Səyahət tarixiniz yaxınlaşır", en: "Your travel date is coming", ru: "Дата поездки приближается" }, body: { az: "Planınızı nəzərdən keçirməyi unutmayın.", en: "Remember to review your plan before you travel.", ru: "Не забудьте проверить план перед поездкой." }, createdAt: "2026-10-21T11:20:00.000Z", read: false },
  { id: "n4", title: { az: "Yeni tövsiyə hazırdır", en: "A new recommendation is ready", ru: "Готова новая рекомендация" }, body: { az: "Payız üçün seçilmiş məkanlara baxın.", en: "See the places selected for autumn.", ru: "Посмотрите места, выбранные для осени." }, createdAt: "2026-10-20T16:10:00.000Z", read: true },
  { id: "n5", title: { az: "AqroQR haqqında yenilik", en: "An AqroQR update", ru: "Обновление AqroQR" }, body: { az: "Platforma yeni demo axınları ilə yeniləndi.", en: "The platform was refreshed with new demo flows.", ru: "Платформа обновлена новыми демонстрационными сценариями." }, createdAt: "2026-10-18T08:50:00.000Z", read: true },
  { id: "n6", title: { az: "Müraciətiniz yeniləndi", en: "Your request was updated", ru: "Ваша заявка обновлена" }, body: { az: "Müraciət statuslarınızı Müraciətlərim səhifəsindən izləyin.", en: "Track request statuses from My requests.", ru: "Следите за статусами на странице «Мои заявки»." }, createdAt: "2026-10-17T12:00:00.000Z", read: true }
];
