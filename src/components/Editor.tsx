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
  const [texts, setTexts] = useState<TextProperties[]>([
    {
      id: "text-1",
      text: "Your Text Here",
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      opacity: 1,
    },
  ]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});
  const trRef = useRef<Konva.Transformer | null>(null);
  const fonts = ["Arial", "Helvetica", "Times New Roman"];

  // Update canvas size based on container
  const updateStageSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const aspectRatio = 4 / 3; // Maintain a 4:3 aspect ratio (adjustable)
      const containerHeight = containerWidth / aspectRatio;
      setStageSize({ width: containerWidth, height: containerHeight });
    }
  };

  useEffect(() => {
    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        const scale = Math.min(
          stageSize.width / img.width,
          stageSize.height / img.height
        );
        setImgScale(scale);
        const width = img.width * scale;
        const height = img.height * scale;

        const x = (stageSize.width - width) / 2;
        const y = (stageSize.height - height) / 2;

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
      if (!result) throw new Error("Background removal failed.");
      const processedUrl = URL.createObjectURL(result);
      const processedImg = new window.Image();
      processedImg.src = processedUrl;

      processedImg.onload = () => {
        const width = processedImg.width * scale;
        const height = processedImg.height * scale;

        const x = (stageSize.width - width) / 2;
        const y = (stageSize.height - height) / 2;

        setBgDims({ width, height, x, y });
        setBgRemovedImg(processedImg);
      };
    } catch {
      setBgRemovedImg(originalImg);
    } finally {
      setIsLoading(false);
    }
  };

  const addText = () => {
    const newText: TextProperties = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: stageSize.width / 6,
      y: stageSize.height / 6,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      opacity: 1,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const deleteText = (id: string) => {
    setTexts((prev) => prev.filter((text) => text.id !== id));
    if (selectedTextId === id) setSelectedTextId(null); // Deselect if deleted
  };

  const handleTextSelect = (id: string) => {
    setSelectedTextId(id);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setTexts((prev) =>
      prev.map((text) =>
        text.id === id ? { ...text, x: newX, y: newY } : text
      )
    );
  };

  const handleTransformEnd = (id: string) => {
    const node = textRefs.current[id];
    if (node) {
      const scaleX = node.scaleX();
      const newX = node.x();
      const newY = node.y();
      const newFontSize = Math.round(node.fontSize() * scaleX);
      setTexts((prev) =>
        prev.map((text) =>
          text.id === id
            ? { ...text, x: newX, y: newY, fontSize: newFontSize }
            : text
        )
      );
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const updateTextProperty = (
    id: string,
    property: keyof TextProperties,
    value: string | number
  ) => {
    setTexts((prev) =>
      prev.map((text) =>
        text.id === id ? { ...text, [property]: value } : text
      )
    );
  };

  // Save the current canvas cropped to the original image boundaries
  // at the original image's resolution.
  const handleSave = () => {
    if (stageRef.current) {
      // Hide the transformer so it doesn't appear in the export
      if (trRef.current) {
        trRef.current.hide();
        trRef.current.getLayer()?.batchDraw();
      }

      const pixelRatio = imgScale > 0 ? 1 / imgScale : 1;
      const uri = stageRef.current.toDataURL({
        x: origDims.x,
        y: origDims.y,
        width: origDims.width,
        height: origDims.height,
        pixelRatio,
      });
      const link = document.createElement("a");
      link.download = `image_with_texts`;
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
    if (trRef.current && selectedTextId && textRefs.current[selectedTextId]) {
      trRef.current.nodes([textRefs.current[selectedTextId]]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedTextId, stageSize]);

  const selectedText = texts.find((text) => text.id === selectedTextId) || null;

  return (
    <div className="h-[100vh] w-[100vw] bg-neutral-50 flex  justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl  flex flex-col lg:flex-row gap-6">
        {/* Canvas Section */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 relative overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            className="w-full border border-brand-100 rounded-lg"
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
              {texts.map((text) => (
                <Text
                  key={text.id}
                  text={text.text}
                  x={text.x}
                  y={text.y}
                  fontSize={text.fontSize}
                  fontFamily={text.fontFamily}
                  fill={text.fill}
                  opacity={text.opacity}
                  draggable
                  ref={(node) => {
                    if (node) textRefs.current[text.id] = node;
                  }}
                  onClick={() => handleTextSelect(text.id)}
                  onTap={() => handleTextSelect(text.id)}
                  onDragEnd={(e) => handleDragEnd(e, text.id)}
                  onTransformEnd={() => handleTransformEnd(text.id)}
                />
              ))}
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
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-t-brand-500 border-brand-100 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Sidebar Section */}
        <div className="w-full h-[70vh] overflow-auto lg:w-96 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-brand-700">Editor Options</h2>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Add Text Button */}
          <button
            onClick={addText}
            className="w-full py-3 bg-gradient-to-r from-brand-300 to-brand-500 text-white font-semibold rounded-lg hover:from-brand-500 hover:to-brand-700 transition-all"
          >
            Add Text
          </button>

          {/* Text List */}
          <div>
            <h3 className="text-lg font-semibold text-brand-700 mb-3">
              Text List
            </h3>
            <div className="max-h-48 overflow-y-auto border border-brand-100 rounded-lg bg-brand-50 p-2">
              {texts.length === 0 ? (
                <p className="text-sm text-brand-500 text-center py-2">
                  No text added yet.
                </p>
              ) : (
                texts.map((text) => (
                  <div
                    key={text.id}
                    className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                      selectedTextId === text.id
                        ? "bg-brand-50 ring-1 ring-brand-300"
                        : "hover:bg-brand-100"
                    } transition-colors`}
                  >
                    <div
                      className="flex-1 cursor-pointer truncate"
                      onClick={() => handleTextSelect(text.id)}
                      style={{
                        fontFamily: text.fontFamily,
                        fontSize: `${Math.min(text.fontSize, 16)}px`,
                        color: text.fill,
                        opacity: text.opacity,
                      }}
                    >
                      {text.text}
                    </div>
                    <button
                      onClick={() => deleteText(text.id)}
                      className="ml-2 text-brand-500 hover:text-brand-700 transition-colors"
                      title="Delete Text"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Text Controls */}
          {selectedText && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Text Content
                </label>
                <input
                  type="text"
                  value={selectedText.text}
                  onChange={(e) =>
                    updateTextProperty(selectedText.id, "text", e.target.value)
                  }
                  className="w-full p-3 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Font Color
                </label>
                <input
                  type="color"
                  value={selectedText.fill}
                  onChange={(e) =>
                    updateTextProperty(selectedText.id, "fill", e.target.value)
                  }
                  className="w-full h-12 rounded-lg border border-brand-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Font Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedText.opacity}
                  onChange={(e) =>
                    updateTextProperty(
                      selectedText.id,
                      "opacity",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="text-sm text-brand-700 mt-1">
                  {Math.round(selectedText.opacity * 100)}%
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Font Type
                </label>
                <button
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  className="w-full p-3 border border-brand-100 rounded-lg text-left flex items-center justify-between bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  style={{ fontFamily: selectedFont }}
                >
                  <span>{selectedFont}</span>
                  <svg
                    className="w-5 h-5 text-brand-500"
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
                  <div className="absolute z-20 mt-2 w-full bg-white border border-brand-100 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {fonts.map((font) => (
                      <div
                        key={font}
                        onMouseEnter={() =>
                          updateTextProperty(
                            selectedText.id,
                            "fontFamily",
                            font
                          )
                        }
                        onMouseLeave={() =>
                          updateTextProperty(
                            selectedText.id,
                            "fontFamily",
                            selectedFont
                          )
                        }
                        onClick={() => {
                          setSelectedFont(font);
                          updateTextProperty(
                            selectedText.id,
                            "fontFamily",
                            font
                          );
                          setIsFontDropdownOpen(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-brand-50 transition-colors"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold rounded-lg hover:from-brand-700 hover:to-brand-900 transition-all"
          >
            Save Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
