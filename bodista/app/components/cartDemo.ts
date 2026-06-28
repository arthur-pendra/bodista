/* ==========================================================================
   DEV-ONLY cart-preview data.
   Laat de gevulde cart-drawer zien zonder echte voorraad. Open een pagina met
   ?cartdemo=1 en open dan de cart. Alleen actief in dev (import.meta.env.DEV);
   in productie wordt dit nooit gebruikt. Veilig te verwijderen zodra er echte
   producten op voorraad zijn — verwijder dan ook het kleine demo-blok in
   CartMain.tsx (gemarkeerd met "DEV cart-preview").
   ========================================================================== */
import type {CartApiQueryFragment, MenuProductsQuery} from 'storefrontapi.generated';

const DEMO_IMG = {
  __typename: 'Image' as const,
  id: 'demo-img',
  url: 'https://cdn.shopify.com/s/files/1/0920/8817/2922/files/Rectangle448_d3d9e8c8-2070-43de-8480-0ea3009bedf0.png?v=1782388158',
  altText: null,
  width: 1146,
  height: 1482,
};

const money = (amount: string) => ({
  __typename: 'MoneyV2' as const,
  amount,
  currencyCode: 'GBP' as const,
});

const demoLine = (
  id: string,
  handle: string,
  title: string,
  variant: string,
  quantity: number,
  total: string,
  compareAt?: string,
) => ({
  id,
  quantity,
  isOptimistic: false,
  attributes: [],
  cost: {
    totalAmount: money(total),
    amountPerQuantity: money(total),
    compareAtAmountPerQuantity: compareAt ? money(compareAt) : null,
  },
  merchandise: {
    id: `${id}-variant`,
    availableForSale: true,
    title: variant,
    image: DEMO_IMG,
    product: {id: `${id}-product`, handle, title, vendor: 'Bodista'},
    selectedOptions: [{name: 'Size', value: variant}],
  },
});

/** Gevulde demo-cart (3 regels, subtotaal £152 → free shipping gehaald). */
export const DEMO_CART = {
  totalQuantity: 4,
  checkoutUrl: '#',
  discountCodes: [],
  appliedGiftCards: [],
  cost: {
    subtotalAmount: money('152.00'),
    totalAmount: money('152.00'),
  },
  lines: {
    nodes: [
      demoLine('l1', 'aqua-universal-the-serum', 'The Serum', '30 ml', 1, '48.00'),
      demoLine('l2', 'universal-santal-the-face-oil', 'The Face Oil', '30 ml', 2, '108.00', '124.00'),
      demoLine('l3', 'aqua-universal-the-mist', 'Body Mist', '100 ml', 1, '38.00'),
    ],
  },
} as unknown as CartApiQueryFragment;

const demoRec = (
  id: string,
  handle: string,
  title: string,
  type: string,
  price: string,
) => ({
  id,
  title,
  handle,
  typeProduct: {value: type},
  priceRange: {minVariantPrice: money(price)},
  selectedOrFirstAvailableVariant: {id: `${id}-v`, availableForSale: true},
  featuredImage: DEMO_IMG,
});

/** "You may also like" demo-suggesties. */
export const DEMO_RECS = {
  products: {
    nodes: [
      demoRec('r1', 'the-cleanser', 'The Cleanser', 'first step', '44.00'),
      demoRec('r2', 'the-body-oil', 'The Body Oil', 'nourishing', '58.00'),
    ],
  },
} as unknown as MenuProductsQuery;
