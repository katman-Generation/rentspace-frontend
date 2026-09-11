import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0b2f24] text-white">

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* BRAND */}
          <div className="max-w-sm">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5ad35]">
                <span className="text-xl font-bold text-[#0d3f29]">
                  R
                </span>
              </div>

              <span className="text-2xl font-bold">
                RentSpace
              </span>

            </Link>

            <p className="mt-5 leading-7 text-white/60">
              A simpler way to discover and share spaces across Zimbabwe.
              Find your place, connect with people, and move forward.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
              <span className="h-2 w-2 rounded-full bg-[#e5ad35]" />
              Built for Zimbabwe
            </div>

          </div>

          {/* EXPLORE */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f5d98b]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <FooterLink to="/">
                Find a Space
              </FooterLink>

              <FooterLink to="/about">
                About RentSpace
              </FooterLink>

              <FooterLink to="/post-space">
                List a Space
              </FooterLink>

            </div>

          </div>

          {/* ACCOUNT */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f5d98b]">
              Account
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <FooterLink to="/login">
                Log in
              </FooterLink>

              <FooterLink to="/register">
                Create account
              </FooterLink>

              <FooterLink to="/profile">
                My Profile
              </FooterLink>

            </div>

          </div>

          {/* LOCATIONS */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f5d98b]">
              Locations
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <span className="text-sm text-white/55">
                Harare
              </span>

              <span className="text-sm text-white/55">
                Bulawayo
              </span>

              <span className="text-sm text-white/55">
                Mutare
              </span>

              <span className="text-sm text-white/55">
                Gweru
              </span>

              <span className="text-sm text-white/55">
                Masvingo
              </span>

            </div>

          </div>

        </div>

        {/* DIVIDER */}
        <div className="my-12 h-px bg-white/10" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} RentSpace. All rights reserved.
          </p>

          <div className="flex gap-5">

            <span>
              Zimbabwe
            </span>

            <span>
              Made with purpose.
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white"
    >
      {children}
    </Link>
  );
}