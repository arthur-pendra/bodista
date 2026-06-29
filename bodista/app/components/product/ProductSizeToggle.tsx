import {useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router'
import {gsap} from 'gsap'
import {type MappedProductOptions} from '@shopify/hydrogen'
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types'
import {Figures} from '~/components/Figures'
import toggleStyles from '~/components/SlidingToggle.module.css'
import styles from './ProductPage.module.css'

// Zelfde slide-easing als de cart-toggle — site-breed hetzelfde gevoel.
const SLIDE_DURATION = 0.45
const SLIDE_EASE = 'power3.out'

/**
 * Maat-keuze (bv. 10ml / 30ml) als dezelfde sliding-toggle als in de cart: een
 * charcoal randje dat met GSAP naar de actieve optie schuift. Hergebruikt
 * SlidingToggle.module (randje + optie); de toevoeging t.o.v. de cart is dat
 * elke optie zélf óók een lichte pill-achtergrond krijgt. Commit op KLIK
 * (navigeert naar de variant) — niet op hover, dat zou bij elke beweging een
 * variant-switch afvuren.
 */
export function ProductSizeToggle({option}: {option: MappedProductOptions}) {
  const navigate = useNavigate()
  const values = option.optionValues

  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const itemsRef = useRef<(HTMLElement | null)[]>([])
  const reduceRef = useRef(false)

  const currentIndex = Math.max(
    0,
    values.findIndex((v) => v.selected),
  )
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

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
      if (mounted) moveTo(currentIndexRef.current, false)
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

  // Slide zodra de actieve maat verandert (na een variant-switch).
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    moveTo(currentIndex, true)
  }, [currentIndex])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={`Choose ${option.name}`}
      className={`${toggleStyles.toggle} ${styles.sizeToggle}`}
    >
      <span
        ref={indicatorRef}
        className={toggleStyles.indicator}
        aria-hidden="true"
      />
      {values.map((value, index) => {
        const {
          name,
          handle,
          variantUriQuery,
          selected,
          available,
          exists,
          isDifferentProduct,
          swatch,
        } = value
        const className = `reset ${toggleStyles.option}`

        if (isDifferentProduct) {
          return (
            <Link
              key={option.name + name}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              className={className}
              prefetch="intent"
              preventScrollReset
              replace
              to={`/products/${handle}?${variantUriQuery}`}
              style={{opacity: available ? 1 : 0.4}}
              onClick={() => moveTo(index, true)}
            >
              <OptionLabel swatch={swatch} name={name} />
            </Link>
          )
        }

        return (
          <button
            type="button"
            key={option.name + name}
            ref={(el) => {
              itemsRef.current[index] = el
            }}
            className={className}
            aria-pressed={selected}
            disabled={!exists}
            style={{opacity: available ? 1 : 0.4}}
            onClick={() => {
              moveTo(index, true)
              if (!selected) {
                void navigate(`?${variantUriQuery}`, {
                  replace: true,
                  preventScrollReset: true,
                })
              }
            }}
          >
            <OptionLabel swatch={swatch} name={name} />
          </button>
        )
      })}
    </div>
  )
}

function OptionLabel({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined
  name: string
}) {
  const image = swatch?.image?.previewImage?.url
  const color = swatch?.color

  if (image || color) {
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

  return (
    <span className="ui-nums">
      <Figures>{name}</Figures>
    </span>
  )
}
