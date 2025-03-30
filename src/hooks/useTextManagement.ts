import { useState } from "react";
import Konva from "konva";

export const useTextManagement = (stageSize: {
  width: number;
  height: number;
}) => {
  const [texts, setTexts] = useState<TextProperties[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

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
    setTexts((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const deleteText = (id: string) => {
    setTexts((prev) => prev.filter((text) => text.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
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

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setTexts((prev) =>
      prev.map((text) =>
        text.id === id ? { ...text, x: newX, y: newY } : text
      )
    );
  };

  const handleTransformEnd = (id: string, node: Konva.Text) => {
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
  };

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
