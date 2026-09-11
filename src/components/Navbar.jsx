import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="h-18 min-h-[72px] flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-full bg-[#0d3b2e] flex items-center justify-center shadow-sm group-hover:scale-105 transition">
              <img
                src={logo}
                alt="RentSpace"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div className="leading-none">
              <span className="block text-xl font-bold text-[#0d3b2e]">
                RentSpace
              </span>

              <span className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-[0.18em] mt-1">
                Find your space
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">

            <NavItem to="/">
              Explore
            </NavItem>

            <NavItem to="/about">
              About
            </NavItem>

            {user && (
              <NavItem to="/profile">
                My Spaces
              </NavItem>
            )}

          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#0d3b2e] transition"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-[#0d3b2e] hover:bg-[#124b3a] text-white text-sm font-semibold rounded-full transition shadow-sm"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/post-space"
                  className="px-5 py-2.5 border border-[#0d3b2e] text-[#0d3b2e] hover:bg-[#0d3b2e] hover:text-white text-sm font-semibold rounded-full transition"
                >
                  + List a Space
                </Link>

                <div className="relative group">
                  <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-[#e0b84b] text-[#0d3b2e] flex items-center justify-center font-bold"
                  >
                    {(user.first_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Link>

                  <div className="absolute right-0 top-full pt-3 hidden group-hover:block">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 w-44">

                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/post-space"
                        className="block px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                      >
                        List a Space
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
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
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
            aria-label="Toggle menu"
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
          <div className="md:hidden pb-5 pt-2 border-t border-gray-100">

            <div className="flex flex-col gap-1">

              <MobileNavItem
                to="/"
                onClick={closeMenu}
              >
                Explore
              </MobileNavItem>

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
                    My Profile
                  </MobileNavItem>

                  <MobileNavItem
                    to="/post-space"
                    onClick={closeMenu}
                  >
                    List a Space
                  </MobileNavItem>

                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
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
                    className="text-center border border-gray-200 py-3 rounded-full font-semibold"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center bg-[#0d3b2e] text-white py-3 rounded-full font-semibold"
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
        `text-sm font-semibold transition ${
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
        `px-4 py-3 rounded-xl font-medium transition ${
          isActive
            ? "bg-[#eef4f1] text-[#0d3b2e]"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}