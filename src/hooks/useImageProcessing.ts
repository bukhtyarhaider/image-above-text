import { useState, useEffect, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import { db } from "../lib/db";

export const useImageProcessing = (stageSize: {
  width: number;
  height: number;
}) => {
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [bgRemovedImg, setBgRemovedImg] = useState<HTMLImageElement | null>(
    null
  );
  const [origDims, setOrigDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [bgDims, setBgDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [imgScale, setImgScale] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const addObjectUrl = useCallback((url: string) => {
    setObjectUrls((prev) => [...prev, url]);
  }, []);

  // Hydrate state from IndexedDB
  useEffect(() => {
    const hydrateState = async () => {
      try {
        const state = await db.loadState();
        if (!state) return setIsHydrated(true);

        const loadImageFromBlob = async (blob: Blob | undefined) => {
          if (!blob) return null;
          const url = URL.createObjectURL(blob);
          addObjectUrl(url);
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
          });
        };

        // Load original image
        const originalImg = await loadImageFromBlob(state.originalImage?.blob);
        if (originalImg) {
          setOriginalImg(originalImg);
          setOrigDims(state.origDims);
        }

        // Load processed image
        const processedImg = await loadImageFromBlob(
          state.processedImage?.blob
        );
        if (processedImg) {
          setBgRemovedImg(processedImg);
          setBgDims(state.bgDims);
        }

        setImgScale(state.imgScale);
      } catch (error) {
        console.error("State hydration failed:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateState();
  }, [addObjectUrl]);

  const processImageDimensions = useCallback(
    (img: HTMLImageElement, scale: number) => {
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (stageSize.width - width) / 2;
      const y = (stageSize.height - height) / 2;
      return { width, height, x, y };
    },
    [stageSize]
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      const url = URL.createObjectURL(file);
      addObjectUrl(url);

      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.src = url;
          image.onload = () => resolve(image);
          image.onerror = reject;
        });

        const scale = Math.min(
          stageSize.width / img.width,
          stageSize.height / img.height,
          1
        );
        const dims = processImageDimensions(img, scale);

        // Save initial state
        const originalBlob = await fetch(url).then((r) => r.blob());
        await db.saveState({
          originalImage: { blob: originalBlob },
          processedImage: undefined,
          texts: [],
          origDims: dims,
          bgDims: dims,
          imgScale: scale,
        });

        setOriginalImg(img);
        setOrigDims(dims);
        setImgScale(scale);

        // Process background removal
        const processedBlob = await removeBackground(originalBlob);
        const processedUrl = URL.createObjectURL(processedBlob);
        addObjectUrl(processedUrl);

        const processedImg = await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = processedUrl;
          img.onload = () => resolve(img);
        });

        const processedDims = processImageDimensions(processedImg, scale);

        // Save final state
        await db.saveState({
          originalImage: { blob: originalBlob },
          processedImage: { blob: processedBlob },
          origDims: dims,
          bgDims: processedDims,
          imgScale: scale,
          texts: [],
        });

        setBgRemovedImg(processedImg);
        setBgDims(processedDims);
      } catch (error) {
        console.error("Image processing failed:", error);
        setBgRemovedImg(null);
      } finally {
        setIsLoading(false);
        URL.revokeObjectURL(url);
      }
    },
    [stageSize, processImageDimensions, addObjectUrl]
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    originalImg,
    bgRemovedImg,
    origDims,
    bgDims,
    isLoading,
    imgScale,
    handleImageUpload,
    isHydrated,
    isOffline,
  };
};
