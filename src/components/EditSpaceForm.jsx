import { useState } from "react";
import api from "../api/api";
import ImagePicker from "./ImagePicker";

export default function EditSpaceForm({ space, onUpdated }) {
  const [title, setTitle] = useState(space.title);
  const [description, setDescription] = useState(space.description);
  const [price, setPrice] = useState(space.price);
  const [images, setImages] = useState(
    space.images?.length
      ? space.images.map((img) => img.image)
      : ["/placeholder-space.jpg"]
  );

  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });

    await api.patch(`/api/spaces/update/${space.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setOpen(false);
    onUpdated();
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-sm text-emerald-700"
      >
        Edit Space
      </button>
    );

  return (
    <div className="mt-4 space-y-3">
      <ImagePicker images={images} setImages={setImages} />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-emerald-700 text-white px-3 py-1 rounded"
        >
          Save
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
