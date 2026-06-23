import styles from './BrandGuide.module.css';

const MARK = 'I  II  II  I';
const LOGOTYPE = '/assets/brand/bodista-logotype.png';

const SWATCHES = [
  {
    bg: '#c5a55a',
    name: 'Gold',
    use: 'Logotype · Palindrome on dark · CTAs',
    hex: '#C5A55A',
    dark: false,
  },
  {
    bg: '#b5b0a4',
    name: 'Silver',
    use: 'Serum accent · Step II markers',
    hex: '#B5B0A4',
    dark: false,
  },
  {
    bg: '#e5e0d5',
    name: 'Silver',
    use: 'Serum accent · Step II markers',
    hex: '#B5B0A4',
    dark: false,
  },
  {
    bg: '#222222',
    name: 'Charcoal',
    use: 'Hero & closing sections',
    hex: '#222222',
    dark: true,
  },
  {
    bg: '#5c594f',
    name: 'Body Grey',
    use: 'Body copy · Explanatory text',
    hex: '#5C594F',
    dark: true,
  },
  {
    bg: '#f4eee2',
    name: 'Warm White',
    use: 'Light backgrounds · Oil column',
    hex: '#F4EEE2',
    dark: false,
  },
];

const SectionHead = ({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: string;
  aside: string;
}) => (
  <div className={styles.head}>
    <div className={styles.headLeft}>
      {eyebrow && <span className={styles.headEyebrow}>{eyebrow}</span>}
      <h2 className={styles.headTitle}>{title}</h2>
    </div>
    <p className={styles.headAside}>{aside}</p>
  </div>
);

const Rules = ({items}: {items: string[]}) => (
  <div className={styles.rules}>
    <span className={styles.rulesLabel}>Rules</span>
    <div className={styles.rulesList}>
      {items.map((rule) => (
        <p key={rule}>{`—  ${rule}`}</p>
      ))}
    </div>
  </div>
);

const RegisterHead = ({
  num,
  title,
  titleClass,
  lead,
  sub,
}: {
  num: string;
  title: string;
  titleClass?: string;
  lead: string;
  sub: string;
}) => (
  <div className={styles.regHead}>
    <div className={styles.regNum}>
      <span className={styles.regNumLabel}>{num}</span>
      <h2 className={`${styles.regNumTitle} ${titleClass ?? ''}`}>{title}</h2>
    </div>
    <div className={styles.regPurpose}>
      <p className={styles.regLead}>{lead}</p>
      <p className={styles.regSub}>{sub}</p>
    </div>
  </div>
);

const Example = ({
  sample,
  eyebrow,
  desc,
}: {
  sample: React.ReactNode;
  eyebrow: string;
  desc: string;
}) => (
  <div className={styles.ex}>
    <div className={styles.exSample}>{sample}</div>
    <div className={styles.exLabel}>
      <span className={styles.exLabelEyebrow}>{eyebrow}</span>
      <span className={styles.exLabelDesc}>{desc}</span>
    </div>
  </div>
);

export function BrandGuide() {
  return (
    <div className={styles.guide}>
      <div className={styles.inner}>
        {/* ---------------------------------------------------- Header --- */}
        <header className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.ink}>BODISTA</span>
            <span className={styles.muted}>Brand Guidelines · April 2026</span>
          </div>
          <div className={styles.hairline} />
          <h1 className={styles.title}>Typography System.</h1>
          <p className={styles.lede}>
            Three registers. One voice. The discipline of quiet confidence.
          </p>
        </header>

        {/* --------------------------------------------------- Colours --- */}
        <section className={styles.section}>
          <SectionHead
            title="Colour"
            aside="Three core colours. Two accents. Used sparingly."
          />
          <div className={styles.hairline} />
          <div className={styles.swatchRow}>
            {SWATCHES.map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className={`${styles.swatch} ${s.dark ? styles.swatchDark : ''}`}
                style={{backgroundColor: s.bg}}
              >
                <h3 className={styles.swatchName}>{s.name}</h3>
                <div className={styles.swatchMeta}>
                  <p className={styles.swatchUse}>{s.use}</p>
                  <p className={styles.swatchHex}>{s.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------- Register 01 --- */}
        <section className={styles.section}>
          <RegisterHead
            num="Register 01"
            title="lowercase."
            lead="Brand voice. Taglines. Philosophy. The intimate register."
            sub="Signals confidence without volume. A brand that doesn't capitalise because it doesn't need to."
          />
          <div className={styles.hairline} />
          <div className={styles.examples}>
            <Example
              sample={
                <img className={styles.logotype} src={LOGOTYPE} alt="bodista" />
              }
              eyebrow="LOGOTYPE"
              desc="Always lowercase. The house mark."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.display} ${styles.s56}`}
                >
                  two elements. one intelligent ritual.
                </p>
              }
              eyebrow="PRIMARY TAGLINE"
              desc="Lowercase. Periods as rhythm and breath."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.display} ${styles.s40}`}
                >
                  trust the body. free the skin.
                </p>
              }
              eyebrow="BRAND SIGN-OFF"
              desc="The closing exhale. Always lowercase."
            />
          </div>
          <Rules
            items={[
              'Applies to all taglines, brand philosophy lines, and sign-offs.',
              'Periods are used as rhythmic punctuation, not just grammatical stops.',
              'Never appears on product packaging descriptors.',
            ]}
          />
        </section>

        {/* ----------------------------------------------- Register 02 --- */}
        <section className={styles.section}>
          <RegisterHead
            num="Register 02"
            title="Sentence case."
            lead="Architecture. Proper names. Navigation. The structural register."
            sub="Signals a named entity within the house. Something with identity."
          />
          <div className={styles.hairline} />
          <div className={styles.examples}>
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.display} ${styles.s64}`}
                >
                  Universāl Protocols
                </p>
              }
              eyebrow="MASTER SYSTEM"
              desc="Names the overarching ritual framework."
            />
            <Example
              sample={
                <p className={`${styles.sample} ${styles.s56}`}>
                  Universāl Santal
                </p>
              }
              eyebrow="PRODUCT NAME"
              desc="Display Italic for proper names of products."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.display} ${styles.s36}`}
                >
                  Facial Rituals · Body Rituals · Hair Rituals
                </p>
              }
              eyebrow="CATEGORIES"
              desc="No 'The' before category names."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.display} ${styles.s36}`}
                >
                  The Circadian Protocols
                </p>
              }
              eyebrow="KNOWLEDGE PROTOCOL"
              desc="Knowledge protocols retain 'The'."
            />
          </div>
          <Rules
            items={[
              'Applies to all proper names, category labels, navigation, and body copy.',
              'Product descriptors use sentence case on all digital surfaces (web, social, email).',
              "No article 'The' before category names: Facial Rituals, not The Facial Rituals.",
              "Knowledge protocols keep 'The': The Circadian Protocols, The Cortisol Protocols.",
            ]}
          />
        </section>

        {/* ----------------------------------------------- Register 03 --- */}
        <section className={styles.section}>
          <RegisterHead
            num="Register 03"
            title="UPPERCASE."
            titleClass={styles.regNumTitleSemibold}
            lead="Product descriptors on physical packaging. Functional labels. The object register."
            sub="Signals what the product is — not what it's called. Lives on bottles and boxes only."
          />
          <div className={styles.hairline} />
          <div className={styles.examples}>
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.semibold} ${styles.s88}`}
                >
                  FACE OIL
                </p>
              }
              eyebrow="BOTTLE DESCRIPTOR"
              desc="What the product is. Wide tracking for object presence."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.semibold} ${styles.s64}`}
                >
                  THE SERUM
                </p>
              }
              eyebrow="BOTTLE DESCRIPTOR"
              desc="Functional label, not a proper name."
            />
            <Example
              sample={
                <p
                  className={`${styles.sample} ${styles.semibold} ${styles.s32}`}
                >
                  BODY OIL · HAIR SERUM · MOUTHWASH
                </p>
              }
              eyebrow="FUTURE PACKAGING"
              desc="Reserved for physical surfaces only."
            />
          </div>
          <Rules
            items={[
              'Appears exclusively on physical product packaging.',
              "Distinguishes the functional descriptor from the product's proper name.",
              'Never appears on the website, social media, email, or any digital surface.',
            ]}
          />
        </section>

        {/* -------------------------------------------------- The Mark --- */}
        <section className={styles.section}>
          <SectionHead
            eyebrow="The Mark"
            title={MARK}
            aside="A palindrome. Outside the registers. The brand's universal mark."
          />
          <div className={styles.hairline} />
          <div className={styles.markRow}>
            <div className={`${styles.markPanel} ${styles.markDark}`}>
              <p className={`${styles.markGlyph} ${styles.markGlyphGold}`}>
                {MARK}
              </p>
              <p className={`${styles.markCaption} ${styles.onDark}`}>
                Gold on Charcoal · #C5A55A
              </p>
            </div>
            <div className={`${styles.markPanel} ${styles.markLight}`}>
              <p className={`${styles.markGlyph} ${styles.markGlyphInk}`}>
                {MARK}
              </p>
              <p className={`${styles.markCaption} ${styles.onLight}`}>
                Charcoal on Warm White · #222222
              </p>
            </div>
          </div>
          <Rules
            items={[
              'Always Roman numerals. Never Arabic (1 2 2 1).',
              'Always serif typeface. No periods between numerals.',
              'Largest typographic element on any surface it appears on.',
              'Gold on dark · Charcoal on light. Never silver. Never grey.',
              'Universal mark: applies to all categories, not to any single one.',
            ]}
          />
        </section>

        {/* ------------------------------------------------- Hierarchy --- */}
        <section className={styles.section}>
          <SectionHead
            eyebrow="Hierarchy"
            title="One surface. Six layers."
            aside="When multiple registers meet, the order is fixed. No layer leapfrogs another."
          />
          <div className={styles.hairline} />
          <div className={styles.stack}>
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>01</span>
              <span className={styles.stackLabel}>House logotype</span>
              <span className={styles.stackCase}>Lowercase</span>
              <img className={styles.stackLogo} src={LOGOTYPE} alt="bodista" />
            </div>
            <div className={styles.stackDivider} />
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>02</span>
              <span className={styles.stackLabel}>Master system</span>
              <span className={styles.stackCase}>Sentence case</span>
              <p className={styles.stackSample} style={{fontSize: '1.75em'}}>
                Universāl Protocols
              </p>
            </div>
            <div className={styles.stackDivider} />
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>03</span>
              <span className={styles.stackLabel}>Category</span>
              <span className={styles.stackCase}>Sentence case</span>
              <p className={styles.stackSample} style={{fontSize: '1.625em'}}>
                Facial Rituals
              </p>
            </div>
            <div className={styles.stackDivider} />
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>04</span>
              <span className={styles.stackLabel}>Symbol</span>
              <span className={styles.stackCase}>—</span>
              <p
                className={`${styles.stackSample} ${styles.stackMark}`}
                style={{fontSize: '2em'}}
              >
                {MARK}
              </p>
            </div>
            <div className={styles.stackDivider} />
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>05</span>
              <span className={styles.stackLabel}>Explanatory copy</span>
              <span className={styles.stackCase}>Sentence case</span>
              <p className={styles.stackSample} style={{fontSize: '1.375em'}}>
                Two botanical liquids, oil &amp; serum…
              </p>
            </div>
            <div className={styles.stackDivider} />
            <div className={styles.stackRow}>
              <span className={styles.stackNum}>06</span>
              <span className={styles.stackLabel}>Tagline</span>
              <span className={styles.stackCase}>Lowercase</span>
              <p className={styles.stackSample} style={{fontSize: '1.625em'}}>
                two elements. one intelligent ritual.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Applications --- */}
        <section className={styles.section}>
          <SectionHead
            eyebrow="In Use"
            title="Applications."
            aside="The system in three contexts. Bottle, web, social."
          />
          <div className={styles.hairline} />
          <div className={styles.appsRow}>
            {/* Bottle */}
            <div className={styles.appCol}>
              <div className={`${styles.appCanvas} ${styles.bottleCanvas}`}>
                <div className={styles.bottleTop}>
                  <p className={styles.bottleProto}>Universāl Protocols</p>
                  <p className={styles.bottleName}>Universāl Santal</p>
                </div>
                <p className={styles.bottleMark}>{MARK}</p>
                <div className={styles.bottleBot}>
                  <p className={styles.bottleDesc}>FACE OIL</p>
                  <p className={styles.bottleVol}>30 ML · 1.0 FL OZ</p>
                </div>
              </div>
              <p className={styles.appCaption}>
                Bottle label · Sentence case + Uppercase descriptor
              </p>
            </div>

            {/* Web */}
            <div className={styles.appCol}>
              <div className={`${styles.appCanvas} ${styles.webCanvas}`}>
                <div className={styles.webNav}>
                  <p className={styles.webLogo}>bodista</p>
                  <div className={styles.webLinks}>
                    <span className={styles.active}>Facial</span>
                    <span>Body</span>
                    <span>Hair</span>
                    <span>Protocols</span>
                  </div>
                </div>
                <div className={styles.hairline} />
                <p className={styles.webCrumb}>Facial Rituals</p>
                <p className={styles.webTitle}>Universāl Santal</p>
                <div className={styles.webDesc}>
                  <p className={styles.webOil}>The Face Oil</p>
                  <p className={styles.webMark}>{MARK}</p>
                  <p className={styles.webBody}>
                    Two botanical liquids, oil &amp; serum. A sensory sequence
                    in four steps.
                  </p>
                </div>
                <p className={styles.webTagline}>
                  two elements. one intelligent ritual.
                </p>
              </div>
              <p className={styles.appCaption}>
                Web product page · Sentence case throughout, lowercase tagline
              </p>
            </div>

            {/* Social */}
            <div className={styles.appCol}>
              <div className={`${styles.appCanvas} ${styles.socCanvas}`}>
                <p className={styles.socLogo}>bodista</p>
                <div className={styles.socMid}>
                  <p className={styles.socMark}>{MARK}</p>
                  <p className={styles.socTagline}>
                    two elements.
                    <br />
                    one intelligent ritual.
                  </p>
                </div>
                <div className={styles.socBot}>
                  <p className={styles.socCat}>Facial Rituals</p>
                  <p className={styles.socSignoff}>
                    trust the body. free the skin.
                  </p>
                </div>
              </div>
              <p className={styles.appCaption}>
                Social post · Logotype + Symbol + Tagline + Sign-off (no
                uppercase)
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Footer --- */}
        <footer className={styles.footer}>
          <div className={styles.hairline} />
          <div className={styles.footerRow}>
            <p className={styles.footerLeft}>
              BODISTA · Typography System · v1.0
            </p>
            <p>Novela Display Regular · Studio Walters</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
