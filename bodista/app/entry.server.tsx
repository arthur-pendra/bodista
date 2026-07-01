import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Klaviyo domains go on default-src so img-src/script-src keep inheriting
    // the Shopify defaults (cdn.shopify.com) — setting those directives
    // explicitly would break that inheritance and block Shopify images.
    defaultSrc: [
      'blob:',
      'https://static.klaviyo.com',
      'https://a.klaviyo.com',
      'https://www.klaviyo.com',
    ],
    workerSrc: ["'self'", 'blob:'],
    // connect-src has its own Hydrogen default, so Klaviyo is merged in here.
    connectSrc: [
      'https://a.klaviyo.com',
      'https://static.klaviyo.com',
      'https://static-tracking.klaviyo.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
