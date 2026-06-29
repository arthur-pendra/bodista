'use client'

import {useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import styles from './SlidingToggle.module.css'

type SlidingToggleProps = {
  items: string[]
  defaultIndex?: number
  className?: string
  ariaLabel?: string
  onChange?: (index: number) => void
}

// Eén gedeelde slide-easing — site-breed herbruikbaar gevoel.
const SLIDE_DURATION = 0.45
const SLIDE_EASE = 'power3.out'

export const SlidingToggle = ({
  items,
  defaultIndex = 0,
  className,
  ariaLabel = 'Toggle',
  onChange,
}: SlidingToggleProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [selected, setSelected] = useState(defaultIndex)
  const selectedRef = useRef(defaultIndex)
  const reduceRef = useRef(false)

  // Schuif het pill-randje naar optie `index`. animate=false → direct plaatsen.
  const moveTo = (index: number, animate = true) => {
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

  const select = (index: number) => {
    selectedRef.current = index
    setSelected(index)
    moveTo(index)
    onChange?.(index)
  }

  useEffect(() => {
    const indicator = indicatorRef.current
    const root = rootRef.current
    if (!indicator || !root) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceRef.current = mq.matches
    const onMq = (e: MediaQueryListEvent) => {
      reduceRef.current = e.matches
    }
    mq.addEventListener('change', onMq)

    let mounted = true
    // Plaats het randje op de geselecteerde optie, zonder animatie.
    const place = () => {
      if (mounted) moveTo(selectedRef.current, false)
    }

    // Direct plaatsen, en opnieuw zodra het font geladen is — letterbreedtes
    // bepalen de pill-breedte, dus na font-load is de meting pas exact.
    place()
    document.fonts.ready.then(place)

    // Osmo schaalt de font-size mee met het scherm → hermeten bij resize.
    const ro = new ResizeObserver(place)
    ro.observe(root)

    return () => {
      mounted = false
      mq.removeEventListener('change', onMq)
      ro.disconnect()
      gsap.killTweensOf(indicator)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={ariaLabel}
      className={`${styles.toggle}${className ? ` ${className}` : ''}`}
    >
      <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className={`reset ${styles.option}`}
          aria-pressed={selected === i}
          onMouseEnter={() => select(i)}
          onFocus={() => select(i)}
          onClick={() => select(i)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
