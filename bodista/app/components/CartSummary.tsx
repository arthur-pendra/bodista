import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {LiningMoney} from './LiningMoney';
import styles from './Cart.module.css';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart}: CartSummaryProps) {
  const subtotal = cart?.cost?.subtotalAmount;
  const appliedCodes =
    cart?.discountCodes?.filter((code) => code.applicable) ?? [];
  const appliedGiftCards = cart?.appliedGiftCards ?? [];
  const hasPromo = appliedCodes.length > 0 || appliedGiftCards.length > 0;

  return (
    <div className={styles.footer} aria-label="Cart summary">
      <CartPromo
        defaultOpen={hasPromo}
        discountCodes={cart?.discountCodes}
        giftCardCodes={cart?.appliedGiftCards}
      />

      <dl className={styles.subtotal}>
        <dt className={styles.subtotalLabel}>Subtotal</dt>
        <dd className={styles.subtotalValue}>
          {subtotal?.amount ? (
            <LiningMoney data={subtotal as MoneyV2} />
          ) : (
            '—'
          )}
        </dd>
      </dl>

      <p className={styles.taxNote}>
        Shipping &amp; taxes calculated at checkout.
      </p>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      <p className={styles.trust}>Secure checkout · encrypted payment</p>
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
