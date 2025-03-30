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
} from "@heroicons/react/24/outline";

const Editor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});
  const trRef = useRef<Konva.Transformer | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  const handleCanvasClick = () => {
    if (!originalImg && !isLoading) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        if (e.target instanceof HTMLInputElement) {
          const event = {
            target: {
              files: e.target.files,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          handleImageUpload(event);
        }
      };
      input.click();
    }
  };

  const selectedText = texts.find((text) => text.id === selectedTextId) || null;
  const hasContent = bgRemovedImg && texts.length > 0;

  return (
    <div className="md:h-[100vh] md:w-[100vw] flex justify-center items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="w-full md:max-h-[70vh] max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* Canvas Container */}
        <div
          className={`flex-1 bg-white rounded-xl shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
            isDraggingOver
              ? "border-4 border-dashed border-brand-500 bg-brand-50/50"
              : "border border-brand-200"
          }`}
          ref={containerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            className={`w-full rounded-lg bg-neutral-50 shadow-inner transition-all duration-200 ${
              !originalImg && !isLoading
                ? "cursor-pointer hover:bg-neutral-100"
                : ""
            }`}
            onClick={handleCanvasClick}
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

          {/* Drop Zone Overlay */}
          {!originalImg && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`text-center transition-all duration-300 ${
                  isDraggingOver ? "scale-110 text-brand-600" : "text-brand-500"
                }`}
              >
                <ArrowUpTrayIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {isDraggingOver
                    ? "Drop your image here!"
                    : "Drag & drop or click to upload an image"}
                </p>
                <p className="text-sm mt-1 text-brand-400">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-brand-900 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-t-brand-300 border-brand-100 rounded-full animate-spin mx-auto mb-2"></div>
                <p>Processing your image...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:max-h-[90vh] overflow-auto lg:w-96 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent flex items-center gap-2">
            <img src="/src/assets/logo.png" className="h-10" /> Image Above Text
          </h2>

          <button
            disabled={!bgRemovedImg}
            onClick={addText}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 transform ${
              bgRemovedImg
                ? "bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-700 hover:to-brand-900 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-5 h-5" /> Add Text
          </button>

          <TextList
            texts={texts}
            selectedTextId={selectedTextId}
            setSelectedTextId={setSelectedTextId}
            deleteText={deleteText}
          />

          <TextControls
            selectedText={selectedText}
            updateTextProperty={updateTextProperty}
          />

          <button
            onClick={handleSave}
            disabled={!hasContent}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 transform ${
              hasContent
                ? "bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-900 hover:to-neutral-900 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <DocumentCheckIcon className="w-5 h-5" /> Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
