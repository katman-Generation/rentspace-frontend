import { useState } from "react";

export default function SearchFilters({ onSearch }) {
  const [search, setSearch] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({
      search: search || undefined,
      space_type: spaceType || undefined,
      max_price: maxPrice || undefined,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const quickFilters = [
    "House",
    "Room",
    "Shop",
    "Office",
    "Warehouse",
    "Event Space",
  ];

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-3 shadow-2xl shadow-black/10">

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
              onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => setSpaceType(e.target.value)}
              className="mt-1 w-full cursor-pointer bg-transparent text-sm font-medium text-[#1d2923] outline-none"
            >
              <option value="">All spaces</option>
              <option value="House">House</option>
              <option value="Room">Room</option>
              <option value="Shop">Shop</option>
              <option value="Office">Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Event Space">Event Space</option>
            </select>
          </div>
        </div>

        {/* PRICE */}
        <div className="flex min-h-[68px] items-center rounded-2xl bg-[#f8f4e9] px-4 transition focus-within:ring-2 focus-within:ring-[#e5ad35]/50">

          <span className="mr-3 text-xl font-semibold text-[#155c3a]">
            $
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
              onChange={(e) => setMaxPrice(e.target.value)}
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

      {/* QUICK FILTERS */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto px-2 pb-1 scrollbar-hide">

        <span className="mr-1 shrink-0 text-xs font-medium text-gray-400">
          Popular:
        </span>

        {quickFilters.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              const newType = spaceType === type ? "" : type;

              setSpaceType(newType);

              onSearch({
                search: search || undefined,
                space_type: newType || undefined,
                max_price: maxPrice || undefined,
              });
            }}
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
    </div>
  );
}