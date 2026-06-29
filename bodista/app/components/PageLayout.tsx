import {Await} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
  MenuProductsQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {SiteFooter} from '~/components/home/SiteFooter';
import {HeaderMenu} from '~/components/Header';
import {SimpleHeader} from '~/components/SimpleHeader';
import {GridOverlay} from '~/components/GridOverlay';
import {CartMain} from '~/components/CartMain';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  menuProducts: Promise<MenuProductsQuery | null>;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  header,
  isLoggedIn,
  publicStoreDomain,
  menuProducts,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} menuProducts={menuProducts} />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      <SimpleHeader cart={cart} menuProducts={menuProducts} />
      {import.meta.env.DEV && <GridOverlay />}
      <main>{children}</main>
      <SiteFooter />
    </Aside.Provider>
  );
}

function CartAside({
  cart,
  menuProducts,
}: {
  cart: PageLayoutProps['cart'];
  menuProducts: PageLayoutProps['menuProducts'];
}) {
  return (
    <Aside type="cart">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return (
              <CartMain
                cart={cart}
                layout="aside"
                recommendations={menuProducts}
              />
            );
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
