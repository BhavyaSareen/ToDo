import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate(); // Navigate hook

  // Fetch user data from localStorage


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  const handleLogout = () => {
    // Remove user data and token from localStorage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null); // Clear the user state
    setDropdownOpen(false); // Close the dropdown after logout
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-semibold text-gray-800">
        To-Do
      </Link>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            {/* Show "Get Started" button if no user is logged in */}
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* Profile button */}
            <button
              onClick={toggleDropdown} // Toggle dropdown on click
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={user.profileImage || 'default-avatar.png'} // Fallback to default avatar
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </button>

            {/* Dropdown menu, visible only when dropdownOpen is true */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)} // Close dropdown on navigation
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
