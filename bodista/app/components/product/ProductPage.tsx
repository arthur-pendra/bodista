import {Suspense} from 'react'
import {Await, Link, useNavigate, useSearchParams} from 'react-router'
import {type MappedProductOptions} from '@shopify/hydrogen'
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types'
import type {ProductCardFragment, ProductFragment} from 'storefrontapi.generated'
import {AddToCartButton} from '~/components/AddToCartButton'
import {useAside} from '~/components/Aside'
import {LiningMoney} from '~/components/LiningMoney'
import {ProductCard} from '~/components/shop/ProductCard'
import {ProductGallery} from './ProductGallery'
import {PurchaseOptions} from './PurchaseOptions'
import styles from './ProductPage.module.css'

export function ProductPage({
  product,
  selectedVariant,
  productOptions,
  recommendations,
}: {
  product: ProductFragment
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant']
  productOptions: MappedProductOptions[]
  recommendations: Promise<ProductCardFragment[]>
}) {
  const navigate = useNavigate()
  const {open} = useAside()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedSellingPlanId = searchParams.get('selling_plan')

  const setSellingPlan = (sellingPlanId: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (sellingPlanId) next.set('selling_plan', sellingPlanId)
        else next.delete('selling_plan')
        return next
      },
      {preventScrollReset: true, replace: true},
    )
  }

  const {title, descriptionHtml} = product
  const eyebrow = product.typeProduct?.value
  const ingredients = product.ingredients?.value
  const howToUse = product.howToUse?.value
  const sellingPlanGroups = product.sellingPlanGroups?.nodes ?? []
  const allocations = selectedVariant?.sellingPlanAllocations?.nodes ?? []
  const available = Boolean(selectedVariant?.availableForSale)

  return (
    <div className={styles.page}>
      <div className={`layout-grid ${styles.inner}`}>
        <div className={styles.galleryCol}>
          <ProductGallery
            images={product.images?.nodes ?? []}
            selectedVariantImage={selectedVariant?.image}
            title={title}
          />
        </div>

        <div className={styles.info}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.price}>
            {selectedVariant?.price && (
              <LiningMoney data={selectedVariant.price} />
            )}
            {selectedVariant?.compareAtPrice && (
              <span className={styles.compareAt}>
                <LiningMoney data={selectedVariant.compareAtPrice} />
              </span>
            )}
          </div>

          {/* Variant-keuze (bv. maat). Eén waarde → niet tonen. */}
          {productOptions.map((option) => {
            if (option.optionValues.length === 1) return null
            return (
              <div className={styles.option} key={option.name}>
                <span className={styles.optionName}>{option.name}</span>
                <div className={styles.optionValues}>
                  {option.optionValues.map((value) => {
                    const {
                      name,
                      handle,
                      variantUriQuery,
                      selected,
                      available: valueAvailable,
                      exists,
                      isDifferentProduct,
                      swatch,
                    } = value

                    const className = `${styles.optionValue} ${
                      selected ? styles.optionValueSelected : ''
                    }`

                    if (isDifferentProduct) {
                      return (
                        <Link
                          key={option.name + name}
                          className={className}
                          prefetch="intent"
                          preventScrollReset
                          replace
                          to={`/products/${handle}?${variantUriQuery}`}
                          style={{opacity: valueAvailable ? 1 : 0.4}}
                        >
                          <ProductOptionSwatch swatch={swatch} name={name} />
                        </Link>
                      )
                    }

                    return (
                      <button
                        type="button"
                        key={option.name + name}
                        className={`reset ${className}`}
                        disabled={!exists}
                        style={{opacity: valueAvailable ? 1 : 0.4}}
                        onClick={() => {
                          if (!selected) {
                            void navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            })
                          }
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <PurchaseOptions
            groups={sellingPlanGroups}
            allocations={allocations}
            oneTimePrice={selectedVariant?.price}
            selectedSellingPlanId={selectedSellingPlanId}
            onSelect={setSellingPlan}
          />

          <AddToCartButton
            className={styles.addToCart}
            disabled={!available}
            onClick={() => open('cart')}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                      sellingPlanId: selectedSellingPlanId ?? undefined,
                    },
                  ]
                : []
            }
          >
            {available ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>

          <div className={styles.accordions}>
            {descriptionHtml && (
              <Accordion title="Description" defaultOpen>
                <div
                  className={styles.richText}
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </Accordion>
            )}
            {ingredients && (
              <Accordion title="Ingredients">
                <p className={styles.plainText}>{ingredients}</p>
              </Accordion>
            )}
            {howToUse && (
              <Accordion title="How to use">
                <p className={styles.plainText}>{howToUse}</p>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      <CompleteYourRoutine recommendations={recommendations} />
    </div>
  )
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details className={styles.accordion} open={defaultOpen}>
      <summary className={styles.accordionSummary}>
        <span>{title}</span>
        <span className={styles.accordionIcon} aria-hidden="true" />
      </summary>
      <div className={styles.accordionBody}>{children}</div>
    </details>
  )
}

function CompleteYourRoutine({
  recommendations,
}: {
  recommendations: Promise<ProductCardFragment[]>
}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={recommendations} errorElement={null}>
        {(products) => {
          if (!products?.length) return null
          return (
            <section className={styles.routine}>
              <header className={styles.routineHeader}>
                <h2 className={styles.routineHeading}>Complete your routine</h2>
                <hr className={styles.rule} />
              </header>
              <ul className={styles.routineGrid}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ul>
            </section>
          )
        }}
      </Await>
    </Suspense>
  )
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined
  name: string
}) {
  const image = swatch?.image?.previewImage?.url
  const color = swatch?.color

  if (!image && !color) return name

  return (
    <span
      aria-label={name}
      className={styles.swatch}
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} />}
    </span>
  )
}
