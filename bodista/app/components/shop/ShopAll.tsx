import {Link} from 'react-router'
import {Image} from '@shopify/hydrogen'
import type {ShopAllProductFragment} from 'storefrontapi.generated'
import {LiningMoney} from '~/components/LiningMoney'
import styles from './ShopAll.module.css'

// Sidebar-filters (voorlopig visueel; nog geen filtering gekoppeld).
const FILTERS = ['Body Oils', 'Face Oils', 'Sets']

// Uitklapbare groepen (openen op hover). Opties afgestemd op ons assortiment:
// de productvormen die we voeren en de kerningrediënten van de oils/serums.
const FILTER_GROUPS = [
  {label: 'Type', options: ['Oils', 'Serums', 'Mists', 'Parfums']},
  {
    label: 'Ingredients',
    options: ['Sandalwood', 'Jojoba', 'Squalane', 'Rosehip', 'Bergamot'],
  },
]

// Categorieën zoals in het design. De eerste sectie toont de producten die we
// al hebben; de rest is nog niet ingericht → grijze placeholder-blokken die we
// later vervangen door echte collections.
const PLACEHOLDER_CATEGORIES = ['Body', 'Sets', 'Accessories']
const PLACEHOLDERS_PER_CATEGORY = 3

export function ShopAll({products}: {products: ShopAllProductFragment[]}) {
  return (
    <section className={styles.shop}>
      <div className={`layout-grid ${styles.inner}`}>
        <div className={styles.sidebar}>
          <div className={styles.filterBlock}>
            <span className={styles.filtersLabel}>Filters</span>
            <ul className={styles.filterList}>
              {FILTERS.map((filter) => (
                <li key={filter}>
                  <button type="button" className={styles.filterItem}>
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {FILTER_GROUPS.map((group) => (
            <div key={group.label} className={styles.group}>
              <button type="button" className={styles.groupToggle}>
                {group.label}
              </button>
              <ul className={styles.groupList}>
                {group.options.map((option) => (
                  <li key={option}>
                    <button type="button" className={styles.groupItem}>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {/* Top-sectie: de producten die we al hebben (zonder kop). De
              onzichtbare spacer houdt exact de hoogte van de "Filters"-label
              aan, zodat deze toplijn op één lijn ligt met die in de sidebar. */}
          <div className={styles.category}>
            <header className={styles.categoryHeaderTop}>
              <span className={styles.headSpacer} aria-hidden="true">
                Filters
              </span>
              <hr className={styles.rule} />
            </header>
            <ul className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          </div>

          {/* Nog niet ingerichte categorieën → grijze placeholders. */}
          {PLACEHOLDER_CATEGORIES.map((title) => (
            <div key={title} className={styles.category}>
              <header className={styles.categoryHeader}>
                <h2 className={styles.heading}>{title}</h2>
                <hr className={styles.rule} />
              </header>
              <ul className={styles.grid}>
                {Array.from({length: PLACEHOLDERS_PER_CATEGORY}).map((_, i) => (
                  <li key={i} className={`${styles.card} ${styles.placeholder}`}>
                    <div className={styles.media} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({product}: {product: ShopAllProductFragment}) {
  return (
    <li className={styles.card}>
      <Link to={`/products/${product.handle}`} className={styles.cardLink}>
        <div className={styles.media}>
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              aspectRatio="348/420"
              sizes="(min-width: 768px) 25vw, 50vw"
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
