import { useState, useEffect, useCallback } from "react";

export const useStageSize = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const updateStageSize = useCallback(() => {
    if (containerRef.current) {
      const styles = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const paddingTop = parseFloat(styles.paddingTop) || 0;
      const paddingBottom = parseFloat(styles.paddingBottom) || 0;

      const containerWidth =
        containerRef.current.offsetWidth - paddingLeft - paddingRight;
      const containerHeight =
        containerRef.current.offsetHeight - paddingTop - paddingBottom;
      const isMobile = window.innerWidth < 1024;
      const aspectRatio = 4 / 3;

      if (isMobile) {
        setStageSize({
          width: Math.max(containerWidth, 0),
          height: Math.max(containerHeight, 0),
        });
      } else {
        // On desktop, maintain 4/3 aspect ratio, but cap height to container
        const calculatedHeight = containerWidth / aspectRatio;
        const adjustedHeight = Math.min(calculatedHeight, containerHeight); // Prevent overflow
        setStageSize({
          width: Math.max(containerWidth, 0),
          height: Math.max(adjustedHeight, 0),
        });
      }
    }
  }, [containerRef]);

  useEffect(() => {
    updateStageSize();
    window.addEventListener("resize", updateStageSize);

    const resizeObserver = new ResizeObserver(updateStageSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateStageSize);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [updateStageSize]);

  return stageSize;
};
