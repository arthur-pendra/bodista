/**
 * Placeholder-data voor de mega-menu's (Shop + Explore).
 * Nu nog statisch; later te vervangen door live Shopify-data
 * (collecties/producten via de storefront-queries).
 *
 * "Alles wat in de menu's zit, komt terug op de site" — de hrefs wijzen
 * dus naar bestaande routes/secties. Pas labels/links hier centraal aan.
 */

export type ShopTab = {
  key: string
  label: string
  href: string
}

// De echte collecties (zie Shopify). Tabs linken rechtstreeks naar de
// collectie-pagina's; de uitgelichte product-cards rechts komen uit de
// live menuProducts-query.
export const SHOP_TABS: ShopTab[] = [
  {key: 'the-facial', label: 'The Facial', href: '/collections/all?collection=the-facial'},
  {key: 'scents', label: 'Scents', href: '/collections/all?collection=scents'},
  {key: 'body', label: 'Body', href: '/collections/all?collection=body'},
  {key: 'sets', label: 'Sets', href: '/collections/all?collection=sets'},
  {key: 'accessories', label: 'Accessories', href: '/collections/all?collection=accessories'},
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
      {label: 'Face', href: '/collections/all?collection=the-facial'},
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
