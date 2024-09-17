import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <Outlet /> {/* Nested routing */}
      </div>
    </div>
  );
};

export default Auth;
