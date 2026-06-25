import {Fragment} from 'react'

/**
 * Rendert UI-cijfers met lining figures (1–9 strak op de baseline) maar houdt
 * de "0" altijd op de ronde old-style glyph — een merkwens van de klant.
 *
 * Wikkel een string-getal hierin binnen een `.ui-nums` context, bv:
 *   <span className="ui-nums"><Figures>30ML</Figures></span>
 *
 * Elke 0 krijgt `.ui-nums-zero`, dat lokaal terugschakelt naar old-style.
 * Onder tabular figures zijn lining- en old-style-0 even breed, dus de
 * uitlijning blijft strak.
 */
export function Figures({children}: {children: string}) {
  const segments = children.split('0')
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {segment}
          {index < segments.length - 1 && (
            <span className="ui-nums-zero">0</span>
          )}
        </Fragment>
      ))}
    </>
  )
}
