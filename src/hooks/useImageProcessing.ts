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

  const processImage = (img: HTMLImageElement, scale: number) => {
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (stageSize.width - width) / 2;
    const y = (stageSize.height - height) / 2;
    return { width, height, x, y };
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

      setIsLoading(true);
      try {
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
        };
      } catch {
        setBgRemovedImg(img);
      } finally {
        setIsLoading(false);
      }
    };
  };

  return {
    originalImg,
    bgRemovedImg,
    origDims,
    bgDims,
    isLoading,
    imgScale,
    handleImageUpload,
  };
};
