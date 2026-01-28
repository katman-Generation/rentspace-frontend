import Navbar from "../components/Navbar";
import SearchFilters from "../components/SearchFilters";
import SpaceCard from "../components/SpaceCard";
import api from "../api/api";
import { useState, useEffect } from "react";

export default function Home() {
  const [spaces, setSpaces] = useState([]);

  const fetchSpaces = async (params = {}) => {
    try {
      const res = await api.get("spaces/", {
        params: params,
      });
      setSpaces(res.data);
    } catch (err) {
      console.error("Failed to fetch spaces", err);
    }
  };

  useEffect(() => {
    fetchSpaces(); // initial load (no filters)
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <SearchFilters onSearch={fetchSpaces} />

        {/* Listings */}
        <h2 className="text-xl font-semibold mb-6">
          Latest Spaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </main>
    </div>
  );
}
