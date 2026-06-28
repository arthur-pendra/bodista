import type {Route} from './+types/($locale).collections.all';
import {useLoaderData} from 'react-router';
import {ShopAll} from '~/components/shop/ShopAll';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Bodista | Shop All'}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);

  return {...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [{products}] = await Promise.all([
    storefront.query(SHOP_ALL_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {products: products.nodes};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return <ShopAll products={products} />;
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const SHOP_ALL_QUERY = `#graphql
  fragment ShopAllProduct on Product {
    id
    title
    handle
    typeProduct: metafield(namespace: "custom", key: "type_product") {
      value
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query ShopAll($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 24, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ShopAllProduct
      }
    }
  }
` as const;
