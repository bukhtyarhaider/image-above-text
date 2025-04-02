import { TrashIcon } from "@heroicons/react/24/outline";

interface TextListProps {
  texts: TextProperties[];
  selectedTextId: string | null;
  setSelectedTextId: (id: string) => void;
  deleteText: (id: string) => void;
}

const TextList: React.FC<TextListProps> = ({
  texts,
  selectedTextId,
  setSelectedTextId,
  deleteText,
}) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-brand-900 flex items-center gap-2">
      Text List <span className="text-sm text-brand-500">({texts.length})</span>
    </h3>
    <div className="max-h-40 overflow-y-auto border border-brand-100 rounded-xl bg-white shadow-inner p-2">
      {texts.length === 0 ? (
        <p className="text-sm text-brand-500 text-center py-2">
          No text added yet.
        </p>
      ) : (
        texts.map((text) => (
          <div
            key={text.id}
            className={`flex items-center justify-between p-2 rounded-lg mb-1 ${
              selectedTextId === text.id
                ? "bg-brand-50 ring-1 ring-brand-300"
                : "hover:bg-neutral-50"
            } transition-all duration-200`}
          >
            <div
              className="flex-1 cursor-pointer truncate text-sm"
              onClick={() => setSelectedTextId(text.id)}
              style={{
                fontFamily: text.fontFamily,
                fontSize: `${Math.min(text.fontSize, 14)}px`,
                color: text.fill,
                opacity: text.opacity,
              }}
              title={text.text}
            >
              {text.text}
            </div>
            <button
              onClick={() => deleteText(text.id)}
              className="ml-2 p-1 text-brand-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              aria-label={`Delete text: ${text.text}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

export default TextList;
