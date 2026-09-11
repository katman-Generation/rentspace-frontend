import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import heroImage from "../assets/rentspace-hero.jpeg";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLink,
}) {
  return (
    <div className="min-h-screen bg-[#f8f4e9]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="relative hidden overflow-hidden bg-[#0d3f29] lg:block">

          <img
            src={heroImage}
            alt="Zimbabwe property"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#0d3f29]/70" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0d3f29] via-transparent to-[#0d3f29]/30" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">

            <Link
              to="/"
              className="flex items-center gap-3 text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1">
                <img
                  src={logo}
                  alt="RentSpace"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-2xl font-bold">
                Rent<span className="text-[#e5ad35]">Space</span>
              </span>
            </Link>

            <div className="max-w-xl text-white">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5d98b]">
                RentSpace Zimbabwe
              </p>

              <h2 className="mt-5 text-5xl font-bold leading-tight xl:text-6xl">
                Find a place that feels like home.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Discover homes, rooms, businesses and spaces across
                Zimbabwe.
              </p>

            </div>

            <p className="text-sm text-white/40">
              Built for Zimbabwe 🇿🇼
            </p>

          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 shadow-sm">
                <img
                  src={logo}
                  alt="RentSpace"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-xl font-bold text-[#155c3a]">
                Rent<span className="text-[#e5ad35]">Space</span>
              </span>
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
                Welcome to RentSpace
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1d2923]">
                {title}
              </h1>

              <p className="mt-3 leading-7 text-gray-500">
                {subtitle}
              </p>
            </div>

            <div className="mt-8">
              {children}
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              {footerText}{" "}
              <Link
                to={footerLink}
                className="font-semibold text-[#155c3a] transition hover:text-[#a85f3f]"
              >
                {footerLinkText}
              </Link>
            </p>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-xs font-medium text-gray-400 transition hover:text-[#155c3a]"
              >
                ← Back to RentSpace
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}