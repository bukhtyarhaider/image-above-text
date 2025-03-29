import { useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { removeBackground } from "@imgly/background-removal";

const Editor: React.FC = () => {
  const stageWidth = 800;
  const stageHeight = 600;

  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [bgRemovedImg, setBgRemovedImg] = useState<HTMLImageElement | null>(
    null
  );
  const [origDims, setOrigDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [bgDims, setBgDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        // Calculate scale to fit the image in the stage
        const scale = Math.min(
          stageWidth / img.width,
          stageHeight / img.height
        );
        const width = img.width * scale;
        const height = img.height * scale;

        const x = (stageWidth - width) / 2;
        const y = (stageHeight - height) / 2;

        setOrigDims({ width, height, x, y });
        setOriginalImg(img);
        processBackgroundRemoval(file, scale);
      };
    }
  };

  const processBackgroundRemoval = async (file: File, scale: number) => {
    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      const blob = await fetch(imageUrl).then((res) => res.blob());
      const result = await removeBackground(blob);
      if (!result) {
        throw new Error("Background removal returned no result.");
      }
      const processedUrl = URL.createObjectURL(result);
      const processedImg = new window.Image();
      processedImg.src = processedUrl;

      processedImg.onload = () => {
        const width = processedImg.width * scale;
        const height = processedImg.height * scale;

        const x = (stageWidth - width) / 2;
        const y = (stageHeight - height) / 2;

        setBgDims({ width, height, x, y });
        setBgRemovedImg(processedImg);
      };
    } catch {
      // Fallback to original image if background removal fails
      setBgRemovedImg(originalImg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {originalImg && (
            <KonvaImage
              image={originalImg}
              x={origDims.x}
              y={origDims.y}
              width={origDims.width}
              height={origDims.height}
            />
          )}
        </Layer>
        <Layer>
          {bgRemovedImg && (
            <KonvaImage
              image={bgRemovedImg}
              x={bgDims.x}
              y={bgDims.y}
              width={bgDims.width}
              height={bgDims.height}
            />
          )}
        </Layer>
      </Stage>
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default Editor;
