import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { BaseUrl } from '../../assets/UserContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Import jwt-decode correctly

const Login = ({ showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BaseUrl}/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        const { token } = res.data;

        const decodedToken = jwtDecode(token);

        const { claims } = decodedToken;
        console.log(claims);

        localStorage.setItem('user', JSON.stringify(claims));
        localStorage.setItem('token', token); // Store the token if needed

        showToast('success', 'Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        showToast('error', error.response.data.message || 'Login failed.');
      } else {
        showToast('error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Login to Your Account
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
