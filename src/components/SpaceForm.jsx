import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import ImagePicker from "./ImagePicker";

export default function SpaceForm({
  initialData = null,
  onSaved,
  onCreated,
  onCancel = () => {},
}) {
  const isEdit = Boolean(initialData);
  const navigate = useNavigate();
  const progressTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const notifySaved = () => {
    if (typeof onSaved === "function") onSaved();
    if (typeof onCreated === "function") onCreated();
  };

  useEffect(() => {
    Promise.all([
      api.get("/api/spaces/locations/"),
      api.get("/api/spaces/space-types/"),
    ]).then(([l, t]) => {
      setLocations(l.data);
      setSpaceTypes(t.data);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setProgress(15);
    setIsSubmitting(true);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 8 : prev));
    }, 150);

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

    try {
      if (isEdit) {
        await api.patch(`/api/spaces/update/${initialData.id}/`, formData);
      } else {
        await api.post("/api/spaces/create/", formData);
      }

      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setProgress(100);

      if (isEdit) {
        setSuccessMessage("Space updated successfully.");
        notifySaved();
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Space created successfully. Redirecting to profile...");
      redirectTimerRef.current = setTimeout(() => {
        notifySaved();
        navigate("/profile");
      }, 1200);
    } catch (error) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setProgress(0);
      setErrorMessage(
        error?.response?.data?.detail || "Failed to save space. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Space" : "Add New Space"}
      </h2>

      {isSubmitting && (
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-emerald-700 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Saving... {progress}%</p>
        </div>
      )}

      {successMessage && (
        <p className="mb-3 text-sm text-emerald-700">{successMessage}</p>
      )}
      {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <ImagePicker images={images} setImages={setImages} />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          disabled={isSubmitting}
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          disabled={isSubmitting}
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          disabled={isSubmitting}
          required
        />

        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          <button
            disabled={isSubmitting}
            className="bg-emerald-700 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
