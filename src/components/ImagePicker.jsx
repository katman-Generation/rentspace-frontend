import { useRef } from "react";

export default function ImagePicker({ images, setImages, max = 5 }) {
  const inputRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const allowed = files.slice(0, max - images.length);
    setImages([...images, ...allowed]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-full h-28 rounded-xl overflow-hidden border"
          >
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="h-28 rounded-xl border-2 border-dashed flex items-center justify-center text-gray-400 hover:border-emerald-500"
          >
            ＋
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFiles}
      />

      <p className="text-xs text-gray-500">
        {images.length}/{max} photos
      </p>
    </div>
  );
}
