import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import ImagePicker from "./ImagePicker";

const CATEGORY_NAMES = {
  BUY: "Buy",
  RENT: "Rent",
  STUDENT: "Student Accommodation",
};

const ROOM_TYPES = [
  { value: "private_room", label: "Private Room" },
  { value: "shared_room", label: "Shared Room" },
  { value: "entire_unit", label: "Entire Unit" },
];

const BATHROOM_TYPES = [
  { value: "private", label: "Private Bathroom" },
  { value: "shared", label: "Shared Bathroom" },
];

const MEAL_PLANS = [
  { value: "none", label: "No Meals" },
  { value: "optional", label: "Meals Available" },
  { value: "included", label: "Meals Included" },
];

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

  /* =========================
     FORM STATE
  ========================= */

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [price, setPrice] = useState(initialData?.price || "");
  const [deposit, setDeposit] = useState(initialData?.deposit || "");

  const [categoryId, setCategoryId] = useState(
    initialData?.category?.id || ""
  );

  const [spaceTypeId, setSpaceTypeId] = useState(
    initialData?.space_type?.id || ""
  );

  const [locationId, setLocationId] = useState(
    initialData?.location?.id || ""
  );

  const [listingPurpose, setListingPurpose] = useState(
    initialData?.listing_purpose || "rent"
  );

  const [currency, setCurrency] = useState(
    initialData?.currency || "USD"
  );

  const [rentalPeriod, setRentalPeriod] = useState(
    initialData?.rental_period || "month"
  );

  const [availableFrom, setAvailableFrom] = useState(
    initialData?.available_from || ""
  );

  const [bedrooms, setBedrooms] = useState(
    initialData?.bedrooms ?? ""
  );

  const [bathrooms, setBathrooms] = useState(
    initialData?.bathrooms ?? ""
  );

  const [parkingSpaces, setParkingSpaces] = useState(
    initialData?.parking_spaces ?? ""
  );

  const [floorArea, setFloorArea] = useState(
    initialData?.floor_area ?? ""
  );

  const [capacity, setCapacity] = useState(
    initialData?.capacity ?? ""
  );

  const [furnished, setFurnished] = useState(
    initialData?.furnished ?? ""
  );

  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available ?? true
  );

  const [amenityIds, setAmenityIds] = useState(
    initialData?.amenities?.map((amenity) => amenity.id) || []
  );

  const [images, setImages] = useState(
    initialData?.images?.length
      ? initialData.images.map((image) => image.image)
      : []
  );

  /* =========================
     STUDENT ACCOMMODATION
  ========================= */

  const existingStudentDetails =
    initialData?.student_details || null;

  const [institutionId, setInstitutionId] = useState(
    existingStudentDetails?.institution?.id ||
      existingStudentDetails?.institution_id ||
      ""
  );

  const [campus, setCampus] = useState(
    existingStudentDetails?.campus || ""
  );

  const [distanceToCampus, setDistanceToCampus] = useState(
    existingStudentDetails?.distance_to_campus_km ?? ""
  );

  const [roomType, setRoomType] = useState(
    existingStudentDetails?.room_type || "private_room"
  );

  const [roomsAvailable, setRoomsAvailable] = useState(
    existingStudentDetails?.rooms_available ?? 1
  );

  const [bathroomType, setBathroomType] = useState(
    existingStudentDetails?.bathroom_type || ""
  );

  const [mealPlan, setMealPlan] = useState(
    existingStudentDetails?.meal_plan || "none"
  );

  /* =========================
     DATABASE OPTIONS
  ========================= */

  const [categories, setCategories] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);

  /* =========================
     STATUS
  ========================= */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     HELPERS
  ========================= */

  const getResults = (response) => {
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.results)) {
      return response.data.results;
    }

    return [];
  };

  const getCategoryById = (id) => {
    return categories.find(
      (category) => String(category.id) === String(id)
    );
  };

  const selectedCategory = getCategoryById(categoryId);

  const selectedCategoryName =
    selectedCategory?.name || "";

  const isBuyCategory =
    selectedCategoryName.toLowerCase() ===
    CATEGORY_NAMES.BUY.toLowerCase();

  const isStudentCategory =
    selectedCategoryName.toLowerCase() ===
    CATEGORY_NAMES.STUDENT.toLowerCase();

  const currencySymbol = currency === "ZiG" ? "ZiG" : "$";

  /* =========================
     LOAD DATABASE OPTIONS
  ========================= */

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      setErrorMessage("");

      try {
        const [
          categoriesResponse,
          typesResponse,
          locationsResponse,
          amenitiesResponse,
          institutionsResponse,
        ] = await Promise.all([
          api.get("/api/spaces/categories/"),
          api.get("/api/spaces/space-types/"),
          api.get("/api/spaces/locations/"),
          api.get("/api/spaces/amenities/"),
          api.get("/api/spaces/institutions/"),
        ]);

        setCategories(getResults(categoriesResponse));
        setSpaceTypes(getResults(typesResponse));
        setLocations(getResults(locationsResponse));
        setAmenities(getResults(amenitiesResponse));
        setInstitutions(getResults(institutionsResponse));
      } catch (error) {
        console.error("Failed to load space options:", error);

        setErrorMessage(
          "We couldn't load the space options. Please refresh the page and try again."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  /* =========================
     FILTER SPACE TYPES
     BY CATEGORY
  ========================= */

  const filteredSpaceTypes = categoryId
    ? spaceTypes.filter(
        (type) =>
          String(type.category) === String(categoryId)
      )
    : [];

  /* =========================
     KEEP LISTING PURPOSE
     ALIGNED WITH CATEGORY
  ========================= */

  useEffect(() => {
    if (isBuyCategory) {
      setListingPurpose("sale");
    } else if (categoryId) {
      setListingPurpose("rent");
    }
  }, [categoryId, isBuyCategory]);

  /* =========================
     CATEGORY CHANGE
  ========================= */

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;

    setCategoryId(newCategoryId);
    setSpaceTypeId("");

    const newCategory = categories.find(
      (category) =>
        String(category.id) === String(newCategoryId)
    );

    const newCategoryName =
      newCategory?.name?.toLowerCase() || "";

    if (
      newCategoryName === CATEGORY_NAMES.BUY.toLowerCase()
    ) {
      setListingPurpose("sale");
    } else {
      setListingPurpose("rent");
    }

    if (
      newCategoryName !==
      CATEGORY_NAMES.STUDENT.toLowerCase()
    ) {
      setInstitutionId("");
      setCampus("");
      setDistanceToCampus("");
      setRoomType("private_room");
      setRoomsAvailable(1);
      setBathroomType("");
      setMealPlan("none");
    }
  };

  /* =========================
     AMENITY TOGGLE
  ========================= */

  const toggleAmenity = (amenityId) => {
    setAmenityIds((current) => {
      if (current.includes(amenityId)) {
        return current.filter((id) => id !== amenityId);
      }

      return [...current, amenityId];
    });
  };

  /* =========================
     CLEANUP
  ========================= */

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

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    if (!categoryId) {
      return "Please choose a category.";
    }

    if (!spaceTypeId) {
      return "Please choose a space type.";
    }

    if (!locationId) {
      return "Please choose a location.";
    }

    if (!title.trim()) {
      return "Please enter a title for your space.";
    }

    if (!description.trim()) {
      return "Please describe your space.";
    }

    if (!price) {
      return "Please enter a price.";
    }

    if (isStudentCategory) {
      if (!institutionId) {
        return "Please choose the institution.";
      }

      if (!roomType) {
        return "Please choose a room type.";
      }

      if (!roomsAvailable || Number(roomsAvailable) < 1) {
        return "Please enter the number of rooms available.";
      }
    }

    return "";
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setProgress(15);
    setIsSubmitting(true);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) =>
        prev < 90 ? prev + 8 : prev
      );
    }, 150);

    const formData = new FormData();

    /* Required fields */

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("category_id", categoryId);
    formData.append("space_type_id", spaceTypeId);
    formData.append("location_id", locationId);
    formData.append("listing_purpose", listingPurpose);
    formData.append("currency", currency);
    formData.append("rental_period", rentalPeriod);

    /* Optional fields */

    if (deposit !== "") {
      formData.append("deposit", deposit);
    }

    if (availableFrom) {
      formData.append("available_from", availableFrom);
    }

    if (bedrooms !== "") {
      formData.append("bedrooms", bedrooms);
    }

    if (bathrooms !== "") {
      formData.append("bathrooms", bathrooms);
    }

    if (parkingSpaces !== "") {
      formData.append("parking_spaces", parkingSpaces);
    }

    if (floorArea !== "") {
      formData.append("floor_area", floorArea);
    }

    if (capacity !== "") {
      formData.append("capacity", capacity);
    }

    if (furnished !== "") {
      formData.append("furnished", furnished);
    }

    formData.append("is_available", isAvailable);

    /* Amenities */

    amenityIds.forEach((id) => {
      formData.append("amenities", id);
    });

    /* Student accommodation */

    if (isStudentCategory) {
      formData.append(
        "student_details",
        JSON.stringify({
          institution_id: institutionId,
          campus: campus.trim(),
          distance_to_campus_km:
            distanceToCampus === ""
              ? null
              : distanceToCampus,
          room_type: roomType,
          rooms_available: Number(roomsAvailable),
          bathroom_type: bathroomType || null,
          meal_plan: mealPlan,
        })
      );
    }

    /* Images */

    images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    try {
      if (isEdit) {
        await api.patch(
          `/api/spaces/update/${initialData.id}/`,
          formData
        );
      } else {
        await api.post(
          "/api/spaces/create/",
          formData
        );
      }

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      setProgress(100);

      if (isEdit) {
        setSuccessMessage(
          "Your space has been updated successfully."
        );

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

      console.error(
        "Failed to save space:",
        error
      );

      const backendError =
        error?.response?.data;

      if (backendError?.detail) {
        setErrorMessage(backendError.detail);
      } else if (
        typeof backendError === "object" &&
        backendError !== null
      ) {
        const firstError =
          Object.values(backendError)?.[0];

        if (Array.isArray(firstError)) {
          setErrorMessage(
            firstError[0]
          );
        } else if (firstError) {
          setErrorMessage(
            String(firstError)
          );
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

  /* =========================
     CALLBACK
  ========================= */

  const notifySaved = () => {
    if (typeof onSaved === "function") {
      onSaved();
    }

    if (typeof onCreated === "function") {
      onCreated();
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(13,59,46,0.08)]">

      {/* HEADER */}

      <div className="relative overflow-hidden bg-[#0d3b2e] px-6 py-8 md:px-10">

        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-[#e5ad35]/20" />

        <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full border border-[#e5ad35]/10" />

        <div className="relative">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5ad35]">
            {isEdit
              ? "Manage your listing"
              : "List your space"}
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

      {(successMessage ||
        errorMessage ||
        isSubmitting) && (
        <div className="px-6 pt-6 md:px-10">

          {isSubmitting && (
            <div className="rounded-2xl border border-[#e8dfc5] bg-[#faf8f1] p-4">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-sm font-bold text-[#18231e]">
                    {isEdit
                      ? "Updating your space..."
                      : "Publishing your space..."}
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
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>
          )}

          {successMessage &&
            !isSubmitting && (
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

        {/* BASIC DETAILS */}

        <section>
          <SectionHeading
            number="02"
            title="Space details"
            description="Tell people what you're offering."
          />

          <div className="mt-6 space-y-5">

            <Field
              label="Space title"
              hint="Example: Modern 3-bedroom house in Borrowdale"
            >
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
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
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the space, its features, surroundings and anything visitors should know..."
                rows={6}
                className="premium-input resize-none"
                disabled={isSubmitting}
                required
              />
            </Field>

          </div>
        </section>

        {/* CATEGORY + SPACE TYPE */}

        <section>
          <SectionHeading
            number="03"
            title="What kind of space is it?"
            description="Choose a category first, then select the specific type of space."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Field
              label="Category"
              hint="Buy, Rent, or Student Accommodation."
            >
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="premium-input appearance-none"
                disabled={
                  isSubmitting ||
                  loadingOptions
                }
                required
              >

                <option value="">
                  {loadingOptions
                    ? "Loading categories..."
                    : "Choose a category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>
            </Field>

            <Field
              label="Space type"
              hint={
                categoryId
                  ? "Choose the type of space."
                  : "Choose a category first."
              }
            >
              <select
                value={spaceTypeId}
                onChange={(e) =>
                  setSpaceTypeId(
                    e.target.value
                  )
                }
                className="premium-input appearance-none"
                disabled={
                  isSubmitting ||
                  loadingOptions ||
                  !categoryId
                }
                required
              >

                <option value="">
                  {!categoryId
                    ? "Choose a category first"
                    : filteredSpaceTypes.length ===
                      0
                    ? "No types available"
                    : "Choose a space type"}
                </option>

                {filteredSpaceTypes.map(
                  (type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  )
                )}

              </select>
            </Field>

          </div>
        </section>

        {/* LISTING PURPOSE + CURRENCY */}

        <section>
          <SectionHeading
            number="04"
            title="Listing & currency"
            description="Tell people whether the space is being rented or sold and which currency you're using."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Field
              label="Listing purpose"
              hint={
                isBuyCategory
                  ? "Buy listings are automatically marked for sale."
                  : "This listing will be offered for rent."
              }
            >
              <select
                value={listingPurpose}
                onChange={(e) =>
                  setListingPurpose(
                    e.target.value
                  )
                }
                className="premium-input appearance-none"
                disabled={
                  isSubmitting ||
                  isBuyCategory
                }
              >
                <option value="rent">
                  For Rent
                </option>

                <option value="sale">
                  For Sale
                </option>
              </select>
            </Field>

            <Field
              label="Currency"
              hint="Choose the currency shown to people."
            >
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="premium-input appearance-none"
                disabled={isSubmitting}
              >
                <option value="USD">
                  US Dollar (USD)
                </option>

                <option value="ZiG">
                  Zimbabwe Gold (ZiG)
                </option>
              </select>
            </Field>

          </div>
        </section>

        {/* LOCATION */}

        <section>
          <SectionHeading
            number="05"
            title="Location"
            description="Tell people where your space is located."
          />

          <div className="mt-6">
            <Field
              label="Location"
              hint="Choose the location closest to your space."
            >
              <select
                value={locationId}
                onChange={(e) =>
                  setLocationId(
                    e.target.value
                  )
                }
                className="premium-input appearance-none"
                disabled={
                  isSubmitting ||
                  loadingOptions
                }
                required
              >

                <option value="">
                  {loadingOptions
                    ? "Loading locations..."
                    : "Choose a location"}
                </option>

                {locations.map(
                  (location) => (
                    <option
                      key={location.id}
                      value={location.id}
                    >
                      {location.province
                        ? `${location.province} — ${location.city} — ${location.area}`
                        : `${location.city} — ${location.area}`}
                    </option>
                  )
                )}

              </select>
            </Field>
          </div>
        </section>

        {/* STUDENT ACCOMMODATION */}

        {isStudentCategory && (
          <section>
            <SectionHeading
              number="06"
              title="Student accommodation"
              description="Give students the information they need to find accommodation near their institution."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Field
                label="Institution"
                hint="Choose the university or college this accommodation serves."
              >
                <select
                  value={institutionId}
                  onChange={(e) =>
                    setInstitutionId(
                      e.target.value
                    )
                  }
                  className="premium-input appearance-none"
                  disabled={
                    isSubmitting ||
                    loadingOptions
                  }
                  required
                >

                  <option value="">
                    {loadingOptions
                      ? "Loading institutions..."
                      : "Choose an institution"}
                  </option>

                  {institutions.map(
                    (institution) => (
                      <option
                        key={institution.id}
                        value={institution.id}
                      >
                        {institution.name}
                        {institution.campus
                          ? ` — ${institution.campus}`
                          : ""}
                      </option>
                    )
                  )}

                </select>
              </Field>

              <Field
                label="Campus"
                hint="Enter the specific campus name."
              >
                <input
                  value={campus}
                  onChange={(e) =>
                    setCampus(e.target.value)
                  }
                  placeholder="Example: Main Campus"
                  className="premium-input"
                  disabled={isSubmitting}
                />
              </Field>

              <NumberField
                label="Distance to campus (km)"
                value={distanceToCampus}
                setValue={setDistanceToCampus}
                disabled={isSubmitting}
                step="0.01"
              />

              <Field
                label="Room type"
                hint="What kind of accommodation is available?"
              >
                <select
                  value={roomType}
                  onChange={(e) =>
                    setRoomType(
                      e.target.value
                    )
                  }
                  className="premium-input appearance-none"
                  disabled={isSubmitting}
                  required
                >
                  {ROOM_TYPES.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <NumberField
                label="Rooms available"
                value={roomsAvailable}
                setValue={setRoomsAvailable}
                disabled={isSubmitting}
              />

              <Field
                label="Bathroom"
                hint="Choose whether the bathroom is private or shared."
              >
                <select
                  value={bathroomType}
                  onChange={(e) =>
                    setBathroomType(
                      e.target.value
                    )
                  }
                  className="premium-input appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="">
                    Not specified
                  </option>

                  {BATHROOM_TYPES.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field
                label="Meal plan"
                hint="Tell students whether meals are available."
              >
                <select
                  value={mealPlan}
                  onChange={(e) =>
                    setMealPlan(
                      e.target.value
                    )
                  }
                  className="premium-input appearance-none"
                  disabled={isSubmitting}
                >
                  {MEAL_PLANS.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </Field>

            </div>
          </section>
        )}

        {/* PRICE */}

        <section>
          <SectionHeading
            number={isStudentCategory ? "07" : "06"}
            title={
              listingPurpose === "sale"
                ? "Sale price"
                : "Pricing"
            }
            description={
              listingPurpose === "sale"
                ? "Set the asking price for this property."
                : "Set your rental price and payment period."
            }
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Field
              label={
                listingPurpose === "sale"
                  ? "Sale price"
                  : "Price"
              }
              hint={`Enter the price in ${currency}.`}
            >
              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#80631d]">
                  {currencySymbol}
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder={
                    currency === "ZiG"
                      ? "100000"
                      : "500"
                  }
                  className="premium-input pl-14"
                  disabled={isSubmitting}
                  required
                />

              </div>
            </Field>

            {listingPurpose !== "sale" && (
              <Field
                label="Rental period"
                hint="How is the price charged?"
              >
                <select
                  value={rentalPeriod}
                  onChange={(e) =>
                    setRentalPeriod(
                      e.target.value
                    )
                  }
                  className="premium-input appearance-none"
                  disabled={isSubmitting}
                  required
                >
                  <option value="hour">
                    Per Hour
                  </option>
                  <option value="day">
                    Per Day
                  </option>
                  <option value="week">
                    Per Week
                  </option>
                  <option value="month">
                    Per Month
                  </option>
                  <option value="year">
                    Per Year
                  </option>
                </select>
              </Field>
            )}

            {listingPurpose !== "sale" && (
              <Field
                label="Security deposit"
                hint="Optional."
              >
                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#80631d]">
                    {currencySymbol}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={deposit}
                    onChange={(e) =>
                      setDeposit(
                        e.target.value
                      )
                    }
                    placeholder="Optional"
                    className="premium-input pl-14"
                    disabled={isSubmitting}
                  />

                </div>
              </Field>
            )}

            <Field
              label="Available from"
              hint="Optional."
            >
              <input
                type="date"
                value={availableFrom}
                onChange={(e) =>
                  setAvailableFrom(
                    e.target.value
                  )
                }
                className="premium-input"
                disabled={isSubmitting}
              />
            </Field>

          </div>
        </section>

        {/* PROPERTY FEATURES */}

        <section>
          <SectionHeading
            number={isStudentCategory ? "08" : "07"}
            title="Space features"
            description="Add useful details so people know what to expect."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <NumberField
              label="Bedrooms"
              value={bedrooms}
              setValue={setBedrooms}
              disabled={isSubmitting}
            />

            <NumberField
              label="Bathrooms"
              value={bathrooms}
              setValue={setBathrooms}
              disabled={isSubmitting}
            />

            <NumberField
              label="Parking spaces"
              value={parkingSpaces}
              setValue={setParkingSpaces}
              disabled={isSubmitting}
            />

            <NumberField
              label="Floor area (m²)"
              value={floorArea}
              setValue={setFloorArea}
              disabled={isSubmitting}
              step="0.01"
            />

            <NumberField
              label="Capacity"
              value={capacity}
              setValue={setCapacity}
              disabled={isSubmitting}
            />

            <Field label="Furnished">
              <select
                value={furnished}
                onChange={(e) =>
                  setFurnished(
                    e.target.value
                  )
                }
                className="premium-input appearance-none"
                disabled={isSubmitting}
              >
                <option value="">
                  Not specified
                </option>

                <option value="true">
                  Furnished
                </option>

                <option value="false">
                  Unfurnished
                </option>
              </select>
            </Field>

          </div>
        </section>

        {/* AMENITIES */}

        {amenities.length > 0 && (
          <section>
            <SectionHeading
              number={isStudentCategory ? "09" : "08"}
              title="Amenities"
              description="Select the features available at your space."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">

              {amenities.map((amenity) => {
                const selected =
                  amenityIds.includes(
                    amenity.id
                  );

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity.id
                      )
                    }
                    disabled={isSubmitting}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? "border-[#0d3b2e] bg-[#0d3b2e] text-white"
                        : "border-gray-200 bg-[#fafaf8] text-gray-700 hover:border-[#0d3b2e]/30 hover:bg-white"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {amenity.name}

                      {selected && (
                        <span>✓</span>
                      )}
                    </span>
                  </button>
                );
              })}

            </div>
          </section>
        )}

        {/* AVAILABILITY */}

        <section>
          <SectionHeading
            number={
              amenities.length > 0
                ? isStudentCategory
                  ? "10"
                  : "09"
                : isStudentCategory
                ? "09"
                : "08"
            }
            title="Availability"
            description="Let people know whether this space is currently available."
          />

          <div className="mt-6">

            <button
              type="button"
              onClick={() =>
                setIsAvailable(
                  (current) => !current
                )
              }
              disabled={isSubmitting}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                isAvailable
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >

              <div>
                <p className="font-bold text-[#18231e]">
                  {isAvailable
                    ? "Space is available"
                    : "Space is currently unavailable"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {isAvailable
                    ? "People can see this listing as available."
                    : "People will see this space as unavailable."}
                </p>
              </div>

              <span
                className={`flex h-8 w-14 items-center rounded-full p-1 transition ${
                  isAvailable
                    ? "bg-[#0d3b2e]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    isAvailable
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </span>

            </button>

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
            disabled={
              isSubmitting ||
              loadingOptions ||
              !categories.length ||
              !locations.length
            }
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
          box-shadow:
            0 0 0 4px rgba(13, 59, 46, 0.08);
        }

        .premium-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>

    </div>
  );
}

/* =========================
   SECTION HEADING
========================= */

function SectionHeading({
  number,
  title,
  description,
}) {
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

/* =========================
   FIELD
========================= */

function Field({
  label,
  hint,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#26342d]">
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-xs text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================
   NUMBER FIELD
========================= */

function NumberField({
  label,
  value,
  setValue,
  disabled,
  step = "1",
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        placeholder="Optional"
        className="premium-input"
        disabled={disabled}
      />
    </Field>
  );
}