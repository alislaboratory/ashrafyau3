import { useEffect, useRef } from 'react';
import { gateAnim } from '../lib/gateAnim';

export function useGateAnim(factory, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !factory) return;
    const ctrl = factory(canvas);
    const anim = gateAnim(canvas, ctrl);
    return () => anim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
