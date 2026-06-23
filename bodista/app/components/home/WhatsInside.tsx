import styles from './WhatsInside.module.css'

const INGREDIENTS = [
  'Lipids',
  'Antioxidant enzymes',
  'Natural Moisturising Factors (NMF)',
  'Exosomes & cellular signalling molecules',
  'Stem cell activity & regeneration factors',
]

export function WhatsInside() {
  return (
    <section className={styles.inside}>
      <div className={`layout-grid ${styles.content}`}>
        <h2 className={styles.heading}>Whats inside matters</h2>

        <p className={styles.lead}>
          Everything our body needs to be healthy is made by the biology within
          us. Given the right elements and nutrition, the skin formulates all
          the actives it needs, at the levels and times required.
        </p>

        <div className={styles.bottom}>
          <hr className={styles.divider} />
          <div className={styles.bottomRow}>
            <ul className={styles.ingredients}>
              {INGREDIENTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.counter}>
              <span className={styles.count}>40/45</span>
              <p className={styles.detail}>
                Rare botanical compositions,
                <br />
                minimally processed by ancient methods.
                <br />
                Cold Pressing, Steam Distillation, Fermentation, Extraction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
