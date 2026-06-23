import styles from './TheFacial.module.css'

const STEPS = [
  {
    label: 'Step 1',
    text: 'Begin with a gentle botanical cleanser to remove the day. Pat your skin damp, not dry — moisture is the bridge between cleanser and oil.',
  },
  {label: 'Step 2'},
  {label: 'Step 3'},
  {label: 'Step 4'},
]

export function TheFacial() {
  return (
    <section className={styles.facial}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Universāl Protocols</span>

        <hr className={styles.divider} />

        <div className={styles.media}>
          <span className={styles.cleansing}>intelligent cleansing</span>
          <span className={styles.dissolve}>Dissolve</span>
          <button type="button" className={styles.oilButton}>
            <span className={styles.oilThumb} />
            <span className={styles.oilLabel}>The face oil</span>
            <span className={styles.oilPlus} aria-hidden="true">
              +
            </span>
          </button>
        </div>

        <div className={styles.steps}>
          <h2 className={styles.heading}>The Facial</h2>
          <p className={styles.intro}>
            two botanical elements, oil and water. a sensory sequence in four
            steps that cleanses and nourishes your skin.
          </p>
          <ol className={styles.stepList}>
            {STEPS.map((step) => (
              <li key={step.label} className={styles.step}>
                <span className={styles.stepLabel}>{step.label}</span>
                {step.text ? (
                  <p className={styles.stepText}>{step.text}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
