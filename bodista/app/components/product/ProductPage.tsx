import {Suspense, useState} from 'react'
import {Await, useSearchParams} from 'react-router'
import {type MappedProductOptions} from '@shopify/hydrogen'
import type {ProductCardFragment, ProductFragment} from 'storefrontapi.generated'
import {AddToCartButton} from '~/components/AddToCartButton'
import {useAside} from '~/components/Aside'
import {ProductCard} from '~/components/shop/ProductCard'
import {ProductGallery} from './ProductGallery'
import {ProductSizeToggle} from './ProductSizeToggle'
import {PurchaseOptions} from './PurchaseOptions'
import {ProductDetails, type ProductDetailSection} from './ProductDetails'
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
  const {open} = useAside()
  const [searchParams, setSearchParams] = useSearchParams()
  const [quantity, setQuantity] = useState(1)

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
  // Detail-dropdowns uit het `custom.detail_sections` metafield (lijst van
  // metaobjects met heading + body). Leeg → ProductDetails toont placeholders.
  const detailSections: ProductDetailSection[] = (
    product.detailSections?.references?.nodes ?? []
  )
    .map((node) => ({
      heading: node?.heading?.value ?? '',
      body: node?.body?.value ?? '',
    }))
    .filter((section) => section.heading)
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
          {/* Foto-1-regio (min-height = eerste foto). De inhoud (purchaseInner)
              staat sticky-gecentreerd en scrollt mee tot het einde van foto 1. */}
          <div className={styles.purchase}>
            <div className={styles.purchaseInner}>
              {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
              <h1 className={styles.title}>{title}</h1>

              {/* Variant-keuze (bv. maat) als sliding-toggle. Eén waarde → niet tonen. */}
              {productOptions.map((option) =>
                option.optionValues.length === 1 ? null : (
                  <ProductSizeToggle key={option.name} option={option} />
                ),
              )}

              <hr className={styles.divider} />

              {descriptionHtml && (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              )}

              <PurchaseOptions
                groups={sellingPlanGroups}
                allocations={allocations}
                oneTimePrice={selectedVariant?.price}
                selectedSellingPlanId={selectedSellingPlanId}
                onSelect={setSellingPlan}
              />

              <div className={styles.buyRow}>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className="reset"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    &minus;
                  </button>
                  <span className={styles.stepperValue} aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="reset"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <AddToCartButton
                  className={styles.addToCart}
                  disabled={!available}
                  onClick={() => open('cart')}
                  lines={
                    selectedVariant
                      ? [
                          {
                            merchandiseId: selectedVariant.id,
                            quantity,
                            selectedVariant,
                            sellingPlanId: selectedSellingPlanId ?? undefined,
                          },
                        ]
                      : []
                  }
                >
                  {available ? 'add to cart' : 'sold out'}
                </AddToCartButton>
              </div>

              <p className={styles.shippingNote}>
                Complimentary shipping on all UK orders over £60
              </p>
            </div>
          </div>

          {/* Detail-dropdowns (metafield-gedreven, placeholder als leeg) —
              scrollen onder het aankoopblok, naast de lagere foto's. */}
          <ProductDetails sections={detailSections} />
        </div>
      </div>

      <CompleteYourRoutine recommendations={recommendations} />
    </div>
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

