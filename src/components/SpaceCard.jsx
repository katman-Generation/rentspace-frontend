import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SpaceCard({ space }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === space.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [space.images.length]);

  return (
    <Link to={`/space/${space.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
        
        <img
          src={space.images[currentImage]?.image}
          alt={space.title}
        />
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {space.title}
          </h3>

          <p className="text-sm text-gray-500">
            {space.location.city}, {space.location.area}
          </p>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              {space.space_type.name}
            </span>

            <span className="text-lg font-bold text-amber-500">
              ${space.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
