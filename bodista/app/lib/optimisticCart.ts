import type {OptimisticCart} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type Cart = OptimisticCart<CartApiQueryFragment | null>;
type Money = {amount: string; currencyCode: CurrencyCode};

/** Maakt een MoneyV2-achtig object met op 2 decimalen afgeronde amount. */
function money(amount: number, currencyCode: CurrencyCode): Money {
  return {amount: amount.toFixed(2), currencyCode};
}

/**
 * Herberekent de afgeleide bedragen (regeltotaal + subtotaal + totaal) bovenop
 * een optimistic cart. Hydrogens `useOptimisticCart` past alleen `quantity` en
 * `totalQuantity` direct toe — de prijzen blijven tot de server-round-trip op de
 * oude waarde staan, waardoor de UI traag aanvoelt. Hier leiden we de bedragen
 * meteen af uit `amountPerQuantity × quantity`, zodat regelprijzen, het subtotaal
 * en de free-shipping-balk direct meebewegen.
 *
 * - Werkt alleen wanneer de cart al optimistic is (dan is het een verse
 *   structuredClone uit de hook → veilig om te muteren).
 * - Carts met een toegepaste korting/cadeaukaart laten we ongemoeid: daar is de
 *   server leidend, anders zou de besparing kort verkeerd kunnen flikkeren.
 */
export function reconcileOptimisticCart(cart: Cart): Cart {
  if (!cart?.isOptimistic || !cart.lines?.nodes?.length) return cart;

  const hasPromo =
    cart.discountCodes?.some((code) => code.applicable) ||
    (cart.appliedGiftCards?.length ?? 0) > 0;
  if (hasPromo) return cart;

  let subtotal = 0;
  let currencyCode: CurrencyCode | undefined;

  for (const line of cart.lines.nodes) {
    const perUnit = line.cost?.amountPerQuantity;
    if (perUnit?.amount != null && typeof line.quantity === 'number') {
      const lineTotal = Number(perUnit.amount) * line.quantity;
      line.cost = {
        ...line.cost,
        totalAmount: money(lineTotal, perUnit.currencyCode),
      };
      subtotal += lineTotal;
      currencyCode ??= perUnit.currencyCode;
    } else if (line.cost?.totalAmount?.amount) {
      // Geen per-stuk-prijs bekend → val terug op het bestaande regeltotaal.
      subtotal += Number(line.cost.totalAmount.amount);
      currencyCode ??= line.cost.totalAmount.currencyCode;
    }
  }

  if (currencyCode) {
    const sub = money(subtotal, currencyCode);
    cart.cost = {
      ...cart.cost,
      subtotalAmount: sub,
      // Zonder korting is het totaal gelijk aan het subtotaal.
      totalAmount: {...sub},
    };
  }

  return cart;
}
