import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import SpaceForm from "../components/SpaceForm";
import { useState, useEffect } from "react";

export default function SpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchSpace = () => {
    api.get(`spaces/${id}/`)
      .then(res => setSpace(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpace();
  }, [id]);

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      await api.patch(`spaces/update/${space.id}/`, {
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

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* IMAGE */}
        {space.images.length > 0 && (
          <img
            src={space.images[0].image}
            alt={space.title}
            className="w-full h-96 object-cover rounded-2xl"
          />
        )}

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4">

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
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              >
                Edit
              </button>
              {editing && (
                <SpaceForm
                  initialData={space}
                  onSaved={() => {
                    setEditing(false);
                    fetchSpace();
                  }}
                  onCancel={() => setEditing(false)}
                />
              )}

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
