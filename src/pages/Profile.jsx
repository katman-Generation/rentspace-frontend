import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import SpaceForm from "../components/SpaceForm";
import SpaceCard from "../components/SpaceCard";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);

  const [spaces, setSpaces] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [profileRes, spacesRes] = await Promise.all([
        api.get("/api/profile/"),
        api.get("/api/spaces/my-spaces/"),
      ]);

      setProfile(profileRes.data);
      setPhone(profileRes.data.phone_number || "");
      setSpaces(spacesRes.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/api/profile/", {
        phone_number: phone,
      });

      const res = await api.get("/api/profile/");

      setProfile(res.data);
      setPhone(res.data.phone_number || "");
      setEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed]">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-5">
            <div className="h-40 bg-white rounded-3xl" />
            <div className="h-64 bg-white rounded-3xl" />
            <div className="h-10 w-48 bg-gray-200 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f7f4ed]">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Profile not found
          </h1>

          <Link
            to="/"
            className="inline-block mt-5 bg-emerald-700 text-white px-6 py-3 rounded-full"
          >
            Return Home
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const hasPhone = Boolean(profile.phone_number);

  const displayName =
    profile.first_name ||
    profile.username ||
    profile.email?.split("@")[0] ||
    "RentSpace Member";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f4ed]">

        {/* PROFILE HERO */}
        <section className="bg-[#0d3b2e]">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

              <div className="flex items-center gap-5">

                {/* AVATAR */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#e0b84b] text-[#0d3b2e] flex items-center justify-center text-3xl font-bold shadow-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-[#e0b84b] text-sm font-semibold uppercase tracking-widest">
                    My RentSpace
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">
                    {displayName}
                  </h1>

                  <p className="text-white/65 mt-1">
                    Manage your profile and listings
                  </p>
                </div>

              </div>

              <Link
                to="/post-space"
                className="inline-flex items-center justify-center gap-2 bg-[#e0b84b] hover:bg-[#edc45b] text-[#17382e] font-semibold px-6 py-3 rounded-full transition"
              >
                <span className="text-lg">+</span>
                Post a Space
              </Link>

            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

          {/* PROFILE INFORMATION */}
          <section className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">

            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Account
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile information
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Keep your contact information up to date.
                  </p>
                </div>

                {!editingProfile && hasPhone && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="border border-gray-200 hover:border-emerald-700 hover:text-emerald-700 px-5 py-2.5 rounded-full font-medium transition"
                  >
                    Edit Profile
                  </button>
                )}

              </div>
            </div>

            <div className="p-6 md:p-8">

              {/* COMPLETE PROFILE */}
              {!hasPhone && !editingProfile && (
                <div className="bg-[#fff8e5] border border-[#f0d98a] rounded-2xl p-5">

                  <div className="flex gap-4">
                    <div className="text-2xl">📱</div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Complete your profile
                      </h3>

                      <p className="text-sm text-gray-600 mt-1 mb-4">
                        Add your phone number so people interested in your
                        spaces can contact you.
                      </p>

                      <form
                        onSubmit={saveProfile}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="flex-1 border border-gray-200 bg-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                          required
                        />

                        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition">
                          Save
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              )}

              {/* PROFILE VIEW */}
              {hasPhone && !editingProfile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <InfoItem
                    label="Name"
                    value={
                      profile.first_name
                        ? `${profile.first_name} ${profile.last_name || ""}`
                        : profile.username
                    }
                  />

                  <InfoItem
                    label="Email"
                    value={profile.email}
                  />

                  <InfoItem
                    label="Phone"
                    value={profile.phone_number}
                  />

                  <InfoItem
                    label="Member since"
                    value={
                      profile.created_at
                        ? new Date(
                            profile.created_at
                          ).toLocaleDateString()
                        : "—"
                    }
                  />

                </div>
              )}

              {/* EDIT */}
              {editingProfile && (
                <form onSubmit={saveProfile} className="max-w-xl space-y-5">

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone number
                    </label>

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-full font-semibold transition"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPhone(profile.phone_number || "");
                        setEditingProfile(false);
                      }}
                      className="border border-gray-200 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              )}

            </div>
          </section>

          {/* LISTINGS HEADER */}
          <section>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">

              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Your properties
                </p>

                <h2 className="text-3xl font-bold text-gray-900">
                  My Spaces
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage the spaces you've listed on RentSpace.
                </p>
              </div>

              <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm">
                <span className="font-bold text-gray-900">
                  {spaces.length}
                </span>{" "}
                {spaces.length === 1 ? "listing" : "listings"}
              </div>

            </div>

            {/* CREATE FORM */}
            {showCreateForm && (
              <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 md:p-8 mb-7">

                <div className="flex items-start justify-between gap-4 mb-6">

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Add a new space
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Add the details for your new listing.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                  >
                    ×
                  </button>

                </div>

                <SpaceForm
                  onCreated={() => {
                    setShowCreateForm(false);
                    loadAll();
                  }}
                />

              </div>
            )}

            {/* EMPTY STATE */}
            {spaces.length === 0 && !showCreateForm && (
              <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 md:p-14 text-center">

                <div className="w-16 h-16 mx-auto rounded-full bg-[#f3ead1] flex items-center justify-center text-2xl">
                  🏠
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-5">
                  Your spaces will appear here
                </h3>

                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  You haven't listed a space yet. Add your first property and
                  start connecting with people looking for a place.
                </p>

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  Add Your First Space
                </button>

              </div>
            )}

            {/* SPACE GRID */}
            {spaces.length > 0 && (
              <>
                <div className="flex justify-end mb-5">
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full font-semibold transition"
                  >
                    {showCreateForm ? "Cancel" : "+ Add Space"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spaces.map((space) => (
                    <SpaceCard
                      key={space.id}
                      space={space}
                    />
                  ))}
                </div>
              </>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-[#faf9f5] rounded-2xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="text-gray-900 font-medium mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}