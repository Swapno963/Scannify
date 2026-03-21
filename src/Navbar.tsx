import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, onLogout } from "./auth/auth";




const Navbar: React.FC = () => {
  const token = getToken();

  const navigate = useNavigate();
if (!token) {
  navigate("/login", { replace: true });
}

  const handleLogout = () => {
  onLogout();
  navigate("/login", { replace: true });
};
  const location = useLocation();

  const navLink = (path: string, label: string) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-blue-400 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo / App Name */}
      <div className="text-xl font-bold text-blue-600">
        ScanApp
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-3">
        {!token ? (
          <>
            {navLink("/login", "Login")}
            {navLink("/registration", "Register")}
          </>
        ) : (
          <>
            {navLink("/", "Scanner")}
            {navLink("/dashboard", "Dashboard")}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;