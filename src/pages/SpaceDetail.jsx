import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import SpaceForm from "../components/SpaceForm";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function SpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const fetchSpace = useCallback(() => {
    setLoading(true);

    api
      .get(`/api/spaces/${id}/`)
      .then((res) => setSpace(res.data))
      .catch((err) => {
        console.error(err);
        setSpace(null);
      })
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
  const messageOwner = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!space?.id || space.is_owner || !space.is_available) {
      return;
    }

    try {
      const res = await api.post("/api/chat/conversations/", {
        space_id: space.id,
      });

      navigate(`/messages?conversation=${res.data.id}`);
    } catch (err) {
      console.error("Failed to start conversation:", err);

      if (err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4e9]">
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-[500px] rounded-[2rem] bg-gray-200" />

            <div className="h-10 w-2/3 rounded-xl bg-gray-200" />

            <div className="h-6 w-1/3 rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-[#f8f4e9]">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5ad35]/20 text-4xl">
              🏠
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#1d2923]">
              Space not found
            </h1>

            <p className="mt-3 text-gray-500">
              This listing may have been removed or is no longer available.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-full bg-[#155c3a] px-6 py-3 font-semibold text-white transition hover:bg-[#0d3f29]"
            >
              ← Back to spaces
            </Link>

          </div>
        </main>

        <Footer />
      </div>
    );
  }


  const images = space.images || [];
  const hasImages = images.length > 0;

  const rentalPeriod = {
    hour: "hour",
    day: "day",
    week: "week",
    month: "month",
    year: "year",
  };

  const periodLabel =
    rentalPeriod[space.rental_period] || "month";

  return (
    <div className="min-h-screen bg-[#f8f4e9]">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#155c3a] transition hover:text-[#a85f3f]"
        >
          ← Back to spaces
        </Link>

        {/* IMAGE GALLERY */}
        <section>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#0d3f29] shadow-2xl">

            <div className="aspect-[16/9] max-h-[650px] w-full">

              <img
                src={
                  hasImages
                    ? images[activeImage]?.image
                    : "/placeholder-space.jpg"
                }
                alt={space.title}
                className="h-full w-full object-cover"
              />

            </div>

            {/* Gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            {/* Type */}
            <div className="absolute left-5 top-5 sm:left-7 sm:top-7">

              <span className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {space.space_type?.name || "Space"}
              </span>

            </div>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-medium text-white backdrop-blur-md sm:right-7 sm:top-7">
                {activeImage + 1} / {images.length}
              </div>
            )}

            {/* Image title */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">

              <p className="text-sm font-medium text-white/70">
                {space.location?.city}
                {space.location?.area
                  ? ` • ${space.location.area}`
                  : ""}
              </p>

              <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {space.title}
              </h1>

            </div>

          </div>

          {/* THUMBNAILS */}
          {hasImages && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

              {images.map((img, index) => (
                <button
                  key={img.id || index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition sm:h-24 sm:w-36 ${
                    activeImage === index
                      ? "ring-3 ring-[#e5ad35]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={`${space.title} ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {activeImage === index && (
                    <div className="absolute inset-0 bg-[#155c3a]/20" />
                  )}
                </button>
              ))}

            </div>
          )}

        </section>

        {/* MAIN INFORMATION */}
        <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div>

            {/* Heading */}
            <div className="border-b border-[#155c3a]/10 pb-8">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-[#155c3a]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#155c3a]">
                  {space.space_type?.name || "Space"}
                </span>

                {space.is_available ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#e5ad35]/20 px-4 py-2 text-xs font-semibold text-[#155c3a]">
                    <span className="h-2 w-2 rounded-full bg-[#155c3a]" />
                    Available
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-600">
                    Currently unavailable
                  </span>
                )}

              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#1d2923] sm:text-4xl">
                {space.title}
              </h2>

              <p className="mt-3 flex items-center gap-2 text-gray-500">
                <span>📍</span>

                <span>
                  {space.location?.city}
                  {space.location?.area
                    ? `, ${space.location.area}`
                    : ""}
                </span>
              </p>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-3 border-b border-[#155c3a]/10 py-8 sm:grid-cols-3">

              {space.bedrooms != null && (
                <Feature
                  icon="🛏"
                  label="Bedrooms"
                  value={space.bedrooms}
                />
              )}

              {space.bathrooms != null && (
                <Feature
                  icon="🚿"
                  label="Bathrooms"
                  value={space.bathrooms}
                />
              )}

              {space.parking_spaces != null && (
                <Feature
                  icon="🚗"
                  label="Parking"
                  value={space.parking_spaces}
                />
              )}

              {space.floor_area != null && (
                <Feature
                  icon="📐"
                  label="Floor area"
                  value={`${space.floor_area}`}
                />
              )}

              {space.capacity != null && (
                <Feature
                  icon="👥"
                  label="Capacity"
                  value={space.capacity}
                />
              )}

              {space.furnished != null && (
                <Feature
                  icon="🛋"
                  label="Furnished"
                  value={space.furnished ? "Yes" : "No"}
                />
              )}

            </div>

            {/* DESCRIPTION */}
            <div className="border-b border-[#155c3a]/10 py-8">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                About this space
              </p>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                {space.description}
              </p>

            </div>

            {/* EXTRA INFORMATION */}
            {(space.deposit || space.available_from) && (
              <div className="py-8">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                  Rental information
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  {space.deposit && (
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                      <p className="text-xs text-gray-400">
                        Deposit
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#155c3a]">
                        ${space.deposit}
                      </p>
                    </div>
                  )}

                  {space.available_from && (
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                      <p className="text-xs text-gray-400">
                        Available from
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#1d2923]">
                        {space.available_from}
                      </p>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* RIGHT PRICE / CONTACT CARD */}
          <aside>

            <div className="sticky top-24 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">

              <div className="flex items-end justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Rent
                  </p>

                  <p className="mt-1 text-4xl font-bold text-[#155c3a]">
                    ${space.price}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    per {periodLabel}
                  </p>
                </div>

                <div className="rounded-full bg-[#e5ad35]/15 px-3 py-1.5 text-xs font-bold text-[#155c3a]">
                  {space.is_available
                    ? "Available"
                    : "Unavailable"}
                </div>

              </div>

              {/* Contact */}
              {!space.is_owner && space.is_available && (
                <button
                  type="button"
                  onClick={messageOwner}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl"
                >
                  <span className="text-xl">💬</span>
                  Message owner
                </button>
              )}

              {!space.is_owner && !space.is_available && (
                <div className="mt-7 rounded-2xl bg-gray-100 px-5 py-4 text-center text-sm font-semibold text-gray-500">
                  This space is currently unavailable
                </div>
              )}

              {/* Owner */}
              {space.is_owner && (
                <div className="mt-7 space-y-3">

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full rounded-2xl border border-[#155c3a]/20 bg-white px-5 py-3.5 font-semibold text-[#155c3a] transition hover:bg-[#f8f4e9]"
                  >
                    Edit listing
                  </button>

                  <button
                    disabled={updating}
                    onClick={toggleAvailability}
                    className={`w-full rounded-2xl px-5 py-3.5 font-semibold text-white transition ${
                      space.is_available
                        ? "bg-[#a85f3f] hover:bg-[#8f4d33]"
                        : "bg-[#155c3a] hover:bg-[#0d3f29]"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {updating
                      ? "Updating..."
                      : space.is_available
                      ? "Mark unavailable"
                      : "Make available"}
                  </button>

                </div>
              )}

              {/* Trust */}
              <div className="mt-7 border-t border-gray-100 pt-6">

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5ad35]/20">
                    🇿🇼
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1d2923]">
                      Listed on RentSpace
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Connect directly with the space owner.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </aside>

        </section>

        {/* EDIT FORM */}
        {space.is_owner && editing && (
          <section className="mt-12 rounded-[2rem] border border-[#155c3a]/10 bg-white p-5 shadow-sm sm:p-8">

            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                Manage listing
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#1d2923]">
                Edit your space
              </h2>
            </div>

            <SpaceForm
              initialData={space}
              onSaved={() => {
                setEditing(false);
                fetchSpace();
              }}
              onCancel={() => setEditing(false)}
            />

          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">

      <span className="text-xl">
        {icon}
      </span>

      <p className="mt-3 text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#1d2923]">
        {value}
      </p>

    </div>
  );
}