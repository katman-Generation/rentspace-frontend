import { useEffect, useState } from "react";
import api from "../api/api";

export default function CreateSpaceForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [locationId, setLocationId] = useState("");
  const [spaceTypeId, setSpaceTypeId] = useState("");

  const [locations, setLocations] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    const [locRes, typeRes] = await Promise.all([
      api.get("spaces/locations/"),
      api.get("spaces/space-types/"),
    ]);

    setLocations(locRes.data);
    setSpaceTypes(typeRes.data);
  };
  const MAX_SIZE = 500 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    alert("Image too large (max 500MB)");
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("spaces/create/", {
      title,
      description,
      price,
      location_id: locationId,
      space_type_id: spaceTypeId,
    });

    setTitle("");
    setDescription("");
    setPrice("");
    setLocationId("");
    setSpaceTypeId("");

    onCreated();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Space</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />

        <button className="bg-emerald-700 text-white px-4 py-2 rounded">
          Create Space
        </button>
      </form>
    </div>
  );
}
