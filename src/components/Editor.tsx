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
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState<boolean>(false);

  const [imgScale, setImgScale] = useState<number>(1);
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
  const fonts = ["Arial", "Helvetica", "Times New Roman"];

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
        setImgScale(scale); // Save the scale for export
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

  // Save the current canvas cropped to the original image boundaries
  // at the original image's resolution.
  const handleSave = () => {
    if (stageRef.current) {
      // Hide the transformer so it doesn't appear in the export
      if (trRef.current && trRef) {
        trRef.current.hide();
        trRef.current.getLayer()?.batchDraw();
      }

      const pixelRatio = imgScale > 0 ? 1 / imgScale : 1;
      const uri = stageRef.current.toDataURL({
        x: origDims.x,
        y: origDims.y,
        width: origDims.width,
        height: origDims.height,
        pixelRatio: pixelRatio,
      });
      const link = document.createElement("a");
      link.download = `image_above_text`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Re-show the transformer after saving
      if (trRef.current) {
        trRef.current.show();
        trRef.current.getLayer()?.batchDraw();
      }
    }
  };

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [textProps]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3 bg-white p-4 rounded shadow">
          <Stage
            width={stageWidth}
            height={stageHeight}
            ref={stageRef}
            className="border border-gray-300 rounded"
          >
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
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Text</label>
            <input
              type="text"
              value={textProps.text}
              onChange={(e) =>
                setTextProps({ ...textProps, text: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Font Color</label>
            <input
              type="color"
              value={textProps.fill}
              onChange={(e) =>
                setTextProps({ ...textProps, fill: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Font Opacity Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Font Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={textProps.opacity}
              onChange={(e) =>
                setTextProps({
                  ...textProps,
                  opacity: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {Math.round(textProps.opacity * 100)}%
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Font Type</label>
            <button
              onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
              className="w-full p-2 border rounded text-left flex items-center justify-between"
              style={{ fontFamily: selectedFont }}
            >
              <span>{selectedFont}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isFontDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                {fonts.map((font) => (
                  <div
                    key={font}
                    onMouseEnter={() =>
                      setTextProps((prev) => ({ ...prev, fontFamily: font }))
                    }
                    onMouseLeave={() =>
                      setTextProps((prev) => ({
                        ...prev,
                        fontFamily: selectedFont,
                      }))
                    }
                    onClick={() => {
                      setSelectedFont(font);
                      setTextProps((prev) => ({ ...prev, fontFamily: font }));
                      setIsFontDropdownOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
