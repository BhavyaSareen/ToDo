import { Link } from 'react-router-dom';
import { useUser } from '../assets/UserContext';

const Navbar = () => {
  const { user, logout } = useUser(); // Access user and logout from context

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-gray-800">
        YourApp
      </Link>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            {/* Show "Get Started" button if no user is logged in */}
            <Link
              to="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* Profile dropdown */}
            <button className="flex items-center space-x-2">
              <img
                src={user.profileImage || 'default-avatar.png'} // Fallback to default avatar
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                My Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
