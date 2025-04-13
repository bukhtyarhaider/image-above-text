import { useState, useEffect, useCallback } from "react";
import Konva from "konva";
import { db } from "../lib/db";

export const useTextManagement = (stageSize: {
  width: number;
  height: number;
}) => {
  const [texts, setTexts] = useState<TextProperties[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Load initial state
  useEffect(() => {
    const loadTexts = async () => {
      try {
        const state = await db.loadState();
        if (state?.texts) {
          setTexts(state.texts);
          if (state.texts.length > 0) {
            setSelectedTextId(state.texts[state.texts.length - 1].id);
          }
        }
      } catch (error) {
        console.error("Failed to load texts:", error);
      }
    };
    loadTexts();
  }, []);

  // Persist texts to DB
  const persistTexts = useCallback(async (newTexts: TextProperties[]) => {
    try {
      const currentState = (await db.loadState()) || {
        texts: [],
        origDims: { width: 0, height: 0, x: 0, y: 0 },
        bgDims: { width: 0, height: 0, x: 0, y: 0 },
        imgScale: 1,
      };
      await db.saveState({ ...currentState, texts: newTexts });
    } catch (error) {
      console.error("Failed to persist texts:", error);
    }
  }, []);

  const addText = useCallback(async () => {
    const newText: TextProperties = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: stageSize.width / 2.5,
      y: stageSize.height / 8,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      opacity: 1,
    };
    setTexts((prev) => {
      const newTexts = [...prev, newText];
      persistTexts(newTexts);
      return newTexts;
    });
    setSelectedTextId(newText.id);
  }, [stageSize, persistTexts]);

  const deleteText = useCallback(
    async (id: string) => {
      setTexts((prev) => {
        const newTexts = prev.filter((text) => text.id !== id);
        persistTexts(newTexts);
        return newTexts;
      });
      if (selectedTextId === id) setSelectedTextId(null);
    },
    [selectedTextId, persistTexts]
  );

  const updateTextProperty = useCallback(
    async (
      id: string,
      property: keyof TextProperties,
      value: string | number
    ) => {
      setTexts((prev) => {
        const newTexts = prev.map((text) =>
          text.id === id ? { ...text, [property]: value } : text
        );
        persistTexts(newTexts);
        return newTexts;
      });
    },
    [persistTexts]
  );

  const handleDragEnd = useCallback(
    async (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
      const newX = e.target.x();
      const newY = e.target.y();
      setTexts((prev) => {
        const newTexts = prev.map((text) =>
          text.id === id ? { ...text, x: newX, y: newY } : text
        );
        persistTexts(newTexts);
        return newTexts;
      });
    },
    [persistTexts]
  );

  const handleTransformEnd = useCallback(
    async (id: string, node: Konva.Text) => {
      const scaleX = node.scaleX();
      const newFontSize = Math.round(node.fontSize() * scaleX);
      setTexts((prev) => {
        const newTexts = prev.map((text) =>
          text.id === id
            ? {
                ...text,
                x: node.x(),
                y: node.y(),
                fontSize: newFontSize,
              }
            : text
        );
        persistTexts(newTexts);
        return newTexts;
      });
      node.scaleX(1);
      node.scaleY(1);
    },
    [persistTexts]
  );

  return {
    texts,
    selectedTextId,
    setSelectedTextId,
    addText,
    deleteText,
    updateTextProperty,
    handleDragEnd,
    handleTransformEnd,
  };
};
