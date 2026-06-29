import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {LiningMoney} from '~/components/LiningMoney';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <LiningMoney data={price} /> : null}
          <s>
            <LiningMoney data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <LiningMoney data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
