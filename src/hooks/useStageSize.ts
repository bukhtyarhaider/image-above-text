import { useState, useEffect, useCallback } from "react";

export const useStageSize = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const updateStageSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const aspectRatio = 4 / 3;
      const containerHeight = containerWidth / aspectRatio;
      setStageSize({ width: containerWidth, height: containerHeight });
    }
  }, [containerRef]);

  useEffect(() => {
    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, [updateStageSize]);

  return stageSize;
};
