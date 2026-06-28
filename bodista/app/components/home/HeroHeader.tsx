import styles from './HeroHeader.module.css'

export function HeroHeader() {
  return (
    <section data-nav-dark="" className={styles.hero}>
      <div className={styles.heroBackdrop}>
        <video
          className={styles.heroVideo}
          src="/assets/videos/video_bodista.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadline}>Trust the body. Free the skin.</h1>
          <p className={styles.heroSubtext}>
            Sensory embodiment founded on elemental biology,
            <br />
            rare heritage botanicals, and the radical act of doing less.
          </p>
          <a className={styles.heroLink} href="/collections/all">
            free your skin now
            <svg
              className={styles.heroLinkArrow}
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 14L14 4M6 4H14V12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
