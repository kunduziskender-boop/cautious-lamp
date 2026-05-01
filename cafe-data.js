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
    photo: 'https://dummyimage.com/400x280/FFE4B5/8B4513?text=Caesar+Salad',
    badge: 'Хит',
  },
  {
    id: 2,
    name: 'Греческий салат',
    category: 'salads',
    price: 380,
    weight: '260 г',
    description: 'Огурцы, помидоры, маслины, сыр фета, красный лук, оливковое масло',
    photo: 'https://dummyimage.com/400x280/E8F5E9/2E7D32?text=Greek+Salad',
    badge: null,
  },
  {
    id: 3,
    name: 'Тёплый салат с тунцом',
    category: 'salads',
    price: 490,
    weight: '250 г',
    description: 'Тунец, стручковая фасоль, помидоры черри, яйцо, горчичная заправка',
    photo: 'https://dummyimage.com/400x280/FFF8DC/FF8C00?text=Tuna+Salad',
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
    photo: 'https://dummyimage.com/400x280/8B0000/FFB6C1?text=Borscht',
    badge: 'Хит',
  },
  {
    id: 5,
    name: 'Паста карбонара',
    category: 'hot',
    price: 520,
    weight: '300 г',
    description: 'Спагетти, бекон панчетта, яичный желток, пармезан, чёрный перец',
    photo: 'https://dummyimage.com/400x280/FFEFD5/D2691E?text=Pasta+Carbonara',
    badge: null,
  },
  {
    id: 6,
    name: 'Бургер классик',
    category: 'hot',
    price: 480,
    weight: '350 г',
    description: 'Говяжья котлета, листья салата, томат, маринованный огурец, фирменный соус',
    photo: 'https://dummyimage.com/400x280/CD5C5C/8B4513?text=Burger',
    badge: 'Новинка',
  },
  {
    id: 7,
    name: 'Стейк из лосося',
    category: 'hot',
    price: 750,
    weight: '200 г',
    description: 'Запечённый лосось с лимоном, каперсами и гарниром из сезонных овощей',
    photo: 'https://dummyimage.com/400x280/FFE4B5/FF6347?text=Salmon+Steak',
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
    photo: 'https://dummyimage.com/400x280/3E2723/D2B48C?text=Espresso',
    badge: null,
  },
  {
    id: 9,
    name: 'Капучино',
    category: 'drinks',
    price: 180,
    weight: '200 мл',
    description: 'Эспрессо с нежной молочной пенкой, латте-арт по запросу',
    photo: 'https://dummyimage.com/400x280/5D4E37/F5DEB3?text=Cappuccino',
    badge: 'Хит',
  },
  {
    id: 10,
    name: 'Лимонад домашний',
    category: 'drinks',
    price: 220,
    weight: '400 мл',
    description: 'Свежевыжатый лимон, мята, газированная вода, сахарный сироп',
    photo: 'https://dummyimage.com/400x280/FFFACD/FFD700?text=Lemonade',
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
    photo: 'https://dummyimage.com/400x280/8B6914/F0E68C?text=Tiramisu',
    badge: 'Хит',
  },
  {
    id: 12,
    name: 'Чизкейк Нью-Йорк',
    category: 'desserts',
    price: 290,
    weight: '140 г',
    description: 'Нежная сырная начинка, сливочный сыр Филадельфия, рассыпчатая основа',
    photo: 'https://dummyimage.com/400x280/FFE4E1/CD853F?text=Cheesecake',
    badge: null,
  },
  {
    id: 13,
    name: 'Брауни с мороженым',
    category: 'desserts',
    price: 250,
    weight: '180 г',
    description: 'Тёплый шоколадный брауни, ванильное мороженое, карамельный соус',
    photo: 'https://dummyimage.com/400x280/663300/FFB6C1?text=Brownie',
    badge: 'Новинка',
  },
];
