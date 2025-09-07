import { type RefObject, useLayoutEffect, useRef } from 'react';

type ResizeObserverConfig = {
  elementRef: RefObject<HTMLElement | null>
  callback: (width: number, height: number) => void
  trackWidth?: boolean
  trackHeight?: boolean
  throttleTime?: number
};

export function useResizeObserver(config: ResizeObserverConfig): RefObject<[number, number]> {
  const sizeRef = useRef<[number, number]>([0, 0]);
  const lastFire = useRef<number>(0);

  const {
    trackWidth = true,
    trackHeight = true,
    throttleTime = 250,
  } = config || {};

  useLayoutEffect(() => {
    const element = config.elementRef.current;

    if (!element) return;

    const updateSizeData = () => {
      const now = performance.now();

      if (lastFire.current && lastFire.current + throttleTime > now) {
        return;
      }

      lastFire.current = now;

      const boundingRect = element.getBoundingClientRect();

      const oldRect = sizeRef.current;
      if ((trackWidth && oldRect[0] !== boundingRect.width) || (trackHeight && oldRect[1] !== boundingRect.height)) {
        sizeRef.current = [boundingRect.width, boundingRect.height];
        config.callback(boundingRect.width, boundingRect.height);
      }
    };

    updateSizeData();

    const observer = new ResizeObserver(updateSizeData);
    observer.observe(element);

    return () => observer.disconnect();
  }, [config, throttleTime, trackHeight, trackWidth]);

  return sizeRef;
}
