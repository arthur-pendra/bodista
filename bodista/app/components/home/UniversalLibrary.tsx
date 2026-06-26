import styles from './UniversalLibrary.module.css'

const ENTRIES = [
  {id: 'how-the-skin-works', label: 'How the skin works'},
  {id: 'oil-and-water', label: 'Why oil and water belong together'},
  {id: 'skin-barrier', label: 'Reading your skin barrier'},
  {id: 'botanical-actives', label: 'The botanicals that do the work'},
  {id: 'night-renewal', label: 'How the skin repairs at night'},
]

export function UniversalLibrary() {
  return (
    <section className={styles.library}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Universāl Library</span>

        <hr className={styles.divider} />

        <div className={styles.text}>
          <p className={styles.heading}>
            A library of everything we have learned about the skin and the
            biology within it.
          </p>
          <p className={styles.intro}>
            Slow, considered reading on the science behind each ritual — from how
            the barrier works to why oil and water belong together.
          </p>
          <ul className={styles.accordion}>
            {ENTRIES.map((entry) => (
              <li key={entry.id} className={styles.entry}>
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
                    d="M4 14L14 4M14 4H6M14 4v8"
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
