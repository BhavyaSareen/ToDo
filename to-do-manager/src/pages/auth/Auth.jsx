import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="flex flex-col md:flex-row ">
      {/* Left side with image (takes up 50% on medium screens and above) */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-200" style={{maxHeight:"90vh"}} >
        {/* Add your image here */}
        <img
          src="/123.jpg"
          alt="Auth"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side with Outlet for nested routing (also takes up 50% on medium screens and above) */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <Outlet /> {/* Nested routing */}
        </div>
      </div>
    </div>
  );
};

export default Auth;
