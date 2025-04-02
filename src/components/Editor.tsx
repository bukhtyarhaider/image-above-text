import { useRef, useEffect, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import Konva from "konva";
import { debounce } from "lodash-es";
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
  TrashIcon,
} from "@heroicons/react/24/outline";
import WebFont from "webfontloader";
import { FONTS } from "../constants/fonts";
import logoImg from "/src/assets/logo.png";
import { db } from "../lib/db";

const Editor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const textRefs = useRef<{ [key: string]: Konva.Text }>({});
  const trRef = useRef<Konva.Transformer | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storageStatus, setStorageStatus] = useState<{
    quota: number;
    usage: number;
  } | null>(null);

  const stageSize = useStageSize(containerRef);
  const {
    originalImg,
    bgRemovedImg,
    origDims,
    bgDims,
    isLoading,
    imgScale,
    handleImageUpload,
    isOffline,
    isHydrated,
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

  // Auto-save mechanism
  useEffect(() => {
    const autoSave = debounce(async () => {
      if (!isHydrated || !bgRemovedImg) return;

      try {
        const originalBlob = originalImg?.src
          ? await fetch(originalImg.src).then((r) => r.blob())
          : undefined;

        const processedBlob = bgRemovedImg?.src
          ? await fetch(bgRemovedImg.src).then((r) => r.blob())
          : undefined;

        await db.saveState({
          originalImage: originalBlob ? { blob: originalBlob } : undefined,
          processedImage: processedBlob ? { blob: processedBlob } : undefined,
          texts,
          origDims,
          bgDims,
          imgScale,
        });
      } catch (error) {
        console.error("Auto-save error:", error);
      }
    }, 15000);

    autoSave();
    return () => autoSave.cancel();
  }, [
    texts,
    origDims,
    bgDims,
    imgScale,
    isHydrated,
    bgRemovedImg,
    originalImg,
  ]);

  // Storage monitoring
  useEffect(() => {
    const checkStorage = async () => {
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();
        setStorageStatus({
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
        });
      }
    };

    checkStorage();
    const interval = setInterval(checkStorage, 30000);
    return () => clearInterval(interval);
  }, []);

  // Transformer setup
  useEffect(() => {
    if (trRef.current && selectedTextId && textRefs.current[selectedTextId]) {
      trRef.current.nodes([textRefs.current[selectedTextId]]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedTextId, stageSize]);

  // Font loading
  useEffect(() => {
    const webFonts = FONTS.filter(
      (font) =>
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
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!stageRef.current) return;

    const pixelRatio = imgScale > 0 ? 1 / imgScale : 1;
    const uri = stageRef.current.toDataURL({
      x: origDims.x,
      y: origDims.y,
      width: origDims.width,
      height: origDims.height,
      pixelRatio,
    });

    const link = document.createElement("a");
    link.download = "design.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imgScale, origDims]);

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);

      const files = e.dataTransfer.files;
      if (files?.length) {
        await handleImageUpload({
          target: { files },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [handleImageUpload]
  );

  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedTextId(null);
      await handleImageUpload(e);
    },
    [handleImageUpload, setSelectedTextId]
  );

  const hasContent = !!bgRemovedImg && texts.length > 0;
  const selectedText = texts.find((text) => text.id === selectedTextId) || null;

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden">
      {!isHydrated && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative text-brand-500 text-center flex flex-col items-center z-10">
            <div className="w-12 h-12 mb-2 relative">
              <div className="absolute w-full h-full rounded-full animate-spin border-2 border-transparent [border-top-color:theme(colors.brand.300)] [border-bottom-color:theme(colors.brand.100)]">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.brand.300)_30%,theme(colors.brand.100)_70%,transparent_100%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                  <div className="absolute inset-[3px] bg-brand-900 rounded-full" />
                </div>
              </div>
            </div>
            Loading your workspace...
          </div>
        </div>
      )}

      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center p-2 z-30">
          Offline mode - some features may be limited
        </div>
      )}

      <header className="lg:hidden flex items-center justify-between p-4 bg-brand-700 text-white shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <img src={logoImg} className="h-8" /> Image Above Text
        </h2>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Bars3Icon className="w-8 h-8" />
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div
          className={`flex-1 bg-white m-2 lg:m-4 rounded-xl shadow-lg p-4 relative overflow-hidden transition-all duration-300 ${
            isDraggingOver
              ? "border-4 border-dashed border-brand-500"
              : "border border-brand-200"
          }`}
          ref={containerRef}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleFileDrop}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            className={`w-full h-full rounded-lg bg-neutral-50 shadow-inner ${
              !originalImg && !isLoading
                ? "cursor-pointer hover:bg-neutral-100"
                : ""
            }`}
            onClick={(e) => {
              if (!originalImg && !isLoading && e.target === e.currentTarget) {
                fileInputRef.current?.click();
              }
            }}
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
                <KonvaText
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
                    if (node) {
                      textRefs.current[text.id] = node;
                    }
                  }}
                  onClick={() => setSelectedTextId(text.id)}
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
              <div className="text-center text-brand-500">
                <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-base font-medium">
                  {isDraggingOver
                    ? "Drop image here"
                    : "Click or drag to upload"}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden">
              {/* Gradient background with animated shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 animate-gradient-flow" />

              {/* Overlay with subtle texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/80 to-brand-900/30" />

              {/* Content container */}
              <div className="relative text-brand-100 text-center flex flex-col items-center z-10">
                <div className="w-12 h-12 mb-2 relative">
                  {/* Existing spinner with your brand colors */}
                  <div className="absolute w-full h-full rounded-full animate-spin border-2 border-transparent [border-top-color:theme(colors.brand.300)] [border-bottom-color:theme(colors.brand.100)]">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.brand.300)_30%,theme(colors.brand.100)_70%,transparent_100%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                      <div className="absolute inset-[3px] bg-brand-900 rounded-full" />
                    </div>
                  </div>
                </div>
                Processing image...
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-96 bg-white m-4 rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-brand-700">
              Editor Controls
            </h2>
            {storageStatus && (
              <div className="text-xs text-brand-500">
                Storage: {(storageStatus.usage / 1024 / 1024).toFixed(1)}MB used
              </div>
            )}
          </div>

          <button
            disabled={!bgRemovedImg}
            onClick={addText}
            className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all ${
              bgRemovedImg
                ? "bg-brand-500 hover:bg-brand-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-5 h-5" /> Add Text
          </button>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4">
            <TextList
              texts={texts}
              selectedTextId={selectedTextId}
              setSelectedTextId={setSelectedTextId}
              deleteText={deleteText}
            />

            {selectedText && (
              <TextControls
                selectedText={selectedText}
                updateTextProperty={updateTextProperty}
              />
            )}
          </div>

          <div className="space-y-4 mt-4">
            <button
              onClick={handleSave}
              disabled={!hasContent}
              className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition-all ${
                hasContent
                  ? "bg-brand-700 hover:bg-brand-800"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <DocumentCheckIcon className="w-5 h-5" /> Export Image
            </button>

            <button
              onClick={async () => {
                await db.clearState();
                window.location.reload();
              }}
              className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:text-red-700 text-sm"
            >
              <TrashIcon className="w-4 h-4" /> Reset Workspace
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg p-4 max-h-[80vh] overflow-y-auto z-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-700">Controls</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-brand-500"
              >
                Close
              </button>
            </div>

            <button
              onClick={addText}
              disabled={!bgRemovedImg}
              className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg mb-4 ${
                bgRemovedImg ? "bg-brand-500" : "bg-gray-300"
              }`}
            >
              <PlusIcon className="w-6 h-6" /> Add Text
            </button>

            <div className="space-y-4">
              <TextList
                texts={texts}
                selectedTextId={selectedTextId}
                setSelectedTextId={setSelectedTextId}
                deleteText={deleteText}
              />

              {selectedText && (
                <TextControls
                  selectedText={selectedText}
                  updateTextProperty={updateTextProperty}
                />
              )}

              <button
                onClick={handleSave}
                disabled={!hasContent}
                className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-lg ${
                  hasContent ? "bg-brand-700" : "bg-gray-300"
                }`}
              >
                <DocumentCheckIcon className="w-6 h-6" /> Export
              </button>

              <button
                onClick={async () => {
                  await db.clearState();
                  window.location.reload();
                }}
                className="w-full py-2 flex items-center justify-center gap-2 text-red-500 text-sm"
              >
                <TrashIcon className="w-5 h-5" /> Clear All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
