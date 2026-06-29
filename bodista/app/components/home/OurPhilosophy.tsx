'use client'

import {useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {SlidingToggle} from '../SlidingToggle'
import styles from './OurPhilosophy.module.css'

const TAGS = [
  {
    label: 'Sustainability',
    copy: 'We formulate with what the earth already offers, keeping our actives minimal and our sourcing responsible. Every component is chosen to last, and our packaging is built to be refilled rather than thrown away and replaced.',
  },
  {
    label: 'philanthropy',
    copy: 'A share of everything we make returns to the communities that grow our ingredients. Those contributions fund clean water, schooling and fair work in the places where our raw materials begin, long before they reach your skin.',
  },
  {
    label: 'mission',
    copy: 'Given the right elements and nutrition, the skin formulates all the actives it needs, at the levels and times the body requires. Our role is simply to provide those elements, and then to step back and let the skin do the rest.',
  },
]

export function OurPhilosophy() {
  const [selected, setSelected] = useState(0)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const firstRun = useRef(true)

  // Subtiele fade wanneer de copy wisselt — eerste render slaan we over.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const el = paragraphRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tween = gsap.fromTo(
      el,
      {opacity: 0},
      {opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: true},
    )

    return () => {
      tween.kill()
    }
  }, [selected])

  return (
    <section className={styles.philosophy}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Our philosophy</span>

        <hr className={styles.divider} />

        <div className={styles.text}>
          <p ref={paragraphRef} className={styles.paragraph}>
            {TAGS[selected].copy}
          </p>

          <SlidingToggle
            items={TAGS.map((tag) => tag.label)}
            className={styles.tags}
            ariaLabel="Our philosophy focus"
            onChange={setSelected}
          />
        </div>

        <div className={styles.media}>
          <img
            className={styles.portrait}
            src="/assets/images/ourphilosophy.png"
            alt=""
          />
        </div>
      </div>
    </section>
  )
}
