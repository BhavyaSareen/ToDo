import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './component/NavBar';
import FooterSection from './component/FooterSection';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Toast from './component/Toast';
import { useState } from 'react';
import DashBoard from './pages/DashBoard';
import Auth from './pages/auth/Auth';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SingleTask from './pages/SingleTask';

function App() {

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (type, message) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000); // Hide toast after 3 seconds
  };

  return (
    <>
      <Navbar />
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login showToast={showToast} />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/task/:taskId" element={<SingleTask />} />
      </Routes>
      <FooterSection />

    </>
  );
}

export default App;
