import { useEffect, useRef } from 'react';

export function useUpdate(callback: any, deps: any[] = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      callback();
    }
  }, deps); //eslint-disable-line react-hooks/exhaustive-deps
}
