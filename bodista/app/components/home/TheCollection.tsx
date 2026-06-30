import {useCallback, useEffect, useRef, useState} from 'react'
import {Link} from 'react-router'
import {Image} from '@shopify/hydrogen'
import {gsap} from 'gsap'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'
import type {RecommendedProductFragment} from 'storefrontapi.generated'
import {Figures} from '~/components/Figures'
import {LiningMoney} from '~/components/LiningMoney'
import {CollectionFilter} from '~/components/shop/CollectionFilter'
import styles from './TheCollection.module.css'

gsap.registerPlugin(Draggable, InertiaPlugin)

// Op de home stuurt de filter niet client-side, maar linkt naar de bijbehorende
// collectie op de shop-pagina (All → de volledige Shop All).
const buildHref = (handle: string | null) =>
  handle === null ? '/collections/all' : `/collections/all?collection=${handle}`

export function TheCollection({
  products,
}: {
  products: RecommendedProductFragment[]
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const dragRef = useRef<Draggable | null>(null)
  // step = breedte van één kaart + gutter; minX = meest-linkse (negatieve) x.
  const metrics = useRef({step: 0, minX: 0})
  const reduceRef = useRef(false)
  // True zodra er écht gesleept is → onderdrukt de klik op de kaart-link erna.
  const moved = useRef(false)

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const x = Number(gsap.getProperty(track, 'x')) || 0
    setCanPrev(x < -1)
    setCanNext(x > metrics.current.minX + 1)
  }, [])

  // Pijl-navigatie: snap naar het vorige/volgende grid-punt (één kaart per stap).
  const move = useCallback(
    (dir: 'prev' | 'next') => {
      const track = trackRef.current
      const {step, minX} = metrics.current
      if (!track || !step) return
      const current = Number(gsap.getProperty(track, 'x')) || 0
      const sign = dir === 'next' ? -1 : 1
      const target = gsap.utils.clamp(
        minX,
        0,
        Math.round(current / step) * step + sign * step,
      )
      gsap.to(track, {
        x: target,
        duration: reduceRef.current ? 0 : 0.5,
        ease: 'power3.out',
        onUpdate: () => dragRef.current?.update(),
        onComplete: updateArrows,
      })
    },
    [updateArrows],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    reduceRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // (Her)bouw: meet de kaart-/track-breedtes, begrens de drag hard op de
    // randen (edgeResistance 1 = geen rubber-band) en snap per kaart op de grid.
    const build = () => {
      const cards = track.children
      if (!cards.length) return
      const cardWidth = (cards[0] as HTMLElement).offsetWidth
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const step = cardWidth + gap
      const cs = getComputedStyle(viewport)
      const padX =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)
      const visible = viewport.clientWidth - padX
      const minX = Math.min(0, visible - track.scrollWidth)
      metrics.current = {step, minX}

      // Huidige positie binnen de nieuwe grenzen houden (bv. na resize).
      const x = gsap.utils.clamp(minX, 0, Number(gsap.getProperty(track, 'x')) || 0)
      gsap.set(track, {x})

      dragRef.current?.kill()
      dragRef.current = Draggable.create(track, {
        type: 'x',
        bounds: {minX, maxX: 0},
        edgeResistance: 1,
        inertia: !reduceRef.current,
        dragClickables: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
        minimumMovement: 6,
        snap: {
          x: (value: number) =>
            gsap.utils.clamp(minX, 0, Math.round(value / step) * step),
        },
        onPress: () => {
          moved.current = false
        },
        onDrag: () => {
          moved.current = true
          updateArrows()
        },
        onThrowUpdate: updateArrows,
        onThrowComplete: updateArrows,
        onDragEnd: updateArrows,
      })[0]

      updateArrows()
    }

    build()

    // Osmo schaalt de breedtes mee → herbouw (debounced) bij resize.
    let timer: ReturnType<typeof setTimeout>
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(build, 150)
    })
    ro.observe(viewport)

    return () => {
      clearTimeout(timer)
      ro.disconnect()
      dragRef.current?.kill()
      dragRef.current = null
    }
  }, [products.length, updateArrows])

  // Onderdruk de kaart-link-klik direct na een sleep.
  const onClickCapture = (e: React.MouseEvent<HTMLUListElement>) => {
    if (moved.current) {
      e.preventDefault()
      e.stopPropagation()
      moved.current = false
    }
  }

  if (!products.length) return null

  const hasSlider = canPrev || canNext

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

          <div className={styles.controls}>
            <CollectionFilter active={null} buildHref={buildHref} />
            {hasSlider && (
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={`reset ${styles.arrow}`}
                  aria-label="Previous products"
                  disabled={!canPrev}
                  onClick={() => move('prev')}
                >
                  <Chevron direction="left" />
                </button>
                <button
                  type="button"
                  className={`reset ${styles.arrow}`}
                  aria-label="Next products"
                  disabled={!canNext}
                  onClick={() => move('next')}
                >
                  <Chevron direction="right" />
                </button>
              </div>
            )}
          </div>
        </header>

        <hr className={styles.divider} />
      </div>

      {/* Full-bleed: de slider loopt door tot de schermrand zodat kaarten daar
          uit beeld glijden i.p.v. bij de content-marge te worden afgeknipt. */}
      <div className={styles.viewport} ref={viewportRef}>
        <ul
          ref={trackRef}
          className={styles.track}
          onClickCapture={onClickCapture}
        >
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

                  <span className={styles.hoverZone} aria-hidden="true" />

                  <span className={styles.quickAdd} aria-label="Quick add">
                    <span className={`${styles.quickAddSize} ui-nums`}>
                      <Figures>30ML</Figures>
                    </span>
                    <span className={styles.quickAddDivider} aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          className={styles.quickAddBarH}
                          d="M1 8h14"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 1v14"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className={`${styles.quickAddSize} ui-nums`}>
                      <Figures>60ML</Figures>
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
                    <LiningMoney data={product.priceRange.minVariantPrice} />
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

const Chevron = ({direction}: {direction: 'left' | 'right'}) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={direction === 'left' ? {transform: 'scaleX(-1)'} : undefined}
  >
    <path
      d="M6 3.5L10.5 8L6 12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
