// ==================================================
// cafe-data.js — Данные меню кафе
// ==================================================
//
// Чтобы добавить новую категорию — добавь объект в CATEGORIES.
// Чтобы добавить новое блюдо — добавь объект в DISHES.
//
// Поля блюда:
//   id          — уникальный номер (не повторять!)
//   name        — название
//   category    — id категории из CATEGORIES
//   price       — цена в рублях (число)
//   weight      — вес/объём порции (строка)
//   description — краткое описание состава
//   photo       — ссылка на фото (можно заменить на локальный путь: 'images/caesar.jpg')
//   badge       — 'Хит' / 'Новинка' / null (если метка не нужна)

// ──────────────────────────────────────────────────
// КАТЕГОРИИ
// ──────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',      label: 'Все блюда' },
  { id: 'salads',   label: 'Салаты'    },
  { id: 'hot',      label: 'Горячее'   },
  { id: 'drinks',   label: 'Напитки'   },
  { id: 'desserts', label: 'Десерты'   },
];

// ──────────────────────────────────────────────────
// БЛЮДА
// ──────────────────────────────────────────────────

const DISHES = [
  // ── Салаты ──────────────────────────────────────
  {
    id: 1,
    name: 'Цезарь с курицей',
    category: 'salads',
    price: 450,
    weight: '280 г',
    description: 'Хрустящие листья романо, куриное филе, пармезан, крутоны, фирменный соус',
    photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Хит',
  },
  {
    id: 2,
    name: 'Греческий салат',
    category: 'salads',
    price: 380,
    weight: '260 г',
    description: 'Огурцы, помидоры, маслины, сыр фета, красный лук, оливковое масло',
    photo: 'https://images.unsplash.com/photo-1540420773-cb5c8500e7b0?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },
  {
    id: 3,
    name: 'Тёплый салат с тунцом',
    category: 'salads',
    price: 490,
    weight: '250 г',
    description: 'Тунец, стручковая фасоль, помидоры черри, яйцо, горчичная заправка',
    photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Новинка',
  },

  // ── Горячее ─────────────────────────────────────
  {
    id: 4,
    name: 'Борщ классический',
    category: 'hot',
    price: 290,
    weight: '350 мл',
    description: 'Свёкла, капуста, картофель, говядина, сметана. Подаётся с пампушкой',
    photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Хит',
  },
  {
    id: 5,
    name: 'Паста карбонара',
    category: 'hot',
    price: 520,
    weight: '300 г',
    description: 'Спагетти, бекон панчетта, яичный желток, пармезан, чёрный перец',
    photo: 'https://images.unsplash.com/photo-1621996346285-e3b42f8f6800?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },
  {
    id: 6,
    name: 'Бургер классик',
    category: 'hot',
    price: 480,
    weight: '350 г',
    description: 'Говяжья котлета, листья салата, томат, маринованный огурец, фирменный соус',
    photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Новинка',
  },
  {
    id: 7,
    name: 'Стейк из лосося',
    category: 'hot',
    price: 750,
    weight: '200 г',
    description: 'Запечённый лосось с лимоном, каперсами и гарниром из сезонных овощей',
    photo: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },

  // ── Напитки ──────────────────────────────────────
  {
    id: 8,
    name: 'Эспрессо',
    category: 'drinks',
    price: 120,
    weight: '30 мл',
    description: 'Крепкий итальянский эспрессо из зерна арабики',
    photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },
  {
    id: 9,
    name: 'Капучино',
    category: 'drinks',
    price: 180,
    weight: '200 мл',
    description: 'Эспрессо с нежной молочной пенкой, латте-арт по запросу',
    photo: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Хит',
  },
  {
    id: 10,
    name: 'Лимонад домашний',
    category: 'drinks',
    price: 220,
    weight: '400 мл',
    description: 'Свежевыжатый лимон, мята, газированная вода, сахарный сироп',
    photo: 'https://images.unsplash.com/photo-1508253730197-b5f4d49cbc68?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },

  // ── Десерты ──────────────────────────────────────
  {
    id: 11,
    name: 'Тирамису',
    category: 'desserts',
    price: 320,
    weight: '150 г',
    description: 'Савоярди, маскарпоне, эспрессо, ликёр амаретто, какао',
    photo: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Хит',
  },
  {
    id: 12,
    name: 'Чизкейк Нью-Йорк',
    category: 'desserts',
    price: 290,
    weight: '140 г',
    description: 'Нежная сырная начинка, сливочный сыр Филадельфия, рассыпчатая основа',
    photo: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=280&fit=crop&auto=format&q=80',
    badge: null,
  },
  {
    id: 13,
    name: 'Брауни с мороженым',
    category: 'desserts',
    price: 250,
    weight: '180 г',
    description: 'Тёплый шоколадный брауни, ванильное мороженое, карамельный соус',
    photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e1c9c37?w=400&h=280&fit=crop&auto=format&q=80',
    badge: 'Новинка',
  },
];
