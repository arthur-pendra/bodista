import styles from './InThisProtocol.module.css'

const CARDS = [
  {
    variant: 'gold' as const,
    label: 'Universāl Santal',
    title: 'The Face Oil',
    caption: 'Seal · Nourish · Regenerate',
  },
  {
    variant: 'silver' as const,
    label: 'Aqua Universāl',
    title: 'The Serum',
    caption: 'Hydrate · Nourish · Regenerate',
  },
]

export function InThisProtocol() {
  return (
    <section className={styles.protocol}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>In this Protocol</span>

        <hr className={styles.divider} />

        <div className={styles.toggle}>
          <span className={styles.toggleOn}>i</span>
          <span className={styles.toggleOff}>iI</span>
        </div>

        <ul className={styles.cards}>
          {CARDS.map((card) => (
            <li key={card.title} className={styles.cardItem}>
              <button
                type="button"
                className={`pill-button-big pill-button-big--${card.variant}`}
                aria-label={`Add ${card.title}`}
              >
                <span className="pill-button-big__thumb" />
                <span className="pill-button-big__info">
                  <span className="pill-button-big__label">{card.label}</span>
                  <span className="pill-button-big__title">{card.title}</span>
                  <span className="pill-button-big__caption">
                    {card.caption}
                  </span>
                </span>
                <span className="pill-button-big__plus" aria-hidden="true">
                  <svg
                    className="pill-button-big__icon"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8 1v14M1 8h14"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
