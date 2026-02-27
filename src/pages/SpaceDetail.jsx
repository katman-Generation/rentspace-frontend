import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import SpaceForm from "../components/SpaceForm";
import { useCallback, useEffect, useState } from "react";

export default function SpaceDetail() {
  const { id } = useParams();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const fetchSpace = useCallback(() => {
    api.get(`/api/spaces/${id}/`)
      .then((res) => setSpace(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchSpace();
  }, [fetchSpace]);

  useEffect(() => {
    if (!space?.images?.length) {
      setActiveImage(0);
      return;
    }
    setActiveImage((prev) =>
      prev >= space.images.length ? 0 : prev
    );
  }, [space?.images?.length]);

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      await api.patch(`/api/spaces/update/${space.id}/`, {
        is_available: !space.is_available,
      });
      fetchSpace();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!space) return <div>Space not found</div>;

  const whatsappLink =
    space && space.owner_phone
      ? `https://wa.me/${space.owner_phone}?text=${encodeURIComponent(
          `Hello, I'm interested in your space "${space.title}" listed on RentSpace`
        )}`
      : null;

  const images = space?.images || [];
  const hasImages = images.length > 0;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* IMAGES */}
        <div className="space-y-3">
          <div className="w-full aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={
                hasImages
                  ? images[activeImage]?.image
                  : "/placeholder-space.jpg"
              }
              alt={space.title}
              className="w-full h-full object-cover"
            />
          </div>

          {hasImages && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {images.map((img, index) => (
                <button
                  key={img.id || index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border ${
                    activeImage === index
                      ? "border-emerald-600 ring-2 ring-emerald-200"
                      : "border-transparent"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img.image}
                    alt={`${space.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {space.title}
            </h1>

            <p className="text-gray-500">
              {space.location.city}, {space.location.area}
            </p>

            <div className="flex gap-3 items-center mt-3">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {space.space_type.name}
              </span>

              <span className="text-2xl font-bold text-amber-500">
                ${space.price}
              </span>
              {space && !space.is_owner && whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  💬 Chat on WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* OWNER CONTROLS */}
          {space.is_owner && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              >
                Edit
              </button>

              <button
                disabled={updating}
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded-lg text-white ${
                  space.is_available
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {space.is_available ? "Disable" : "Enable"}
              </button>
            </div>
          )}
        </div>

        {space.is_owner && editing && (
          <div className="w-full">
            <SpaceForm
              initialData={space}
              onSaved={() => {
                setEditing(false);
                fetchSpace();
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-700 leading-relaxed">
          {space.description}
        </p>

        {/* STATUS */}
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              space.is_available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {space.is_available ? "Available" : "Unavailable"}
          </span>
        </div>

      </div>
    </>
  );
}
