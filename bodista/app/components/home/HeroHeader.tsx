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
      </div>
    </section>
  )
}
