import {Link} from 'react-router'
import styles from './OurPhilosophy.module.css'

const TAGS = ['Sustainability', 'philanthropy', 'mission']

export function OurPhilosophy() {
  return (
    <section className={styles.philosophy}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Our philosophy</span>

        <hr className={styles.divider} />

        <div className={styles.text}>
          <p className={styles.paragraph}>
            Given the right elements and nutrition, the skin formulates all the
            actives it needs, at the levels and times required.Given the right
            elements and nutrition, the skin formulates all the actives it
            needs, at the levels and times required.
          </p>

          <Link to="/pages/about" className={styles.readMore}>
            read more
            <svg
              className={styles.arrow}
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 18L18 5M18 5H7M18 5v11"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

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
