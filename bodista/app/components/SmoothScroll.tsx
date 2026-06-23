import {useEffect} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {setLenisInstance} from '~/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    // lerp bepaalt de smoothing-intensiteit (0–1). Default 0.1 voelt zwaar/
    // floaty; hoger = snappier en dichter bij native scroll. wheelMultiplier 1
    // houdt de scroll-afstand gelijk aan native.
    const lenis = new Lenis({
      lerp: 0.18,
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
