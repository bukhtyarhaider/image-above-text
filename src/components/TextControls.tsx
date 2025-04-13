import { useState, useRef, useEffect } from "react";
import WebFont from "webfontloader";
import { FAVORITE_FONTS, FONTS } from "../constants/fonts";

interface TextControlsProps {
  selectedText: TextProperties | null;
  updateTextProperty: (
    id: string,
    property: keyof TextProperties,
    value: string | number
  ) => void;
  position: { x: number; y: number };
  colorPalette: string[];
}

// Persistent state for all fonts loaded (won’t reset on re-render)
let allFontsLoadedGlobally = false;

const TextControls: React.FC<TextControlsProps> = ({
  selectedText,
  updateTextProperty,
  position,
  colorPalette,
}) => {
  const [fontSearch, setFontSearch] = useState("");
  const [isFontListOpen, setIsFontListOpen] = useState(false);
  const [showAllFonts, setShowAllFonts] = useState(allFontsLoadedGlobally);
  const [allFontsLoaded, setAllFontsLoaded] = useState(allFontsLoadedGlobally);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close font list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node)
      ) {
        setIsFontListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load all fonts when "Show All Fonts" is clicked, only if not already loaded
  const handleLoadAllFonts = () => {
    if (!allFontsLoadedGlobally) {
      setShowAllFonts(true);
      WebFont.load({
        google: {
          families: FONTS.filter((font) => !FAVORITE_FONTS.includes(font)),
        },
        active: () => {
          allFontsLoadedGlobally = true;
          setAllFontsLoaded(true);
        },
      });
    } else {
      setShowAllFonts(true);
    }
  };

  // Handle left/right arrow key navigation for font selection
  useEffect(() => {
    if (!selectedText || !isFontListOpen) return;

    const availableFonts =
      showAllFonts && allFontsLoaded ? FONTS : FAVORITE_FONTS;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentFontIndex = availableFonts.indexOf(selectedText.fontFamily);
      let newFontIndex: number;

      if (e.key === "ArrowLeft") {
        newFontIndex =
          currentFontIndex > 0
            ? currentFontIndex - 1
            : availableFonts.length - 1;
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        newFontIndex =
          currentFontIndex < availableFonts.length - 1
            ? currentFontIndex + 1
            : 0;
        e.preventDefault();
      } else {
        return;
      }

      updateTextProperty(
        selectedText.id,
        "fontFamily",
        availableFonts[newFontIndex]
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedText,
    isFontListOpen,
    showAllFonts,
    allFontsLoaded,
    updateTextProperty,
  ]);

  if (!selectedText) return null;

  const availableFonts =
    showAllFonts && allFontsLoaded ? FONTS : FAVORITE_FONTS;
  const filteredFonts = availableFonts.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const fontList = [
    selectedText.fontFamily,
    ...filteredFonts.filter((font) => font !== selectedText.fontFamily),
  ];

  return (
    <div
      ref={controlsRef}
      className="absolute bg-white rounded-xl shadow-lg p-4 border border-brand-100 z-20 w-80"
      style={{ top: position.y, left: position.x }}
    >
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={selectedText.text}
            onChange={(e) =>
              updateTextProperty(selectedText.id, "text", e.target.value)
            }
            className="w-full p-2 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-300 text-sm"
            placeholder="Edit text"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
            onFocus={() => setIsFontListOpen(true)}
            placeholder="Search fonts..."
            className="w-full p-2 border border-brand-100 rounded-lg text-sm"
          />
          {isFontListOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-brand-100 rounded-lg shadow-lg max-h-40 overflow-y-auto z-30">
              {fontList.length === 1 &&
              fontSearch &&
              filteredFonts.length === 0 ? (
                <div className="p-2 text-sm text-brand-500">No fonts found</div>
              ) : (
                fontList.map((font, index) => (
                  <button
                    key={`${font}-${index}`}
                    onClick={() => {
                      updateTextProperty(selectedText.id, "fontFamily", font);
                      setIsFontListOpen(false);
                      setFontSearch("");
                    }}
                    className={`w-full px-2 py-1 text-left text-sm hover:bg-brand-50 ${
                      selectedText.fontFamily === font ? "bg-brand-100" : ""
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))
              )}
              {!showAllFonts && (
                <button
                  onClick={handleLoadAllFonts}
                  className="w-full px-2 py-1 text-left text-sm text-brand-500 hover:bg-brand-50"
                >
                  Show All Fonts
                </button>
              )}
              {showAllFonts && !allFontsLoaded && (
                <div className="p-2 text-sm text-brand-500">
                  Loading fonts...
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-700 block mb-1">Color</label>
            <input
              type="color"
              value={selectedText.fill}
              onChange={(e) =>
                updateTextProperty(selectedText.id, "fill", e.target.value)
              }
              className="w-full h-8 rounded-md border border-brand-100 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-brand-700 block mb-1">Opacity</label>
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
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>
      <div>
        {colorPalette.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs text-brand-700 block w-full">
              Suggested Colors:
            </span>
            {colorPalette.map((color, index) => (
              <button
                key={index}
                onClick={() =>
                  updateTextProperty(selectedText.id, "fill", color)
                }
                className="w-6 h-6 rounded-full border border-brand-200 hover:border-brand-500 focus:ring-2 focus:ring-brand-300"
                style={{ backgroundColor: color }}
                aria-label={`Apply color ${color}`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextControls;
