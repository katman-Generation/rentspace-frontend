import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faLocationDot,
  faHandshake,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchFilters from "../components/SearchFilters";
import SpaceCard from "../components/SpaceCard";
import Footer from "../components/Footer";
import api from "../api/api";

export default function Home() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState("");

  const fetchSpaces = async (params = {}) => {
    try {
      setLoading(true);

      const res = await api.get("/api/spaces/", {
        params,
      });

      setSpaces(res.data);
    } catch (err) {
      console.error("Failed to fetch spaces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const searchLocation = (location) => {
    setActiveLocation(location);

    fetchSpaces({
      city: location,
    });

    setTimeout(() => {
      document
        .getElementById("explore")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f8f4e9]">

      <Navbar />

      {/* HERO */}
      <Hero />

      <main>

        {/* SEARCH */}
        <section
          id="search"
          className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 sm:px-6"
        >
          <SearchFilters onSearch={fetchSpaces} />
        </section>

        {/* LISTINGS */}
        <section
          id="explore"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
        >

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                {activeLocation
                  ? `Spaces in ${activeLocation}`
                  : "Discover"}
              </p>

              <h2 className="text-4xl font-bold tracking-tight text-[#1d2923] sm:text-5xl">
                Find your next space.
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Explore spaces listed by people across Zimbabwe.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveLocation("");
                fetchSpaces();
              }}
              className="self-start rounded-full border border-[#155c3a]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#155c3a] transition hover:bg-[#155c3a] hover:text-white sm:self-auto"
            >
              View all spaces
            </button>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[1.75rem] bg-white"
                >
                  <div className="h-64 animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : spaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[#155c3a]/10 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5ad35]/15 text-4xl">
                <FontAwesomeIcon icon={faHouse} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#1d2923]">
                {activeLocation
                  ? `No spaces found in ${activeLocation}.`
                  : "Zimbabwe's spaces are coming."}
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-gray-500">
                {activeLocation
                  ? "Try another location or explore all available spaces."
                  : "We're getting RentSpace ready for property owners and renters across Zimbabwe."}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">

                {activeLocation && (
                  <button
                    onClick={() => {
                      setActiveLocation("");
                      fetchSpaces();
                    }}
                    className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    View all spaces
                  </button>
                )}

                <Link
                  to="/post-space"
                  className="rounded-full bg-[#155c3a] px-6 py-3 font-semibold !text-[#e5ad35] transition hover:-translate-y-0.5 hover:bg-[#0d3f29]"
                >
                  List a space
                </Link>

              </div>

            </div>
          )}

        </section>

        {/* LOCATIONS */}
        <section className="bg-[#155c3a] py-20 text-white">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5d98b]">
                Explore Zimbabwe
              </p>

              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Find a space where life is happening.
              </h2>

              <p className="mt-5 leading-7 text-white/70">
                From the energy of Harare to the beauty of Victoria Falls,
                RentSpace is built to help people discover spaces across
                Zimbabwe.
              </p>

            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

              {[
                "Harare",
                "Bulawayo",
                "Mutare",
                "Gweru",
                "Masvingo",
                "Victoria Falls",
              ].map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => searchLocation(location)}
                  className={`group rounded-2xl border p-5 text-left backdrop-blur-sm transition duration-300 hover:-translate-y-1 ${
                    activeLocation === location
                      ? "border-[#e5ad35] bg-white/15"
                      : "border-white/10 bg-white/5 hover:border-[#e5ad35]/50 hover:bg-white/10"
                  }`}
                >

                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </span>

                  <span className="mt-4 block font-semibold">
                    {location}
                  </span>

                  <span className="mt-1 block text-xs text-white/50 transition group-hover:text-[#f5d98b]">
                    Explore spaces →
                  </span>

                </button>
              ))}

            </div>
          </div>

        </section>

        {/* MISSION */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                Our mission
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight text-[#1d2923] sm:text-5xl">
                Zimbabwe has spaces worth discovering.
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                RentSpace is being built to make finding and sharing those
                spaces simpler.
              </p>

              <p className="mt-4 leading-7 text-gray-500">
                Whether you're searching for a home, a room, a shop, an
                office, a warehouse or somewhere to bring people together,
                we're creating a place where Zimbabweans can connect with
                spaces directly.
              </p>

              <Link
                to="/about"
                className="mt-7 inline-flex items-center rounded-full bg-[#155c3a] px-6 py-3 font-semibold !text-[#e5ad35] transition hover:-translate-y-0.5 hover:bg-[#0d3f29]"
              >
                Our story →
              </Link>

            </div>

            <div className="relative">

              <div className="rounded-[2rem] bg-[#e5ad35] p-2">

                <div className="rounded-[1.6rem] bg-[#f8f4e9] p-8 sm:p-10">

                  <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1">

                    <MissionItem
                      icon={faMagnifyingGlass}
                      title="Discover"
                      text="Search spaces that match what you're looking for."
                    />

                    <MissionItem
                      icon={faHandshake}
                      title="Connect"
                      text="Connect directly with the people behind the spaces."
                    />

                    <MissionItem
                      icon={faHouse}
                      title="Move forward"
                      text="Find a space that fits the next chapter of your life."
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d3f29] px-6 py-16 text-center text-white sm:px-12">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5d98b]">
              RentSpace Zimbabwe
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
              Your next space could be closer than you think.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Discover spaces. Connect with people. Find your place.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <a
                href="#search"
                className="rounded-full bg-[#e5ad35] px-7 py-3.5 font-semibold text-[#0d3f29] transition hover:bg-[#f5d98b]"
              >
                Start exploring
              </a>

              <Link
                to="/register"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20"
              >
                Join RentSpace
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}

function MissionItem({ icon, title, text }) {
  return (
    <div>
      <span className="text-3xl">
        <FontAwesomeIcon icon={icon} />
      </span>

      <h3 className="mt-3 font-bold text-[#1d2923]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}