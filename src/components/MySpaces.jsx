import { useEffect, useState } from "react";
import api from "../api/api";
import SpaceCard from "./SpaceCard";

export default function MySpaces() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    const res = await api.get("/api/spaces/my-spaces/");
    setSpaces(res.data);
  };

  const toggleAvailability = async (space) => {
    await api.patch(`/api/spaces/update/${space.id}/`, {
      is_available: !space.is_available,
    });
    fetchSpaces();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Spaces</h2>

      {spaces.length === 0 && (
        <p className="text-gray-500">You haven’t posted any spaces yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div key={space.id} className="relative">

            {/* CARD */}
            <SpaceCard space={space} />

            {/* AVAILABILITY TOGGLE */}
            <button
              onClick={() => toggleAvailability(space)}
              className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white ${
                space.is_available
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {space.is_available ? "Disable" : "Enable"}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
