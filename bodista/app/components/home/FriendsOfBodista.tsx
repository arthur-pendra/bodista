import styles from './FriendsOfBodista.module.css'

const QUOTES = [
  {
    quote:
      'The face oil melts into my skin without a trace of heaviness. By morning everything looks calm, soft and genuinely nourished — it has quietly become the part of my evening I look forward to most.',
    source: 'Marlowe V.',
    image: '/assets/images/friends%20of%20bodista/Frame_2713313_1.jpg.png',
  },
  {
    quote:
      'The serum did in two weeks what nothing else managed in years. My barrier finally feels healthy again — no tightness, no redness, just skin that looks hydrated and alive. Bodista understands skin almost biologically.',
    source: 'Anaïs R.',
    image:
      '/assets/images/friends%20of%20bodista/JO_ELLNER_REOME1648_1_e5841e7f-ef1b-4384-a156-6e237387e4c5.jpg.png',
  },
  {
    quote:
      'I came for the ritual and stayed for the results. Cleansing with the oil and water feels like a small ceremony each night, and my skin has never been softer — deeply hydrated without ever feeling stripped.',
    source: 'Theo L.',
    image: '/assets/images/friends%20of%20bodista/Reome_060120262102_copy.jpg.png',
  },
  {
    quote:
      'After years of overcomplicated routines, this is the first that feels truly considered. A few botanical drops and my skin regenerates overnight — firmer, clearer, more like itself. I won’t go back.',
    source: 'Juno M.',
    image:
      '/assets/images/friends%20of%20bodista/REOME_171024_SHOT_01_050_retouch_bw.jpg.png',
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
              <div className={styles.text}>
                <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
                <span className={styles.source}>[ {item.source} ]</span>
              </div>
              <div className={styles.portrait}>
                <img src={item.image} alt="" className={styles.portraitImg} />
              </div>
            </li>
          ))}

          {/* Verticale scheidingslijnen, exact op grid-lijn 4, 7 en 10. */}
          <span className={styles.vline} aria-hidden="true" />
          <span className={styles.vline} aria-hidden="true" />
          <span className={styles.vline} aria-hidden="true" />
        </ul>
      </div>
    </section>
  )
}
