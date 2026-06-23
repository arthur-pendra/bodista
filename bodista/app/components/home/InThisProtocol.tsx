import styles from './InThisProtocol.module.css'

const CARDS = [
  {
    variant: 'oil' as const,
    label: 'Universāl Santal',
    title: 'The Face Oil',
    caption: 'Seal · Nourish · Regenerate',
  },
  {
    variant: 'serum' as const,
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
            <li
              key={card.title}
              className={`${styles.card} ${styles[card.variant]}`}
            >
              <span className={styles.thumb} />
              <div className={styles.info}>
                <span className={styles.cardLabel}>{card.label}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <span className={styles.caption}>{card.caption}</span>
              </div>
              <button
                type="button"
                className={styles.plus}
                aria-label={`Add ${card.title}`}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
