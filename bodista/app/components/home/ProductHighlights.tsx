import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductFragment} from 'storefrontapi.generated';
import styles from './ProductHighlights.module.css';

export function ProductHighlights({
  products,
}: {
  products: RecommendedProductFragment[];
}) {
  if (!products.length) return null;

  return (
    <section className={styles.highlights}>
      <div className={styles.highlightsHeader}>
        <h2 className={styles.highlightsHeading}>All products</h2>
        <Link to="/collections" className={styles.highlightsViewAll}>
          View all
        </Link>
      </div>
      <div className={styles.highlightsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.highlightsCard}>
            <Link
              to={`/products/${product.handle}`}
              className={styles.highlightsImageLink}
            >
              <div className={styles.highlightsImageWrapper}>
                <span className={styles.highlightsBadge}>Back in stock</span>
                {product.featuredImage ? (
                  <Image
                    data={product.featuredImage}
                    aspectRatio="3/4"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={styles.highlightsImage}
                  />
                ) : (
                  <div className={styles.highlightsImagePlaceholder} />
                )}
              </div>
            </Link>
            <div className={styles.highlightsMeta}>
              <Link
                to={`/products/${product.handle}`}
                className={styles.highlightsInfo}
              >
                <h3 className={styles.highlightsProductName}>{product.title}</h3>
                <p className={styles.highlightsPrice}>
                  <Money data={product.priceRange.minVariantPrice} />
                </p>
              </Link>
              <button
                type="button"
                className={styles.highlightsSave}
                aria-label="Save product"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2.5h10v13l-5-3.5-5 3.5v-13Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
