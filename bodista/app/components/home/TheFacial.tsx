import {useState} from 'react'
import styles from './TheFacial.module.css'

const STEPS = [
  {
    word: 'Cleanse',
    eyebrow: 'intelligent cleansing',
    product: {variant: 'gold', name: 'The face oil'},
    text: 'Warm a few drops between your palms and press them into dry skin. The botanical oil dissolves makeup, sunscreen and the residue of the day, lifting it all away gently, without ever stripping your barrier or leaving the skin tight.',
  },
  {
    word: 'Hydrate',
    eyebrow: 'water meets oil',
    product: {variant: 'silver', name: 'The serum'},
    text: 'Mist the serum over the oil and emulsify with damp fingertips. Water binds to the oil and carries everything away clean, so the skin is left fresh, soft and deeply quenched rather than stripped of its own moisture.',
  },
  {
    word: 'Moisturize',
    eyebrow: 'a living base layer',
    product: {variant: 'silver', name: 'The serum'},
    text: 'Press a second veil of serum into still-damp skin. This living base layer floods the surface with lightweight moisture and prepares it to hold and absorb everything that follows in the ritual.',
  },
  {
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
                  key={step.word}
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
                    <span className={styles.stepWord}>{step.word}</span>
                    <svg
                      className={styles.stepIcon}
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        className={styles.stepBarV}
                        d="M9 3v12"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 9h12"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div className={styles.stepBottom}>
                    <div className={styles.stepBottomWrap}>
                      <p className={styles.stepText}>
                        <span
                          className={`${styles.stepCount} ${
                            step.product.variant === 'gold'
                              ? styles.stepCountGold
                              : styles.stepCountSilver
                          }`}
                        >
                          Step {index + 1}.
                        </span>
                        {step.text}
                      </p>
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
