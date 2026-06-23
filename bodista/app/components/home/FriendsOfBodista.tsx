import styles from './FriendsOfBodista.module.css'

const QUOTES = [
  {
    quote:
      'This serum acts like a probiotic, tackling inflammation while ensuring your skin barrier stays healthy and vibrant. Remember, biotechnology is paving the way for the future of skincare!',
    source: 'Refinery29',
  },
  {
    quote:
      "But that's not all this amazing formula has to offer: founder Joanna Ellner has gone beyond the usual ingredients, crafting a unique blend that truly stands out in effectiveness.",
    source: "Harper's Bazaar",
  },
  {
    quote:
      "This cleanser achieves the ideal balance – it's gentle yet powerfully effective, leaving your skin feeling soft, refreshed, and most importantly, deeply hydrated.",
    source: "Women's Health",
  },
  {
    quote:
      'REOME’s second product launch is impressively on point... Not only does it provide excellent glide for facial massages, but the formula is also packed with biofermented actives that nourish and revitalize the skin.',
    source: 'Vogue',
  },
]

export function FriendsOfBodista() {
  return (
    <section className={styles.friends}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Friends of bodista</span>

        <hr className={styles.divider} />

        <ul className={styles.columns}>
          {QUOTES.map((item) => (
            <li key={item.source} className={styles.col}>
              <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
              <span className={styles.source}>[ {item.source} ]</span>
              <div className={styles.portrait} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
