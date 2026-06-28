import {useEffect} from 'react';
import {useLocation} from 'react-router';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {getLenisInstance, setLenisInstance} from '~/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  // Reset de scrollpositie bij een echte route-wissel (alleen pathname, niet
  // search-params). Lenis houdt zijn eigen scroll-target bij en reset niet
  // vanzelf bij navigatie → zonder dit blijf je op je oude scroll-offset hangen
  // terwijl de nieuwe pagina rendert. preventScrollReset-navigaties (variant-/
  // subscribe-keuze op de PDP wijzigen alleen de search) blijven ongemoeid.
  const {pathname} = useLocation();
  useEffect(() => {
    getLenisInstance()?.scrollTo(0, {immediate: true});
  }, [pathname]);

  useEffect(() => {
    // lerp bepaalt de smoothing-intensiteit (0–1). Default 0.1 voelt zwaar/
    // floaty; hoger = snappier en dichter bij native scroll. 0.25 ligt dicht
    // tegen native aan zonder de smoothing helemaal te verliezen.
    // wheelMultiplier 1 houdt de scroll-afstand gelijk aan native.
    const lenis = new Lenis({
      lerp: 0.25,
      wheelMultiplier: 1,
    });
    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
