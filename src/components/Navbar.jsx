import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d3b2e] shadow-sm transition group-hover:scale-105">
              <img
                src={logo}
                alt="RentSpace"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="leading-none">
              <span className="block text-xl font-bold text-[#0d3b2e]">
                RentSpace
              </span>

              <span className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-gray-400 sm:block">
                Find your space
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-7 md:flex">

            <NavItem to="/">
              Explore
            </NavItem>

            <NavItem to="/buy">
              Buy
            </NavItem>

            <NavItem to="/rent">
              Rent
            </NavItem>

            <NavItem to="/student-living">
              Student Living
            </NavItem>

            <NavItem to="/about">
              About
            </NavItem>

            {user && (
              <>
                <NavItem to="/profile">
                  My Spaces
                </NavItem>

                <NavItem to="/messages">
                  Messages
                </NavItem>
              </>
            )}

          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:text-[#0d3b2e]"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-[#0d3b2e] px-5 py-2.5 text-sm font-semibold !text-[#e5ad35] shadow-sm transition hover:bg-[#124b3a] hover:text-[#f5d98b]"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/post-space"
                  className="rounded-full border border-[#0d3b2e] px-5 py-2.5 text-sm font-semibold text-[#0d3b2e] transition hover:bg-[#0d3b2e] hover:text-white"
                >
                  + List a Space
                </Link>

                <div className="relative group">
                  <Link
                    to="/profile"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0b84b] font-bold text-[#0d3b2e]"
                  >
                    {(user.first_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Link>

                  <div className="absolute right-0 top-full hidden pt-3 group-hover:block">
                    <div className="w-44 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">

                      <Link
                        to="/profile"
                        className="block rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/post-space"
                        className="block rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        List a Space
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Log out
                      </button>

                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-gray-100 pb-5 pt-3 md:hidden">

            <div className="flex flex-col gap-1">

              <MobileNavItem
                to="/"
                onClick={closeMenu}
              >
                Explore
              </MobileNavItem>

              {/* MARKETPLACE */}
              <div className="mt-2 px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Find a space
              </div>

              <MobileNavItem
                to="/buy"
                onClick={closeMenu}
              >
                Buy Property
              </MobileNavItem>

              <MobileNavItem
                to="/rent"
                onClick={closeMenu}
              >
                Rent a Space
              </MobileNavItem>

              <MobileNavItem
                to="/student-living"
                onClick={closeMenu}
              >
                Student Living
              </MobileNavItem>

              {/* GENERAL */}
              <div className="mt-2 px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                RentSpace
              </div>

              <MobileNavItem
                to="/about"
                onClick={closeMenu}
              >
                About RentSpace
              </MobileNavItem>

              {user && (
                <>
                  <MobileNavItem
                    to="/profile"
                    onClick={closeMenu}
                  >
                    My Spaces
                  </MobileNavItem>

                  <MobileNavItem
                    to="/messages"
                    onClick={closeMenu}
                  >
                    Messages
                  </MobileNavItem>

                  <MobileNavItem
                    to="/post-space"
                    onClick={closeMenu}
                  >
                    + List a Space
                  </MobileNavItem>

                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </>
              )}

              {!user && (
                <div className="grid grid-cols-2 gap-3 pt-3">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-full border border-gray-200 py-3 text-center font-semibold"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-full bg-[#0d3b2e] py-3 text-center font-semibold text-[#f5d98b]"
                  >
                    Create account
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative py-2 text-sm font-semibold transition ${
          isActive
            ? "text-[#0d3b2e]"
            : "text-gray-500 hover:text-[#0d3b2e]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-xl px-4 py-3 font-medium transition ${
          isActive
            ? "bg-[#eef4f1] font-semibold text-[#0d3b2e]"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}