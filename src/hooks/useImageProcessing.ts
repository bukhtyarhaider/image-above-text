import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const processImage = (img: HTMLImageElement, scale: number) => {
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (stageSize.width - width) / 2;
    const y = (stageSize.height - height) / 2;
    return { width, height, x, y };
  };

  const cacheImage = (url: string) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: "CACHE_IMAGE",
        url,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = imageUrl;

    img.onload = async () => {
      const scale = Math.min(
        stageSize.width / img.width,
        stageSize.height / img.height
      );
      setImgScale(scale);
      const dims = processImage(img, scale);
      setOrigDims(dims);
      setOriginalImg(img);

      // Cache the original image
      cacheImage(imageUrl);

      setIsLoading(true);
      try {
        if (navigator.onLine) {
          const blob = await fetch(imageUrl).then((res) => res.blob());
          const result = await removeBackground(blob);
          if (!result) throw new Error("Background removal failed");

          const processedUrl = URL.createObjectURL(result);
          const processedImg = new window.Image();
          processedImg.src = processedUrl;

          processedImg.onload = () => {
            const bgDims = processImage(processedImg, scale);
            setBgDims(bgDims);
            setBgRemovedImg(processedImg);
            cacheImage(processedUrl); // Cache the processed image
          };
        } else {
          // Offline: Use original image as fallback
          setBgRemovedImg(img);
          setBgDims(dims);
          console.warn("Offline mode: Background removal unavailable");
        }
      } catch (error) {
        console.error("Image processing error:", error);
        setBgRemovedImg(img); // Fallback to original image
        setBgDims(dims);
      } finally {
        setIsLoading(false);
      }
    };
  };

  // Monitor online/offline status
  window.addEventListener("online", () => setIsOffline(false));
  window.addEventListener("offline", () => setIsOffline(true));

  return {
    originalImg,
    bgRemovedImg,
    origDims,
    bgDims,
    isLoading,
    imgScale,
    handleImageUpload,
    isOffline,
  };
};
