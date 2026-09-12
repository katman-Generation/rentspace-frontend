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
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || "");
  const [locationId, setLocationId] = useState(
    initialData?.location?.id || ""
  );
  const [spaceTypeId, setSpaceTypeId] = useState(
    initialData?.space_type?.id || ""
  );

  const [images, setImages] = useState(
    initialData?.images?.length
      ? initialData.images.map((i) => i.image)
      : []
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

  /* LOAD FORM OPTIONS */
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [locationsResponse, typesResponse] = await Promise.all([
          api.get("/api/spaces/locations/"),
          api.get("/api/spaces/space-types/"),
        ]);

        setLocations(locationsResponse.data);
        setSpaceTypes(typesResponse.data);
      } catch (error) {
        console.error("Failed to load space options:", error);
        setErrorMessage(
          "We couldn't load locations and space types. Please refresh and try again."
        );
      }
    };

    loadOptions();
  }, []);

  /* CLEANUP */
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  /* SUBMIT */
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
        await api.patch(
          `/api/spaces/update/${initialData.id}/`,
          formData
        );
      } else {
        await api.post("/api/spaces/create/", formData);
      }

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      setProgress(100);

      if (isEdit) {
        setSuccessMessage("Your space has been updated successfully.");
        notifySaved();
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        "Your space has been published successfully."
      );

      redirectTimerRef.current = setTimeout(() => {
        notifySaved();
        navigate("/profile");
      }, 1200);

    } catch (error) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      setProgress(0);

      console.error("Failed to save space:", error);

      const backendError = error?.response?.data;

      if (backendError?.detail) {
        setErrorMessage(backendError.detail);
      } else if (typeof backendError === "object") {
        const firstError = Object.values(backendError)?.[0];

        if (Array.isArray(firstError)) {
          setErrorMessage(firstError[0]);
        } else if (firstError) {
          setErrorMessage(String(firstError));
        } else {
          setErrorMessage(
            "We couldn't save your space. Please check your details and try again."
          );
        }
      } else {
        setErrorMessage(
          "We couldn't save your space. Please check your details and try again."
        );
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(13,59,46,0.08)]">

      {/* FORM HEADER */}
      <div className="relative overflow-hidden bg-[#0d3b2e] px-6 py-8 md:px-10">

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-[#e5ad35]/20" />

        <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full border border-[#e5ad35]/10" />

        <div className="relative">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5ad35]">
            {isEdit ? "Manage your listing" : "List your space"}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            {isEdit
              ? "Update your space"
              : "Tell people about your space"}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
            {isEdit
              ? "Update your listing details and keep your space information current."
              : "Add a few details and photos to create a beautiful listing on RentSpace."}
          </p>

        </div>

      </div>

      {/* STATUS */}
      {(successMessage || errorMessage || isSubmitting) && (
        <div className="px-6 pt-6 md:px-10">

          {isSubmitting && (
            <div className="rounded-2xl border border-[#e8dfc5] bg-[#faf8f1] p-4">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-sm font-bold text-[#18231e]">
                    {isEdit ? "Updating your space..." : "Publishing your space..."}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Please keep this page open.
                  </p>
                </div>

                <span className="text-sm font-bold text-[#80631d]">
                  {progress}%
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9e2d0]">

                <div
                  className="h-full rounded-full bg-[#e5ad35] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />

              </div>

            </div>
          )}

          {successMessage && !isSubmitting && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                ✓
              </span>

              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                !
              </span>

              <span>{errorMessage}</span>
            </div>
          )}

        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-10 p-6 md:p-10"
      >

        {/* PHOTOS */}
        <section>

          <SectionHeading
            number="01"
            title="Photos"
            description="Good photos help people understand your space before they contact you."
          />

          <div className="mt-6">
            <ImagePicker
              images={images}
              setImages={setImages}
            />
          </div>

        </section>

        {/* DETAILS */}
        <section>

          <SectionHeading
            number="02"
            title="Space details"
            description="Give your listing a clear title and a description people can trust."
          />

          <div className="mt-6 space-y-5">

            <Field
              label="Space title"
              hint="Example: Modern 3-bedroom house in Borrowdale"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your space a memorable title"
                className="premium-input"
                disabled={isSubmitting}
                required
              />
            </Field>

            <Field
              label="Description"
              hint="Tell people what makes this space special."
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the space, its features, surroundings and anything visitors should know..."
                rows={6}
                className="premium-input resize-none"
                disabled={isSubmitting}
                required
              />
            </Field>

          </div>

        </section>

        {/* PRICE + LOCATION */}
        <section>

          <SectionHeading
            number="03"
            title="Pricing & location"
            description="Help people understand where your space is and what it costs."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Field
              label="Monthly price"
              hint="Enter the rental price in USD."
            >
              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#80631d]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="500"
                  className="premium-input pl-10"
                  disabled={isSubmitting}
                  required
                />

              </div>
            </Field>

            <Field label="Space type">

              <select
                value={spaceTypeId}
                onChange={(e) => setSpaceTypeId(e.target.value)}
                className="premium-input appearance-none"
                disabled={isSubmitting}
                required
              >
                <option value="">Choose a space type</option>

                {spaceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}

              </select>

            </Field>

            <Field
              label="Location"
              hint="Choose the location closest to your space."
            >
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="premium-input appearance-none"
                disabled={isSubmitting}
                required
              >
                <option value="">Choose a location</option>

                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city} — {location.area}
                  </option>
                ))}

              </select>
            </Field>

          </div>

        </section>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-gray-200 px-7 py-3.5 font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0d3b2e] px-8 py-3.5 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#124c3a] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Publishing..."
              : isEdit
              ? "Save changes"
              : "Publish space"}

            {!isSubmitting && (
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            )}

          </button>

        </div>

      </form>

      {/* LOCAL STYLES */}
      <style>{`
        .premium-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          background: #fafaf8;
          padding: 0.9rem 1rem;
          color: #18231e;
          outline: none;
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease,
            background 200ms ease;
        }

        .premium-input::placeholder {
          color: #a1a1aa;
        }

        .premium-input:hover {
          border-color: #d4d4d8;
          background: #ffffff;
        }

        .premium-input:focus {
          border-color: #0d3b2e;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(13, 59, 46, 0.08);
        }

        .premium-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

/* SECTION HEADING */
function SectionHeading({ number, title, description }) {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3ead1] text-xs font-bold text-[#80631d]">
        {number}
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#18231e]">
          {title}
        </h3>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

    </div>
  );
}

/* FIELD */
function Field({ label, hint, children }) {
  return (
    <div>

      <div className="mb-2 flex items-baseline justify-between gap-3">

        <label className="text-sm font-bold text-[#26342d]">
          {label}
        </label>

      </div>

      {children}

      {hint && (
        <p className="mt-2 text-xs text-gray-400">
          {hint}
        </p>
      )}

    </div>
  );
}