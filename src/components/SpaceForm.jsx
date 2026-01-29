import { useEffect, useState } from "react";
import api from "../api/api";
import ImagePicker from "./ImagePicker";

export default function SpaceForm({ initialData = null, onSaved, onCancel }) {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [locationId, setLocationId] = useState(initialData?.location?.id || "");
  const [spaceTypeId, setSpaceTypeId] = useState(initialData?.space_type?.id || "");

  const [images, setImages] = useState(
    initialData?.images?.length
      ? initialData.images.map((i) => i.image)
      : ["/placeholder-space.jpg"]
  );

  const [locations, setLocations] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/spaces/locations/"),
      api.get("/api/spaces/space-types/"),
    ]).then(([l, t]) => {
      setLocations(l.data);
      setSpaceTypes(t.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location_id", locationId);
    formData.append("space_type_id", spaceTypeId);

    images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });

    if (isEdit) {
      await api.patch(`/api/spaces/update/${initialData.id}/`, formData);
    } else {
      await api.post("/api/spaces/create/", formData);
    }

    onSaved();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Space" : "Add New Space"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ImagePicker images={images} setImages={setImages} />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.city} - {l.area}
            </option>
          ))}
        </select>

        <select
          value={spaceTypeId}
          onChange={(e) => setSpaceTypeId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select space type</option>
          {spaceTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex gap-3 pt-4">
          <button className="bg-emerald-700 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
