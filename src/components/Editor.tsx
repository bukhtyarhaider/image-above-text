import { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import Konva from "konva";
import TextControls from "./TextControls";
import TextList from "./TextList";
import { useStageSize } from "../hooks/useStageSize";
import { useImageProcessing } from "../hooks/useImageProcessing";
import { useTextManagement } from "../hooks/useTextManagement";
import {
  ArrowUpTrayIcon,
  DocumentCheckIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import WebFont from "webfontloader";
import { FONTS } from "../constants/fonts";
import logoImg from "/src/assets/logo.png";

const Editor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});
  const trRef = useRef<Konva.Transformer | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stageSize = useStageSize(containerRef);
  const {
    originalImg,
    bgRemovedImg,
    origDims,
    bgDims,
    isLoading,
    imgScale,
    handleImageUpload,
  } = useImageProcessing(stageSize);
  const {
    texts,
    selectedTextId,
    setSelectedTextId,
    addText,
    deleteText,
    updateTextProperty,
    handleDragEnd,
    handleTransformEnd,
  } = useTextManagement(stageSize);

  useEffect(() => {
    if (trRef.current && selectedTextId && textRefs.current[selectedTextId]) {
      trRef.current.nodes([textRefs.current[selectedTextId]]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedTextId, stageSize]);

  const handleSave = () => {
    if (!stageRef.current) return;
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
    link.download = "image_with_texts";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (trRef.current) {
      trRef.current.show();
      trRef.current.getLayer()?.batchDraw();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleCanvasClick = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (originalImg || isLoading) return;
    if (e.target === stageRef.current) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e);
    }
  };

  useEffect(() => {
    const webFonts = FONTS.filter(
      (font: string) =>
        ![
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Georgia",
          "Verdana",
        ].includes(font)
    );
    WebFont.load({
      google: { families: webFonts },
      active: () => console.log("Web fonts loaded"),
    });
  }, []);

  const selectedText = texts.find((text) => text.id === selectedTextId) || null;
  const hasContent = bgRemovedImg && texts.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-brand-700 text-white shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <img src={logoImg} className="h-8" /> Image Above Text
        </h2>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Bars3Icon className="w-8 h-8" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Canvas Container */}
        <div
          className={`flex-1 bg-white m-2 lg:m-4 rounded-xl shadow-lg p-4 relative overflow-hidden transition-all duration-300 ${
            isDraggingOver
              ? "border-4 border-dashed border-brand-500 bg-brand-50/50"
              : "border border-brand-200"
          } max-h-full`}
          ref={containerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            className={`w-full h-full rounded-lg bg-neutral-50 shadow-inner transition-all duration-200 ${
              !originalImg && !isLoading
                ? "cursor-pointer hover:bg-neutral-100"
                : ""
            }`}
            onMouseDown={handleCanvasClick}
            onTouchStart={handleCanvasClick}
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
                  onClick={() => setSelectedTextId(text.id)}
                  onTap={() => setSelectedTextId(text.id)}
                  onDragEnd={(e) => handleDragEnd(e, text.id)}
                  onTransformEnd={() =>
                    handleTransformEnd(text.id, textRefs.current[text.id])
                  }
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

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {!originalImg && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`text-center transition-all duration-300 ${
                  isDraggingOver ? "scale-110 text-brand-600" : "text-brand-500"
                }`}
              >
                <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-base font-medium">
                  {isDraggingOver
                    ? "Drop your image here!"
                    : "Drag & drop or tap to upload"}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-brand-900 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
              <div className="text-center text-white">
                <div className="w-10 h-10 border-4 border-t-brand-300 border-brand-100 rounded-full animate-spin mx-auto mb-2"></div>
                <p>Processing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-96 bg-white m-4 rounded-xl shadow-lg p-6 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-brand-700 flex items-center gap-2 mb-2">
            <img src="/src/assets/logo.png" className="h-10" /> Image Above Text
          </h2>
          <button
            disabled={!bgRemovedImg}
            onClick={addText}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 ${
              bgRemovedImg
                ? "bg-brand-500 hover:bg-brand-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-5 h-5" /> Add Text
          </button>
          <div className="flex-1 mt-4">
            <TextList
              texts={texts}
              selectedTextId={selectedTextId}
              setSelectedTextId={setSelectedTextId}
              deleteText={deleteText}
            />
          </div>
          <div className="flex-1 mt-4">
            <TextControls
              selectedText={selectedText}
              updateTextProperty={updateTextProperty}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!hasContent}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 mt-2 ${
              hasContent
                ? "bg-brand-700 hover:bg-brand-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <DocumentCheckIcon className="w-5 h-5" /> Save Image
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg p-4 max-h-[80vh] overflow-y-auto z-20 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-700">Controls</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-brand-500 text-base font-medium"
            >
              Close
            </button>
          </div>
          <button
            disabled={!bgRemovedImg}
            onClick={() => {
              addText();
              setIsSidebarOpen(false);
            }}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 mb-4 ${
              bgRemovedImg
                ? "bg-brand-500 hover:bg-brand-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-6 h-6" /> Add Text
          </button>
          <div className="mb-4">
            <TextList
              texts={texts}
              selectedTextId={selectedTextId}
              setSelectedTextId={(id) => {
                setSelectedTextId(id);
                setIsSidebarOpen(false);
              }}
              deleteText={deleteText}
            />
          </div>
          <div className="mb-4">
            <TextControls
              selectedText={selectedText}
              updateTextProperty={updateTextProperty}
            />
          </div>
          <button
            onClick={() => {
              handleSave();
              setIsSidebarOpen(false);
            }}
            disabled={!hasContent}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 ${
              hasContent
                ? "bg-brand-700 hover:bg-brand-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <DocumentCheckIcon className="w-6 h-6" /> Save Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Editor;
