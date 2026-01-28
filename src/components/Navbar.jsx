import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO + NAME */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="RentSpace logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-bold text-lg">RentSpace</span>
        </Link>

        {/* NAV LINKS */}
        <div className="space-x-4">
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile">Post Your Space</Link>
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export { Navbar };
