/**
 * Klaviyo server-side helpers. Runs on the Hydrogen/Oxygen server only — the
 * private API key never reaches the client. Talks to the Klaviyo REST API
 * directly; Composio is only used at dev-time to inspect/configure the account.
 *
 * Note on approach: the official `profile-subscription-bulk-create-jobs`
 * endpoint returns 202 but never processes in this account (verified across
 * both opt-in modes over 45+ min). We use the reliable path instead — create
 * the profile, then add it to the list, which sets can_receive_email_marketing.
 */

const KLAVIYO_API = 'https://a.klaviyo.com/api'
// Klaviyo versions its API by a date revision header — pin it.
const KLAVIYO_REVISION = '2024-10-15'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SubscribeResult = {ok: true} | {ok: false; error: string}

export function isValidEmail(email: string) {
  return EMAIL_RE.test(email)
}

function headers(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: KLAVIYO_REVISION,
    'content-type': 'application/json',
    accept: 'application/json',
  }
}

/**
 * Create (or find the existing) profile for an email and return its Klaviyo id.
 * A duplicate returns 409 with the existing id in the error meta.
 */
async function upsertProfile(
  apiKey: string,
  email: string,
): Promise<string | null> {
  const response = await fetch(`${KLAVIYO_API}/profiles/`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({
      data: {type: 'profile', attributes: {email}},
    }),
  })

  if (response.status === 201) {
    const body = (await response.json()) as {data?: {id?: string}}
    return body.data?.id ?? null
  }

  // 409 Conflict → profile already exists; id sits in the error meta.
  if (response.status === 409) {
    const body = (await response.json()) as {
      errors?: {meta?: {duplicate_profile_id?: string}}[]
    }
    return body.errors?.[0]?.meta?.duplicate_profile_id ?? null
  }

  const detail = await response.text()
  console.error(`Klaviyo profile upsert failed (${response.status}): ${detail}`)
  return null
}

/**
 * Subscribe an email to the newsletter list: upsert the profile, then add it
 * to the list. On a single opt-in list this makes them eligible for marketing.
 */
export async function subscribeToNewsletter(
  env: Env,
  email: string,
): Promise<SubscribeResult> {
  const apiKey = env.PRIVATE_KLAVIYO_API_KEY
  const listId = env.KLAVIYO_NEWSLETTER_LIST_ID

  if (!apiKey || !listId) {
    console.error(
      'Klaviyo env vars missing (PRIVATE_KLAVIYO_API_KEY / KLAVIYO_NEWSLETTER_LIST_ID)',
    )
    return {ok: false, error: 'Newsletter is temporarily unavailable.'}
  }

  try {
    const profileId = await upsertProfile(apiKey, email)
    if (!profileId) {
      return {ok: false, error: 'Something went wrong. Please try again.'}
    }

    const response = await fetch(
      `${KLAVIYO_API}/lists/${listId}/relationships/profiles/`,
      {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify({
          data: [{type: 'profile', id: profileId}],
        }),
      },
    )

    // 204 No Content = added to the list.
    if (response.status === 204) return {ok: true}

    const detail = await response.text()
    console.error(`Klaviyo add-to-list failed (${response.status}): ${detail}`)
    return {ok: false, error: 'Something went wrong. Please try again.'}
  } catch (error) {
    console.error('Klaviyo subscribe error:', error)
    return {ok: false, error: 'Something went wrong. Please try again.'}
  }
}
