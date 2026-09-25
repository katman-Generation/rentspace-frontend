import { useState } from "react";

const CATEGORY_OPTIONS = [
  {
    value: "",
    label: "All spaces",
  },
  {
    value: "rent",
    label: "Rent",
  },
  {
    value: "buy",
    label: "Buy",
  },
  {
    value: "student-accommodation",
    label: "Student Living",
  },
];

const GENERAL_TYPES = [
  "House",
  "Flat / Apartment",
  "Townhouse / Cluster",
  "Cottage / Garden Flat",
  "Room",
  "Commercial Property",
  "Office",
  "Warehouse / Factory",
  "Shop / Retail",
];

const BUY_TYPES = [
  "House",
  "Flat / Apartment",
  "Townhouse / Cluster",
  "Cottage / Garden Flat",
  "Stand / Residential Land",
  "Commercial Property",
  "Office",
  "Warehouse / Factory",
  "Shop / Retail",
  "Farm / Agricultural Land",
];

const STUDENT_TYPES = [
  "Student House",
  "Private Room",
  "Shared Room",
  "Student Flat / Apartment",
];

const QUICK_FILTERS = [
  "House",
  "Flat / Apartment",
  "Room",
  "Shop / Retail",
  "Office",
  "Warehouse / Factory",
];

const ROOM_TYPES = [
  "Private Room",
  "Shared Room",
  "Single Room",
];

const BATHROOM_TYPES = [
  "Private",
  "Shared",
];

const MEAL_PLANS = [
  "None",
  "Breakfast",
  "Half Board",
  "Full Board",
];

export default function SearchFilters({ onSearch }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [roomType, setRoomType] = useState("");
  const [bathroomType, setBathroomType] = useState("");
  const [mealPlan, setMealPlan] = useState("");

  const isStudent =
    category === "student-accommodation";

  const isBuy = category === "buy";

  const getSpaceTypes = () => {
    if (isStudent) {
      return STUDENT_TYPES;
    }

    if (isBuy) {
      return BUY_TYPES;
    }

    return GENERAL_TYPES;
  };

  const handleSearch = () => {
    const params = {
      search: search.trim() || undefined,
      category: category || undefined,
      space_type: spaceType || undefined,
      max_price: maxPrice || undefined,
      currency: currency || undefined,
      room_type: roomType || undefined,
      bathroom_type: bathroomType || undefined,
      meal_plan: mealPlan || undefined,
    };

    onSearch(params);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSpaceType("");
    setRoomType("");
    setBathroomType("");
    setMealPlan("");

    onSearch({
      search: search.trim() || undefined,
      category: value || undefined,
      max_price: maxPrice || undefined,
      currency: currency || undefined,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickFilter = (type) => {
    const newType = spaceType === type ? "" : type;

    setSpaceType(newType);

    onSearch({
      search: search.trim() || undefined,
      category: category || undefined,
      space_type: newType || undefined,
      max_price: maxPrice || undefined,
      currency: currency || undefined,
      room_type: roomType || undefined,
      bathroom_type: bathroomType || undefined,
      meal_plan: mealPlan || undefined,
    });
  };

  const spaceTypes = getSpaceTypes();

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-3 shadow-2xl shadow-black/10">

      {/* CATEGORY TABS */}
      <div className="mb-3 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleCategoryChange(option.value)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              category === option.value
                ? "bg-[#155c3a] text-white shadow-sm"
                : "bg-[#f8f4e9] text-gray-600 hover:bg-[#eef4f1] hover:text-[#155c3a]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* MAIN SEARCH */}
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">

        {/* LOCATION / KEYWORD */}
        <div className="flex min-h-[68px] items-center rounded-2xl bg-[#f8f4e9] px-4 transition focus-within:ring-2 focus-within:ring-[#e5ad35]/50">
          <span className="mr-3 text-xl">
            🔎
          </span>

          <div className="min-w-0 flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Where
            </label>

            <input
              type="text"
              placeholder="City, area or keyword"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1 w-full bg-transparent text-sm font-medium text-[#1d2923] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* TYPE */}
        <div className="flex min-h-[68px] items-center rounded-2xl bg-[#f8f4e9] px-4 transition focus-within:ring-2 focus-within:ring-[#e5ad35]/50">
          <span className="mr-3 text-xl">
            🏠
          </span>

          <div className="min-w-0 flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Space type
            </label>

            <select
              value={spaceType}
              onChange={(event) => setSpaceType(event.target.value)}
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
            >
              <option value="">All spaces</option>

              {spaceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRICE */}
        <div className="flex min-h-[68px] items-center rounded-2xl bg-[#f8f4e9] px-4 transition focus-within:ring-2 focus-within:ring-[#e5ad35]/50">
          <span className="mr-3 text-xl font-semibold text-[#155c3a]">
            {currency === "ZiG" ? "Z" : "$"}
          </span>

          <div className="min-w-0 flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Maximum price
            </label>

            <input
              type="number"
              min="0"
              placeholder="Any price"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1 w-full bg-transparent text-sm font-medium text-[#1d2923] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* SEARCH */}
        <button
          type="button"
          onClick={handleSearch}
          className="group flex min-h-[68px] items-center justify-center gap-2 rounded-2xl bg-[#155c3a] px-7 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl"
        >
          <span>Search</span>

          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* ADVANCED FILTERS */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* CURRENCY */}
        <div className="rounded-2xl bg-[#f8f4e9] px-4 py-3">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Currency
          </label>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
          >
            <option value="">Any currency</option>
            <option value="USD">USD</option>
            <option value="ZiG">ZiG</option>
          </select>
        </div>

        {/* STUDENT ROOM TYPE */}
        {isStudent && (
          <div className="rounded-2xl bg-[#f8f4e9] px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Room type
            </label>

            <select
              value={roomType}
              onChange={(event) => setRoomType(event.target.value)}
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
            >
              <option value="">Any room</option>

              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STUDENT BATHROOM */}
        {isStudent && (
          <div className="rounded-2xl bg-[#f8f4e9] px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Bathroom
            </label>

            <select
              value={bathroomType}
              onChange={(event) =>
                setBathroomType(event.target.value)
              }
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
            >
              <option value="">Any bathroom</option>

              {BATHROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STUDENT MEAL PLAN */}
        {isStudent && (
          <div className="rounded-2xl bg-[#f8f4e9] px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Meal plan
            </label>

            <select
              value={mealPlan}
              onChange={(event) => setMealPlan(event.target.value)}
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
            >
              <option value="">Any meal plan</option>

              {MEAL_PLANS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* QUICK FILTERS */}
      {!isStudent && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto px-2 pb-1 scrollbar-hide">
          <span className="mr-1 shrink-0 text-xs font-medium text-gray-400">
            Popular:
          </span>

          {QUICK_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleQuickFilter(type)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                spaceType === type
                  ? "border-[#155c3a] bg-[#155c3a] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#155c3a]/30 hover:bg-[#f8f4e9] hover:text-[#155c3a]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* STUDENT FILTER MESSAGE */}
      {isStudent && (
        <div className="mt-3 rounded-2xl border border-[#e5ad35]/30 bg-[#fffaf0] px-4 py-3 text-sm text-gray-600">
          <span className="font-semibold text-[#155c3a]">
            Student Living
          </span>{" "}
          — narrow your search by room type, bathroom and meal plan.
        </div>
      )}
    </div>
  );
}