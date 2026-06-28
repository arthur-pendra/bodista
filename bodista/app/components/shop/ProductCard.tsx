import {Link} from 'react-router'
import {Image} from '@shopify/hydrogen'
import type {ProductCardFragment} from 'storefrontapi.generated'
import {LiningMoney} from '~/components/LiningMoney'
import styles from './ProductCard.module.css'

/**
 * Herbruikbare product-card (Shop All grid én "Complete your routine" op de
 * PDP). Visueel = de bekende card: warme media-box met vaste aspect-ratio,
 * gouden eyebrow (type) en prijs in UI-cijfers. Eén bron → geen drift tussen
 * de pagina's.
 */
export function ProductCard({
  product,
  sizes = '(min-width: 768px) 25vw, 50vw',
}: {
  product: ProductCardFragment
  sizes?: string
}) {
  return (
    <li className={styles.card}>
      <Link to={`/products/${product.handle}`} className={styles.cardLink}>
        <div className={styles.media}>
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              aspectRatio="348/420"
              sizes={sizes}
              className={styles.image}
            />
          ) : (
            <div className={styles.image} />
          )}
        </div>

        <div className={styles.meta}>
          <div className={styles.titleGroup}>
            {product.typeProduct?.value && (
              <span className={styles.eyebrow}>{product.typeProduct.value}</span>
            )}
            <h3 className={styles.name}>{product.title}</h3>
          </div>
          <div className={styles.price}>
            <LiningMoney data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </li>
  )
}

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
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
` as const
