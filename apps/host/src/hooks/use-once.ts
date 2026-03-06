import { useEffect, useRef } from 'react';

export function useOnce(fn: () => void) {
  const ran = useRef(false);
  useEffect(() => {
    if (!ran.current) {
      ran.current = true;
      fn();
    }
  }, [fn]);
}
