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

                  <span className={styles.addToCart}>
                    {product.featuredImage ? (
                      <Image
                        data={product.featuredImage}
                        aspectRatio="1/1"
                        width={30}
                        className={styles.addThumb}
                      />
                    ) : (
                      <span className={styles.addThumb} />
                    )}
                    <span className={styles.addLabel}>add to cart</span>
                    <span className={styles.addPlus} aria-hidden="true">
                      +
                    </span>
                  </span>
                </div>

                <div className={styles.meta}>
                  <h3 className={styles.name}>{product.title}</h3>
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
