import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for IntersectionObserver.
 * @param onIntersect Callback when the observed element is intersecting.
 * @param options IntersectionObserver options.
 * @param isActive Whether the observer should be active.
 * @returns Ref callback to assign to the last element.
 */
export function useIntersectionObserver(
  onIntersect: () => void,
  options?: IntersectionObserverInit,
  isActive: boolean = true
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!isActive) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      }, options);

      if (node) observerRef.current.observe(node);
    },
    [onIntersect, options, isActive]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}
