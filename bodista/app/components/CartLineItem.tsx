import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {LiningMoney} from './LiningMoney';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import styles from './Cart.module.css';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * Eén regel in de cart: afbeelding, titel, variant, prijs + controls om de
 * hoeveelheid aan te passen of de regel te verwijderen. Child-componenten
 * (bijv. gift wrap) worden genest onder de hoofdregel getoond.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  // Variant-omschrijving zonder de loze Shopify-default ("Title: Default Title").
  const variantLabel = selectedOptions
    .filter(
      (option) =>
        option.name !== 'Title' && option.value !== 'Default Title',
    )
    .map((option) => option.value)
    .join(' · ');

  const compareAt = line?.cost?.compareAtAmountPerQuantity;
  const total = line?.cost?.totalAmount;

  return (
    <li className={styles.line}>
      <Link
        to={lineItemUrl}
        prefetch="intent"
        className={styles.lineMedia}
        onClick={() => layout === 'aside' && close()}
        tabIndex={-1}
        aria-hidden="true"
      >
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1.1"
            data={image}
            height={110}
            loading="lazy"
            width={100}
          />
        )}
      </Link>

      <div className={styles.lineBody}>
        <div className={styles.lineTop}>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            className={styles.lineName}
            onClick={() => layout === 'aside' && close()}
          >
            {product.title}
          </Link>
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>

        {variantLabel && <span className={styles.lineVariant}>{variantLabel}</span>}

        <div className={styles.lineBottom}>
          <CartLineQuantity line={line} />
          <span className={styles.linePrice}>
            {compareAt?.amount && (
              <span className={styles.compareAt}>
                <LiningMoney data={compareAt} />
              </span>
            )}
            {total && <LiningMoney data={total} />}
          </span>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className={styles.children}>
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Stepper om de hoeveelheid van een regel aan te passen. Tijdens een optimistic
 * update (server nog niet bevestigd) staan de knoppen uit.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className={styles.stepper}>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className={`reset ${styles.stepperBtn}`}
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
        >
          &#8722;
        </button>
      </CartLineUpdateButton>
      <span className={`${styles.qty} ui-nums`}>{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className={`reset ${styles.stepperBtn}`}
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
        >
          &#43;
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * Knop die een regel uit de cart verwijdert. Uit tijdens een nog niet
 * bevestigde optimistic update.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className={`reset ${styles.lineRemove}`}
        disabled={disabled}
        type="submit"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Unieke key voor de update-actie zodat acties op dezelfde regel elkaar
 * annuleren i.p.v. tegelijk te lopen (snel +/− klikken).
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
