import { useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";

const Editor: React.FC = () => {
  const stageWidth = 800;
  const stageHeight = 600;

  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [origDims, setOrigDims] = useState({ width: 0, height: 0, x: 0, y: 0 });

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
      };
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
      </Stage>
    </div>
  );
};

export default Editor;
