/**
 * Placeholder-data voor de mega-menu's (Shop + Explore).
 * Nu nog statisch; later te vervangen door live Shopify-data
 * (collecties/producten via de storefront-queries).
 *
 * "Alles wat in de menu's zit, komt terug op de site" — de hrefs wijzen
 * dus naar bestaande routes/secties. Pas labels/links hier centraal aan.
 */

export type ShopProduct = {
  name: string
  type: string
  /** Prijs zonder valutateken; het € wordt los gerenderd (ui-nums). */
  price: string
  handle: string
}

export type ShopTab = {
  key: string
  label: string
  href: string
  products: ShopProduct[]
}

export const SHOP_TABS: ShopTab[] = [
  {
    key: 'face',
    label: 'face',
    href: '/collections',
    products: [
      {name: 'The Serum', type: 'water phase', price: '48', handle: 'the-serum'},
      {name: 'The Face Oil', type: 'oil phase', price: '62', handle: 'the-face-oil'},
      {name: 'The Cleanser', type: 'first step', price: '44', handle: 'the-cleanser'},
      {name: 'The Mist', type: 'finishing veil', price: '38', handle: 'the-mist'},
    ],
  },
  {
    key: 'body',
    label: 'body',
    href: '/collections',
    products: [
      {name: 'The Body Oil', type: 'nourishing', price: '58', handle: 'the-body-oil'},
      {name: 'The Body Wash', type: 'cleansing', price: '36', handle: 'the-body-wash'},
      {name: 'The Salt Scrub', type: 'renewing', price: '46', handle: 'the-salt-scrub'},
      {name: 'The Hand Balm', type: 'protecting', price: '28', handle: 'the-hand-balm'},
    ],
  },
  {
    key: 'serie',
    label: 'serie',
    href: '/collections',
    products: [
      {name: 'The Ritual', type: 'full protocol', price: '180', handle: 'the-ritual'},
      {name: 'The Duo', type: 'oil & water', price: '98', handle: 'the-duo'},
      {name: 'The Discovery', type: 'starter set', price: '64', handle: 'the-discovery'},
      {name: 'The Refill', type: 'sustained', price: '52', handle: 'the-refill'},
    ],
  },
  {
    key: 'accessoires',
    label: 'Accessoires',
    href: '/collections',
    products: [
      {name: 'The Cloth', type: 'organic cotton', price: '18', handle: 'the-cloth'},
      {name: 'The Dropper', type: 'precise dosing', price: '12', handle: 'the-dropper'},
      {name: 'The Dish', type: 'ceramic rest', price: '24', handle: 'the-dish'},
      {name: 'The Pouch', type: 'linen travel', price: '22', handle: 'the-pouch'},
    ],
  },
]

export type ExploreLink = {
  label: string
  href: string
  external?: boolean
}

export type ExploreColumn = {
  heading: string
  links: ExploreLink[]
}

export const EXPLORE_COLUMNS: ExploreColumn[] = [
  {
    heading: 'the brand',
    links: [
      {label: 'Botanical', href: '/blogs/journal'},
      {label: 'Face', href: '/collections'},
      {label: 'Bodista', href: '/'},
      {label: 'Learn More', href: '/blogs/journal'},
    ],
  },
  {
    heading: 'join the world',
    links: [
      {label: 'Instagram', href: 'https://instagram.com', external: true},
      {label: 'Facebook', href: 'https://facebook.com', external: true},
      {label: 'Tiktok', href: 'https://tiktok.com', external: true},
      {label: 'Youtube', href: 'https://youtube.com', external: true},
    ],
  },
]

export type ExploreCard = {
  src: string
  label: string
  sub: string
  href: string
}

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    src: '/assets/images/ourphilosophy.png',
    label: 'In their nature',
    sub: 'the philosophy',
    href: '/blogs/journal',
  },
  {
    src: '/assets/images/friends%20of%20bodista/REOME_171024_SHOT_01_050_retouch_bw.jpg.png',
    label: 'Friends of Bodista',
    sub: 'the world',
    href: '/blogs/journal',
  },
]
