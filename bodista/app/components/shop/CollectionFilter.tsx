import {useEffect, useRef} from 'react'
import {Link} from 'react-router'
import {gsap} from 'gsap'
import toggleStyles from '~/components/SlidingToggle.module.css'
import styles from './CollectionFilter.module.css'

// De echte collecties (zie Shopify) — gedeelde bron voor de shop én de home.
export const COLLECTIONS = [
  {label: 'The Facial', handle: 'the-facial'},
  {label: 'Scents', handle: 'scents'},
  {label: 'Sets', handle: 'sets'},
  {label: 'Accessories', handle: 'accessories'},
]

// "All" + de collecties → de opties van de toggle. handle null = geen filter.
export const FILTERS: {label: string; handle: string | null}[] = [
  {label: 'All', handle: null},
  ...COLLECTIONS,
]

// Gedeelde slide-easing — gelijk aan SlidingToggle (zelfde gevoel site-breed).
const SLIDE_DURATION = 0.45
const SLIDE_EASE = 'power3.out'

/**
 * Collectie-filter als kleine sliding-pill toggle in de Our Philosophy-stijl:
 * lichte warm-witte pillen met een hairline randje dat met GSAP meeschuift.
 * Commit op KLIK (Link-navigatie) — hover zou anders bij elke beweging
 * navigeren. Het randje volgt de actieve filter en schuift mee onder de cursor;
 * verlaat je de rij dan keert het terug.
 *
 * `active`   = de huidige collectie-handle (null = "All").
 * `buildHref` = bouwt de bestemming per optie (shop = URL-param, home = link
 *               naar de shop-collectie).
 */
export function CollectionFilter({
  active,
  buildHref,
}: {
  active: string | null
  buildHref: (handle: string | null) => string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const reduceRef = useRef(false)

  const activeIndex = Math.max(
    0,
    FILTERS.findIndex((filter) => filter.handle === active),
  )
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

  // Mount: plaats het randje (zonder animatie), opnieuw na font-load en bij
  // resize — Osmo schaalt de pill-breedtes mee.
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

  // Slide zodra de actieve filter verandert (na een klik/navigatie).
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    moveTo(activeIndex, true)
  }, [activeIndex])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Filter by collection"
      className={`${toggleStyles.toggle} ${styles.filter}`}
      // Verlaat de rij → randje terug naar de actieve filter.
      onMouseLeave={() => moveTo(activeIndexRef.current, true)}
    >
      <span
        ref={indicatorRef}
        className={toggleStyles.indicator}
        aria-hidden="true"
      />
      {FILTERS.map((filter, index) => {
        const isActive = index === activeIndex
        return (
          <Link
            key={filter.handle ?? 'all'}
            to={buildHref(filter.handle)}
            prefetch="intent"
            ref={(el) => {
              itemsRef.current[index] = el
            }}
            className={`reset ${toggleStyles.option}`}
            aria-current={isActive ? 'true' : undefined}
            // Randje schuift mee onder de cursor; de Link commit op klik en het
            // [activeIndex]-effect corrigeert daarna naar de werkelijke filter.
            onMouseEnter={() => moveTo(index, true)}
          >
            {filter.label}
          </Link>
        )
      })}
    </div>
  )
}
