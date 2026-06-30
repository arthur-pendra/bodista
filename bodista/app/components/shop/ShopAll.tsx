import {useSearchParams} from 'react-router'
import type {ShopAllProductFragment} from 'storefrontapi.generated'
import {ProductCard} from './ProductCard'
import {CollectionFilter} from './CollectionFilter'
import styles from './ShopAll.module.css'

export function ShopAll({products}: {products: ShopAllProductFragment[]}) {
  const [params] = useSearchParams()
  const selCollection = params.get('collection')

  // Bouw een href die alleen de collection-param zet/wist.
  const buildHref = (handle: string | null) => {
    const next = new URLSearchParams(params)
    if (handle === null) next.delete('collection')
    else next.set('collection', handle)
    const qs = next.toString()
    return `/collections/all${qs ? `?${qs}` : ''}`
  }

  const visible = selCollection
    ? products.filter((product) =>
        product.collections.nodes.some((c) => c.handle === selCollection),
      )
    : products

  return (
    <section className={styles.shop}>
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
          <CollectionFilter active={selCollection} buildHref={buildHref} />
        </header>

        <hr className={styles.rule} />

        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No products match this filter.</p>
        )}
      </div>
    </section>
  )
}
