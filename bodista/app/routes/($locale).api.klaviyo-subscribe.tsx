import {data} from 'react-router'
import type {Route} from './+types/($locale).api.klaviyo-subscribe'
import {isValidEmail, subscribeToNewsletter} from '~/lib/klaviyo.server'

// Resource route (no UI) — the newsletter form posts here via useFetcher.
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data({ok: false, error: 'Method not allowed'}, {status: 405})
  }

  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim()
  // Honeypot: bots fill hidden fields, humans never do.
  const honeypot = String(formData.get('company') ?? '')

  // Silently accept bots — don't reveal the trap.
  if (honeypot) return data({ok: true})

  if (!email || !isValidEmail(email)) {
    return data(
      {ok: false, error: 'Please enter a valid email address.'},
      {status: 400},
    )
  }

  const result = await subscribeToNewsletter(context.env, email)
  if (!result.ok) {
    return data({ok: false, error: result.error}, {status: 502})
  }

  return data({ok: true})
}
