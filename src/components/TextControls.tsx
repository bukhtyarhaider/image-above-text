import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FONTS } from "../constants/fonts";

interface TextControlsProps {
  selectedText: TextProperties | null;
  updateTextProperty: (
    id: string,
    property: keyof TextProperties,
    value: string | number
  ) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  selectedText,
  updateTextProperty,
}) => {
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFontDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedText) return null;

  return (
    <div className="space-y-4 p-3 bg-brand-50 rounded-xl shadow-inner">
      <h3 className="text-lg font-semibold text-brand-900">Text Settings</h3>
      <div className="space-y-4">
        {/* Text Content */}
        <div>
          <label className="text-sm font-medium text-brand-700 mb-1 block">
            Content
          </label>
          <input
            type="text"
            value={selectedText.text}
            onChange={(e) =>
              updateTextProperty(selectedText.id, "text", e.target.value)
            }
            className="w-full p-2 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-300 transition-all duration-200 bg-white text-brand-900 text-sm"
            placeholder="Enter text here"
          />
        </div>

        {/* Font Type */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-brand-700 mb-1 block">
            Font
          </label>
          <button
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className="w-full p-2 border border-brand-100 rounded-lg text-left flex items-center justify-between transition-all duration-200 bg-white text-sm text-brand-900"
            style={{ fontFamily: selectedFont }}
          >
            <span>{selectedFont}</span>
            <ChevronDownIcon
              className={`w-4 h-4 text-brand-500 transition-transform duration-200 ${
                isFontDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isFontDropdownOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-brand-100 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {FONTS.map((font) => (
                <div
                  key={font}
                  onMouseEnter={() =>
                    updateTextProperty(selectedText.id, "fontFamily", font)
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
                    updateTextProperty(selectedText.id, "fontFamily", font);
                    setIsFontDropdownOpen(false);
                  }}
                  className="px-2 py-1 cursor-pointer hover:bg-brand-50 text-sm text-brand-900 transition-all duration-200"
                  style={{ fontFamily: font }}
                >
                  <span>{font}</span>
                  {font === selectedFont && (
                    <span className="text-brand-500 text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Font Color and Opacity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-brand-700 mb-1 block">
              Color
            </label>
            <div className="relative">
              <input
                type="color"
                value={selectedText.fill}
                onChange={(e) =>
                  updateTextProperty(selectedText.id, "fill", e.target.value)
                }
                className="w-full h-8 rounded-lg border border-brand-100 cursor-pointer p-0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-700 mb-1 block">
              Opacity
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextControls;
