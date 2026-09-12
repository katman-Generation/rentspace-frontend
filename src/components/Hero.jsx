import { Link } from "react-router-dom";
import heroImage from "../assets/rentspace-hero.jpeg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0d3b2e]">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful property in Zimbabwe"
          className="h-full w-full object-cover"
        />

        {/* GREEN OVERLAY */}
        <div className="absolute inset-0 bg-[#0d3b2e]/75" />

        {/* EXTRA DEPTH */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3b2e] via-[#0d3b2e]/70 to-[#0d3b2e]/30" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b2e] via-transparent to-black/10" />
      </div>

      {/* DECORATIVE SHAPES */}
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#e5ad35]/20" />

      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#e5ad35]/10" />

      <div className="absolute bottom-10 right-[10%] h-3 w-3 rounded-full bg-[#e5ad35]/70" />

      <div className="absolute left-[8%] top-28 h-2 w-2 rounded-full bg-white/30" />

      {/* CONTENT */}
      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">

        <div className="max-w-3xl">

          {/* EYEBROW */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">

            <span className="h-2 w-2 rounded-full bg-[#e5ad35]" />

            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
              Zimbabwe's rental marketplace
            </span>

          </div>

          {/* HEADLINE */}
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">

            Find a space
            <span className="block text-[#f5d98b]">
              that feels right.
            </span>

          </h1>

          {/* DESCRIPTION */}
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Discover homes, rooms, shops, offices, warehouses and spaces
            across Zimbabwe — all in one place.
          </p>

          {/* ACTIONS */}
          <div className="mt-9 flex flex-wrap gap-4">

            <a
              href="#search"
              className="group inline-flex items-center gap-3 rounded-full bg-[#e5ad35] px-7 py-3.5 font-bold text-[#0d3f29] shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#f5d98b]"
            >
              Start exploring

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <Link
              to="/post-space"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              List your space
            </Link>

          </div>

          {/* TRUST POINTS */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">

            <TrustPoint text="Spaces across Zimbabwe" />
            <TrustPoint text="Connect directly" />
            <TrustPoint text="Built for Zimbabwe" />

          </div>

        </div>

        {/* FLOATING PROPERTY CARD */}
        <div className="absolute bottom-16 right-5 hidden w-64 rotate-2 sm:block lg:right-10">

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md">

            {/* IMAGE */}
            <div className="relative h-36 overflow-hidden rounded-[1.25rem]">

              <img
                src={heroImage}
                alt="Property available on RentSpace"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* AVAILABLE BADGE */}
              <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                Explore
              </div>

            </div>

            {/* CARD CONTENT */}
            <div className="px-3 pb-2 pt-3">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    RentSpace
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Find your next space
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5ad35] text-[#0d3b2e] shadow-lg">
                  →
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM TRANSITION */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d3b2e]/50 to-transparent" />

    </section>
  );
}

function TrustPoint({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/65">

      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#e5ad35]/50 text-[10px] text-[#e5ad35]">
        ✓
      </span>

      {text}

    </div>
  );
}