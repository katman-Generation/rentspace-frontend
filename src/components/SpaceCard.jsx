import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faLocationDot,
  faBed,
  faShower,
  faCar,
  faCircleCheck,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

export default function SpaceCard({ space }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = space?.images || [];
  const hasImages = images.length > 0;

  useEffect(() => {
    if (!hasImages || images.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev >= images.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [hasImages, images.length]);

  const location = space?.location;
  const spaceType = space?.space_type;
  const studentDetails = space?.student_details;

  const rentalLabel = {
    hour: "Per hour",
    day: "Per day",
    week: "Per week",
    month: "Per month",
    year: "Per year",
  };

  const currencySymbol = space?.currency === "ZiG" ? "ZiG " : "$";

  const isStudentListing =
    space?.category?.slug === "student-accommodation";

  const isVerified = space?.verification_status === "verified";

  return (
    <Link
      to={`/space/${space.id}`}
      className="group block h-full"
    >
      <article className="h-full overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#155c3a]/10">

        {/* IMAGE */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={
              hasImages
                ? images[currentImage]?.image
                : "/placeholder-space.jpg"
            }
            alt={space.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* IMAGE GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* PROPERTY TYPE */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {spaceType?.name || "Space"}
            </span>
          </div>

          {/* VERIFIED BADGE */}
          {isVerified && (
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ad35]/40 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f2c35f] backdrop-blur-md">
                <FontAwesomeIcon icon={faCircleCheck} />
                Verified
              </span>
            </div>
          )}

          {/* IMAGE COUNT */}
          {images.length > 1 && (
            <div
              className={`absolute top-14 right-4 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md ${
                isVerified ? "top-14" : "top-4"
              }`}
            >
              <FontAwesomeIcon icon={faCamera} className="mr-1.5" />
              {currentImage + 1}/{images.length}
            </div>
          )}

          {/* AVAILABILITY */}
          <div className="absolute bottom-4 left-4">
            {space.is_available ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#155c3a] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#155c3a]" />
                Available
              </span>
            ) : (
              <span className="rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                Currently unavailable
              </span>
            )}
          </div>

          {/* DOTS */}
          {images.length > 1 && (
            <div className="absolute bottom-5 right-4 flex items-center gap-1.5">
              {images.slice(0, 5).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "w-5 bg-[#e5ad35]"
                      : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex h-[calc(100%-16rem)] flex-col p-5">

          {/* LOCATION */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-sm"
            />

            <span className="truncate">
              {location?.city || "Zimbabwe"}
              {location?.area ? ` • ${location.area}` : ""}
            </span>
          </div>

          {/* TITLE */}
          <h3 className="mt-2 line-clamp-1 text-xl font-bold tracking-tight text-[#1d2923] transition-colors group-hover:text-[#155c3a]">
            {space.title}
          </h3>

          {/* STUDENT LISTING INFO */}
          {isStudentListing && (
            <div className="mt-3 rounded-2xl bg-[#f8f4e9] px-3.5 py-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#155c3a]">
                <FontAwesomeIcon icon={faGraduationCap} />

                <span className="truncate">
                  {studentDetails?.institution?.name ||
                    "Student Accommodation"}
                </span>
              </div>

              {studentDetails?.room_type && (
                <p className="mt-1 text-[11px] text-gray-500">
                  {studentDetails.room_type}
                  {studentDetails.distance_to_campus_km != null &&
                    ` • ${studentDetails.distance_to_campus_km} km from campus`}
                </p>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          {space.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
              {space.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              A space waiting to be discovered.
            </p>
          )}

          {/* FEATURES */}
          {(space.bedrooms != null ||
            space.bathrooms != null ||
            space.parking_spaces != null) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {space.bedrooms != null && (
                <span className="rounded-full bg-[#f8f4e9] px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                  <FontAwesomeIcon
                    icon={faBed}
                    className="mr-1.5"
                  />
                  {space.bedrooms}{" "}
                  {space.bedrooms === 1 ? "bed" : "beds"}
                </span>
              )}

              {space.bathrooms != null && (
                <span className="rounded-full bg-[#f8f4e9] px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                  <FontAwesomeIcon
                    icon={faShower}
                    className="mr-1.5"
                  />
                  {space.bathrooms}{" "}
                  {space.bathrooms === 1 ? "bath" : "baths"}
                </span>
              )}

              {space.parking_spaces != null && (
                <span className="rounded-full bg-[#f8f4e9] px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                  <FontAwesomeIcon
                    icon={faCar}
                    className="mr-1.5"
                  />
                  {space.parking_spaces} parking
                </span>
              )}
            </div>
          )}

          {/* PRICE */}
          <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {space.listing_purpose === "sale"
                  ? "For sale"
                  : rentalLabel[space.rental_period] || "Per month"}
              </p>

              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-[#155c3a]">
                  {currencySymbol}
                  {space.price}
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8f4e9] text-lg text-[#155c3a] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#e5ad35] group-hover:text-[#0d3f29]">
              →
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}