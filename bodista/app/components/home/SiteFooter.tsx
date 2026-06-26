import {Wordmark} from '~/components/Wordmark'
import styles from './SiteFooter.module.css'

const INFORMATION = ['botonical', 'Face', 'Routines']

const SOCIAL = ['Instagram', 'Facebook', 'Tiktok', 'Youtube']

const SHOP = ['Body', 'Face', 'Routines', 'Cloths', 'Scalp']

const ArrowIcon = () => (
  <svg
    className={styles.arrow}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 11L11 3M4.5 3H11V9.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="layout-grid">
        <hr className={styles.topDivider} />

        <Wordmark className={styles.wordmark} />

        <hr className={styles.midDivider} />

        <div className={styles.columns}>
          {/* Newsletter */}
          <div className={styles.column}>
            <h2 className={styles.heading}>Newsletter</h2>
            <form
              className={styles.signup}
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className={styles.fields}>
                <input
                  id="footer-email"
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="your@mail.com"
                  autoComplete="email"
                />
                <button className={styles.submit} type="submit">
                  subscribe
                </button>
              </div>
              <p className={styles.consent}>
                By subscribing you agree to our{' '}
                <a className={styles.consentLink} href="/">
                  Privacy Policy
                </a>
                . Unsubscribe anytime.
              </p>
            </form>
          </div>

          {/* Information */}
          <div className={styles.column}>
            <h2 className={styles.heading}>Information</h2>
            <nav aria-label="Information">
              <ul className={styles.links}>
                {INFORMATION.map((item) => (
                  <li key={item}>
                    <a className={styles.link} href="/">
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <a className={`${styles.link} ${styles.linkArrow}`} href="/">
                    Learn More
                    <ArrowIcon />
                  </a>
                </li>
              </ul>
            </nav>
            <a className={styles.muted} href="/">
              research papers
            </a>
          </div>

          {/* Press and social */}
          <div className={styles.column}>
            <h2 className={styles.heading}>press and social</h2>
            <nav aria-label="Press and social">
              <ul className={styles.links}>
                {SOCIAL.map((item) => (
                  <li key={item}>
                    <a className={styles.link} href="/">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <span className={styles.muted}>© 2026</span>
          </div>

          {/* Shop */}
          <div className={styles.column}>
            <h2 className={styles.heading}>Shop</h2>
            <nav aria-label="Shop">
              <ul className={styles.links}>
                {SHOP.map((item) => (
                  <li key={item}>
                    <a className={styles.link} href="/">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a className={styles.muted} href="/">
              shop all
            </a>
          </div>

          {/* Verticale scheidingslijnen vlak vóór elk nav-item (kolom 9/14/19). */}
          <span className={styles.vline} aria-hidden="true" />
          <span className={styles.vline} aria-hidden="true" />
          <span className={styles.vline} aria-hidden="true" />
        </div>

        <hr className={styles.bottomDivider} />

        <p className={styles.copyright}>Copyright ©2026 Bodista</p>
      </div>
    </footer>
  )
}
