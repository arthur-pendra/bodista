import {useOptimisticCart} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {DEMO_CART, DEMO_RECS} from './cartDemo';
import type {
  CartApiQueryFragment,
  MenuProductsQuery,
} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartRecommendations} from './CartRecommendations';
import {LiningMoney} from './LiningMoney';
import styles from './Cart.module.css';

export type CartLayout = 'page' | 'aside';

/** Drempel waarboven verzending gratis is (in de valuta van de cart). */
const FREE_SHIPPING_THRESHOLD = 75;

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  recommendations?: Promise<MenuProductsQuery | null>;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childLines] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childLines);
      }
    }
  }
  return children;
}

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({
  layout,
  cart: originalCart,
  recommendations,
}: CartMainProps) {
  // De useOptimisticCart-hook past pending acties direct toe zodat de gebruiker
  // meteen feedback ziet bij het wijzigen van de cart.
  const optimisticCart = useOptimisticCart(originalCart);

  // DEV cart-preview — toont de gevulde drawer met placeholder-data via
  // ?cartdemo=1 (alleen dev, zolang er geen voorraad is). Zie cartDemo.ts.
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).has('cartdemo')
    ) {
      setDemo(true);
    }
  }, []);

  const cart = demo
    ? (DEMO_CART as unknown as typeof optimisticCart)
    : optimisticCart;
  const activeRecs = demo ? Promise.resolve(DEMO_RECS) : recommendations;

  const cartHasItems = (cart?.totalQuantity ?? 0) > 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  const rootClass = `${styles.cart} ${
    layout === 'aside' ? styles.cartAside : styles.cartPage
  }`;

  if (!cartHasItems) {
    return (
      <div className={rootClass}>
        <div className={styles.scroll}>
          <CartEmpty />
          {activeRecs && (
            <CartRecommendations
              recommendations={activeRecs}
              inCartHandles={new Set<string>()}
            />
          )}
        </div>
      </div>
    );
  }

  // Handles van producten al in de cart — zo filteren we ze uit de suggesties.
  const inCartHandles = new Set(
    (cart?.lines?.nodes ?? [])
      .map((line) => line.merchandise?.product?.handle)
      .filter(Boolean) as string[],
  );

  return (
    <div className={rootClass}>
      <FreeShippingBar subtotal={cart?.cost?.subtotalAmount} />

      <div className={styles.scroll}>
        <ul className={styles.lines} aria-label="Cart items">
          {(cart?.lines?.nodes ?? []).map((line) => {
            // Geen child-regels op het hoofdniveau renderen.
            if (
              'parentRelationship' in line &&
              line.parentRelationship?.parent
            ) {
              return null;
            }
            return (
              <CartLineItem
                key={line.id}
                line={line}
                layout={layout}
                childrenMap={childrenMap}
              />
            );
          })}
        </ul>

        {activeRecs && (
          <CartRecommendations
            recommendations={activeRecs}
            inCartHandles={inCartHandles}
          />
        )}
      </div>

      <CartSummary cart={cart} layout={layout} />
    </div>
  );
}

/**
 * Free-shipping voortgangsbalk. Toont hoeveel er nog tot gratis verzending
 * resteert, of een bevestiging zodra de drempel is gehaald.
 */
function FreeShippingBar({
  subtotal,
}: {
  subtotal?: {amount?: string; currencyCode?: string} | null;
}) {
  const amount = Number(subtotal?.amount ?? 0);
  const currencyCode = subtotal?.currencyCode ?? 'EUR';
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - amount, 0);
  const reached = remaining <= 0;
  const progress = Math.min(amount / FREE_SHIPPING_THRESHOLD, 1) * 100;

  return (
    <div className={styles.shipping}>
      <span
        className={`${styles.shippingLabel} ${
          reached ? styles.shippingReached : ''
        }`}
      >
        {reached ? (
          <>you’ve unlocked free shipping ✓</>
        ) : (
          <>
            you’re{' '}
            <strong>
              <LiningMoney
                data={
                  {amount: remaining.toFixed(2), currencyCode} as MoneyV2
                }
              />
            </strong>{' '}
            away from free shipping
          </>
        )}
      </span>
      <div
        className={styles.shippingTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span
          className={styles.shippingFill}
          data-reached={reached}
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  );
}

function CartEmpty() {
  const {close} = useAside();
  return (
    <div className={styles.empty}>
      <span className={styles.emptyEyebrow}>Your cart is empty</span>
      <p className={styles.emptyHeading}>
        Add your favourite rituals to your cart.
      </p>
      <Link
        to="/collections/all"
        onClick={close}
        prefetch="viewport"
        className={styles.emptyLink}
      >
        Shop all
      </Link>
    </div>
  );
}
