import {Link} from 'react-router'
import {Image, Money} from '@shopify/hydrogen'
import type {RecommendedProductFragment} from 'storefrontapi.generated'
import styles from './TheCollection.module.css'

const FILTERS = ['oils', 'serums', 'bodymist', 'cloths']

export function TheCollection({
  products,
}: {
  products: RecommendedProductFragment[]
}) {
  if (!products.length) return null

  return (
    <section className={styles.collection}>
      <div className={`layout-grid ${styles.inner}`}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <span className={styles.label}>The Collection</span>
            <h2 className={styles.heading}>
              We provide the elements.
              <br />
              Your skin is the formulator.
            </h2>
          </div>
          <div className={styles.filters}>
            {FILTERS.map((filter) => (
              <button key={filter} type="button" className={styles.filter}>
                {filter}
              </button>
            ))}
            <button type="button" className={styles.filterToggle}>
              <span className={styles.filterPlus}>+</span>
              Filters
            </button>
          </div>
        </header>

        <hr className={styles.divider} />

        <ul className={styles.grid}>
          {products.map((product) => (
            <li key={product.id} className={styles.card}>
              <Link
                to={`/products/${product.handle}`}
                className={styles.cardLink}
              >
                <div className={styles.media}>
                  {product.featuredImage ? (
                    <Image
                      data={product.featuredImage}
                      aspectRatio="348/465"
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}

                  <span className={styles.caption}>
                    Seal · Nourish · Regenerate
                  </span>

                  <span
                    className={`product-pill product-pill--gold ${styles.addToCart}`}
                  >
                    {product.featuredImage ? (
                      <Image
                        data={product.featuredImage}
                        aspectRatio="1/1"
                        width={30}
                        className="product-pill__thumb"
                      />
                    ) : (
                      <span className="product-pill__thumb" />
                    )}
                    <span className="product-pill__label">add to cart</span>
                    <span className="product-pill__plus" aria-hidden="true">
                      <svg
                        className="product-pill__icon"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 1v14M1 8h14"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </span>
                </div>

                <div className={styles.meta}>
                  <div className={styles.titleGroup}>
                    {product.typeProduct?.value && (
                      <span className={styles.eyebrow}>
                        {product.typeProduct.value}
                      </span>
                    )}
                    <h3 className={styles.name}>{product.title}</h3>
                  </div>
                  <div className={styles.price}>
                    <Money data={product.priceRange.minVariantPrice} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
