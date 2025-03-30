import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
  const fonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Roboto",
  ];

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
    <div className="space-y-6 p-4 bg-brand-50 rounded-xl shadow-inner">
      <h3 className="text-lg font-display font-semibold text-brand-900 flex items-center gap-2">
        Text Settings
      </h3>

      {/* Grid Layout for Controls */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Text Content */}
        <div className="col-span-1 sm:col-span-2">
          <label className="text-sm font-medium text-brand-700 mb-1 flex items-center gap-2">
            Content
          </label>
          <input
            type="text"
            value={selectedText.text}
            onChange={(e) =>
              updateTextProperty(selectedText.id, "text", e.target.value)
            }
            className="w-full p-2.5 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all duration-200 bg-white hover:bg-neutral-50 text-brand-900 placeholder-brand-300"
            placeholder="Enter text here"
          />
        </div>

        {/* Font Type */}
        <div className="col-span-1 sm:col-span-2 relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-brand-700 mb-1 flex items-center gap-2">
            Font
          </label>
          <button
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className="w-full p-2.5 border border-brand-100 rounded-lg text-left flex items-center justify-between bg-white hover:bg-brand-50 focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all duration-200 text-brand-900"
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
            <div className="absolute z-20 mt-1 w-full bg-white border border-brand-100 rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-300 scrollbar-track-brand-50">
              {fonts.map((font) => (
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
                  className="px-3 py-2 cursor-pointer hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 flex items-center justify-between text-brand-900"
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

        {/* Font Color */}
        <div>
          <label className="text-sm font-medium text-brand-700 mb-1 flex items-center gap-2">
            Color
          </label>
          <div className="relative">
            <input
              type="color"
              value={selectedText.fill}
              onChange={(e) =>
                updateTextProperty(selectedText.id, "fill", e.target.value)
              }
              className="w-full h-10 rounded-lg border border-brand-100 cursor-pointer hover:border-brand-300 transition-all duration-200 p-0"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-brand-700">
              {selectedText.fill.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Font Opacity */}
        <div>
          <label className="text-sm font-medium text-brand-700 mb-1 flex items-center gap-2">
            Opacity
          </label>
          <div className="flex items-center gap-2">
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
              className="w-full h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-700 transition-all duration-200"
            />
            <span className="text-sm text-brand-700 min-w-[40px] text-right">
              {Math.round(selectedText.opacity * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextControls;
