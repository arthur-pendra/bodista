import {Link, useSearchParams} from 'react-router'
import type {ShopAllProductFragment} from 'storefrontapi.generated'
import {ProductCard} from './ProductCard'
import styles from './ShopAll.module.css'

// De echte collecties (zie Shopify) — als filters in de sidebar.
const COLLECTIONS = [
  {label: 'The Facial', handle: 'the-facial'},
  {label: 'Scents', handle: 'scents'},
  {label: 'Body', handle: 'body'},
  {label: 'Sets', handle: 'sets'},
  {label: 'Accessories', handle: 'accessories'},
]

function parseList(value?: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : []
  } catch {
    return []
  }
}

export function ShopAll({products}: {products: ShopAllProductFragment[]}) {
  const [params] = useSearchParams()

  const selCollection = params.get('collection')
  const selType = params.get('type')
  const selIngredient = params.get('ingredient')

  // Filter-opties afgeleid uit de echte producten → blijven vanzelf in sync.
  const types = [
    ...new Set(products.map((p) => p.productType).filter(Boolean)),
  ].sort() as string[]
  const ingredients = [
    ...new Set(products.flatMap((p) => parseList(p.keyIngredients?.value))),
  ].sort()

  // Bouw een href die de bestaande filters behoudt en één param zet/wist.
  const buildHref = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    return `/collections/all${qs ? `?${qs}` : ''}`
  }

  const visible = products.filter((product) => {
    if (
      selCollection &&
      !product.collections.nodes.some((c) => c.handle === selCollection)
    ) {
      return false
    }
    if (selType && product.productType !== selType) return false
    if (selIngredient && !parseList(product.keyIngredients?.value).includes(selIngredient)) {
      return false
    }
    return true
  })

  const activeCollection = COLLECTIONS.find((c) => c.handle === selCollection)
  const heading = activeCollection ? activeCollection.label : 'All products'

  return (
    <section className={styles.shop}>
      <div className={`layout-grid ${styles.inner}`}>
        <div className={styles.sidebar}>
          <div className={styles.filterBlock}>
            <span className={styles.filtersLabel}>Collections</span>
            <ul className={styles.filterList}>
              <li>
                <Link
                  prefetch="intent"
                  to={buildHref('collection', null)}
                  className={`${styles.filterItem} ${!selCollection ? styles.filterItemActive : ''}`}
                >
                  All
                </Link>
              </li>
              {COLLECTIONS.map((collection) => {
                const active = collection.handle === selCollection
                return (
                  <li key={collection.handle}>
                    <Link
                      prefetch="intent"
                      to={buildHref('collection', active ? null : collection.handle)}
                      className={`${styles.filterItem} ${active ? styles.filterItemActive : ''}`}
                    >
                      {collection.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Type-filter (afgeleid van productType). */}
          <div className={styles.group}>
            <span
              className={`${styles.groupToggle} ${selType ? styles.groupToggleActive : ''}`}
            >
              Type
            </span>
            <ul className={styles.groupList}>
              {types.map((type) => {
                const active = type === selType
                return (
                  <li key={type}>
                    <Link
                      prefetch="intent"
                      to={buildHref('type', active ? null : type)}
                      className={`${styles.groupItem} ${active ? styles.groupItemActive : ''}`}
                    >
                      {type}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Ingredient-filter (afgeleid van custom.key_ingredients). */}
          <div className={styles.group}>
            <span
              className={`${styles.groupToggle} ${selIngredient ? styles.groupToggleActive : ''}`}
            >
              Ingredients
            </span>
            <ul className={styles.groupList}>
              {ingredients.map((ingredient) => {
                const active = ingredient === selIngredient
                return (
                  <li key={ingredient}>
                    <Link
                      prefetch="intent"
                      to={buildHref('ingredient', active ? null : ingredient)}
                      className={`${styles.groupItem} ${active ? styles.groupItemActive : ''}`}
                    >
                      {ingredient}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.category}>
            <header className={styles.categoryHeader}>
              <h2 className={styles.heading}>{heading}</h2>
              <hr className={styles.rule} />
            </header>

            {visible.length > 0 ? (
              <ul className={styles.grid}>
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No products match these filters.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
