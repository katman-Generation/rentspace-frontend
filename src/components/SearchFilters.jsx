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

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="City, area, or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={spaceType}
          onChange={(e) => setSpaceType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Space Types</option>
          <option value="House">House</option>
          <option value="Room">Room</option>
          <option value="Shop">Shop</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Event Space">Event Space</option>
        </select>

        <input
          type="number"
          placeholder="Max price (USD)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={handleSearch}
          className="bg-emerald-700 text-white rounded-lg px-4 py-2"
        >
          Search
        </button>
      </div>
    </div>
  );
}
