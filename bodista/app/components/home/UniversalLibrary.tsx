import {useState} from 'react'
import styles from './UniversalLibrary.module.css'

const HEADING_DEFAULT =
  'A library of everything we have learned about the skin and the biology within it.'

const ENTRIES = [
  {
    id: 'how-the-skin-works',
    label: 'How the skin works',
    title:
      'Given the right elements, the skin formulates every active it needs on its own.',
  },
  {
    id: 'oil-and-water',
    label: 'Why oil and water belong together',
    title:
      'Oil and water are not opposites — together they rebuild and protect the barrier.',
  },
  {
    id: 'skin-barrier',
    label: 'Reading your skin barrier',
    title:
      'The barrier speaks first; learning to read it tells you what the skin needs.',
  },
  {
    id: 'botanical-actives',
    label: 'The botanicals that do the work',
    title:
      'A few honest botanicals, quietly doing the work of an entire bathroom shelf.',
  },
  {
    id: 'night-renewal',
    label: 'How the skin repairs at night',
    title:
      'While you sleep the skin repairs, renews and returns itself to balance.',
  },
]

export function UniversalLibrary() {
  const [active, setActive] = useState<number | null>(null)
  const heading = active === null ? HEADING_DEFAULT : ENTRIES[active].title

  return (
    <section className={styles.library}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Universāl Library</span>

        <hr className={styles.divider} />

        <div className={styles.text}>
          <p className={styles.heading} key={active ?? 'default'}>
            {heading}
          </p>
          <ul
            className={styles.accordion}
            onMouseLeave={() => setActive(null)}
          >
            {ENTRIES.map((entry, index) => (
              <li
                key={entry.id}
                className={styles.entry}
                onMouseEnter={() => setActive(index)}
              >
                <span className={styles.entryLabel}>{entry.label}</span>
                <svg
                  className={styles.arrow}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 14L14 4M6 4H14V12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <div className={styles.portrait} />
        </div>
      </div>
    </section>
  )
}
