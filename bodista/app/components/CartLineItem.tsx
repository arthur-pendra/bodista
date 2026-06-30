import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {LiningMoney} from './LiningMoney';
import {Figures} from './Figures';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import styles from './Cart.module.css';
import toggleStyles from './SlidingToggle.module.css';

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

  // Size-varianten van dit product. Alleen bij ≥2 maten tonen we de pills (en
  // verbergen het losse variant-label, want dat is dan dubbelop).
  const sizes = getSizeVariants(line);
  const hasSizeChoice = sizes.length > 1;

  // Subscriptie: alle beschikbare plans van het product + het actieve plan (kan
  // null zijn bij een eenmalige regel). Zolang het product plans heeft tonen we
  // de tag — ook om een subscription te kunnen tóévoegen aan een one-time regel.
  const subPlans =
    merchandise.product?.sellingPlanGroups?.nodes?.flatMap(
      (group) => group.sellingPlans?.nodes ?? [],
    ) ?? [];
  const serverPlanId = line.sellingPlanAllocation?.sellingPlan?.id ?? null;
  const [subOpen, setSubOpen] = useState(false);

  // Optimistische keuze: Hydrogens useOptimisticCart past `sellingPlanAllocation`
  // niet meteen toe, dus zonder dit "springt" de tag pas na de server-round-trip.
  // `undefined` = geen override (toon server), anders de zojuist gekozen plan-id
  // (of null voor one-time). Zodra de server onze keuze bevestigt, laten we los.
  const [pendingPlanId, setPendingPlanId] = useState<string | null | undefined>(
    undefined,
  );
  useEffect(() => {
    if (pendingPlanId !== undefined && pendingPlanId === serverPlanId) {
      setPendingPlanId(undefined);
    }
  }, [pendingPlanId, serverPlanId]);

  const activePlanId = pendingPlanId !== undefined ? pendingPlanId : serverPlanId;
  const activePlan = activePlanId
    ? subPlans.find((plan) => plan.id === activePlanId) ?? null
    : null;

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
          <div className={styles.lineHeading}>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              className={styles.lineName}
              onClick={() => layout === 'aside' && close()}
            >
              {product.title}
            </Link>
            {subPlans.length > 0 && (
              <button
                type="button"
                className={`reset ${styles.subTag} ${
                  activePlan ? styles.subTagActive : ''
                }`}
                aria-expanded={subOpen}
                onClick={() => setSubOpen((value) => !value)}
              >
                <span className="ui-nums">
                  <Figures>
                    {activePlan
                      ? `subscription · ${formatInterval(activePlan.name)}`
                      : '+ subscribe'}
                  </Figures>
                </span>
              </button>
            )}
          </div>
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>

        {!hasSizeChoice && variantLabel && (
          <span className={`${styles.lineVariant} ui-nums`}>
            <Figures>{variantLabel}</Figures>
          </span>
        )}

        {subOpen && subPlans.length > 0 && (
          <CartLineSubscriptionOptions
            line={line}
            plans={subPlans}
            activePlanId={activePlanId}
            onSelect={(sellingPlanId) => {
              setPendingPlanId(sellingPlanId);
              setSubOpen(false);
            }}
          />
        )}

        <div className={styles.lineBottom}>
          <div className={styles.controls}>
            {hasSizeChoice && <CartLineSizeToggle line={line} sizes={sizes} />}
            <CartLineQuantity line={line} />
          </div>
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

type SizeVariant = {variantId: string; value: string; available: boolean};

/**
 * Haalt de "Size"-varianten van het product van een regel op, in catalogus-
 * volgorde. Leeg als het product geen Size-optie heeft.
 */
function getSizeVariants(line: CartLine): SizeVariant[] {
  const variants = line.merchandise.product?.variants?.nodes ?? [];
  return variants.flatMap((variant) => {
    const size = variant.selectedOptions.find(
      (option) => option.name.toLowerCase() === 'size',
    );
    return size
      ? [
          {
            variantId: variant.id,
            value: size.value,
            available: variant.availableForSale,
          },
        ]
      : [];
  });
}

/** "Delivery every 2 months" → "every 2 months". */
function formatInterval(name: string) {
  return name.replace(/^delivery\s+/i, '').toLowerCase();
}

// Gedeelde slide-easing, gelijk aan SlidingToggle (zelfde gevoel site-breed).
const SLIDE_DURATION = 0.45;
const SLIDE_EASE = 'power3.out';

/**
 * Size-keuze als sliding-toggle in de OurPhilosophy-stijl: een charcoal randje
 * dat met GSAP naar de actieve maat schuift. Anders dan SlidingToggle commit
 * deze op KLIK (niet hover) via een CartForm — hover zou anders bij elke
 * beweging een variant-switch afvuren. Het randje volgt de échte cart-variant
 * (en schuift mee zodra die na een wissel verandert).
 */
function CartLineSizeToggle({
  line,
  sizes,
}: {
  line: CartLine;
  sizes: SizeVariant[];
}) {
  const {id: lineId, quantity, merchandise, isOptimistic} = line;
  const sellingPlanId = line.sellingPlanAllocation?.sellingPlan?.id;

  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceRef = useRef(false);

  const currentIndex = Math.max(
    0,
    sizes.findIndex((size) => size.variantId === merchandise.id),
  );
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Schuif het randje naar optie `index`. animate=false → direct plaatsen.
  const moveTo = (index: number, animate: boolean) => {
    const el = itemsRef.current[index];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: animate && !reduceRef.current ? SLIDE_DURATION : 0,
      ease: SLIDE_EASE,
      overwrite: true,
    });
  };

  // Mount: plaats het randje (zonder animatie), opnieuw na font-load en bij
  // resize — Osmo schaalt de breedtes mee.
  useEffect(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    if (!root || !indicator) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceRef.current = mq.matches;
    const onMq = (event: MediaQueryListEvent) => {
      reduceRef.current = event.matches;
    };
    mq.addEventListener('change', onMq);

    let mounted = true;
    const place = () => {
      if (mounted) moveTo(currentIndexRef.current, false);
    };
    place();
    void document.fonts.ready.then(place);

    const ro = new ResizeObserver(place);
    ro.observe(root);

    return () => {
      mounted = false;
      mq.removeEventListener('change', onMq);
      ro.disconnect();
      gsap.killTweensOf(indicator);
    };
  }, []);

  // Slide zodra de actieve maat verandert (na een switch).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    moveTo(currentIndex, true);
  }, [currentIndex]);

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Choose size"
      className={`${toggleStyles.toggle} ${styles.sizeToggle}`}
    >
      <span
        ref={indicatorRef}
        className={toggleStyles.indicator}
        aria-hidden="true"
      />
      {sizes.map((size, index) => {
        const active = size.variantId === merchandise.id;
        const lines: CartLineUpdateInput[] = [
          {
            id: lineId,
            merchandiseId: size.variantId,
            quantity,
            ...(sellingPlanId ? {sellingPlanId} : {}),
          },
        ];
        return (
          <CartLineUpdateButton key={size.variantId} lines={lines}>
            <button
              type="submit"
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`reset ${toggleStyles.option}`}
              aria-pressed={active}
              disabled={active || !!isOptimistic || !size.available}
              // Schuif het randje meteen op klik — wacht niet op de server-
              // bevestiging van de variant-wissel. De [currentIndex]-effect
              // corrigeert later naar de werkelijke maat indien nodig.
              onClick={() => moveTo(index, true)}
            >
              <span className="ui-nums">
                <Figures>{size.value}</Figures>
              </span>
            </button>
          </CartLineUpdateButton>
        );
      })}
    </div>
  );
}

type SellingPlanOption = NonNullable<
  CartLine['merchandise']['product']['sellingPlanGroups']
>['nodes'][number]['sellingPlans']['nodes'][number];

/**
 * Uitklapbare subscription-keuze (geopend vanuit de tag achter de producttitel).
 * Kleine pillen in de cart-stijl: per interval één pill plus "one-time". Hiermee
 * kun je het interval veranderen, naar eenmalig wisselen, óf — op een one-time
 * regel — een subscription toevoegen.
 */
function CartLineSubscriptionOptions({
  line,
  plans,
  activePlanId,
  onSelect,
}: {
  line: CartLine;
  plans: SellingPlanOption[];
  activePlanId: string | null;
  onSelect: (sellingPlanId: string | null) => void;
}) {
  const {id: lineId, quantity, merchandise, isOptimistic} = line;

  // De keuzes: elk interval + "one-time" (selling plan wissen). sellingPlanId
  // null = eenmalig.
  const options: {key: string; sellingPlanId: string | null; label: string}[] = [
    ...plans.map((plan) => ({
      key: plan.id,
      sellingPlanId: plan.id,
      label: formatInterval(plan.name),
    })),
    {key: 'one-time', sellingPlanId: null, label: 'one-time'},
  ];

  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.sellingPlanId === activePlanId),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceRef = useRef(false);

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Schuif het randje naar optie `index`. animate=false → direct plaatsen.
  const moveTo = (index: number, animate: boolean) => {
    const el = itemsRef.current[index];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: animate && !reduceRef.current ? SLIDE_DURATION : 0,
      ease: SLIDE_EASE,
      overwrite: true,
    });
  };

  // Mount: plaats het randje op de actieve optie (zonder animatie), opnieuw na
  // font-load en bij resize.
  useEffect(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    if (!root || !indicator) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceRef.current = mq.matches;
    const onMq = (event: MediaQueryListEvent) => {
      reduceRef.current = event.matches;
    };
    mq.addEventListener('change', onMq);

    let mounted = true;
    const place = () => {
      if (mounted) moveTo(activeIndexRef.current, false);
    };
    place();
    void document.fonts.ready.then(place);

    const ro = new ResizeObserver(place);
    ro.observe(root);

    return () => {
      mounted = false;
      mq.removeEventListener('change', onMq);
      ro.disconnect();
      gsap.killTweensOf(indicator);
    };
  }, []);

  const updateLines = (sellingPlanId: string | null): CartLineUpdateInput[] => [
    {id: lineId, merchandiseId: merchandise.id, quantity, sellingPlanId},
  ];

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Subscription"
      className={`${toggleStyles.toggle} ${styles.subToggle}`}
      // Verlaat de rij → randje terug naar de actieve keuze.
      onMouseLeave={() => moveTo(activeIndexRef.current, true)}
    >
      <span
        ref={indicatorRef}
        className={toggleStyles.indicator}
        aria-hidden="true"
      />
      {options.map((option, index) => {
        const active = index === activeIndex;
        return (
          <CartLineUpdateButton
            key={option.key}
            lines={updateLines(option.sellingPlanId)}
          >
            <button
              type="submit"
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`reset ${toggleStyles.option} ${
                active ? styles.subOptionActive : ''
              }`}
              aria-pressed={active}
              disabled={active || !!isOptimistic}
              // Randje schuift mee onder de cursor; klik commit + sluit.
              onMouseEnter={() => moveTo(index, true)}
              onClick={() => onSelect(option.sellingPlanId)}
            >
              <span className="ui-nums">
                <Figures>{option.label}</Figures>
              </span>
            </button>
          </CartLineUpdateButton>
        );
      })}
    </div>
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
      <span className={`${styles.qty} ui-nums`}>
        <Figures>{String(quantity)}</Figures>
      </span>
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
        aria-label="Remove"
      >
        <span className={styles.lineRemoveIcon} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M2.75 4h10.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M6 4V2.9c0-.39.31-.7.7-.7h2.6c.39 0 .7.31.7.7V4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.1 4l.62 9.05c.03.5.45.9.95.9h4.66c.5 0 .92-.4.95-.9L11.9 4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.7 6.5v5M9.3 6.5v5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="sr-only">Remove</span>
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
