# Klaviyo — status & to-do

Aantekeningen bij de Klaviyo-koppeling met de Hydrogen-storefront.
Laatst bijgewerkt: 2026-07-01.

## Config

- Account: **BODISTA** (via Composio, account `klaviyo_rigid-arhar`). Nooit DARETODREAM / niet de built-in Klaviyo-MCP (= Candela).
- Public site-ID (company_id): `QQ5xwM`
- Email List: `SMhrFa` — staat nu op **single opt-in** (was double).
- Sending-domein `hello.bodista.com` = Active/geverifieerd (DNS groen).
- Env (`.env`, gitignored): `PRIVATE_KLAVIYO_API_KEY`, `PUBLIC_KLAVIYO_COMPANY_ID`, `KLAVIYO_NEWSLETTER_LIST_ID`.

## Wat werkt ✅

- **Onsite tracking** — `klaviyo.js` laadt via `root.tsx` (Active on Site). CSP-domeinen staan in `entry.server.tsx`.
- **Nieuwsbrief-signup** — footer-form → `($locale).api.klaviyo-subscribe.tsx` → `app/lib/klaviyo.server.ts`.
  Getest end-to-end: profiel komt op de Email List met `can_receive_email_marketing: true` → ontvangt mails.

## Bekende kwestie ⚠️ — subscribe-endpoint

Het officiële endpoint `profile-subscription-bulk-create-jobs` geeft **202 maar verwerkt nooit**
in dit account (getest in beide opt-in-modes, ook na 45+ min — geen profiel, geen consent).

- Niet de oorzaak: flows, domein, afzender, key, plan-basics (directe `POST /profiles` en add-to-list werken wél).
- **Workaround (nu in gebruik):** profiel aanmaken + toevoegen aan de lijst. Zet `can_receive: true`,
  maar **geen formele consent-timestamp/bron** (`consent: NEVER_SUBSCRIBED`).

## To-do

- [ ] **Klaviyo-support ticket**: waarom verwerkt `profile-subscription-bulk-create-jobs` niet? Doel: formele consent + double opt-in terug.
- [ ] Zodra dat werkt: `klaviyo.server.ts` terug naar het subscribe-endpoint + lijst weer op **double opt-in** (AVG).
- [ ] **Welcome-flow** bouwen (trigger: "toegevoegd aan Email List").
- [ ] Overige flows: abandoned cart, browse abandonment, post-purchase.
- [ ] **Custom events** toevoegen (Viewed Product, Added to Cart) — onsite tracking uitbreiden.
- [ ] Oxygen-env (productie): dezelfde 3 Klaviyo-vars zetten.
- [ ] Click-tracking domein (Klaviyo meldt "upgrade required").

## Bredere roadmap (los van Klaviyo-basis)

- [ ] Reviews (Okendo of Judge.me — headless + Klaviyo-koppeling)
- [ ] Back-in-stock knop op productpagina (metric bestaat al in Klaviyo)
- [ ] Cookie-consent banner (AVG) — `root.tsx` `withPrivacyBanner` staat nu op `false`
- [ ] SMS (SMS-lijst bestaat al)
- [ ] Subscriptions-klantportaal checken (Shopify Subscriptions / Recharge)
- [ ] Routine-/huidquiz → conversie + Klaviyo-profieldata
