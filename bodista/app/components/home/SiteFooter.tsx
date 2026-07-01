import {Link, useFetcher} from 'react-router'
import {Wordmark} from '~/components/Wordmark'
import styles from './SiteFooter.module.css'

type SubscribeResponse = {ok: boolean; error?: string}

// Newsletter signup — posts to the Klaviyo resource route via useFetcher.
// Double opt-in: on success Klaviyo emails a confirmation before adding.
function NewsletterForm() {
  const fetcher = useFetcher<SubscribeResponse>()
  const busy = fetcher.state !== 'idle'
  const success = fetcher.data?.ok === true
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : undefined

  return (
    <fetcher.Form
      className={styles.signup}
      method="post"
      action="/api/klaviyo-subscribe"
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
          required
          disabled={busy || success}
        />
        {/* Honeypot — hidden from users, catches bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />
        <button
          className={styles.submit}
          type="submit"
          disabled={busy || success}
        >
          {busy ? '…' : success ? 'thanks' : 'subscribe'}
        </button>
      </div>
      {success ? (
        <p className={styles.feedback}>
          Check your inbox to confirm your subscription.
        </p>
      ) : error ? (
        <p className={`${styles.feedback} ${styles.feedbackError}`}>{error}</p>
      ) : (
        <p className={styles.consent}>
          By subscribing you agree to our{' '}
          <a className={styles.consentLink} href="/">
            Privacy Policy
          </a>
          . Unsubscribe anytime.
        </p>
      )}
    </fetcher.Form>
  )
}

const INFORMATION = ['botonical', 'Face', 'Routines']

const SOCIAL = ['Instagram', 'Facebook', 'Tiktok', 'Youtube']

// De echte collecties (zie Shopify).
const SHOP = [
  {label: 'The Facial', href: '/collections/all?collection=the-facial'},
  {label: 'Scents', href: '/collections/all?collection=scents'},
  {label: 'Body', href: '/collections/all?collection=body'},
  {label: 'Sets', href: '/collections/all?collection=sets'},
  {label: 'Accessories', href: '/collections/all?collection=accessories'},
]

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
            <NewsletterForm />
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
                  <li key={item.label}>
                    <Link className={styles.link} to={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link className={styles.muted} to="/collections/all">
              shop all
            </Link>
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
