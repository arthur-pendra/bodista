import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {useAside} from '~/components/Aside';
import {getLenisInstance} from '~/lib/lenis';
import styles from './MegaNav.module.css';

/* ---------------------------------------------------------------- Icons -- */

function BookmarkIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3.75h12a.5.5 0 0 1 .5.5V20.5l-6.5-3.75L5.5 20.5V4.25a.5.5 0 0 1 .5-.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 8L10 12.5L14.5 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ----------------------------------------------------------------- Data -- */

const MARQUEE_PHRASE =
  'WORLDWIDE SHIPPING | © BODISTA — TRUST THE BODY AND FREE THE SKIN';

const TOGGLES = [
  {name: 'shop', label: 'Shop'},
  {name: 'explore', label: 'Explore'},
];

type PanelColumn = {label: string; links: string[]};
type Panel = {columns: PanelColumn[]; media: string};

const PANELS: Record<string, Panel> = {
  shop: {
    columns: [
      {label: 'Body', links: ['Body Oil', 'Body Mist', 'Body Balm']},
      {label: 'Face', links: ['Face Mist', 'Face Oil', 'Serum']},
      {label: 'Rituals', links: ['Sets', 'Gift cards', 'Accessories']},
    ],
    media: 'New arrivals',
  },
  explore: {
    columns: [
      {label: 'Bodista', links: ['About', 'Ingredients', 'Sustainability']},
      {label: 'Journal', links: ['Rituals', 'Stories', 'Stockists']},
    ],
    media: 'Our story',
  },
};

const SEARCH_CATEGORIES = [
  'Body Oil',
  'Face Mist',
  'Body Mist',
  'Sets',
  'Gift cards',
];

const SEARCH_BESTSELLERS = [
  {name: 'Golden Body Oil', price: '€48'},
  {name: 'Rosewater Face Mist', price: '€32'},
  {name: 'Ritual Set', price: '€96'},
  {name: 'Nourishing Balm', price: '€38'},
];

/* ------------------------------------------------------------- Component -- */

export function MegaNav() {
  const rootRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const [langOpen, setLangOpen] = useState(false);
  const {open} = useAside();

  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [langOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const DUR = {
      bgMorph: 0.4,
      contentIn: 0.3,
      contentOut: 0.2,
      stagger: 0.25,
      backdropIn: 0.3,
      backdropOut: 0.2,
      openScale: 0.35,
      closeScale: 0.25,
    };
    const HOVER_ENTER = 120;
    const HOVER_LEAVE = 150;

    const q = (sel: string) => root.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) =>
      Array.from(root.querySelectorAll(sel)) as HTMLElement[];

    const menuWrap = root;
    const navList = q('[data-nav-list]');
    const dropWrapper = q('[data-dropdown-wrapper]');
    const dropContainer = q('[data-dropdown-container]');
    const backdrop = q('[data-menu-backdrop]');
    const toggles = qa('[data-dropdown-toggle]');
    const panels = qa('[data-nav-content]');
    const burger = q('[data-burger-toggle]');
    const backBtn = q('[data-mobile-back]');
    const logo = q('[data-menu-logo]');
    const [lineTop, lineMid, lineBot] = ['top', 'mid', 'bot'].map((id) =>
      q(`[data-burger-line='${id}']`),
    );

    if (!navList || !dropWrapper || !dropContainer || !backdrop || !burger) {
      return;
    }

    const state = {
      isOpen: false,
      activePanel: null as string | null,
      activePanelIndex: -1,
      isMobile: window.innerWidth <= 991,
      mobileMenuOpen: false,
      mobilePanelActive: null as string | null,
      hoverTimer: null as ReturnType<typeof setTimeout> | null,
      leaveTimer: null as ReturnType<typeof setTimeout> | null,
      tl: null as gsap.core.Timeline | null,
      mobileTl: null as gsap.core.Timeline | null,
      mobilePanelTl: null as gsap.core.Timeline | null,
    };

    const getPanel = (name: string | null) =>
      name ? q(`[data-nav-content="${name}"]`) : null;
    const getToggle = (name: string | null) =>
      name ? q(`[data-dropdown-toggle="${name}"]`) : null;
    const getFade = (el: HTMLElement) =>
      Array.from(el.querySelectorAll('[data-menu-fade]')) as HTMLElement[];
    const getNavItems = () =>
      Array.from(
        navList.querySelectorAll('[data-nav-list-item]'),
      ) as HTMLElement[];
    const getIndex = (name: string | null) =>
      toggles.indexOf(getToggle(name) as HTMLElement);
    const stagger = (n: number) => (n <= 1 ? 0 : {amount: DUR.stagger});

    const clearTimers = () => {
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      if (state.leaveTimer) clearTimeout(state.leaveTimer);
      state.hoverTimer = state.leaveTimer = null;
    };

    const killTl = (key: 'tl' | 'mobileTl' | 'mobilePanelTl') => {
      const t = state[key];
      if (t) {
        t.kill();
        state[key] = null;
      }
    };

    const killDropdown = () => {
      killTl('tl');
      gsap.killTweensOf(dropContainer);
      gsap.killTweensOf(backdrop);
      panels.forEach((p) => {
        gsap.killTweensOf(p);
        gsap.killTweensOf(getFade(p));
      });
    };

    const killMobile = () => {
      killTl('mobileTl');
      gsap.killTweensOf([navList, lineTop, lineMid, lineBot]);
    };

    const killMobilePanel = () => {
      killTl('mobilePanelTl');
      gsap.killTweensOf(getNavItems());
      gsap.killTweensOf([backBtn, logo]);
      panels.forEach((p) => {
        gsap.killTweensOf(p);
        gsap.killTweensOf(getFade(p));
      });
    };

    const resetToggles = () =>
      toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'));

    const resetDesktop = () => {
      panels.forEach((p) => {
        gsap.set(p, {
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          xPercent: 0,
        });
        gsap.set(getFade(p), {autoAlpha: 0, x: 0, y: 0});
      });
      gsap.set(dropContainer, {height: 0});
      gsap.set(backdrop, {autoAlpha: 0});
      menuWrap.setAttribute('data-menu-open', 'false');
      resetToggles();
    };

    const setupMobile = () => {
      panels.forEach((p) => {
        gsap.set(p, {
          autoAlpha: 0,
          xPercent: 0,
          visibility: 'visible',
          pointerEvents: 'none',
        });
        gsap.set(getFade(p), {xPercent: 20, autoAlpha: 0});
      });
      gsap.set(getNavItems(), {xPercent: 0, y: 0, autoAlpha: 1});
      gsap.set(navList, {autoAlpha: 0, x: 0});
      gsap.set(backBtn, {autoAlpha: 0});
      gsap.set(logo, {autoAlpha: 1});
      gsap.set(dropContainer, {clearProps: 'height'});
      gsap.set(backdrop, {autoAlpha: 0});
    };

    const measurePanel = (name: string) => {
      const el = getPanel(name);
      if (!el) return 0;
      const s = el.style;
      const prev = [s.visibility, s.opacity, s.pointerEvents];
      Object.assign(s, {visibility: 'visible', opacity: '0', pointerEvents: 'none'});
      const h = el.getBoundingClientRect().height;
      [s.visibility, s.opacity, s.pointerEvents] = prev;
      return h;
    };

    /* DESKTOP — open dropdown */
    const openDropdown = (panelName: string) => {
      if (state.isOpen && state.activePanel === panelName) return;
      if (state.isOpen) return switchPanel(state.activePanel as string, panelName);

      const height = measurePanel(panelName);
      if (!height) return;

      killDropdown();
      resetDesktop();

      const el = getPanel(panelName);
      if (!el) return;
      const fade = getFade(el);
      const toggle = getToggle(panelName);

      state.isOpen = true;
      state.activePanel = panelName;
      state.activePanelIndex = getIndex(panelName);
      menuWrap.setAttribute('data-menu-open', 'true');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');

      gsap.set(dropContainer, {height: 0});

      const tl = gsap.timeline();
      state.tl = tl;
      tl.to(backdrop, {autoAlpha: 1, duration: DUR.backdropIn, ease: 'power2.out'}, 0);
      tl.to(dropContainer, {height, duration: DUR.openScale, ease: 'power3.out'}, 0);
      tl.set(el, {visibility: 'visible', opacity: 1, pointerEvents: 'auto'}, 0.05);
      if (fade.length) {
        tl.fromTo(
          fade,
          {autoAlpha: 0, y: 8},
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.contentIn,
            stagger: stagger(fade.length),
            ease: 'power3.out',
          },
          0.1,
        );
      }
    };

    /* DESKTOP — close dropdown */
    const closeDropdown = () => {
      if (!state.isOpen) return;
      const el = getPanel(state.activePanel);
      const fade = el ? getFade(el) : [];

      killDropdown();

      const tl = gsap.timeline({
        onComplete() {
          state.isOpen = false;
          state.activePanel = null;
          state.activePanelIndex = -1;
          state.tl = null;
          resetDesktop();
        },
      });
      state.tl = tl;
      if (fade.length)
        tl.to(
          fade,
          {autoAlpha: 0, y: -4, duration: DUR.contentOut * 0.7, ease: 'power2.in'},
          0,
        );
      tl.to(dropContainer, {height: 0, duration: DUR.closeScale, ease: 'power2.in'}, 0.05);
      tl.to(backdrop, {autoAlpha: 0, duration: DUR.backdropOut, ease: 'power2.out'}, 0);
      if (el) tl.set(el, {visibility: 'hidden', opacity: 0, pointerEvents: 'none'});
    };

    /* DESKTOP — directional panel switch */
    function switchPanel(fromName: string, toName: string) {
      const dir = getIndex(toName) > getIndex(fromName) ? 1 : -1;
      const fromEl = getPanel(fromName);
      const toEl = getPanel(toName);
      if (!fromEl || !toEl) return;

      const fromFade = getFade(fromEl);
      const toFade = getFade(toEl);
      const toHeight = measurePanel(toName);
      if (!toHeight) return;

      killDropdown();

      panels.forEach((p) => {
        gsap.set(p, {
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          xPercent: 0,
        });
        gsap.set(getFade(p), {autoAlpha: 0, x: 0, y: 0});
      });
      gsap.set(fromEl, {visibility: 'visible', opacity: 1, pointerEvents: 'auto', x: 0});
      if (fromFade.length) gsap.set(fromFade, {autoAlpha: 1, x: 0, y: 0});
      gsap.set(backdrop, {autoAlpha: 1});

      const toToggle = getToggle(toName);
      state.activePanel = toName;
      state.activePanelIndex = getIndex(toName);
      resetToggles();
      if (toToggle) toToggle.setAttribute('aria-expanded', 'true');

      const xOut = dir * -30;
      const xIn = dir * 30;
      const tl = gsap.timeline();
      state.tl = tl;

      if (fromFade.length)
        tl.to(
          fromFade,
          {autoAlpha: 0, x: xOut, duration: DUR.contentOut, ease: 'power2.in'},
          0,
        );
      tl.set(
        fromEl,
        {visibility: 'hidden', opacity: 0, pointerEvents: 'none', xPercent: 0},
        DUR.contentOut,
      );
      if (fromFade.length) tl.set(fromFade, {x: 0}, DUR.contentOut);
      tl.to(dropContainer, {height: toHeight, duration: DUR.bgMorph, ease: 'power3.out'}, 0.05);
      tl.set(
        toEl,
        {visibility: 'visible', opacity: 1, pointerEvents: 'auto', xPercent: 0},
        DUR.contentOut * 0.5,
      );
      if (toFade.length) {
        tl.fromTo(
          toFade,
          {autoAlpha: 0, x: xIn},
          {
            autoAlpha: 1,
            x: 0,
            duration: DUR.contentIn,
            stagger: stagger(toFade.length),
            ease: 'power3.out',
          },
          DUR.contentOut * 0.6,
        );
      }
    }

    /* DESKTOP — hover intent */
    const handleToggleEnter = (e: Event) => {
      if (state.isMobile) return;
      const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
      if (!name) return;
      if (state.leaveTimer) clearTimeout(state.leaveTimer);
      state.leaveTimer = null;
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      state.hoverTimer = setTimeout(
        () => openDropdown(name),
        state.isOpen ? 0 : HOVER_ENTER,
      );
    };

    const handleWrapperEnter = () => {
      if (state.isMobile) return;
      if (state.leaveTimer) clearTimeout(state.leaveTimer);
      state.leaveTimer = null;
    };

    const handleWrapperLeave = () => {
      if (state.isMobile) return;
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      state.hoverTimer = null;
      state.leaveTimer = setTimeout(closeDropdown, HOVER_LEAVE);
    };

    /* close behaviors */
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (state.isMobile) {
        if (state.mobilePanelActive) closeMobilePanel();
        else if (state.mobileMenuOpen) closeMobileMenu();
        return;
      }
      if (state.isOpen) {
        const t = getToggle(state.activePanel);
        closeDropdown();
        if (t) t.focus();
      }
    };

    const handleDocClick = (e: MouseEvent) => {
      if (state.isMobile || !state.isOpen) return;
      if (!(e.target as HTMLElement).closest('[data-menu-wrap]')) closeDropdown();
    };

    /* keyboard navigation */
    const focusFirstLink = (panelName: string) => {
      setTimeout(() => {
        const el = getPanel(panelName);
        if (!el) return;
        const link = el.querySelector('a') as HTMLElement | null;
        if (!link) return;
        gsap.set(link, {visibility: 'visible'});
        link.focus();
      }, 80);
    };

    const handleKeydownOnToggle = (e: KeyboardEvent) => {
      if (state.isMobile) return;
      const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
      if (!name) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (state.isOpen && state.activePanel === name) closeDropdown();
        else {
          openDropdown(name);
          focusFirstLink(name);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!state.isOpen || state.activePanel !== name) openDropdown(name);
        focusFirstLink(name);
      }
      if (e.key === 'Tab' && !e.shiftKey && state.isOpen && state.activePanel === name) {
        e.preventDefault();
        const link = getPanel(name)?.querySelector('a') as HTMLElement | null;
        if (link) link.focus();
      }
    };

    const handleKeydownInPanel = (e: KeyboardEvent) => {
      if (state.isMobile || !state.isOpen) return;
      const el = getPanel(state.activePanel);
      if (!el) return;

      const links = Array.from(el.querySelectorAll('a')) as HTMLElement[];
      const idx = links.indexOf(document.activeElement as HTMLElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(idx + 1) % links.length].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx <= 0) {
          const t = getToggle(state.activePanel);
          if (t) t.focus();
        } else links[idx - 1].focus();
      }
      if (e.key === 'Tab' && !e.shiftKey && idx === links.length - 1) {
        e.preventDefault();
        const curIdx = toggles.indexOf(getToggle(state.activePanel) as HTMLElement);
        const next = curIdx < toggles.length - 1 ? toggles[curIdx + 1] : null;
        closeDropdown();
        if (next) next.focus();
      }
      if (e.key === 'Tab' && e.shiftKey && idx === 0) {
        e.preventDefault();
        const t = getToggle(state.activePanel);
        if (t) t.focus();
      }
    };

    /* MOBILE — burger animation */
    const animateBurger = (toX: boolean) => {
      const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
      if (toX) {
        tl.to(lineTop, {y: '0.3125em', duration: 0.15}, 0);
        tl.to(lineBot, {y: '-0.3125em', duration: 0.15}, 0);
        tl.to(lineMid, {autoAlpha: 0, duration: 0.1}, 0.1);
        tl.to(lineTop, {rotation: 45, duration: 0.2}, 0.15);
        tl.to(lineBot, {rotation: -45, duration: 0.2}, 0.15);
      } else {
        tl.to(lineTop, {rotation: 0, duration: 0.2}, 0);
        tl.to(lineBot, {rotation: 0, duration: 0.2}, 0);
        tl.to(lineTop, {y: 0, duration: 0.15}, 0.15);
        tl.to(lineBot, {y: 0, duration: 0.15}, 0.15);
        tl.to(lineMid, {autoAlpha: 1, duration: 0.1}, 0.15);
      }
      return tl;
    };

    /* MOBILE — menu open/close */
    const openMobileMenu = () => {
      killMobile();
      state.mobileMenuOpen = true;
      menuWrap.setAttribute('data-menu-open', 'true');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      getLenisInstance()?.stop();

      const items = getNavItems();
      const tl = gsap.timeline();
      state.mobileTl = tl;
      tl.add(animateBurger(true), 0);
      tl.to(navList, {autoAlpha: 1, duration: 0.3, ease: 'power2.out'}, 0);
      if (items.length) {
        tl.fromTo(
          items,
          {autoAlpha: 0, y: 12},
          {autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power3.out'},
          0.15,
        );
      }
    };

    const closeMobileMenu = () => {
      const hadPanel = state.mobilePanelActive;
      const panelEl = hadPanel ? getPanel(hadPanel) : null;

      killMobile();
      killMobilePanel();

      menuWrap.setAttribute('data-menu-open', 'false');
      state.mobileMenuOpen = false;
      state.mobilePanelActive = null;
      burger.setAttribute('aria-expanded', 'false');

      const tl = gsap.timeline({
        onComplete() {
          document.body.style.overflow = '';
          getLenisInstance()?.start();
          state.mobileTl = null;
          setupMobile();
        },
      });
      state.mobileTl = tl;
      tl.add(animateBurger(false), 0);
      if (hadPanel && panelEl) {
        tl.to(panelEl, {autoAlpha: 0, duration: 0.3, ease: 'power2.inOut'}, 0.05);
        tl.to(backBtn, {autoAlpha: 0, duration: 0.2, ease: 'power2.in'}, 0.05);
      }
      tl.to(navList, {autoAlpha: 0, duration: 0.3, ease: 'power2.inOut'}, 0.05);
    };

    /* MOBILE — slide-over panels */
    const openMobilePanel = (panelName: string) => {
      const el = getPanel(panelName);
      if (!el) return;
      killMobilePanel();
      state.mobilePanelActive = panelName;

      const navItems = getNavItems();
      const panelFade = getFade(el);

      const tl = gsap.timeline();
      state.mobilePanelTl = tl;

      if (navItems.length) {
        tl.to(
          navItems,
          {xPercent: -10, autoAlpha: 0, duration: 0.35, stagger: 0.03, ease: 'power2.in'},
          0,
        );
      }
      tl.to(logo, {autoAlpha: 0, duration: 0.2, ease: 'power2.in'}, 0);
      tl.to(backBtn, {autoAlpha: 1, duration: 0.25, ease: 'power2.inOut'}, 0.15);
      tl.set(el, {autoAlpha: 1, xPercent: 0, pointerEvents: 'auto'}, 0.2);
      if (panelFade.length) {
        tl.fromTo(
          panelFade,
          {xPercent: 8, autoAlpha: 0},
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.3,
            stagger: stagger(panelFade.length),
            ease: 'power3.out',
          },
          0.25,
        );
      }
    };

    function closeMobilePanel() {
      if (!state.mobilePanelActive) return;
      const el = getPanel(state.mobilePanelActive);
      if (!el) return;
      killMobilePanel();

      const navItems = getNavItems();
      const panelFade = getFade(el);

      const tl = gsap.timeline({
        onComplete() {
          state.mobilePanelActive = null;
          state.mobilePanelTl = null;
        },
      });
      state.mobilePanelTl = tl;

      if (panelFade.length) {
        tl.to(el, {xPercent: 20, autoAlpha: 0, duration: 0.3, ease: 'power2.in'}, 0);
      }
      tl.set(el, {autoAlpha: 0, pointerEvents: 'none'}, 0.25);
      tl.to(backBtn, {autoAlpha: 0, duration: 0.2, ease: 'power2.in'}, 0);
      tl.to(logo, {autoAlpha: 1, duration: 0.25, ease: 'power2.out'}, 0.15);
      if (navItems.length) {
        tl.fromTo(
          navItems,
          {xPercent: -20, autoAlpha: 0},
          {xPercent: 0, autoAlpha: 1, duration: 0.35, stagger: 0.03, ease: 'power3.out'},
          0.25,
        );
      }
    }

    const handleToggleClick = (e: Event) => {
      if (!state.isMobile || !state.mobileMenuOpen) return;
      const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
      if (name) {
        e.preventDefault();
        openMobilePanel(name);
      }
    };

    const handleBurgerClick = () =>
      state.mobileMenuOpen ? closeMobileMenu() : openMobileMenu();

    /* RESIZE */
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const was = state.isMobile;
        state.isMobile = window.innerWidth <= 991;

        if (was && !state.isMobile) {
          killMobile();
          killMobilePanel();
          gsap.set(navList, {clearProps: 'all'});
          gsap.set(getNavItems(), {clearProps: 'all'});
          gsap.set(backBtn, {autoAlpha: 0});
          gsap.set(logo, {clearProps: 'all'});
          gsap.set([lineTop, lineMid, lineBot], {rotation: 0, y: 0, autoAlpha: 1});
          burger.setAttribute('aria-expanded', 'false');
          state.mobileMenuOpen = false;
          state.mobilePanelActive = null;
          document.body.style.overflow = '';
          getLenisInstance()?.start();
          resetDesktop();
        }
        if (!was && state.isMobile) {
          killDropdown();
          state.isOpen = false;
          state.activePanel = null;
          state.activePanelIndex = -1;
          clearTimers();
          menuWrap.setAttribute('data-menu-open', 'false');
          resetToggles();
          setupMobile();
        }
      }, 150);
    };

    /* EVENT BINDING — tracked for cleanup */
    const cleanups: Array<() => void> = [];
    const on = (
      target: Window | Document | HTMLElement,
      type: string,
      handler: EventListenerOrEventListenerObject,
    ) => {
      target.addEventListener(type, handler);
      cleanups.push(() => target.removeEventListener(type, handler));
    };

    const ctx = gsap.context(() => {
      toggles.forEach((btn) => {
        on(btn, 'mouseenter', handleToggleEnter);
        on(btn, 'keydown', handleKeydownOnToggle as EventListener);
        on(btn, 'click', handleToggleClick);
      });
      on(dropWrapper, 'mouseenter', handleWrapperEnter);
      on(dropWrapper, 'mouseleave', handleWrapperLeave);
      panels.forEach((p) => on(p, 'keydown', handleKeydownInPanel as EventListener));
      on(backdrop, 'click', closeDropdown);
      on(document, 'keydown', handleEscape as EventListener);
      on(document, 'click', handleDocClick as EventListener);
      on(burger, 'click', handleBurgerClick);
      if (backBtn) on(backBtn, 'click', closeMobilePanel);
      on(window, 'resize', handleResize);

      if (state.isMobile) setupMobile();
      else resetDesktop();
    }, root);

    /* Thema: het glas past zich aan de achtergrond erachter aan. Donkere
       secties dragen [data-nav-dark]; een detectielijn op het midden van de
       balk bepaalt of de nav over een donkere of lichte achtergrond staat. */
    const setTheme = (t: 'dark' | 'light') =>
      root.setAttribute('data-nav-theme', t);
    const darkSections = Array.from(document.querySelectorAll('[data-nav-dark]'));
    let themeObserver: IntersectionObserver | null = null;
    if (darkSections.length) {
      const barRect = dropWrapper.getBoundingClientRect();
      const lineTop = barRect.bottom;
      const intersecting = new Set<Element>();
      themeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) intersecting.add(e.target);
            else intersecting.delete(e.target);
          });
          setTheme(intersecting.size > 0 ? 'dark' : 'light');
        },
        {
          rootMargin: `-${lineTop}px 0px -${window.innerHeight - lineTop}px 0px`,
          threshold: 0,
        },
      );
      darkSections.forEach((s) => themeObserver?.observe(s));
    } else {
      setTheme('light');
    }

    return () => {
      cleanups.forEach((fn) => fn());
      clearTimers();
      if (resizeTimer) clearTimeout(resizeTimer);
      themeObserver?.disconnect();
      document.body.style.overflow = '';
      getLenisInstance()?.start();
      ctx.revert();
    };
  }, []);

  return (
    <nav
      ref={rootRef}
      data-menu-open="false"
      data-menu-wrap=""
      data-nav-theme="dark"
      className={styles.nav}
    >
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {Array.from({length: 8}).map((_, i) => (
            <span className={styles.marqueePhrase} key={i}>
              {MARQUEE_PHRASE}
            </span>
          ))}
        </div>
      </div>

      <div data-dropdown-wrapper="" className={styles.bar}>
        <div className={styles.barTop}>
          <div data-nav-list="" data-mobile-nav="" className={styles.barInner}>
            <div className={styles.barGroup}>
              {TOGGLES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  data-nav-list-item=""
                  data-dropdown-toggle={t.name}
                  aria-expanded="false"
                  aria-haspopup="true"
                  className={styles.navItem}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.barGroup}>
              <button
                type="button"
                data-nav-list-item=""
                aria-label="Saved"
                className={styles.navIcon}
              >
                <BookmarkIcon className={styles.navIconSvg} />
              </button>
              <div
                ref={langRef}
                data-nav-list-item=""
                className={styles.navLangWrap}
              >
                <button
                  type="button"
                  aria-label="Language"
                  aria-haspopup="true"
                  aria-expanded={langOpen}
                  className={`${styles.navItem} ${styles.navLang}`}
                  onClick={() => setLangOpen((v) => !v)}
                >
                  En
                  <ChevronDown className={styles.navChevron} />
                </button>
                {langOpen && (
                  <div className={styles.langMenu}>
                    {['En', 'Nl', 'Fr', 'De'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        className={styles.langOption}
                        onClick={() => setLangOpen(false)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" data-nav-list-item="" className={styles.navItem}>
                Account
              </button>
              <button
                type="button"
                data-nav-list-item=""
                data-dropdown-toggle="search"
                aria-expanded="false"
                aria-haspopup="true"
                className={styles.navItem}
              >
                Search
              </button>
              <button
                type="button"
                data-nav-list-item=""
                className={`${styles.navItem} ${styles.navCart}`}
                onClick={() => open('cart')}
              >
                Cart
                <span className={styles.cartBadge}>0</span>
              </button>
            </div>
          </div>

          <a
            data-menu-logo=""
            href="#"
            aria-label="Bodista home"
            className={styles.logo}
          >
            <svg
              width="119"
              height="23"
              viewBox="0 0 119 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M81.3755 13.0864C80.3623 12.6722 79.5359 12.2977 78.8927 11.9663C77.6423 11.3144 76.9417 10.5616 76.7979 9.71165C76.7045 9.15338 76.8482 8.66716 77.2255 8.24936C77.6028 7.83516 78.1058 7.61186 78.7382 7.57944C79.7622 7.51821 80.6389 7.84957 81.3683 8.57351C81.7923 8.99491 82.1875 9.52076 82.5648 10.1511C82.5828 10.1835 82.6259 10.1871 82.651 10.1619L84.3757 8.32139L84.3865 8.27817C83.9517 7.85317 83.1145 7.51821 81.8749 7.26609C80.6353 7.01758 79.4712 6.95995 78.3861 7.09321C77.6531 7.18686 77.0063 7.35253 76.4458 7.59025C75.8889 7.82796 75.4505 8.11609 75.1272 8.45465C74.8074 8.79321 74.5631 9.13538 74.3906 9.48834C74.2181 9.84131 74.1032 10.2195 74.0421 10.6229C73.7438 12.5606 74.6744 14.0373 76.8339 15.053C78.8496 15.975 80.2078 16.6629 80.9048 17.1131C81.6019 17.5634 82.0258 18.0892 82.1696 18.6907C82.2307 18.896 82.2702 19.1157 82.2845 19.3426C82.2989 19.5695 82.2702 19.818 82.1983 20.0809C82.1265 20.3439 82.0079 20.5816 81.8498 20.7977C81.6917 21.0102 81.4402 21.1867 81.0988 21.3271C80.7575 21.4676 80.3479 21.5432 79.8736 21.554C78.7166 21.554 77.6279 21.0462 76.6183 20.0305C76.065 19.4723 75.6086 18.8528 75.2457 18.172C75.2278 18.1396 75.1847 18.1324 75.1595 18.1612L73.23 20.2214C73.2085 20.243 73.2085 20.279 73.23 20.3006C73.6576 20.7076 74.3367 21.0894 75.2637 21.446C76.2302 21.8206 77.2938 22.0583 78.4508 22.1627C79.4927 22.2456 80.4449 22.1843 81.3036 21.9826C82.1624 21.7809 82.8558 21.482 83.3804 21.0822C83.9086 20.6824 84.3218 20.2502 84.6308 19.7856C84.9362 19.3174 85.1303 18.8384 85.2129 18.3413C85.6153 16.0398 84.3398 14.2894 81.3827 13.0864"
                fill="#A4883C"
              />
              <path
                d="M29.2188 22.2022C26.8977 22.2022 24.9754 21.4746 23.4483 20.0231C21.9213 18.5681 21.1632 16.742 21.1739 14.5414C21.1847 13.0466 21.5368 11.7248 22.2303 10.5723C22.9238 9.41973 23.8903 8.53372 25.1263 7.91782C26.3659 7.29833 27.7744 6.99219 29.3589 6.99219C31.7699 6.99219 33.6922 7.68732 35.1222 9.08117C36.5522 10.4714 37.2457 12.3227 37.2026 14.6386C37.1702 16.796 36.4265 18.5969 34.9713 20.0411C33.5161 21.4818 31.5974 22.2058 29.2152 22.2058M29.5745 21.5034C30.4117 21.4314 31.1267 21.0604 31.716 20.3905C32.3052 19.7206 32.7328 18.8814 32.9987 17.8693C33.2646 16.8572 33.3939 15.7191 33.3939 14.4513C33.3724 13.1439 33.2035 11.9805 32.8909 10.9649C32.5747 9.94918 32.0968 9.1388 31.4537 8.53732C30.8105 7.93583 30.056 7.6549 29.1865 7.69812C28.3385 7.74854 27.6055 8.11592 26.9875 8.79304C26.3731 9.47376 25.9168 10.331 25.6293 11.3719C25.3383 12.4091 25.1982 13.5581 25.2089 14.8115C25.2197 16.0144 25.3958 17.1274 25.7371 18.1503C26.0785 19.1731 26.5851 20.0015 27.2606 20.6354C27.9361 21.2693 28.705 21.5575 29.5745 21.507"
                fill="#A4883C"
              />
              <path
                d="M58.38 19.6545L58.5058 20.0975L52.6491 22.1144L52.4946 22.0532C52.4946 21.6282 52.5054 21.0627 52.5269 20.3568C51.4203 21.3941 50.001 21.9704 48.2692 22.0856C46.1241 22.2081 44.324 21.549 42.8724 20.1083C41.4172 18.664 40.6914 16.7803 40.6914 14.4572C40.6914 12.3898 41.3705 10.6826 42.7359 9.3248C44.0976 7.97056 45.8331 7.2142 47.9458 7.05933C49.789 6.93327 51.3269 7.16018 52.5593 7.72925C52.5269 5.30891 52.4982 3.88984 52.4659 3.46123C52.4551 3.23433 52.4407 3.05784 52.4192 2.93899C52.3976 2.82013 52.3401 2.70488 52.2503 2.58962C52.1569 2.47797 52.0275 2.40233 51.8622 2.37352C51.582 2.31229 51.158 2.35191 50.5867 2.49958L50.4573 2.01695C51.3772 1.74682 52.4766 1.33263 53.7953 0.896823C55.1139 0.461018 55.9475 0.104449 56.2889 0L56.35 0.0288136C56.2673 3.16229 56.2242 6.87564 56.2242 10.9852C56.2242 13.0093 56.2565 15.4225 56.3176 18.2246C56.3284 18.7757 56.4326 19.1682 56.6266 19.4096C56.8242 19.6509 57.0722 19.7589 57.374 19.7373C57.6722 19.7157 58.01 19.6905 58.3836 19.6617M49.3112 20.4793C50.6478 20.5297 51.7185 20.0939 52.5269 19.1718V18.3146C52.5269 17.8788 52.5305 16.91 52.5413 15.4009C52.5521 13.8954 52.5557 12.7968 52.5557 12.1017C52.5234 11.0536 52.2826 10.1532 51.8263 9.40044C51.37 8.64768 50.7987 8.12904 50.1088 7.8373C49.4189 7.54556 48.6967 7.49874 47.9422 7.69683C46.8032 7.98857 45.966 8.71972 45.4342 9.89027C44.9025 11.0644 44.712 12.6059 44.8665 14.5148C44.9923 16.2473 45.4666 17.6591 46.2894 18.7505C47.1122 19.8418 48.1183 20.418 49.3112 20.4793Z"
                fill="#A4883C"
              />
              <path
                d="M99.6031 19.8352L99.8222 20.1306C99.5025 20.5159 99.118 20.8653 98.6725 21.1823C98.2269 21.4992 97.6089 21.7693 96.8148 21.9998C96.0208 22.2267 95.18 22.306 94.2925 22.234C91.1234 21.9746 89.5389 20.1378 89.5389 16.7234V8.29898H86.8369V7.81635C87.5627 7.76592 88.2526 7.61465 88.9101 7.36614C89.5676 7.11762 90.1785 6.77185 90.7426 6.32885C91.3067 5.88584 91.7846 5.31317 92.1726 4.60003C92.5607 3.89049 92.8122 3.08371 92.9272 2.17969H93.5164L93.4877 7.59664H97.2173V8.29537H93.4877L93.4553 11.9871V14.8973C93.4553 16.4856 93.5236 17.5842 93.6565 18.2C93.9476 19.457 94.5943 20.2242 95.5968 20.5051C96.2615 20.6924 96.9586 20.7248 97.6951 20.606C98.4317 20.4871 99.0677 20.2314 99.6067 19.8352"
                fill="#A4883C"
              />
              <path
                d="M16.0718 9.24587C14.9831 7.87002 13.4309 7.12086 11.4116 6.9948C10.7504 6.95519 10.1001 7.02002 9.46053 7.1893C8.82455 7.35858 8.27482 7.58908 7.8149 7.87362C7.35499 8.15815 6.96694 8.44629 6.65075 8.73803C6.33456 9.02977 6.1082 9.29989 5.97526 9.54841C5.97526 5.46048 5.99682 2.30179 6.03634 0.0831436L5.94292 0.00390625C5.55128 0.126364 0.395237 1.97404 0 2.08569L0.150908 2.49268C0.689867 2.36662 1.12463 2.3162 1.45519 2.33781C1.83605 2.35942 2.05164 2.63315 2.09116 3.1626C2.13428 3.67044 2.15224 6.27807 2.15224 10.9783C2.15224 13.5535 2.26722 21.5745 2.278 21.6573H2.63012V21.6645L5.1776 20.7785C6.63638 21.7798 8.4365 22.2192 10.5887 22.0751C11.8643 22.0031 13.0177 21.6141 14.0525 20.9082C15.0873 20.2022 15.9029 19.2838 16.4993 18.1529C17.0958 17.0219 17.4335 15.7757 17.5162 14.4179C17.6419 12.3433 17.1605 10.6181 16.0718 9.24227M13.6357 15.1202C13.6033 16.0747 13.4524 16.9967 13.1757 17.8827C12.9027 18.7688 12.5003 19.5323 11.9721 20.1734C11.4439 20.8109 10.8439 21.1891 10.172 21.3008C8.98265 21.4988 7.99096 21.1675 7.1969 20.3139C6.40643 19.4567 6.0076 18.2357 6.0076 16.6474V10.4668C6.53578 9.72849 7.12144 9.19905 7.7646 8.87849C8.40417 8.55434 9.01858 8.40667 9.59706 8.42828C10.869 8.4571 11.8787 9.06218 12.626 10.2327C13.3734 11.4069 13.7075 13.0349 13.6357 15.1202Z"
                fill="#A4883C"
              />
              <path
                d="M118.058 19.8291C117.745 19.8543 117.673 19.8615 117.393 19.8795C117.091 19.9011 116.843 19.793 116.646 19.5517C116.448 19.314 116.344 18.9178 116.336 18.3668C116.329 18.0786 116.326 17.7941 116.319 17.5132C116.319 17.5132 116.268 8.9231 116.265 8.44048C116.257 7.95785 116.25 7.67331 116.243 7.59048H115.887L113.491 8.42247C113.034 8.09111 112.582 7.86781 112.582 7.86781C111.349 7.29874 109.811 7.07183 107.968 7.19789C105.856 7.35276 104.12 8.10912 102.758 9.46336C101.397 10.8176 100.714 12.5284 100.714 14.5958C100.714 16.9189 101.44 18.8062 102.895 20.2468C104.35 21.6875 106.15 22.3502 108.292 22.2242C110.02 22.1089 111.439 21.5327 112.549 20.4954C112.528 21.2013 112.517 21.7668 112.517 22.1918L112.672 22.253L118.223 20.3333L118.061 19.8182L118.058 19.8291ZM112.56 15.5502C112.549 17.0557 112.546 18.0282 112.546 18.464V19.3212C111.737 20.2468 110.667 20.6827 109.33 20.6286C108.137 20.5674 107.131 19.9911 106.308 18.8998C105.485 17.8121 105.011 16.4002 104.885 14.6642C104.731 12.7553 104.921 11.2138 105.453 10.0396C105.988 8.86548 106.822 8.13433 107.961 7.8462C108.719 7.6481 109.441 7.69492 110.128 7.98666C110.818 8.2784 111.389 8.79705 111.845 9.5498C112.301 10.3026 112.546 11.203 112.575 12.2511C112.575 12.9462 112.567 14.0483 112.56 15.5502Z"
                fill="#A4883C"
              />
              <path
                d="M65.4442 4.40387C66.055 4.40387 66.5688 4.18417 66.9892 3.75196C67.4096 3.31616 67.618 2.79031 67.618 2.17802C67.618 1.63777 67.4096 1.16955 66.9892 0.769757C66.5688 0.369969 66.055 0.171875 65.4442 0.171875C64.8333 0.171875 64.3375 0.369969 63.9279 0.769757C63.5183 1.16955 63.3135 1.63777 63.3135 2.17802C63.3135 2.79031 63.5183 3.31616 63.9279 3.75196C64.3375 4.18777 64.8405 4.40387 65.4442 4.40387Z"
                fill="#A4883C"
              />
              <path
                d="M63.7374 22.1145L63.5793 22.0532C63.5793 21.6462 63.5865 21.3257 63.6044 20.681V20.2848V19.0998V18.2426C63.6044 18.0157 63.6044 17.6447 63.608 17.1297V14.4825C63.608 12.1486 63.5865 10.7259 63.5469 10.218C63.5362 10.0848 63.529 10.0019 63.5218 9.96952C63.5182 9.94071 63.5038 9.87228 63.4823 9.76783C63.4607 9.66338 63.4356 9.59855 63.4032 9.56613C63.3709 9.53732 63.3242 9.5013 63.2631 9.46528C63.202 9.42927 63.123 9.40406 63.0295 9.39685C62.7601 9.37524 62.3469 9.40766 61.7863 9.4905L61.6318 8.94664C63.5577 8.34516 65.5087 7.62482 67.4885 6.92969L67.5819 6.99092C67.5388 9.7102 67.5352 16.9424 67.564 18.2822C67.5748 18.8333 67.679 19.2259 67.873 19.4672C68.0706 19.7085 68.3185 19.8166 68.6203 19.795C68.9222 19.7733 69.2563 19.7481 69.63 19.7193L69.727 20.1011L63.7338 22.1253L63.7374 22.1145Z"
                fill="#A4883C"
              />
            </svg>
          </a>

          <button
            data-burger-toggle=""
            aria-label="toggle menu"
            aria-expanded="false"
            className={styles.burger}
          >
            <span data-burger-line="top" className={styles.burgerLine} />
            <span data-burger-line="mid" className={styles.burgerLine} />
            <span data-burger-line="bot" className={styles.burgerLine} />
          </button>

          <div data-mobile-back="" className={styles.back}>
            <button
              type="button"
              aria-label="back to menu"
              className={styles.navItem}
            >
              ← Back
            </button>
          </div>
        </div>

        <div data-dropdown-container="" className={styles.barDrop}>
          {TOGGLES.map((t) => (
            <div
              key={t.name}
              data-panel-state=""
              data-nav-content={t.name}
              role="region"
              aria-label={`${t.label} menu`}
              className={styles.dropdownPanel}
            >
              <div className={styles.dropdownInner}>
                <div className={styles.panelCols}>
                  {PANELS[t.name].columns.map((col, i) => (
                    <div key={i} data-menu-fade="" className={styles.panelCol}>
                      <span data-menu-fade="" className={styles.panelLabel}>
                        {col.label}
                      </span>
                      <ul className={styles.panelList}>
                        {col.links.map((l, j) => (
                          <li data-menu-fade="" key={j}>
                            <a href="#" className={styles.panelLink}>
                              {l}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div data-menu-fade="" className={styles.panelMedia}>
                  <div className={styles.panelPhoto} />
                  <span className={styles.panelPhotoLabel}>
                    {PANELS[t.name].media}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div
            data-panel-state=""
            data-nav-content="search"
            role="region"
            aria-label="Search menu"
            className={styles.dropdownPanel}
          >
            <div className={styles.searchInner}>
              <div data-menu-fade="" className={styles.searchField}>
                <input
                  type="search"
                  placeholder="Search products…"
                  aria-label="Search products"
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.searchCats}>
                {SEARCH_CATEGORIES.map((c) => (
                  <a
                    href="#"
                    key={c}
                    data-menu-fade=""
                    className={styles.searchChip}
                  >
                    <span className={styles.searchChipThumb} />
                    <span className={styles.searchChipLabel}>{c}</span>
                  </a>
                ))}
              </div>

              <div className={styles.searchBest}>
                <span data-menu-fade="" className={styles.panelLabel}>
                  Best sellers
                </span>
                <div className={styles.searchBestRow}>
                  {SEARCH_BESTSELLERS.map((p) => (
                    <a
                      href="#"
                      key={p.name}
                      data-menu-fade=""
                      className={styles.searchCard}
                    >
                      <span className={styles.searchCardPhoto} />
                      <span className={styles.searchCardName}>{p.name}</span>
                      <span className={styles.searchCardPrice}>{p.price}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-menu-backdrop="" className={styles.backdrop} />
    </nav>
  );
}
