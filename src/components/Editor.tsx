import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import Konva from "konva";
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

  const [textProps, setTextProps] = useState<TextProperties>({
    text: "Your Text Here",
    x: 100,
    y: 100,
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#000000",
    opacity: 1,
  });

  const stageRef = useRef<Konva.Stage | null>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
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
      setBgRemovedImg(originalImg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setTextProps({ ...textProps, x: newX, y: newY });
  };

  const handleTransformEnd = () => {
    if (textRef.current) {
      const node = textRef.current;
      const scaleX = node.scaleX();
      const newX = node.x();
      const newY = node.y();
      const newFontSize = textProps.fontSize * scaleX;
      setTextProps({
        ...textProps,
        x: newX,
        y: newY,
        fontSize: newFontSize,
      });
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [textProps]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <input
        type="text"
        value={textProps.text}
        onChange={(e) => setTextProps({ ...textProps, text: e.target.value })}
      />
      <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
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
          <Text
            text={textProps.text}
            x={textProps.x}
            y={textProps.y}
            fontSize={textProps.fontSize}
            fontFamily={textProps.fontFamily}
            fill={textProps.fill}
            opacity={textProps.opacity}
            draggable
            ref={textRef}
            onDragEnd={handleDragEnd}
            onTransformEnd={handleTransformEnd}
          />
          <Transformer ref={trRef} />
        </Layer>
        <Layer>
          {bgRemovedImg && (
            <KonvaImage
              image={bgRemovedImg}
              x={bgDims.x}
              y={bgDims.y}
              width={bgDims.width}
              height={bgDims.height}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default Editor;
