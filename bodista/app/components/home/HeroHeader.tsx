import styles from './HeroHeader.module.css';

export function HeroHeader() {
  return (
    <section data-nav-dark="" className={styles.hero}>
      <div className={styles.heroBackdrop} />
    </section>
  );
}
