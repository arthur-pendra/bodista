import styles from './UniversalLibrary.module.css'

const ENTRIES = [
  {id: 'skin-1', label: 'How the skin works'},
  {id: 'skin-2', label: 'How the skin works'},
  {id: 'skin-3', label: 'How the skin works'},
]

export function UniversalLibrary() {
  return (
    <section className={styles.library}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Universāl Library</span>

        <hr className={styles.divider} />

        <div className={styles.text}>
          <p className={styles.heading}>
            Everything our body needs to be healthy is made by the biology
            within us.
          </p>
          <p className={styles.intro}>
            Begin with a gentle botanical cleanser to remove the day. Pat your
            skin damp, not dry — moisture is the bridge between cleanser and oil.
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
