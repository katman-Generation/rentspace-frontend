import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHandshake,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/rentspace-hero.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0d3f29] py-24 text-white/70 sm:py-32">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Zimbabwe property"
            className="h-full w-full object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-[#0d3f29]/80" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Making it easier to find your place in Zimbabwe.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
            RentSpace is a Zimbabwean platform built to connect people with
            spaces, from homes and rooms to businesses, offices and places
            worth discovering.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
              Why we exist
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-[#1d2923] sm:text-5xl">
              Finding a space shouldn't feel harder than finding a home.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Zimbabwe has thousands of spaces being rented, shared, opened
              and discovered every day. RentSpace exists to bring those
              spaces together in one place.
            </p>

            <p className="mt-5 leading-7 text-gray-500">
              Our goal is simple: make it easier for someone looking for a
              space to discover their options and connect directly with the
              people offering them.
            </p>

            <p className="mt-5 leading-7 text-gray-500">
              At the same time, we want property owners and businesses to
              have a simple way to put their spaces in front of people who
              are actually looking.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={heroImage}
                alt="Zimbabwe property from above"
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-7 -left-4 rounded-2xl bg-[#e5ad35] p-5 shadow-xl sm:-left-7">
              <p className="text-3xl font-bold text-[#0d3f29]">
                🇿🇼
              </p>

              <p className="mt-1 text-sm font-semibold text-[#0d3f29]">
                Built for Zimbabwe
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a85f3f]">
              What matters to us
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#1d2923] sm:text-5xl">
              Simple principles.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-[2rem] bg-[#f8f4e9] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#155c3a] text-2xl">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#1d2923]">
                Discovery
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Make it easier for people to discover spaces they might
                otherwise never find.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#f8f4e9] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ad35] text-2xl">
                <FontAwesomeIcon icon={faHandshake} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#1d2923]">
                Connection
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Help renters and space owners connect directly and
                communicate clearly.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#f8f4e9] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a85f3f] text-2xl">
                <FontAwesomeIcon icon={faHouse} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#1d2923]">
                Community
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Build something useful for people and businesses across
                Zimbabwe.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#155c3a] py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5d98b]">
              How RentSpace works
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Three steps to your next space.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Search",
                text: "Tell us what kind of space you're looking for.",
              },
              {
                number: "02",
                title: "Explore",
                text: "Browse listings and find a space that fits your needs.",
              },
              {
                number: "03",
                title: "Connect",
                text: "Contact the owner and take the next step.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="border-t border-white/20 pt-6"
              >
                <span className="text-sm font-bold text-[#f5d98b]">
                  {item.number}
                </span>

                <h3 className="mt-4 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-white/60">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-[#e5ad35] px-6 py-16 text-center sm:px-12">

          <h2 className="text-4xl font-bold text-[#0d3f29] sm:text-5xl">
            Ready to find your space?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#0d3f29]/70">
            Explore spaces across Zimbabwe or create an account and list
            your own.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              to="/"
              className="rounded-full bg-[#0d3f29] px-7 py-3.5 font-semibold !text-[#e5ad35] transition hover:-translate-y-0.5 hover:bg-[#155c3a]"
            >
              Explore spaces
            </Link>

            <Link
              to="/register"
              className="rounded-full border-2 border-[#0d3f29]/20 px-7 py-3.5 font-semibold text-[#0d3f29] transition hover:bg-white/30"
            >
              Join RentSpace
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}