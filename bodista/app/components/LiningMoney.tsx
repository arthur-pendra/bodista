import {useMoney} from '@shopify/hydrogen'
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types'
import {Figures} from './Figures'

/**
 * Prijs met UI-cijfers: lining + tabular voor 1–9, ronde old-style 0.
 * Het valutateken (£/$/€) wordt apart gerenderd in `.ui-nums-symbol` zodat
 * het optisch op lijn met de cijfers getild kan worden — sommige symbolen
 * (bv. £) hebben een staart onder de baseline en hangen anders te laag.
 */
export function LiningMoney({data}: {data: MoneyV2}) {
  const {parts} = useMoney(data)
  return (
    <span className="ui-nums">
      {parts.map((part, index) =>
        part.type === 'currency' ? (
          <span key={index} className="ui-nums-symbol">
            {part.value}
          </span>
        ) : (
          <Figures key={index}>{part.value}</Figures>
        ),
      )}
    </span>
  )
}
