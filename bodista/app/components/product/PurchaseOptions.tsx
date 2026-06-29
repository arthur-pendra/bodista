import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types'
import type {ProductFragment} from 'storefrontapi.generated'
import {LiningMoney} from '~/components/LiningMoney'
import toggleStyles from '~/components/SlidingToggle.module.css'
import styles from './ProductPage.module.css'

type SellingPlanGroup = ProductFragment['sellingPlanGroups']['nodes'][number]
type Allocation = NonNullable<
  ProductFragment['selectedOrFirstAvailableVariant']
>['sellingPlanAllocations']['nodes'][number]

// Zelfde slide-easing als de cart/maat-toggle — site-breed hetzelfde gevoel.
const SLIDE_DURATION = 0.45
const SLIDE_EASE = 'power3.out'

/**
 * Aankoopkeuze: "buy once" óf "subscribe" als dezelfde sliding-toggle als de
 * maat-keuze — twee lichte pillen met een charcoal randje dat met GSAP naar de
 * actieve keuze schuift. Commit op klik (zet/wist de `selling_plan`-param via
 * onSelect). Subscribe pakt het eerste auto-replenish-plan van het product.
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
  // Eerste groep/plan = de subscribe-optie. Geen plans → geen keuze tonen.
  const plan = groups[0]?.sellingPlans.nodes[0]

  const subscribeAdj = allocations.find(
    (a) => a.sellingPlan.id === plan?.id,
  )?.priceAdjustments[0]
  const isSubscribe = Boolean(selectedSellingPlanId)
  const activeIndex = isSubscribe ? 1 : 0

  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const reduceRef = useRef(false)

  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

  // Schuif het randje naar optie `index`. animate=false → direct plaatsen.
  const moveTo = (index: number, animate: boolean) => {
    const el = itemsRef.current[index]
    const indicator = indicatorRef.current
    if (!el || !indicator) return
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: animate && !reduceRef.current ? SLIDE_DURATION : 0,
      ease: SLIDE_EASE,
      overwrite: true,
    })
  }

  // Mount: plaats het randje (zonder animatie), opnieuw na font-load en resize.
  useEffect(() => {
    const root = rootRef.current
    const indicator = indicatorRef.current
    if (!root || !indicator) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceRef.current = mq.matches
    const onMq = (event: MediaQueryListEvent) => {
      reduceRef.current = event.matches
    }
    mq.addEventListener('change', onMq)

    let mounted = true
    const place = () => {
      if (mounted) moveTo(activeIndexRef.current, false)
    }
    place()
    void document.fonts.ready.then(place)

    const ro = new ResizeObserver(place)
    ro.observe(root)

    return () => {
      mounted = false
      mq.removeEventListener('change', onMq)
      ro.disconnect()
      gsap.killTweensOf(indicator)
    }
  }, [])

  // Slide zodra de keuze verandert (ook bij externe wijziging van de param).
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    moveTo(activeIndex, true)
  }, [activeIndex])

  if (!plan) return null

  return (
    <div className={styles.plan}>
      <p className={styles.planLabel}>Choose your plan</p>
      <hr className={styles.divider} />

      <div
        ref={rootRef}
        role="group"
        aria-label="Choose your plan"
        className={`${toggleStyles.toggle} ${styles.planToggle}`}
      >
        <span
          ref={indicatorRef}
          className={toggleStyles.indicator}
          aria-hidden="true"
        />

        <button
          type="button"
          ref={(el) => {
            itemsRef.current[0] = el
          }}
          className={`reset ${toggleStyles.option}`}
          aria-pressed={!isSubscribe}
          onClick={() => {
            moveTo(0, true)
            onSelect(null)
          }}
        >
          <span className={styles.planName}>buy once</span>
          {oneTimePrice && (
            <span className={styles.planPrice}>
              <LiningMoney data={oneTimePrice} />
            </span>
          )}
        </button>

        <button
          type="button"
          ref={(el) => {
            itemsRef.current[1] = el
          }}
          className={`reset ${toggleStyles.option}`}
          aria-pressed={isSubscribe}
          onClick={() => {
            moveTo(1, true)
            onSelect(plan.id)
          }}
        >
          <span className={styles.planName}>subscribe</span>
          {subscribeAdj?.price && (
            <span className={styles.planPrice}>
              {subscribeAdj.compareAtPrice && (
                <span className={styles.planCompareAt}>
                  <LiningMoney data={subscribeAdj.compareAtPrice} />
                </span>
              )}
              <LiningMoney data={subscribeAdj.price} />
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
