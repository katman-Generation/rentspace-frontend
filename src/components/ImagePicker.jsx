import { useEffect, useRef, useState } from "react";

export default function ImagePicker({ images, setImages, max = 5 }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const objectUrls = images.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );

    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url, index) => {
        if (images[index] instanceof File) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const allowed = files.slice(0, max - images.length);

    setImages([...images, ...allowed]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const openPicker = () => {
    if (images.length < max) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-4">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Photos
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#18231e]">
            Show people your space
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add up to {max} photos. Your first photo will be the main image.
          </p>
        </div>

        <div className="rounded-full bg-[#f3ead1] px-3 py-1.5 text-xs font-bold text-[#765719]">
          {images.length}/{max}
        </div>

      </div>

      {/* PHOTO GRID */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

        {/* MAIN IMAGE */}
        {previews[0] && (
          <div className="group relative col-span-2 row-span-2 h-64 overflow-hidden rounded-3xl border border-black/5 bg-gray-100 shadow-sm">

            <img
              src={previews[0]}
              alt="Main space"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">

              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                Main photo
              </span>

            </div>

            <button
              type="button"
              onClick={() => removeImage(0)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-sm text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-red-500"
              aria-label="Remove main photo"
            >
              ×
            </button>

          </div>
        )}

        {/* SECONDARY IMAGES */}
        {previews.slice(1).map((src, index) => {

          const actualIndex = index + 1;

          return (
            <div
              key={actualIndex}
              className="group relative h-[122px] overflow-hidden rounded-2xl border border-black/5 bg-gray-100 shadow-sm sm:h-[122px]"
            >

              <img
                src={src}
                alt={`Space ${actualIndex + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <button
                type="button"
                onClick={() => removeImage(actualIndex)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-red-500"
                aria-label={`Remove photo ${actualIndex + 1}`}
              >
                ×
              </button>

            </div>
          );
        })}

        {/* ADD PHOTO */}
        {images.length < max && (
          <button
            type="button"
            onClick={openPicker}
            className="flex h-[122px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9cfae] bg-[#faf8f1] text-gray-400 transition hover:border-[#e5ad35] hover:bg-[#fffaf0] hover:text-[#8b6b1f]"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e5c5] text-xl text-[#80631d]">
              +
            </span>

            <span className="mt-2 text-xs font-bold">
              Add photo
            </span>

          </button>
        )}

      </div>

      {/* HIDDEN INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFiles}
      />

    </div>
  );
}