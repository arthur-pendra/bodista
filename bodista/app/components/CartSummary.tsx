import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {type OptimisticCart} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import {LiningMoney} from './LiningMoney';
import {useAside} from './Aside';
import styles from './Cart.module.css';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart}: CartSummaryProps) {
  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;
  const appliedCodes =
    cart?.discountCodes?.filter((code) => code.applicable) ?? [];

  // Korting/gift cards verlagen het totaal, niet het subtotaal. Het verschil is
  // de besparing; alleen tonen als die er daadwerkelijk is.
  const savings = Number(subtotal?.amount ?? 0) - Number(total?.amount ?? 0);
  const hasSavings = savings > 0.009 && !!subtotal?.currencyCode;
  const codeLabel = appliedCodes.map((code) => code.code).join(', ');

  const {close} = useAside();

  return (
    <div className={styles.footer} aria-label="Cart summary">
      {hasSavings && (
        <>
          <dl className={styles.summaryRow}>
            <dt>Subtotal</dt>
            <dd>
              <LiningMoney data={subtotal as MoneyV2} />
            </dd>
          </dl>
          <dl className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
            <dt>{codeLabel ? `Discount · ${codeLabel}` : 'Discount'}</dt>
            <dd>
              {'−'}
              <LiningMoney
                data={
                  {
                    amount: savings.toFixed(2),
                    currencyCode: subtotal!.currencyCode,
                  } as MoneyV2
                }
              />
            </dd>
          </dl>
        </>
      )}

      <dl className={styles.summaryRow}>
        <dt>Shipping</dt>
        <dd>Calculated at checkout</dd>
      </dl>

      <dl className={styles.subtotal}>
        <dt className={styles.subtotalLabel}>Total</dt>
        <dd className={styles.subtotalValue}>
          {total?.amount ? (
            <LiningMoney data={total as MoneyV2} />
          ) : subtotal?.amount ? (
            <LiningMoney data={subtotal as MoneyV2} />
          ) : (
            '—'
          )}
        </dd>
      </dl>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      <p className={styles.terms}>
        By proceeding to checkout you agree to our{' '}
        <Link
          className={styles.termsLink}
          to="/policies/terms-of-service"
          onClick={close}
        >
          terms and conditions
        </Link>{' '}
        and{' '}
        <Link
          className={styles.termsLink}
          to="/policies/privacy-policy"
          onClick={close}
        >
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self" className={styles.checkout}>
      Checkout
    </a>
  );
}
