import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {MenuProductsQuery} from 'storefrontapi.generated';
import {AddToCartButton} from './AddToCartButton';
import {LiningMoney} from './LiningMoney';
import {useAside} from './Aside';
import styles from './Cart.module.css';

type MenuProduct = NonNullable<
  MenuProductsQuery['products']
>['nodes'][number];

/**
 * "You may also like" — suggesties onderin de cart. Hergebruikt de producten
 * die de header al ophaalt (geen extra query); producten die al in de cart
 * zitten worden eruit gefilterd. Elke kaart linkt naar het product en heeft
 * een quick-add.
 */
export function CartRecommendations({
  recommendations,
  inCartHandles,
}: {
  recommendations: Promise<MenuProductsQuery | null>;
  inCartHandles: Set<string>;
}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={recommendations}>
        {(response) => {
          const products = (response?.products?.nodes ?? [])
            .filter((product) => !inCartHandles.has(product.handle))
            .slice(0, 4);

          if (products.length === 0) return null;

          return (
            <section className={styles.recommend} aria-label="You may also like">
              <span className={styles.recommendHead}>you may also like</span>
              <ul className={styles.recommendList}>
                {products.map((product) => (
                  <RecommendationCard key={product.id} product={product} />
                ))}
              </ul>
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}

function RecommendationCard({product}: {product: MenuProduct}) {
  const {open} = useAside();
  const variant = product.selectedOrFirstAvailableVariant;
  const canAdd = Boolean(variant?.id && variant.availableForSale);

  return (
    <li className={styles.recommendCard}>
      <span className={styles.recommendMedia}>
        <Link
          prefetch="intent"
          to={`/products/${product.handle}`}
          onClick={() => open('closed')}
          aria-label={product.title}
        >
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              aspectRatio="1/1.1"
              sizes="160px"
            />
          )}
        </Link>
        {canAdd && variant && (
          <AddToCartButton
            className={`reset ${styles.recommendAdd}`}
            lines={[{merchandiseId: variant.id, quantity: 1}]}
          >
            <span className={styles.recommendAddIcon} aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 8h14"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M8 1v14"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="sr-only">Add {product.title} to cart</span>
          </AddToCartButton>
        )}
      </span>

      <Link
        prefetch="intent"
        to={`/products/${product.handle}`}
        className={styles.recommendText}
        onClick={() => open('closed')}
      >
        {product.typeProduct?.value && (
          <span className={styles.recommendType}>
            {product.typeProduct.value}
          </span>
        )}
        <span className={styles.recommendName}>{product.title}</span>
        <span className={styles.recommendPrice}>
          <LiningMoney data={product.priceRange.minVariantPrice} />
        </span>
      </Link>
    </li>
  );
}
