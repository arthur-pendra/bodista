import {useEffect, useState} from 'react'
import styles from './GridOverlay.module.css'

/**
 * Dev-only kolom-grid overlay (zoals de Figma layout-grid).
 * - Desktop: 24 kolommen, margin 1.875em (30px), gutter 1.25em (20px)
 * - Mobile (<=767px): 12 kolommen, margin 1em (16px), gutter 1.25em (20px)
 * Toggle met de "G"-toets (genegeerd tijdens typen in een veld).
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) {
        return
      }
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable) {
        return
      }
      setVisible((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!visible) return null

  return (
    <div className={styles.overlay} aria-hidden="true">
      {Array.from({length: 24}).map((_, i) => (
        <div key={i} className={styles.col}>
          <span className={styles.num}>{i + 1}</span>
        </div>
      ))}
    </div>
  )
}
