import styles from './OurPhilosophy.module.css'

const TAGS = ['Sustainability', 'philanthropy', 'mission']

export function OurPhilosophy() {
  return (
    <section className={styles.philosophy}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Our philosophy</span>

        <hr className={styles.dividerLeft} />
        <hr className={styles.dividerRight} />

        <div className={styles.text}>
          <p className={styles.paragraph}>
            Given the right elements and nutrition, the skin formulates all the
            actives it needs, at the levels and times required.Given the right
            elements and nutrition, the skin formulates all the actives it
            needs, at the levels and times required.
          </p>

          <ul className={styles.tags}>
            {TAGS.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
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
