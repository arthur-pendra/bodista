import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useRef, useState} from 'react';
import {Link, useFetcher} from 'react-router';
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
  const appliedGiftCards = cart?.appliedGiftCards ?? [];
  const hasPromo = appliedCodes.length > 0 || appliedGiftCards.length > 0;

  // Korting/gift cards verlagen het totaal, niet het subtotaal. Het verschil is
  // de besparing; alleen tonen als die er daadwerkelijk is.
  const savings = Number(subtotal?.amount ?? 0) - Number(total?.amount ?? 0);
  const hasSavings = savings > 0.009 && !!subtotal?.currencyCode;
  const codeLabel = appliedCodes.map((code) => code.code).join(', ');

  const {close} = useAside();

  return (
    <div className={styles.footer} aria-label="Cart summary">
      <CartPromo
        defaultOpen={hasPromo}
        discountCodes={cart?.discountCodes}
        giftCardCodes={cart?.appliedGiftCards}
      />

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

/**
 * Inklapbaar blok voor kortingscode én cadeaukaart — standaard dicht, maar
 * open zodra er al iets is toegepast.
 */
function CartPromo({
  defaultOpen,
  discountCodes,
  giftCardCodes,
}: {
  defaultOpen: boolean;
  discountCodes?: CartApiQueryFragment['discountCodes'];
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'];
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.promo}>
      <button
        type="button"
        className={`reset ${styles.promoToggle}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.promoToggleIcon} data-open={open}>
          +
        </span>
        Add discount or gift card
      </button>

      {open && (
        <div className={styles.promoPanel}>
          <CartDiscounts discountCodes={discountCodes} />
          <CartGiftCard giftCardCodes={giftCardCodes} />
        </div>
      )}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <>
      {codes.length > 0 && (
        <UpdateDiscountForm>
          <div className={styles.promoApplied}>
            <code>{codes.join(', ')}</code>
            <button
              type="submit"
              className={`reset ${styles.promoRemove}`}
              aria-label="Remove discount"
            >
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      )}

      <UpdateDiscountForm discountCodes={codes}>
        <div className={styles.promoField}>
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <button
            type="submit"
            className={`reset ${styles.promoApply}`}
            aria-label="Apply discount code"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'];
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className={styles.promoApplied}>
                <code>***{giftCard.lastCharacters}</code>
                <LiningMoney data={giftCard.amountUsed} />
                <button type="submit" className={`reset ${styles.promoRemove}`}>
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className={styles.promoField}>
          <label htmlFor="gift-card-input" className="sr-only">
            Gift card code
          </label>
          <input
            id="gift-card-input"
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          <button
            type="submit"
            className={`reset ${styles.promoApply}`}
            disabled={giftCardAddFetcher.state !== 'idle'}
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
