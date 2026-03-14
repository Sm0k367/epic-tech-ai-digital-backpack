import { useRef, useEffect } from 'react';

export function useOnce(fn: () => void) {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      fn();
    }
    // intentionally empty deps — run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
