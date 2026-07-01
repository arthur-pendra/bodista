import {useState} from 'react'
import styles from './ProductDetails.module.css'

export type ProductDetailSection = {heading: string; body: string}

/**
 * Placeholder-inhoud zolang een product nog geen `custom.detail_sections`
 * metafield gevuld heeft. Bewust "logische" voorbeelddata — heading + body
 * zijn straks per product in Shopify aan te passen. Body's met regeleinden
 * (\n) renderen als lijstjes via `white-space: pre-line`.
 */
const PLACEHOLDER_SECTIONS: ProductDetailSection[] = [
  {heading: 'Suitable for', body: 'All skin types'},
  {heading: 'Awards', body: 'ELLE UK Future of Beauty Awards 2024'},
  {
    heading: 'Key features',
    body: 'Clinically proven\nBreakthrough technology\nCruelty free\nVegan',
  },
  {
    heading: 'Key ingredients',
    body: 'Bio-Fermented Mineral Compound CF5, Fractionated Centella Asiatica, High Beta Glucan Oat Active…\n\nSee all ingredients',
  },
  {
    heading: 'Clinical testing',
    body: 'Independently tested over 8 weeks on a panel of 42 participants, with measured improvements in barrier strength and hydration.',
  },
]

/**
 * Product-detail dropdowns — hergebruikt de expand-mechaniek van The Facial
 * (grid-template-rows 0fr→1fr + plus/kruis-icoon). Eén sectie tegelijk open;
 * klik op een open sectie sluit hem weer.
 */
export function ProductDetails({sections}: {sections?: ProductDetailSection[]}) {
  const items = sections?.length ? sections : PLACEHOLDER_SECTIONS
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={styles.details}>
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isOpen = index === openIndex
          return (
            <li
              key={item.heading}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
            >
              <button
                type="button"
                className={`reset ${styles.top}`}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className={styles.heading}>{item.heading}</span>
                <svg
                  className={styles.icon}
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    className={styles.barV}
                    d="M9 3v12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 9h12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className={styles.bottom}>
                <div className={styles.bottomWrap}>
                  <p className={styles.body}>{item.body}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
