import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SpaceForm from "../components/SpaceForm";
import { useAuth } from "../context/useAuth";

export default function PostSpace() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f4ed]">

        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0d3b2e]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(218,165,32,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

          <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition"
              >
                ← Back to RentSpace
              </Link>

              <p className="text-[#e0b84b] font-semibold uppercase tracking-[0.18em] text-xs mb-3">
                List your space
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Turn your space into an opportunity.
              </h1>

              <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-2xl">
                Share your property with people looking for a place to live,
                work, create, host, or build their next chapter.
              </p>
            </div>
          </div>
        </section>

        {/* FORM AREA */}
        <section className="max-w-5xl mx-auto px-4 py-10 md:py-14">

          {/* INTRO CARD */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">
                  Welcome, {user?.first_name || user?.username || "there"}
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  Tell us about your space
                </h2>

                <p className="text-gray-500 mt-2">
                  Add the details renters need to make a confident decision.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f3ead1] flex items-center justify-center text-[#9b7415]">
                  ✦
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Make it stand out
                  </p>
                  <p className="text-xs text-gray-500">
                    Good photos attract more attention.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ACTUAL SPACE FORM */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 md:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                Property details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete the form below to publish your space on RentSpace.
              </p>
            </div>

            <SpaceForm
              onCreated={() => {
                window.location.href = "/profile";
              }}
            />

          </div>

          {/* TRUST NOTE */}
          <div className="mt-6 bg-[#0d3b2e] rounded-3xl p-6 md:p-7 text-white">
            <div className="flex gap-4">

              <div className="w-11 h-11 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center">
                🔒
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  You stay in control
                </h3>

                <p className="text-white/70 text-sm leading-relaxed mt-1">
                  You can update your listing, change its availability, or
                  manage your spaces from your profile at any time.
                </p>
              </div>

            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}