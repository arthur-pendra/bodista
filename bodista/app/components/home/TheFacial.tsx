import {useState} from 'react'
import styles from './TheFacial.module.css'

const STEPS = [
  {
    label: 'Step 1',
    word: 'Cleanse',
    eyebrow: 'intelligent cleansing',
    product: {variant: 'gold', name: 'The face oil'},
    text: 'Warm a few drops between your palms and press them into dry skin. The botanical oil dissolves makeup, sunscreen and the residue of the day, lifting it all away gently — without ever stripping your barrier or leaving the skin tight.',
  },
  {
    label: 'Step 2',
    word: 'Hydrate',
    eyebrow: 'water meets oil',
    product: {variant: 'silver', name: 'The serum'},
    text: 'Mist the serum over the oil and emulsify with damp fingertips. Water binds to the oil and carries everything away clean, so the skin is left fresh, soft and deeply quenched rather than stripped of its own moisture.',
  },
  {
    label: 'Step 3',
    word: 'Moisturize',
    eyebrow: 'a living base layer',
    product: {variant: 'silver', name: 'The serum'},
    text: 'Press a second veil of serum into still-damp skin. This living base layer floods the surface with lightweight moisture and prepares it to hold and absorb everything that follows in the ritual.',
  },
  {
    label: 'Step 4',
    word: 'Regenerate',
    eyebrow: 'lasting nourishment',
    product: {variant: 'gold', name: 'The face oil'},
    text: 'Seal the routine with a final, weightless layer of face oil. It locks in the hydration beneath and feeds the skin through the night, so it wakes balanced, supple and visibly renewed.',
  },
]

export function TheFacial() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = STEPS[activeIndex]

  return (
    <section className={styles.facial}>
      <div className={`layout-grid ${styles.inner}`}>
        <span className={styles.label}>Universāl Protocols</span>

        <hr className={styles.divider} />

        <div className={styles.media}>
          <span className={styles.eyebrow} key={`eyebrow-${activeIndex}`}>
            {active.eyebrow}
          </span>
          <span className={styles.word} key={`word-${activeIndex}`}>
            {active.word}
          </span>
          <button
            type="button"
            key={`pill-${activeIndex}`}
            className={`product-pill product-pill--${active.product.variant} ${styles.oilButton}`}
          >
            <span className="product-pill__thumb" />
            <span className="product-pill__label">{active.product.name}</span>
            <span className="product-pill__plus" aria-hidden="true">
              <svg
                className="product-pill__icon"
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
        </div>

        <div className={styles.steps}>
          <h2 className={styles.heading}>The Facial</h2>
          <p className={styles.intro}>
            two botanical elements, oil and water. a sensory sequence in four
            steps that cleanses and nourishes your skin.
          </p>
          <ul className={styles.stepList}>
            {STEPS.map((step, index) => {
              const isActive = index === activeIndex
              return (
                <li
                  key={step.label}
                  className={`${styles.step} ${isActive ? styles.stepActive : ''}`}
                >
                  <button
                    type="button"
                    className={`reset ${styles.stepTop}`}
                    aria-expanded={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className={styles.stepBottom}>
                    <div className={styles.stepBottomWrap}>
                      <p className={styles.stepText}>{step.text}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
