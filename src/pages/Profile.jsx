import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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

  // 🔹 Load profile + spaces
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
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save profile (phone)
  const saveProfile = async (e) => {
    e.preventDefault();

    await api.patch("profile/", {
      phone_number: phone,
    });

    const res = await api.get("profile/");
    setProfile(res.data);
    setEditingProfile(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  const hasPhone = Boolean(profile.phone_number);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          {/* FIRST TIME PHONE */}
          {!hasPhone && !editingProfile && (
            <>
              <h2 className="text-xl font-bold">Complete Your Profile</h2>

              <form onSubmit={saveProfile} className="space-y-3">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <button className="bg-emerald-700 text-white px-4 py-2 rounded">
                  Save
                </button>
              </form>
            </>
          )}

          {/* PROFILE VIEW */}
          {hasPhone && !editingProfile && (
            <>
              <h2 className="text-xl font-bold">My Profile</h2>

              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone_number}</p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </p>

              <button
                onClick={() => setEditingProfile(true)}
                className="border px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </>
          )}

          {/* EDIT PROFILE */}
          {editingProfile && (
            <>
              <h2 className="text-xl font-bold">Edit Profile</h2>

              <form onSubmit={saveProfile} className="space-y-3">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <div className="flex gap-3">
                  <button className="bg-emerald-700 text-white px-4 py-2 rounded">
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhone(profile.phone_number);
                      setEditingProfile(false);
                    }}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* ================= ADD SPACE ================= */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Spaces</h2>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-emerald-700 text-white px-4 py-2 rounded"
            >
              {showCreateForm ? "Cancel" : "Add Space"}
            </button>
          </div>

          {showCreateForm && (
            <SpaceForm
              onCreated={() => {
                setShowCreateForm(false);
                loadAll();
              }}
            />
          )}
        </div>

        {/* ================= MY SPACES GRID ================= */}
        {spaces.length === 0 ? (
          <p className="text-gray-500">You haven’t added any spaces yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
