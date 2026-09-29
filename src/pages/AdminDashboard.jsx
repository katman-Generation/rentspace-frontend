import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/api";
import { useAuth } from "../context/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    if (!user.is_staff) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboard();

        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        if (err?.response?.status === 403) {
          setError("You do not have permission to access this dashboard.");
        } else {
          setError(
            "We couldn't load the dashboard. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, navigate]);

  const maxCityCount = useMemo(() => {
    if (!dashboard?.listings_by_city?.length) return 1;

    return Math.max(
      ...dashboard.listings_by_city.map((item) => item.count),
      1
    );
  }, [dashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f7] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-64 rounded-xl bg-gray-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-3xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9f7] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    users,
    spaces,
    listing_purpose,
    student_accommodation,
    listings_by_city,
    growth,
  } = dashboard;

  const totalListingsForBreakdown =
    listing_purpose.rent +
    listing_purpose.sale;

  return (
    <div className="min-h-screen bg-[#f7f9f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#155c3a]">
              RentSpace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#1d2923] sm:text-4xl">
              Founder Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your marketplace growth and activity.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-fit rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#1d2923] shadow-sm transition hover:border-[#155c3a] hover:text-[#155c3a]"
          >
            Refresh data
          </button>
        </div>

        {/* Main Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total users"
            value={users.total}
            subtitle={`+${users.this_month} this month`}
            icon="👥"
          />

          <StatCard
            title="Total spaces"
            value={spaces.total}
            subtitle={`+${spaces.this_month} this month`}
            icon="🏠"
          />

          <StatCard
            title="Available spaces"
            value={spaces.available}
            subtitle={`${spaces.unavailable} unavailable`}
            icon="📍"
          />

          <StatCard
            title="Verified spaces"
            value={spaces.verified}
            subtitle={`${spaces.unverified} awaiting verification`}
            icon="✓"
          />

        </div>

        {/* Growth Cards */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <SmallStat
            title="New users today"
            value={users.today}
          />

          <SmallStat
            title="New users this week"
            value={users.this_week}
          />

          <SmallStat
            title="New listings today"
            value={spaces.today}
          />

          <SmallStat
            title="New listings this week"
            value={spaces.this_week}
          />

        </div>

        {/* Growth Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <GrowthChart
            title="User growth"
            data={growth.users}
          />

          <GrowthChart
            title="Listing growth"
            data={growth.spaces}
          />

        </div>

        {/* Market Breakdown */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Cities */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#1d2923]">
                Listings by city
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Where your marketplace is growing.
              </p>
            </div>

            <div className="space-y-5">

              {listings_by_city.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No listings yet.
                </p>
              ) : (
                listings_by_city.map((item) => (
                  <div key={item.city}>

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1d2923]">
                        {item.city || "Unknown"}
                      </span>

                      <span className="text-sm font-semibold text-[#155c3a]">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#155c3a] transition-all"
                        style={{
                          width: `${
                            (item.count / maxCityCount) * 100
                          }%`,
                        }}
                      />
                    </div>

                  </div>
                ))
              )}

            </div>
          </div>

          {/* Listing Breakdown */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#1d2923]">
                Marketplace breakdown
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                What people are listing on RentSpace.
              </p>
            </div>

            <div className="space-y-5">

              <BreakdownRow
                label="For rent"
                value={listing_purpose.rent}
                total={totalListingsForBreakdown}
              />

              <BreakdownRow
                label="For sale"
                value={listing_purpose.sale}
                total={totalListingsForBreakdown}
              />

              <div className="my-6 border-t border-gray-100" />

              <div className="flex items-center justify-between rounded-2xl bg-[#f5f8f5] p-5">
                <div>
                  <p className="text-sm font-semibold text-[#1d2923]">
                    Student accommodation
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Dedicated student listings
                  </p>
                </div>

                <span className="text-2xl font-bold text-[#155c3a]">
                  {student_accommodation}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Verification */}
        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1d2923]">
              Listing verification
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Keep track of listings that still need review.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-medium text-green-700">
                Verified
              </p>

              <p className="mt-2 text-3xl font-bold text-green-800">
                {spaces.verified}
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <p className="text-sm font-medium text-yellow-700">
                Awaiting verification
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-800">
                {spaces.unverified}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-[#1d2923]">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ef] text-lg">
          {icon}
        </div>

      </div>
    </div>
  );
}


function SmallStat({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">

      <p className="text-xs font-medium text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#1d2923]">
        {value}
      </p>

    </div>
  );
}


function BreakdownRow({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-[#1d2923]">
          {label}
        </span>

        <span className="text-sm text-gray-500">
          {value} ({percentage}%)
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-[#155c3a]"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


function GrowthChart({
  title,
  data,
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.count),
    1
  );

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1d2923]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Last 30 days
        </p>
      </div>

      <div className="flex h-56 items-end gap-1">

        {data.map((item) => {

          const height =
            item.count > 0
              ? Math.max(
                  (item.count / maxValue) * 100,
                  4
                )
              : 2;

          return (
            <div
              key={item.date}
              className="group relative flex h-full flex-1 items-end"
            >

              <div
                className="w-full rounded-t-md bg-[#155c3a] opacity-80 transition group-hover:opacity-100"
                style={{
                  height: `${height}%`,
                }}
                title={`${item.date}: ${item.count}`}
              />

            </div>
          );
        })}

      </div>

      <div className="mt-3 flex justify-between text-[10px] text-gray-400">
        <span>
          {data[0]?.date}
        </span>

        <span>
          {data[data.length - 1]?.date}
        </span>
      </div>

    </div>
  );
}