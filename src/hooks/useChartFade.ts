import { useEffect, useRef, useState } from 'react';
import type { Filters } from '@/data/mockData';

/**
 * Returns a CSS opacity class that briefly fades out then back in
 * whenever the filters object changes. This signals data refresh to the user.
 */
export function useChartFade(filters: Filters): string {
  const [fading, setFading] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setFading(true);
    const t = setTimeout(() => setFading(false), 220);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return fading
    ? 'opacity-0 transition-opacity duration-[180ms]'
    : 'opacity-100 transition-opacity duration-[220ms]';
}
