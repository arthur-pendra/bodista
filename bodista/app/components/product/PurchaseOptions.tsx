import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types'
import type {ProductFragment} from 'storefrontapi.generated'
import {LiningMoney} from '~/components/LiningMoney'
import styles from './ProductPage.module.css'

type SellingPlanGroup = ProductFragment['sellingPlanGroups']['nodes'][number]
type Allocation = NonNullable<
  ProductFragment['selectedOrFirstAvailableVariant']
>['sellingPlanAllocations']['nodes'][number]

/**
 * Aankoopkeuze: één keer kopen óf Subscribe & save (auto-replenish). Volledig
 * gevoed door de Shopify selling plans van het product — de frequenties en
 * prijzen komen uit de echte plans/allocaties. Selectie loopt via de
 * `selling_plan` search-param (geregeld in ProductPage).
 */
export function PurchaseOptions({
  groups,
  allocations,
  oneTimePrice,
  selectedSellingPlanId,
  onSelect,
}: {
  groups: SellingPlanGroup[]
  allocations: Allocation[]
  oneTimePrice?: MoneyV2
  selectedSellingPlanId: string | null
  onSelect: (sellingPlanId: string | null) => void
}) {
  // Eerste groep = de subscription-optie (Bodista voert één auto-replenish-plan
  // per product). Geen plans → geen subscribe, dus toon niets.
  const group = groups[0]
  const plans = group?.sellingPlans.nodes ?? []
  if (!plans.length) return null

  // Map plan-id → prijsinfo uit de variant-allocaties.
  const priceByPlan = new Map(
    allocations.map((a) => [a.sellingPlan.id, a.priceAdjustments[0]]),
  )

  const isSubscribe = Boolean(selectedSellingPlanId)
  const defaultPlanId = plans[0].id

  return (
    <div className={styles.purchase}>
      {/* One-time */}
      <label
        className={`${styles.purchaseRow} ${!isSubscribe ? styles.purchaseRowActive : ''}`}
      >
        <input
          type="radio"
          name="purchase-mode"
          className={styles.radio}
          checked={!isSubscribe}
          onChange={() => onSelect(null)}
        />
        <span className={styles.purchaseLabel}>One-time purchase</span>
        {oneTimePrice && (
          <span className={styles.purchasePrice}>
            <LiningMoney data={oneTimePrice} />
          </span>
        )}
      </label>

      {/* Subscribe & save */}
      <div
        className={`${styles.purchaseRow} ${styles.purchaseRowStacked} ${
          isSubscribe ? styles.purchaseRowActive : ''
        }`}
      >
        <label className={styles.purchaseHead}>
          <input
            type="radio"
            name="purchase-mode"
            className={styles.radio}
            checked={isSubscribe}
            onChange={() => onSelect(selectedSellingPlanId ?? defaultPlanId)}
          />
          <span className={styles.purchaseLabel}>
            Subscribe &amp; save
            <span className={styles.purchaseNote}>
              Auto-replenish · skip or cancel anytime
            </span>
          </span>
        </label>

        {isSubscribe && (
          <ul className={styles.frequencies}>
            {plans.map((plan) => {
              const adj = priceByPlan.get(plan.id)
              const price = adj?.price
              const compareAt = adj?.compareAtPrice
              const save = savingsPercent(price, compareAt)
              const checked = plan.id === selectedSellingPlanId
              return (
                <li key={plan.id}>
                  <label
                    className={`${styles.frequency} ${
                      checked ? styles.frequencyActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      className={styles.radio}
                      checked={checked}
                      onChange={() => onSelect(plan.id)}
                    />
                    <span className={styles.frequencyName}>{plan.name}</span>
                    {price && (
                      <span className={styles.frequencyPrice}>
                        <LiningMoney data={price} />
                        {save ? (
                          <span className={styles.save}>Save {save}%</span>
                        ) : null}
                      </span>
                    )}
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function savingsPercent(price?: MoneyV2, compareAt?: MoneyV2): number | null {
  if (!price || !compareAt) return null
  const p = Number(price.amount)
  const c = Number(compareAt.amount)
  if (!c || c <= p) return null
  return Math.round((1 - p / c) * 100)
}
