import {useState} from 'react'
import styles from './WhatsInside.module.css'

const INGREDIENTS = [
  {
    name: 'Organic Jojoba Oil',
    text: "A liquid wax almost identical to the skin's own sebum. It absorbs without weight, balancing oil and sealing in moisture so the barrier stays soft, calm and protected.",
  },
  {
    name: 'Organic Moringa Oil',
    text: 'Pressed from the seeds of the miracle tree. Rich in antioxidants and behenic acid, it shields against pollution and restores a clear, even, well-nourished surface.',
  },
  {
    name: 'Organic Prickly Pair Oil',
    text: 'Cold-pressed from desert cactus seeds, rare and slow to yield. Exceptionally high in vitamin E and linoleic acid, it brightens, firms and revives skin that has lost its glow.',
  },
  {
    name: 'Indian Sandalwood Oil',
    text: 'Steam-distilled from sacred heartwood. Quietly anti-inflammatory and grounding, it soothes redness and leaves behind a warm, meditative trace of the ritual.',
  },
  {
    name: 'Bulgarian Rose Oil',
    text: 'Distilled from petals gathered at dawn in the Valley of Roses. Deeply hydrating and toning, it comforts sensitive skin and softens the look of fine lines.',
  },
  {
    name: 'Neroli Oil',
    text: 'Drawn from the blossom of the bitter orange tree. Regenerating and balancing, it refines tone and texture while lifting the senses with its delicate floral light.',
  },
  {
    name: 'Organic Coffee Oil',
    text: 'Pressed from green coffee beans. Naturally rich in caffeine and antioxidants, it wakes tired skin, eases puffiness and helps firm the surface.',
  },
  {
    name: 'Tocopherols',
    text: "Pure vitamin E — the botanical world's own preservative. A powerful antioxidant that protects the oils and the skin alike, guarding against oxidation and keeping the formula alive.",
  },
]

export function WhatsInside() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = INGREDIENTS[activeIndex]

  return (
    <section className={styles.inside}>
      <div className={styles.content}>
        <div className={`layout-grid ${styles.top}`}>
          <h2 className={styles.heading}>Whats inside matters</h2>

          <p className={styles.lead}>
            Everything our body needs to be healthy is made by the biology
            within us. Given the right elements and nutrition, the skin
            formulates all the actives it needs, at the levels and times
            required.
          </p>
        </div>

        <hr className={styles.divider} />

        <div className={`layout-grid ${styles.bottom}`}>
          <ul className={styles.ingredients}>
            {INGREDIENTS.map((item, index) => (
              <li key={item.name} className={styles.ingredient}>
                <button
                  type="button"
                  className={`reset ${styles.ingredientButton} ${
                    index === activeIndex ? styles.ingredientActive : ''
                  }`}
                  aria-pressed={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.description}>
            <p className={styles.descriptionText} key={activeIndex}>
              {active.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
