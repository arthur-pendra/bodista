import {useMoney} from '@shopify/hydrogen'
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types'
import {Figures} from './Figures'

/**
 * Money-shape die zowel de Storefront- als de Customer-Account-API dekt. De
 * laatste heeft een bredere `currencyCode` (bv. "USDC"), dus we typen `data`
 * structureel en casten alleen intern voor `useMoney` (currencyCode wordt enkel
 * aan Intl doorgegeven — runtime is een string).
 */
type MoneyLike = {amount: string; currencyCode: string}

/**
 * Prijs met UI-cijfers: lining + tabular voor 1–9, ronde old-style 0.
 * Het valutateken (£/$/€) wordt apart gerenderd in `.ui-nums-symbol` zodat
 * het optisch op lijn met de cijfers getild kan worden — sommige symbolen
 * (bv. £) hebben een staart onder de baseline en hangen anders te laag.
 */
export function LiningMoney({data}: {data: MoneyLike}) {
  const {parts} = useMoney(data as MoneyV2)
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
